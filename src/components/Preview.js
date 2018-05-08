import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Preview from 'react-styleguidist/lib/rsg-components/Preview/Preview'
import api from '../api'
import Test from './Test'
import renderHTML from '../html-renderer'

class SnapguidistPreview extends Component {

  constructor(props) {
    super(props)

    this.state = { response: null, html: null }

    this.runTest = this.runTest.bind(this)
    this.renderHTML = this.renderHTML.bind(this)
    this.evalInContext = this.evalInContext.bind(this)
  }

  componentDidMount() {
    window.requestAnimationFrame(() => this.runTest())
    window.requestAnimationFrame(() => this.renderHTML())
  }

  componentDidUpdate(prevProps) {
    if (prevProps.code !== this.props.code) {
      window.requestAnimationFrame(() => this.runTest())
      window.requestAnimationFrame(() => this.renderHTML())
    }
  }

  runTest(update) {
    this.setState({ isFetching: true })
    api
      .runTest(this.context.name, this.example, update)
      .then(response => this.setState({ response, isFetching: false }))
  }

  evalInContext(code) {
    const result = this.props.evalInContext(code)

    const wrapper = (state, setState, callback) => {
      console.log('wrapper', state, setState, callback)
      this.example = result(state, setState, callback)

      return this.example
    }

    return wrapper
  }

  renderHTML() {
    renderHTML(this.example).then(html => this.setState({ html }))
  }

  render() {
    return (
      <div>
        <Preview {...this.props} evalInContext={this.evalInContext} />
        <pre>Hello: {this.state.html}</pre>
        <Test
          isFetching={this.state.isFetching}
          onClick={() => this.runTest(true)}
          response={this.state.response}
        />
      </div>
    )
  }
}

SnapguidistPreview.propTypes = {
  code: PropTypes.string.isRequired,
  evalInContext: PropTypes.func.isRequired,
}

SnapguidistPreview.contextTypes = {
  name: PropTypes.string.isRequired,
}

export default SnapguidistPreview
