import React, { Component, } from 'react'
import { withStyles, ListItem, ListItemText, Typography, List, Button, TextField, Snackbar, LinearProgress, CircularProgress, Card, CardContent, CardHeader, IconButton, CardActionArea } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import back from '../requests/back';

const styles = theme => ({
  chatArea: {
    background: '#fff',
    display: 'block',
    height: 'calc(100% - 64px)',
    width: '100%',
    border: '1px solid #efefef',
    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)'
  },
  buttonCenter: {
    display: 'block',
    margin: '0 auto',
    marginBottom: '10px'
  },
  messagesHeader: {
    background: '#efefef',
    display: 'block',
    height: '40px',
    width: '100%',
    padding: '5px 10px',
    border: '1px solid #efefef'
  },
  messagesContainer: {
    display: 'block',
    height: 'calc(100% - 140px)',
    width: '100%',
    padding: '30px 20px',
    overflowY: 'scroll',
    border: '1px solid #efefef'
  },
  messageCard: {
    marginBottom: '10px',
    marginTop: '10px',
    width: 'calc(50% - 10px)',
    background: 'rgba(46, 67, 255, 0.14901960784313725)'
  },
  sentByMe: {
    marginLeft: 'calc(50% + 10px)',
    background: 'rgba(81, 255, 118, 0.23)'
  },
  messageHeader: {
    padding: '5px'
  },
  messageContent: {
    padding: '5px',
    paddingBottom: '5px !important'
  },
  messageFieldContainer: {
    display: 'block',
    height: '100px',
    width: '100%',
    border: '1px solid #efefef',
    padding: '10px'
  },
  messageField: {
    width: 'calc(100% - 120px)',
    height: '100%',
    padding: '10px'
  },
  messageSend: {
    marginRight: '20px',
    width: '100px'
  }
})
class Chat extends Component {

  state = {
    thread: null,
    messages: [],
    loading: true,
    editingName: false
  }

  constructor(props){
    super(props)
    this.getThread = this.getThread.bind(this)
  }

  componentDidMount(){
    this.getThread()
  }

  async getThread(){
    const threadId = this.props.match.params.threadId
    const repositoryId = this.props.match.params.repositoryId
    const resp = await back.get(`/projects/${repositoryId}/threads/${threadId}`)
    this.setState({ thread: resp.data })
    this.getMessages()
  }

  async getMessages() {
    this.setState({ loading: true })

    this.setState({ messages: [
      {
        content: 'akldjhalkdjas',
        createdAt: new Date(),
        user: {
          username: 'alkdjhaldjk',
          name: 'alkhsdfkljadhfkja'
        }
      },
      {
        content: 'akldjhalkdjas',
        createdAt: new Date(),
        user: {
          username: 'alkdjhaldjk',
          name: 'alkhsdfkljadhfkja'
        }
      },
      {
        content: 'akldjhalkdjas',
        createdAt: new Date(),
        user: {
          username: 'alkdjhaldjk',
          name: 'alkhsdfkljadhfkja'
        }
      },
      {
        content: 'akldjhalkdjas',
        createdAt: new Date(),
        user: {
          username: 'alkdjhaldjk',
          name: 'alkhsdfkljadhfkja'
        }
      },{
        content: 'akldjhalkdjas',
        createdAt: new Date(),
        user: {
          username: 'alkdjhaldjk',
          name: 'alkhsdfkljadhfkja'
        }
      },
      {
        content: 'akldjhalkdjas',
        createdAt: new Date(),
        user: {
          username: 'alkdjhaldjk',
          name: 'alkhsdfkljadhfkja'
        }
      },{
        content: 'akldjhalkdjas',
        createdAt: new Date(),
        user: {
          username: 'alkdjhaldjk',
          name: 'alkhsdfkljadhfkja'
        }
      },
      {
        content: 'akldjhalkdjas',
        createdAt: new Date(),
        user: {
          username: 'alkdjhaldjk',
          name: 'alkhsdfkljadhfkja'
        }
      }
    ] })

    this.setState({ loading: false })
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
          <CircularProgress />
        </div>
      )
    }else if(!this.state.editingName){
      const { classes } = this.props
      return (
        <div className={classes.chatArea}>
          <div className={classes.messagesHeader}>
            <Typography variant="title">{this.state.thread.name} </Typography>
          </div>

          <div className={classes.messagesContainer}>
          
          <Button variant="outlined" className={classes.buttonCenter} >Load older messages</Button>

          {this.state.messages.map((message, idx) => (
            <Card key={idx} className={[classes.messageCard, idx % 2 == 0 ? classes.sentByMe : ''].join(' ')}>
            <CardHeader subheader={message.user.username + ' - ' + message.user.name} className={classes.messageHeader}/>
              <CardContent className={classes.messageContent}>
                <Typography component="p">{message.content}</Typography>
              </CardContent>
            </Card>
          ))}

          </div>


          <div className={classes.messageFieldContainer}>
            <TextField multiline className={classes.messageField} placeholder='Type your message here...' rowsMax="4"/>
            <Button variant="contained" color="primary" className={classes.messageSend}>Enviar</Button>
          </div>

        </div>
      )
    }
    
  }

}

export default withStyles(styles)(Chat);