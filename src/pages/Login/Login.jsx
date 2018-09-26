import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { hasUser } from '../../login/login-service';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: '#fff',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  logo: {
    height: '50px'
  },
  noStyle: {
    textDecoration: 'none'
  }
});

class SignIn extends Component {

  GITHUB_CLIENT_ID = window.location.hostname === 'localhost' ? 'd8fac4c3209c24213a83' : '06769512846394835010'

  render() {
    const { classes } = this.props

    if (hasUser()) {
      return <Redirect to="/" />
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <img src='/images/github-logo.svg' alt='github logo' className={classes.logo} />
            </Avatar>
            <Typography variant="headline">ChatHub</Typography>

            <a className={classes.noStyle} href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${this.GITHUB_CLIENT_ID}`}>
              <Button
                fullWidth
                variant="raised"
                color="primary"
                className={classes.submit}>
                Sign in with github
                    </Button>
            </a>

          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);