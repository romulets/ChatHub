import React, { Component } from 'react'
import Axios from 'axios';

export default class ListProjects extends Component {

    state = {
        repositories: [],
        user: '',
        loading: false
    }

    constructor (props) {
        super(props)

        this.onUpdateUser = this.onUpdateUser.bind(this)
        this.getUserRepositories = this.getUserRepositories.bind(this)
    }

    onUpdateUser (event) {
        this.setState({
            user: event.target.value
        })
    }

    async getUserRepositories () {
        this.setState({repositories: []})
        const {user} = this.state

        try {
            this.setState({loading: true})

            const resp = await Axios.get(`https://api.github.com/users/${user}/repos`)
            this.setState({repositories: resp.data})

            this.setState({loading: false})
        } catch (error) {   
            alert('Usuário não existe')

            this.setState({loading: false})
        }
    }

    render () {
        return (
            <div>
                <label htmlFor="user">Digite seu usuário</label>
                <input type="text" onChange={this.onUpdateUser} id="user" /> 
                <button onClick={this.getUserRepositories}>Buscar Repositórios</button>

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