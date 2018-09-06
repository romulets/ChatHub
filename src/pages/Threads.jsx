import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withStyles, ListItem, ListItemText, Typography, List } from '@material-ui/core';

const styles = theme => ({
  normalLink: {
    textDecoration: 'none'
  }
})

class Threads extends Component {

	render() {
		const { classes } = this.props

		return (
			<div>
				<Typography variant="title">Threads</Typography>

				<List>
					<Link to={`/projects/0/threads/0/chat`} className={classes.normalLink}>
						<ListItem button>
							<ListItemText primary={'Main'} />
						</ListItem>
					</Link>
				</List>
			</div>
		)
	}

}

export default withStyles(styles)(Threads);