/* global d3 */

class App {
  constructor () {
    this.state = {
      svgUrl: './squirrel.svg'
    }
    this.els = {}
  }

  init () {
    this.rootEl = document.createElement('div')
    document.body.appendChild(this.rootEl)
    this.inputs = this.setupInputs()
    this.els.svg = this.setupSvg()
    this.loadSvg({ svgUrl: this.state.svgUrl })
    // .then(() => this.startAnimation())
      .catch(this.handleError)
  }

  setupInputs () {
    const inputs = {}
    const inputsDiv = document.createElement('div')
    this.rootEl.appendChild(inputsDiv)

    // SVG text input.
    inputs.svgUrl = document.createElement('input')
    inputs.svgUrl.value = this.state.svgUrl
    inputsDiv.appendChild(inputs.svgUrl)
    inputs.svgUrl.addEventListener('change', (e) => {
      this.state.svgUrl = e.target.value
    })

    // Load button
    inputs.loadButton = document.createElement('button')
    inputs.loadButton.innerHTML = 'load it!'
    inputsDiv.appendChild(inputs.loadButton)
    inputs.loadButton.addEventListener('click', () => {
      this.loadSvg({ svgUrl: this.state.svgUrl })
    })

    return inputs
  }

  setupSvg () {
    const svgEl = document.createElementNS('https://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svgEl)
    svgEl.setAttribute('width', 1000)
    svgEl.setAttribute('height', 1000)
    return svgEl
  }

  loadSvg ({ svgUrl }) {
    const svgPromise = window.fetch(svgUrl)
      .then((response) => response.text())
      .then((text) => this.renderSvg({ svgStr: text }))
      .catch(this.handleError)
    return svgPromise
  }

  renderSvg ({ svgStr }) {
    const parser = new window.DOMParser()
    const svgDoc = parser.parseFromString(svgStr, 'image/svg+xml')
    // Achtung! this has a side effect of destroying the soul of rootel in its original doc. weiiiiird. There can be only one. Highlander.
    svgDoc.rootElement.setAttribute('width', 100)
    svgDoc.rootElement.setAttribute('height', 100)
    this.els.svg.appendChild(svgDoc.rootElement)
    return Promise.resolve()
  }

  startAnimation () {
    console.log('start!')
    // start the timer
    this.timer = d3.interval((t) => {
      this.step(t)
    }, 500)
  }

  step (t) {
    const pos = this.positionFn({t})

  }

  positionFn ({t}) {
    return {
      y: Math.sin(t),
      x: Math.cos(t)
    }
  }

  handleError (e) {
    console.log('badness!', e)
  }
}

const app = new App()
app.init()
