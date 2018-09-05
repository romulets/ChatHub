import React, { Component } from 'react'
import { removeToken, hasToken } from '../login/login-service';
import { Redirect } from 'react-router-dom'

export default class LoggedTemplate extends Component {

  state = {
    redirectToLogin: false
  }

  constructor(props) {
    super(props)

    this.logout = this.logout.bind(this)
  }

  logout() {
    removeToken()
    this.setState({ redirectToLogin: true })
  }

  render() {
    if (this.state.redirectToLogin || !hasToken()) {
      return <Redirect to="/login" />
    }

    return (
      <div>
        <button onClick={this.logout}>Logout</button>

        <div>
          {this.props.children}
        </div>

      </div>
    )
  }

}