import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import ListProjects from './pages/ListProjects';
import Login from './pages/Login/Login';
import LoginCallback from './pages/Login/LoginCallback';

class App extends Component {
  render() {
    return (
      <Router>

       <div>
        <Route exact path="/login" component={Login} />
        <Route exact path="/login/callback" component={LoginCallback} />
        <Route exact path="/" component={ListProjects} />
       </div>

      </Router>
    )
  }
}

export default App;
