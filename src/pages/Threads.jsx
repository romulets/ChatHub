import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withStyles, ListItem, ListItemText, Typography, List, Button, TextField, Snackbar, CircularProgress } from '@material-ui/core';
import back from '../requests/back';
import { getUser } from '../login/login-service';

const styles = theme => ({
  normalLink: {
    textDecoration: 'none'
  },
  threadNameField: {
    width: '50%',
    marginRight: '20px'
  }
})

class Threads extends Component {

  state = {
    threads: [],
    threadName: '',
    repository: undefined,
    snackbarIsOpen: false,
    snackbarMessage: ''
  }

  props = {}

  constructor(props) {
    super(props)
    this.props = props
    this.getRepositoryThreads = this.getRepositoryThreads.bind(this)
    this.newThread = this.newThread.bind(this)
    this.updateThreadName = this.updateThreadName.bind(this)
  }

  async componentDidMount() {
    await this.getRepository()
    await this.getRepositoryThreads()
  }

  updateThreadName({ target: { value } }) {
    this.setState({ threadName: value })
  }

  openSnackbar(snackbarMessage) {
    this.setState({ snackbarIsOpen: true, snackbarMessage })
  }

  async getRepository() {
    const repositoryId = this.props.match.params.repositoryId
    const user = getUser()

    try {
      const resp = await back.get(`users/${user._id}/repositories/${repositoryId}`)
      this.setState({ repository: resp.data })
    } catch (error) {
      alert("Error on fetch the repositories")
    }
  }

  async getRepositoryThreads() {
    this.setState({ threads: [] })

    try {
      const resp = await back.get(`/repositories/${this.state.repository._id}/threads`)
      this.setState({ threads: resp.data })
    } catch (error) {
      alert("Error on fetch the threads' repositories")
    }
  }

  async newThread() {
    const newThreadName = (this.state.threadName || '').trim()

    if (newThreadName.length === 0) {
      this.openSnackbar('Please provide a valid thread name')
      return
    }

    const data = {
      name: newThreadName,
      repositoryId: this.state.repository._id
    }

    this.setState({ threadName: '' })
    this.openSnackbar('Saving thread')

    await back.post(`repositories/${this.state.repository._id}/threads`, data)
    await this.getRepositoryThreads()

    this.openSnackbar('Thread saved!')
  }

  render() {
    const { classes } = this.props

    const threadName = this.state.threadName || ''
    const { repository } = this.state
    return (
      <div>
        <Typography variant="title">{repository ? repository.name + "'s" : ''} Threads </Typography>


        <TextField
          className={classes.threadNameField}
          id="threadName"
          label="New thread name"
          margin="normal"
          onChange={this.updateThreadName}
          value={threadName}
          error={threadName.trim().length === 0} />

        <Button variant="contained" color="primary" onClick={this.newThread}>Create new thread</Button>

        {
          ((threads) => {
            if (threads.length === 0) {
              return <CircularProgress style={{ display: 'block' }} />
            } else {
              return (
                <List>
                  {this.state.threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((thread, idx) => {
                    return (
                      <Link to={`/repositories/` + repository._id + `/threads/` + thread._id + `/chat`} className={classes.normalLink} key={idx}>
                        <ListItem button>
                          <ListItemText primary={thread.name} />
                        </ListItem>
                      </Link>
                    )

                  })}

                </List>
              )
            }
          })(this.state.threads || [])
        }

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.snackbarIsOpen}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={this.state.snackbarMessage} />
      </div>
    )
  }

}

export default withStyles(styles)(Threads);