import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withStyles, ListItem, ListItemText, Typography, List, Button } from '@material-ui/core';
import back from '../requests/back';

const styles = theme => ({
	normalLink: {
		textDecoration: 'none'
	}
})

class Threads extends Component {

	state = {
		threads: [],
		projectId: 0
	}

	props = {}

	constructor(props) {
		super(props)
		this.props = props
		this.getProjectThreads = this.getProjectThreads.bind(this)
		this.newThread = this.newThread.bind(this)
	}

	componentDidMount() {
		this.getProjectThreads()
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
		const newThreadName = prompt("Nomeie a nova thread")

		const data = {
				name: newThreadName,
				projectId: this.state.projectId
		}

		await back.post(`/threads`, data)

		this.getProjectThreads()

	}

	render() {
		const { classes } = this.props
		const projectId = this.props.match.params.projectId
		return (
			<div>
				<Typography variant="title">Threads <Button variant="contained" color="primary" onClick={this.newThread}>Nova</Button></Typography>

				<List>
					{this.state.threads.map((thread, id) => {

						return (
							<Link to={`/projects/` + projectId + `/threads/` + thread._id + `/chat`} className={classes.normalLink}>
								<ListItem button>
									<ListItemText primary={thread.name} />
								</ListItem>
							</Link>
						)

					})}

				</List>
			</div>
		)
	}

}

export default withStyles(styles)(Threads);