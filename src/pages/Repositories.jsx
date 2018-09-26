import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import back from '../requests/back';
import { getUser } from '../login/login-service';
import { List, ListItem, ListItemText, Typography, withStyles, CircularProgress } from '@material-ui/core';

const styles = theme => ({
  normalLink: {
    textDecoration: 'none'
  }
})

class Repository extends Component {

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
    const user = getUser()

    try {
      this.setState({ loading: true })

      const resp = await back.get(`/users/${user._id}/repositories`)
      this.setState({ repositories: resp.data })

      this.setState({ loading: false })
    } catch (error) {
      alert('User does not exists')

      this.setState({ loading: false })
    }
  }

  logout() {
    localStorage.removeItem('access_token')
  }

  render() {
    if (this.state.loading) {
      return <CircularProgress />
    }

    const { classes } = this.props

    return (
      <div>
        <Typography variant="title">Your Repositories</Typography>

        <List>
          {this.state.repositories.map((repo, idx) => {
            return (
              <Link to={`/repositories/${repo._id}/threads`} className={classes.normalLink} key={idx}>
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

export default withStyles(styles)(Repository);