import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withStyles, ListItem, ListItemText, Typography, List, Button, TextField, Snackbar } from '@material-ui/core';
import back from '../requests/back';

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
    projectId: 0,
    snackbarIsOpen: false,
    snackbarMessage: ''
	}

	props = {}

	constructor(props) {
		super(props)
		this.props = props
		this.getProjectThreads = this.getProjectThreads.bind(this)
    this.newThread = this.newThread.bind(this)
    this.updateThreadName = this.updateThreadName.bind(this)
	}

	componentDidMount() {
		this.getProjectThreads()
  }
  
  updateThreadName ({target: { value }}) {
    this.setState({threadName: value})
  }

  openSnackbar(snackbarMessage) {
    this.setState({snackbarIsOpen: true, snackbarMessage })
  }

	async getProjectThreads() {
		const projectId = this.props.match.params.projectId

		this.setState({ threads: [], projectId: projectId })

		try {
			const resp = await back.get(`/threads/${projectId}`)
			this.setState({ threads: resp.data })
		} catch (error) {
			alert("Erro ao consultar as threads do projeto")
		}
	}

	async newThread(){
    const newThreadName = this.state.threadName.trim()
    
    if (newThreadName.length === 0) {
      this.openSnackbar('Please provide a valid thread name')
      return
    }

		const data = {
				name: newThreadName,
				projectId: this.state.projectId
		}

    this.setState({ threadName: '' })
    this.openSnackbar('Saving thread')

		await back.post(`/threads`, data)
    await this.getProjectThreads()
    
    this.openSnackbar('Thread saved!')
	}

	render() {
		const { classes } = this.props
    const projectId = this.props.match.params.projectId
    
    console.log(this.state.threads)
		return (
			<div>
				<Typography variant="title">Threads </Typography>

        
          <TextField 
            className={classes.threadNameField} 
            id="threadName" 
            label="New thread name" 
            margin="normal" 
            onChange={this.updateThreadName} 
            value={this.state.threadName}
            error={this.state.threadName.trim().length === 0} /> 

          <Button variant="contained" color="primary" onClick={this.newThread}>Create new thread</Button>
        

				<List>
					{this.state.threads.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((thread, id) => {

						return (
							<Link to={`/projects/` + projectId + `/threads/` + thread._id + `/chat`} className={classes.normalLink}>
								<ListItem button>
									<ListItemText primary={thread.name} />
								</ListItem>
							</Link>
						)

					})}

				</List>

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