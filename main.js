/* global d3 */

class App {
  constructor () {
    this.state = {
      svgUrl: './squirrel.svg'
    }
  }

  init () {
    this.rootEl = document.createElement('div')
    document.body.appendChild(this.rootEl)
    this.inputs = this.setupInputs()
    this.loadSvg({ svgUrl: this.state.svgUrl })
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

  loadSvg ({ svgUrl }) {
    window.fetch(svgUrl)
      .then((response) => response.text())
      .then((text) => this.renderSvg({ svgStr: text }))
      .catch((err) => {
        console.log('badneessssss', err)
      })
  }

  renderSvg ({ svgStr }) {
    // make it into an el
    d3.select(document.body)
      .append('svg')
      .html(svgStr)
  }

  render () {
  }
}

const app = new App()
app.init()
