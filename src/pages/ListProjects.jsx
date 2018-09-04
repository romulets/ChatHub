import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import Axios from 'axios';
import back from '../requests/back';

export default class ListProjects extends Component {

  state = {
    repositories: [],
    loading: false
  }

  constructor (props) {
    super(props)
    this.getUserRepositories = this.getUserRepositories.bind(this)
  }

  componentDidMount() {
    this.getUserRepositories()
  }

  async getUserRepositories () {
    this.setState({repositories: []})
    const token = localStorage.getItem('access_token')

    try {
      this.setState({loading: true})

      const resp = await back.get(`/repositories?token=${token}`)
      this.setState({repositories: resp.data})

      this.setState({loading: false})
    } catch (error) {   
      alert('Usuário não existe')

      this.setState({loading: false})
    }
  }

  render () {
      if (!localStorage.getItem('access_token')) {
        return <Redirect to="/login" />
      }

      return (
        <div>
          { this.state.loading ? <p>Carregando</p> : null }

          <ul>
            {this.state.repositories.map((repo, idx) => {
              return (
                <li key={idx}>
                  <a href={repo.url} target="_blank">{repo.name}</a>
                </li>
              )
            })}
          </ul>
        </div>
      )
  }

}