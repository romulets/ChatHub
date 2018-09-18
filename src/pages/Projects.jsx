import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import back from '../requests/back';
import { getToken } from '../login/login-service';
import { List, ListItem, ListItemText, Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
  normalLink: {
    textDecoration: 'none'
  }
})

class Project extends Component {

  state = {
    repositories: [],
    loading: false
  }

  constructor(props) {
    super(props)
    this.getUserRepositories = this.getUserRepositories.bind(this)
  }

  componentDidMount() {
    this.getUserRepositories()
  }

  async getUserRepositories() {
    this.setState({ repositories: [] })
    const token = getToken()

    try {
      this.setState({ loading: true })

      const resp = await back.get(`/repositories?token=${token}`)
      this.setState({ repositories: resp.data })

      this.setState({ loading: false })
    } catch (error) {
      alert('Usuário não existe')

      this.setState({ loading: false })
    }
  }

  logout() {
    localStorage.removeItem('access_token')
  }

  render() {
    if (this.state.loading) {
      return <Typography variant="body1">Carregando</Typography>
    }

    const { classes } = this.props

    return (
      <div>
        <Typography variant="title">Your Projects</Typography>

        <List>
          {this.state.repositories.map((repo, idx) => {
            return (
              <Link to={`/projects/${idx}/threads`} className={classes.normalLink}>
                <ListItem key={idx} button>
                  <ListItemText primary={repo.name} />
                </ListItem>
              </Link>
            )
          })}
        </List>
      </div>
    )
  }

}

export default withStyles(styles)(Project);