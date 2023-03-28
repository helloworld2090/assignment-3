import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import AppBarNotAuthenicated from '../Components/AppBarNotAuthenicated';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import PurpleButton from '../Components/PurpleButton';
import Alert from '@mui/material/Alert';
import axios from 'axios';

const useStyles = makeStyles({
  body: {
    marginLeft: '20%',
    marginTop: '200px',
  },
  textFieldDIv: {
    marginTop: '50px',
    width: '60%',
  },
  textField: {
    width: '50%',
  },
  btnContainer: {
    marginLeft: '20%',
  },
  Alert: {
    marginLeft: '20%',
    width: '30%'
  }
})

export default function GameSession () {
  const navigate = useNavigate();
  const classes = useStyles();
  const [hideErrAlert, setHideErrAlert] = useState(true);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const SesssionId = urlParams.get('Sesssion');
  useEffect(() => {
    populateData();
  }, []);

  function populateData () {
    if (SesssionId != null) {
      console.log(SesssionId);
      document.getElementById('gameIdInput').value = SesssionId;
    }
  }

  // when the user enters a game
  async function enterGame () {
    const sessionId = document.getElementById('gameIdInput').value;
    const newName = document.getElementById('NameInput').value;

    const res = await axios({
      method: 'post',
      url: 'http://localhost:5005/play/join/' + sessionId,
      data: {
        name: newName
      }
    }).catch(() => failedJoin());
    if (res === undefined) {
      return;
    }
    sessionStorage.setItem('playerId', res.data.playerId);
    sessionStorage.setItem('name', newName);

    navigate('/GameQuestion');
  }

  // when the user failed to join a game
  function failedJoin () {
    console.log('incorrect session Id');
    setHideErrAlert(false);
  }
  return (
    <div>
      <AppBarNotAuthenicated>
      </AppBarNotAuthenicated>
      <div className={classes.body}>
      <h1>Enter Game session</h1>
      <div className={classes.textFieldDIv}>
        <TextField
        className={classes.textField}
        id='gameIdInput'
        InputLabelProps={{ shrink: true }}
        label='ID' variant='outlined'/>
      </div>
      <div className={classes.textFieldDIv}>
        <TextField
        className={classes.textField}
        id='NameInput'
        InputLabelProps={{ shrink: true }}
        label='Name' variant='outlined'/>
      </div>
      </div>
      <div className={classes.btnContainer}>
        <PurpleButton
          onClick={() => enterGame()}
          title = 'Enter Game'
          id = 'enterGameBtn'
        >
        </PurpleButton>
      </div>
      <div className={classes.Alert} hidden = {hideErrAlert}>
          <Alert severity='error'>Game Session not found</Alert>
      </div>

    </div>
  )
}
