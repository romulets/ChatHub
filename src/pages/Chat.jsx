import React, { Component, } from 'react'
import { withStyles, Typography, Button, TextField, CircularProgress, Card, CardContent, CardHeader } from '@material-ui/core';
import back from '../requests/back';
import io from 'socket.io-client'
import { Socket } from 'net';
import { getUser } from '../login/login-service';

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
    marginBottom: '10px',
    textAlign: 'center'
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
    minWidth: '200px',
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
    paddingBottom: '5px !important',
    wordBreak: 'break-all'
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
    hasMoreMessages: true,
    thread: null,
    messages: [],
    messageContent: '',
    loading: true,
    loadingMessages: false,
    editingName: false
  }

  constructor(props){
    super(props)

    this.getThread = this.getThread.bind(this)
    this.getMessages = this.getMessages.bind(this)
    this.updateMessage = this.updateMessage.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.sendMessageThroughKeyEnter = this.sendMessageThroughKeyEnter.bind(this)
    this.loadOlderMessages = this.loadOlderMessages.bind(this)
  }

  async componentDidMount(){
    this.setState({ loading: true })
    await this.getThread()
    await this.getMessages()
    this.connectSocket()

    this.loggedUser = getUser()
    this.setState({ loading: false })
  }

  connectSocket () {
    this.socket = io.connect('http://localhost:3200')
    const { threadId } = this.props.match.params

    this.socket.on(`message:${threadId}`, message => {
      const { messages } = this.state
      messages.push(message)
      this.setState({ messages })
      this.scrollMessagesContainerBottom()
    })
  }

  componentWillUnmount () {
      this.socket.disconnect()
  }

  sendMessageThroughKeyEnter (event) {
      if (event.key !== 'Enter' || event.shiftKey) {
          return
      }

      event.preventDefault()
      this.sendMessage()
      return false
  }

  scrollMessagesContainerBottom() {
    setTimeout(() => {
        const objDiv = document.getElementById('messagesContainer')
        objDiv.scrollTop = objDiv.scrollHeight
    }, 20)
}

  async getThread(){
    const { repositoryId, threadId } = this.props.match.params
    const resp = await back.get(`/repositories/${repositoryId}/threads/${threadId}`)
    this.setState({ thread: resp.data })
  }

  async loadOlderMessages() {
    this.setState({ loadingMessages: true })

    const { repositoryId, threadId } = this.props.match.params
    const skip = this.state.messages.length
    const resp = await back.get(`/repositories/${repositoryId}/threads/${threadId}/messages?skip=${skip}`)

    this.setState({
      hasMoreMessages: resp.data.length === 20,
      messages: resp.data.concat(this.state.messages)
    })

    this.setState({ loadingMessages: false })
  }

  async getMessages() {
    this.setState({ loadingMessages: true })

    const { repositoryId, threadId } = this.props.match.params
    const resp = await back.get(`/repositories/${repositoryId}/threads/${threadId}/messages`)

    this.setState({
      hasMoreMessages: resp.data.length === 20,
      messages: resp.data
    })

    this.setState({ loadingMessages: false })
  }

  updateMessage (event) {
    this.setState({ message: event.target.value })
  }

  sendMessage () {
    const { messages, message: messageContent } = this.state
    const { threadId } = this.props.match.params

    if (!messageContent || messageContent.trim().length === 0) {
        return
    }
    
    const message = {
        threadId,
        user: this.loggedUser,
        content: messageContent.trim(),
        sentAt: new Date(),
    }  

    this.socket.emit('message:sent', message)
    messages.push(message)
    this.setState({ message: '', messages })
    this.scrollMessagesContainerBottom()
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

          <div className={classes.messagesContainer} id="messagesContainer">
          
          { this.state.loadingMessages ? 
            <CircularProgress className={classes.buttonCenter} /> :
                this.state.hasMoreMessages ? 
                <Button variant="outlined" className={classes.buttonCenter} onClick={this.loadOlderMessages} >Load older messages</Button> :
                <Typography component="p" className={classes.buttonCenter}>No more messages.</Typography>}

          {this.state.messages.map((message, idx) => (
            <Card key={idx} className={[classes.messageCard, message.user.githubId === this.loggedUser.githubId ? classes.sentByMe : ''].join(' ')}>
            <CardHeader subheader={`${message.user.username} - ${message.sentAt.toLocaleString()}`} className={classes.messageHeader}/>
              <CardContent className={classes.messageContent}>
                <Typography component="p">{message.content}</Typography>
              </CardContent>
            </Card>
          ))}

          </div>


          <div className={classes.messageFieldContainer}>
            <TextField className={classes.messageField} placeholder='Type your message here...' onChange={this.updateMessage} onKeyPress={this.sendMessageThroughKeyEnter} value={this.state.message}/>
            <Button variant="contained" color="primary" className={classes.messageSend} onClick={this.sendMessage}>Enviar</Button>
          </div>

        </div>
      )
    }
    
  }

}

export default withStyles(styles)(Chat);