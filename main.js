/* global d3 */

class App {
  constructor() {
    this.state = {
      svgUrl: './squirrel.svg'
    };
    this.els = {};
  }

  init({ scale = 80, cycleLength = 5000, centerY = 300 }) {
    this.scale = scale;
    this.cycleLength = cycleLength;
    this.centerY = centerY;
    this.normalizedPositionFnName = 'easeElastic';
    this.rootEl = document.createElement('div');
    document.body.appendChild(this.rootEl);
    this.inputs = this.setupInputs();
    this.els.svg = this.setupSvg();
    this.loadSvg({ svgUrl: this.state.svgUrl })
      // .then(() => this.startAnimation())
      .catch(this.handleError);
  }

  setupInputs() {
    const inputs = {};
    const inputsDiv = document.createElement('div');
    this.rootEl.appendChild(inputsDiv);

    // SVG text input.
    inputs.svgUrl = document.createElement('input');
    inputs.svgUrl.value = this.state.svgUrl;
    inputsDiv.appendChild(inputs.svgUrl);
    inputs.svgUrl.addEventListener('change', e => {
      this.state.svgUrl = e.target.value;
    });

    // Load button
    var app = this;
    inputs.loadButton = createButton({
      label: 'Load',
      onClick: () => {
        app.loadSvg({ svgUrl: app.state.svgUrl });
      }
    });
    inputsDiv.appendChild(inputs.loadButton);

    // Position function picker
    inputs.positionFnPicker = document.createElement('select');
    var easeFnNames = Object.keys(d3).filter(isEaseFn);
    easeFnNames.forEach(addEaseOption.bind(this));
    inputs.positionFnPicker.addEventListener(
      'change',
      e => (this.normalizedPositionFnName = e.target.value)
    );
    inputsDiv.appendChild(inputs.positionFnPicker);

    // Go button
    inputs.goButton = createButton({
      label: 'Go',
      onClick: this.startAnimation.bind(this)
    });
    inputsDiv.appendChild(inputs.goButton);

    function addEaseOption(fnName) {
      var option = document.createElement('option');
      option.textContent = fnName;
      option.value = fnName;
      if (fnName === this.normalizedPositionFnName) {
        option.selected = 'selected';
      }
      inputs.positionFnPicker.appendChild(option);
    }
  }

  setupSvg() {
    const svgEl = document.createElementNS(
      'https://www.w3.org/2000/svg',
      'svg'
    );
    document.body.appendChild(svgEl);
    svgEl.setAttribute('width', 1000);
    svgEl.setAttribute('height', 1000);
    return svgEl;
  }

  loadSvg({ svgUrl }) {
    const svgPromise = window
      .fetch(svgUrl)
      .then(response => response.text())
      .then(text => this.renderSvg({ svgStr: text }))
      .catch(this.handleError);
    return svgPromise;
  }

  renderSvg({ svgStr }) {
    const parser = new window.DOMParser();
    const svgDoc = parser.parseFromString(svgStr, 'image/svg+xml');
    // Achtung! this has a side effect of destroying the soul of rootel in its original doc. weiiiiird. There can be only one. Highlander.
    svgDoc.rootElement.setAttribute('width', 100);
    svgDoc.rootElement.setAttribute('height', 100);
    this.targetSvg = svgDoc.rootElement;
    this.els.svg.appendChild(this.targetSvg);
    return Promise.resolve();
  }

  startAnimation() {
    console.log('start!');
    // start the timer
    this.timer = d3.timer(this.step.bind(this));
  }

  step(time) {
    const t = (time % this.cycleLength) / 1000;
    var pos = this.positionFn({ t });
    pos[1] += this.centerY;
    this.targetSvg.setAttribute('transform', `translate(${pos.join(', ')})`);
  }

  scaleIt(val) {
    return this.scale * val;
  }

  positionFn({ t }) {
    return [t, d3[this.normalizedPositionFnName](t)].map(
      this.scaleIt.bind(this)
    );
  }

  handleError(e) {
    console.log('badness!', e);
  }
}

function createButton({ onClick, label }) {
  var button = document.createElement('button');
  button.innerHTML = label;
  button.addEventListener('click', onClick);
  return button;
}

function isEaseFn(name) {
  return name.startsWith('ease');
}

const app = new App();
app.init({});
