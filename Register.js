import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import AppBarNotAuthenicated from '../Components/AppBarNotAuthenicated';
import PurpleButton from '../Components/PurpleButton';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

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
  errMsg: {
    maxWidth: '300px'
  }
})

export default function Register () {
  const navigate = useNavigate();
  const classes = useStyles();
  const [hideEmpty, setHideEmpty] = useState(true);
  const [hidePasswordErr, setHidePasswordErr] = useState(true);
  const [hidePasswordLength, setHidePasswordLength] = useState(true);

  // api call to register a new user
  function registerUser () {
    const newEmail = document.getElementById('emailInput').value;
    const newName = document.getElementById('NameInput').value;
    const newPassword = document.getElementById('passwordInput').value;
    const newPassword2 = document.getElementById('passwordInput2').value;

    if (newEmail === '' || newName === '') {
      setHideEmpty(false);
      setHidePasswordErr(true);
      setHidePasswordLength(true);
      return;
    } else if (newPassword.length < 6) {
      setHidePasswordLength(false);
      setHideEmpty(true);
      setHidePasswordErr(true);
      return;
    } else if (newPassword !== newPassword2) {
      setHidePasswordErr(false);
      setHideEmpty(true);
      setHidePasswordLength(true);
      return;
    }

    axios({
      method: 'post',
      url: 'http://localhost:5005/admin/auth/register',
      headers: {},
      data: {
        email: newEmail,
        password: newPassword,
        name: newName
      },
    })
      .then((response) => {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('email', newEmail);
        navigate('/DashBoard');
      })
      .catch(() => {
        console.log('login failed');
      });
  }

  return (
    <div>
      <AppBarNotAuthenicated>
      </AppBarNotAuthenicated>
      <div className={classes.body}>
        <h1 id = 'registerTitle'>Register</h1>
          <div className={classes.errMsg} hidden = {hideEmpty}>
            <Alert severity='error'>Email and Name cannot be empty</Alert>
          </div>
          <div className={classes.errMsg} hidden = {hidePasswordErr}>
            <Alert severity='error'>Passwords do not Match</Alert>
          </div>
          <div className={classes.errMsg} hidden = {hidePasswordLength}>
            <Alert severity='error'>Password Length must be atlest 6 characters</Alert>
          </div>
            <div className={classes.textFieldDIv}>
                <TextField
                name = 'email'
                className={classes.textField}
                id='emailInput'
                label='Email'
                variant='outlined'/>
            </div>
            <div className={classes.textFieldDIv}>
                <TextField
                className={classes.textField}
                id='NameInput'
                label='Name'
                name = 'name'
                variant='outlined' />
            </div>
            <div className={classes.textFieldDIv}>
                <TextField
                className={classes.textField}
                name = 'passwordInput1'
                id='passwordInput'
                label='Password'
                type = 'password'
                variant='outlined' />
            </div>
            <div className={classes.textFieldDIv}>
                <TextField className={classes.textField}
                name = 'passwordInput2'
                id='passwordInput2'
                label='Re type Password'
                type = 'password'
                variant='outlined' />
            </div>
            <PurpleButton
              type = 'registerBtn'
              title = 'Register'
              id = 'registerBtn'
              onClick={() => registerUser()}
            ></PurpleButton>

            <h4>Already have an Account?
              <Button
                id = 'hasAccount'
                onClick={() => navigate('/')}
                className={classes.link}
              >
                <p className={classes.link}>Login</p>
              </Button>
            </h4>
          </div>
      </div>
  );
}
