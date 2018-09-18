import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import queryString from 'query-string'
import back from "../../requests/back";
import { setToken, hasToken } from "../../login/login-service";

export default class SignInCallback extends Component {

  async componentDidMount() {
    const { code } = queryString.parse(this.props.location.search)

    if (hasToken()) {
      return
    }

    try {
      const resp = await back.post('/login', { code })
      const { code: access_token } = resp.data
      console.log('ACCESS_TOKEN ' + access_token)
      setToken(access_token)
      window.location.reload(true)
    } catch (error) {
      window.alert(error.data.message)
      console.error(error)
    }
  }

  render() {
    if (hasToken()) {
      return <Redirect to="/" />
    }

    return <div />
  }

}