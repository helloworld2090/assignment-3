import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@material-ui/core';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import AppBarNotAuthenicated from '../Components/AppBarNotAuthenicated';
import PurpleButton from '../Components/PurpleButton';

import axios from 'axios';
import Alert from '@mui/material/Alert';

const useStyles = makeStyles({
  body: {
    marginLeft: '20%',
    marginTop: '200px',
  },
  textFieldDIv: {
    marginTop: '50px',
    width: 600,
  },
  textField: {
    width: 400,
  },
  primaryButton: {
    padding: '0 30px',
    height: 50,
    width: 140,
    borderRadius: 8,
    fontSize: '13pt',
    margin: '40px 0 20px 0',
    background: 'transparent',
    fontWeight: 'bold',
    borderColor: '#CCCCFF',
    '&:hover': {
      borderColor: 'purple',
      cursor: 'pointer',
    },
  },
  link: {
    marginLeft: '10px',
    color: '#89589C',
    fontWeight: 'bold',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  loginFailed: {
    maxWidth: '300px'
  }
})

export default function Login () {
  const classes = useStyles();
  const [hideFailed, setHideFailed] = useState(true);
  const navigate = useNavigate();

  // api call to login a user
  function loginUser () {
    const userEmail = document.getElementById('emailInput').value;
    const userPassword = document.getElementById('passwordInput').value;

    axios({
      method: 'post',
      url: 'http://localhost:5005/admin/auth/login',
      headers: {},
      data: {
        email: userEmail,
        password: userPassword,
      },
    })
      .then((response) => {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('email', userEmail);
        navigate('/DashBoard');
      })
      .catch(() => {
        console.log('login failed');
        setHideFailed(false);
      });
  }
  return (
    <div>
        <AppBarNotAuthenicated>
        </AppBarNotAuthenicated>
        <div className={classes.body}>
        <div className={classes.loginFailed} hidden = {hideFailed}>
          <Alert severity='error'>Incorrect Email or Password</Alert>
        </div>
            <h1 id = 'loginTitle'>Log In</h1>
            <div className={classes.textFieldDIv}>
                <TextField
                className={classes.textField}
                id='emailInput'
                label='Email'
                name = 'emailInput'
                variant='outlined'/>
              </div>
            <div className={classes.textFieldDIv}>
              <TextField
                className={classes.textField}
                id='passwordInput'
                name = 'passWordInput'
                label='Password'
                type = 'password'
                variant='outlined' />
            </div>
            <PurpleButton
              type = 'logIn'
              title = 'Log In'
              id = 'loginBtn'
              onClick={() => loginUser()}
            ></PurpleButton>
            <h4>Don not have an Account?
              <Button
                id = 'hasAccount'
                onClick={() => navigate('/register')}
                className={classes.link}
              >
                <p className={classes.link}>Sign Up</p>
              </Button>
            </h4>
        </div>
    </div>
  )
}
