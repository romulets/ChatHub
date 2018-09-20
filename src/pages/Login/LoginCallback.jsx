import React, { Component } from "react";
import queryString from 'query-string'
import back from "../../requests/back";
import { setUser, hasUser } from "../../login/login-service";

export default class SignInCallback extends Component {

  async componentDidMount() {
    const { code } = queryString.parse(this.props.location.search)

    if (hasUser()) {
      return
    }

    try {
      const resp = await back.post('/login', { code })
      const user = resp.data
      setUser(user)
      window.location = '/'
    } catch (error) {
      window.alert(error.data ? error.data.message : error.message)
      console.error(error)
    }
  }

  render() {
    return (
      <div>
        <p>Log In...</p>
      </div>
    )
  }

}