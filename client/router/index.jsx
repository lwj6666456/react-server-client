import React from 'react'
import {
  Route,
} from 'react-router'
import Login from '../views/Login/index'
import Register from '../views/Register/index'


export default () => [
  <Route key="login" path="/Login" component={Login} exact />,
  <Route key="register" path="/Register" component={Register} exact />,
]
