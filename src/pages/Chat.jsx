import React, { Component, } from 'react'
import { withStyles, Typography, Button, TextField, CircularProgress, Card, CardContent, CardHeader, InputAdornment, FormControl, Input } from '@material-ui/core';
import back from '../requests/back';
import { getUser } from '../login/login-service';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'

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
    display: 'flex',
    height: '40px',
    width: '100%',
    padding: '5px 10px',
    border: '1px solid #efefef',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    background: 'rgba(81, 255, 118, 0.23)',
  },
  sentByGithub:{
    marginLeft: 'calc(35% + 5px)',
    background: 'rgb(255, 242, 216)',
    textAlign: 'center',
    width: 'calc(30% - 10px)',
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
    searchText: '',
    searchedText: '',
    loading: true,
    loadingMessages: false,
    editingName: false
  }

  constructor(props) {
    super(props)

    this.getThread = this.getThread.bind(this)
    this.getMessages = this.getMessages.bind(this)
    this.updateMessage = this.updateMessage.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.sendMessageThroughKeyEnter = this.sendMessageThroughKeyEnter.bind(this)
    this.loadOlderMessages = this.loadOlderMessages.bind(this)
    this.editName = this.editName.bind(this)
    this.updateThreadName = this.updateThreadName.bind(this)
    this.stopEditName = this.stopEditName.bind(this)
    this.search = this.search.bind(this)
    this.updateSearchText = this.updateSearchText.bind(this)
  }

  async componentDidMount() {
    this.setState({ loading: true })
    await this.getRepository()
    await this.getThread()
    await this.getMessages()
    this.startPooling()

    this.loggedUser = getUser()
    delete this.loggedUser.repositories
    delete this.loggedUser.url
    delete this.loggedUser.avatarUrl

    this.setState({ loading: false })
  }

  startPooling() {
    setInterval(this.getNextMessages.bind(this), 10000)
  }

  async getNextMessages() {
    if (this.state.searchedText.trim() > 0) {
      return
    }

    const { messages: msgs } = this.state

    const { repositoryId, threadId } = this.props.match.params
    const lastMsg = msgs[msgs.length - 1]
    const timestamp = lastMsg ? new Date(lastMsg.savedAt) : new Date()
    const resp = await back.get(`/repositories/${repositoryId}/threads/${threadId}/messages/next/${timestamp.getTime()}`)

    if (resp.data.length > 0) {
      this.setState({
        hasMoreMessages: resp.data.length === 20,
        messages: this.state.messages.concat(resp.data)
      })

      this.scrollMessagesContainerBottom()
    }
  }

  sendMessageThroughKeyEnter(event) {
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

  async getThread() {
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
    this.scrollMessagesContainerBottom()
  }

  updateMessage(event) {
    this.setState({ message: event.target.value })
  }

  async sendMessage() {
    const { messages, message: messageContent } = this.state
    const { threadId, repositoryId } = this.props.match.params

    if (!messageContent || messageContent.trim().length === 0) {
      return
    }

    const message = {
      user: this.loggedUser,
      content: messageContent.trim(),
      sentAt: new Date(),
    }
    const resp = await back.post(`/repositories/${repositoryId}/threads/${threadId}/messages`, message)
    messages.push(resp.data)
    this.setState({ message: '', messages })
    this.scrollMessagesContainerBottom()
  }


  async updateThreadName(e) {
    const { thread } = this.state
    thread.name = e.target.value
    this.setState({ thread })
  }

  editName() {
    this.setState({ editingName: true })
  }

  async stopEditName(e) {

    if (e.key === "Enter") {
      const { repositoryId } = this.props.match.params
      console.log(repositoryId)
      console.log(this.state.thread)
      await back.post(`repositories/${repositoryId}/threads/${this.state.thread._id}`, this.state.thread)
      this.setState({ editingName: false })
      return false
    }
    return true
  }

  updateSearchText(evt) {
    this.setState({ searchText: evt.target.value })
  }

  async search() {
    const { searchText, searchedText } = this.state
    
    if (searchText.trim().length === 0) {
      if (searchedText.trim().length > 0) {
        this.setState({searchedText: ''})
        this.getMessages()
      }
      return
    }

    if (searchText === searchedText) {
      return
    }

    const { repositoryId, threadId } = this.props.match.params
    this.setState({messages: [], loadingMessages: true})
    const resp = await back.get(`/repositories/${repositoryId}/threads/${threadId}/messages?search=${searchText}`)
    this.setState({messages: resp.data, searchedText: searchText, loadingMessages: false})
  }

  render() {
    const { editingName, thread, loadingMessages, hasMoreMessages, messages, repository, searchedText } = this.state

    if (this.state.loading && !this.state.editingName) {
      return (
        <div>
          <CircularProgress />
        </div>
      )
    } else {
      const { classes } = this.props
      return (
        <div className={classes.chatArea}>
          <div className={classes.messagesHeader}>

            <Typography variant="body1">
              {repository.name}
            </Typography>


            {(editingName) ? (
              <Typography variant="title">
                <TextField className={classes.threadNameField}
                  id="threadName"
                  margin="normal"
                  onChange={this.updateThreadName}
                  onKeyPress={this.stopEditName}
                  value={thread.name}
                  error={thread.name.trim().length === 0} />
              </Typography>
            ) : (
                <Typography variant="title">
                  {thread.name}
                  {thread.main ? null : (
                    <IconButton onClick={this.editName}>
                      <EditIcon />
                    </IconButton>
                  )}
                </Typography>
              )}

            <FormControl>
              <Input
                id="search"
                placeholder="Search...  "
                onKeyPress={(evt) => evt.key.toLowerCase() === 'enter' ? this.search() : null }
                onChange={this.updateSearchText}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Search"
                      onClick={this.search}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>

          <div className={classes.messagesContainer} id="messagesContainer">

            {searchedText.trim().length > 0 ? 
              <Typography component="p" className={classes.buttonCenter}>Searching for '{searchedText}'</Typography> :
                loadingMessages ?
                <CircularProgress className={classes.buttonCenter} /> :
                hasMoreMessages ?
                  <Button variant="outlined" className={classes.buttonCenter} onClick={this.loadOlderMessages} >Load older messages</Button> :
                  <Typography component="p" className={classes.buttonCenter}>No more messages.</Typography>}

            {messages.map((message, idx) => (
              (message.user != null) ? (
              <Card key={idx} className={[classes.messageCard, message.user != null && message.user.githubId === this.loggedUser.githubId ? classes.sentByMe :  message.user == null ? classes.sentByGithub : ''].join(' ')}>
                <CardHeader subheader={`${message.user == null ? "GitHub" : message.user.username} - ${message.sentAt.toLocaleString()}`} className={classes.messageHeader} />
                <CardContent className={classes.messageContent}>
                  <Typography component="p">
                    {searchedText.trim().length === 0 ? message.content : (
                      <Highlighter 
                        searchWords={[searchedText.trim()]}
                        autoEscape={true}
                        textToHighlight={message.content}
                      />
                    )}
                  </Typography>
                </CardContent>
              </Card>    
              ) : (
                <a href={message.url} target="_blank" style={{textDecoration:'none'}}>
                  <Card key={idx} className={[classes.messageCard, classes.sentByGithub].join(' ')}>
                  <CardContent className={classes.messageContent}>
                    <Typography component="p">
                      {searchedText.trim().length === 0 ? message.content : (
                        <Highlighter 
                          searchWords={[searchedText.trim()]}
                          autoEscape={true}
                          textToHighlight={message.content}
                        />
                      )}
                    </Typography>
                  </CardContent>
                </Card>    
              </a>
              )  
          ))}

          </div>


          <div className={classes.messageFieldContainer}>
            <TextField className={classes.messageField} placeholder='Type your message here...' onChange={this.updateMessage} onKeyPress={this.sendMessageThroughKeyEnter} value={this.state.message} />
            <Button variant="contained" color="primary" className={classes.messageSend} onClick={this.sendMessage}>Enviar</Button>
          </div>

        </div>
      )
    }

  }

}

export default withStyles(styles)(Chat);