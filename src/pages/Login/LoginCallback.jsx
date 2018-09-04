import React, { Component } from "react";
import {Redirect} from 'react-router-dom'
import queryString from 'query-string'
import back from "../../requests/back";

export default class SignInCallback extends Component {

  state = {
    redirect: false
  }

  async componentDidMount() {
    const {code} = queryString.parse(this.props.location.search)

    try {
      const resp = await back.post('/login', {code})
      const {access_token} = resp.data
      localStorage.setItem('access_token', access_token)
      this.setState({redirect: true})
    } catch (error) {
      console.error(error)
    }
  }

  render () {
    if (this.state.redirect) {
      return <Redirect to="/" />
    }

    return <div />
  }

}