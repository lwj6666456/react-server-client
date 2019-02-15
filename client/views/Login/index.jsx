import React from 'react'
import {
  observer,
  inject,
} from 'mobx-react'
import PropTypes from 'prop-types'
import { AppState } from '../../store/index'


@inject('appState') @observer
class Login extends React.Component {
  constructor() {
    super()
    this.changeName = this.changeName.bind(this)
  }

  componentDidMount() {

  }

  changeName(ev) {
    this.props.appState.changeName(ev.target.value)
  }

  render() {
    return (
      <div>
        <input type="text" onChange={this.changeName} />
        <div>{this.props.appState && this.props.appState.msg}</div>
      </div>

    )
  }
}

Login.proopTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired,
}
export default Login
