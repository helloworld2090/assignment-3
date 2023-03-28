import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from '@material-ui/core';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import PlaceHolder from './PlaceHolder.js'
import CloseIcon from '@mui/icons-material/Close';
import PurpleButton from '../Components/PurpleButton';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  appBar: {
    background: '#F3F3F3',
    height: 60,
    top: 0,
    width: '100%',
    position: 'fixed',
    zIndex: 99,
    borderBottom: '1px solid #CCCCFF',
  },
  title: {
    marginLeft: '5%',
  },

  appBarBtn: {
    marginLeft: '10px',
    marginTop: '8px',
    height: '48px',
    minWidth: '100px',
    border: 'none',
    background: 'none',
    borderBottom: '3px solid transparent',
    '&:hover': {
      cursor: 'pointer',
      borderBottom: '3px solid #89589C',
    },
  },
  userEmail: {
    marginLeft: '30%',
    marginTop: '5px',
    color: 'purple'
  },

  logoutBtn: {
    marginTop: '10px',
    marginLeft: '5%',
    height: '50px',
    border: 'none',
    background: 'none',
    borderBottom: '3px solid transparent',
    '&:hover': {
      cursor: 'pointer',
      borderBottom: '3px solid #89589C',
    },
  },
  modalBox: {
    marginLeft: '25%',
    marginTop: '10%',
    width: '50%',
    height: '400px',
    backgroundColor: 'white',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '20px'
  },
  modalContainer: {
    alignItems: 'center',
    textAlign: 'center',

  },
  textFieldDIv: {
    marginTop: '50px',
  },
  textField: {
    width: '70%',
  },
  homeBtn: {
    width: 200,
    fontSize: '10pt',
    marginLeft: '20px',
    border: 'none',
    background: 'transparent',
    '&:hover': {
      cursor: 'pointer',
    },
  },

  addGameBtn: {
    padding: '0 30px',
    height: 50,
    width: 200,
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
  Alert: {
    marginLeft: '10%',
    width: '80%'
  },
  closeIcon: {
    marginLeft: '90%',
    marginTop: '5px',
    border: 'transparent',
    background: 'transparent',
    '&:hover': {
      cursor: 'pointer',
    },
  }
})
export default function AppBarAuthenticated (props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hideSuccessAlert, setHideSuccessAlert] = useState(true);
  const [hideErrAlert, setHideErrAlert] = useState(true);

  function handleClose () {
    setOpen(false);
    setHideSuccessAlert(true);
    setHideErrAlert(true);
  }

  // logout a user
  function logout () {
    axios({
      method: 'post',
      url: 'http://localhost:5005/admin/auth/logout',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
    })
      .then(() => {
        sessionStorage.clear();
        navigate('/')
      })
  }

  function joinGame () {
    window.open('http://localhost:3000/GameSession', '_blank').focus();
  }

  // adds a new game
  async function addGame () {
    const NewGameTitle = document.getElementById('NewName').value;

    if (NewGameTitle === '') {
      setHideSuccessAlert(true);
      setHideErrAlert(false);
      return;
    }
    const res = await axios({
      method: 'post',
      url: 'http://localhost:5005/admin/quiz/new',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
      data: {
        name: NewGameTitle,
      },
    })
    axios({
      method: 'put',
      url: 'http://localhost:5005/admin/quiz/' + res.data.quizId,
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      data: {
        questions: [
        ],
        name: NewGameTitle,
        thumbnail: PlaceHolder()
      },
    })

    document.getElementById('NewName').value = '';
    setHideSuccessAlert(false);
    setHideErrAlert(true);
    const newURL = window.location.pathname;
    if (newURL.includes('EditGame')) {
      navigate('/EditGame?id=' + res.data.quizId);
      window.location.reload();
    } else {
      navigate('/EditGame?id=' + res.data.quizId);
    }
  }

  return (
    <div>
      <AppBar position='static' class={classes.appBar}>
        <Toolbar>
          <Button
          onClick={() => navigate('/DashBoard')}
          class={classes.homeBtn}
          disableRipple
          type = "homeBtn"
          ><h3 id = 'bigBrainTitle' className = {classes.title}
            >Big Brain</h3>
          </Button>

          <Button
            class={classes.appBarBtn}
            onClick={() => setOpen(true)}
            disableRipple
            id = 'addGame'
            type = 'addGame'
          >
            Add Game
          </Button>
          <Button
            class={classes.appBarBtn}
            disableRipple
            onClick={() => navigate('/SearchPage')}
            id = 'search'
            type = 'search'
          >
              Search
          </Button>
          <Button
            class={classes.appBarBtn}
            onClick={() => joinGame()}
            disableRipple
            id = 'joinGame'
          >
              Join a Game
          </Button>

          <Button
            class={classes.appBarBtn}
            onClick={() => logout()}
            disableRipple
            id= 'logout'
            type = 'logout'
          >
            Logout
          </Button>
            <div
              className={classes.userEmail}
            >
              {sessionStorage.getItem('email')}
          </div>
        </Toolbar>
      </AppBar>

      <div className={classes.modalContainer}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box class={classes.modalBox}>
            <Button class={classes.closeIcon}
            onClick = { () => handleClose()}
            type= 'closeModal'
            disableRipple
            >
              <CloseIcon></CloseIcon>
            </Button>
            <h1 className={classes.newGameTitle}>Enter new game title</h1>
            <div className={classes.textFieldDIv}>
                <TextField
                className={classes.textField}
                id='NewName'
                label='Title'
                name = 'newGameTitle'
                variant='outlined'/>
            </div>
            <PurpleButton
                type = 'createGameBtn'
                title = 'Create Game'
                id = 'addGameBtn'
                onClick={() => addGame()}>
            </PurpleButton>
            <div className={classes.Alert} hidden = {hideSuccessAlert}>
                <Alert severity='success'>Game Added</Alert>
            </div>
            <div className={classes.Alert} hidden = {hideErrAlert}>
                <Alert severity='error'>Title Cannot be Empty</Alert>
            </div>
          </Box>
        </Modal>
      </div>
  </div>
  )
}

AppBarAuthenticated.propTypes = {
  curGame: PropTypes.number,
  addNewGame: PropTypes.any
};
