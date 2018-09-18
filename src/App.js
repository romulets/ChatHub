import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Projects from './pages/Projects';
import Threads from './pages/Threads';
import Chat from './pages/Chat';
import Login from './pages/Login/Login';
import LoginCallback from './pages/Login/LoginCallback';
import LoggedTemplate from './templates/LoggedTemplate';

class App extends Component {
  render() {
    return (
      <Router>

       <div>
        <Route exact path="/login" component={Login} />
        <Route exact path="/login-callback" component={LoginCallback} />
      
        <LoggedTemplate>
          <Route exact path="/projects" component={Projects} />
          <Route exact path="/projects/:projectId/threads" component={Threads} />
          <Route exact path="/projects/:projectId/threads/:threadId/chat" component={Chat} />
        </LoggedTemplate>
       </div>

      </Router>
    )
  }
}

export default App;
