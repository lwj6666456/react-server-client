import React from 'react'
import Routes from '../router/index'
import {
  Link,
} from 'react-router-dom'

export default class App extends React.Component {
  componentDidMount() {
    console.log(111)
  }

  render() {
    return [
      <div>
        <Link to="/register">注册</Link>
        <br />
        <Link to="/login">登录</Link>
      </div>,
      <Routes />]
  }
}
