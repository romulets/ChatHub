import React, { Component, } from 'react'
import { withStyles, ListItem, ListItemText, Typography, List, Button, TextField, Snackbar } from '@material-ui/core';
import back from '../requests/back';

class Chat extends Component {

  state = {
    thread: null,
    loading: true,
    editingName: false
  }

  constructor(props){
    super(props)
    this.getThread.bind(props)
  }

  componentDidMount(){
    this.getThread()
  }

  async getThread(){
    const threadId = this.props.match.params.threadId
    const projectId = this.props.match.params.projectId
    const resp = await back.get(`/projects/${projectId}/threads/${threadId}`)
    this.setState({ thread: resp.data[0], loading: false })
  }

  async updateThreadName(){

  }

  editName(){
    this.setState({editingName:true})
  }

  render() {
    if(this.state.loading && !this.state.editingName){
      return (
        <div>
          <Typography variant="title">Carregando ... </Typography>
        </div>
      )
    }else if(!this.state.editingName){
      return (
        <div>
          <Typography variant="title">{this.state.thread.name} </Typography>
        </div>
      )
    }else{
		const { classes } = this.props
    return(
        <div>
          <TextField 
            className={classes.threadNameField} 
            id="threadName" 
            label="New thread name" 
            margin="normal" 
            onChange={this.updateThreadName} 
            value={this.state.thread.name}
            error={this.state.thread.name.trim().length === 0} /> 

          <Button variant="contained" color="primary" onClick={this.newThread}>Create new thread</Button>
        </div>
      )
    }
    
  }

}

export default Chat