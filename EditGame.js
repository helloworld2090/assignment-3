import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@mui/material/Button';
import AppBarAuthenticated from '../Components/AppBarAuthenticated';
import QuestionComponent from '../Components/QuestionComponent';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import PurpleButton from '../Components/PurpleButton';

import axios from 'axios';

const useStyles = makeStyles({
  body: {
    marginTop: '100px',
  },
  gameTitle: {
    display: 'inline-block',
    marginLeft: '5%',
    paddingTop: '-10%',
    width: '50%',
    minWidth: '400px',
    wordWrap: 'break-word'
  },
  thumbNail: {
    maxWidth: '30%',
    minWidth: '300px',
    marginLeft: '10%',
    minHeight: '250px',
    maxHeight: '20%',
    borderRadius: '10px'
  },
  addQuestionBtn: {
    marginTop: '10px',
    height: 50,
    width: 140,
    borderColor: '#CCCCFF',
    background: 'none',
    borderRadius: 8,
    '&:hover': {
      cursor: 'pointer',
      borderColor: 'purple',
    },
  },
  editGame: {
    marginTop: '10px',
    height: 50,
    width: 140,
    borderColor: '#B5B5B5',
    background: 'none',
    borderRadius: 8,
    '&:hover': {
      cursor: 'pointer',
      borderColor: 'black',
    },
  },
  editGameTitle: {
    width: '90%',
    marginLeft: '5%',
    wordWrap: 'break-word'
  },
  modalBox: {
    marginLeft: '25%',
    marginTop: '10%',
    width: '50%',
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
  inputImage: {
    margin: '20px',
  },
  closeIcon: {
    marginLeft: '90%',
    marginTop: '5px',
    border: 'transparent',
    background: 'transparent',
    '&:hover': {
      cursor: 'pointer',
    },

  },
  Alert: {
    marginLeft: '10%',
    width: '80%'
  },
})

export default function EditGame () {
  let uploadImg;
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [title, setTitle] = useState(null);
  const [img, setImg] = useState(null);
  const [curQuestions, setCurQuestions] = useState([]);
  const [delGame, setDelGame] = useState(0);
  const [hideSuccessAlert, setHideSuccessAlert] = useState(true);
  const [hideErrAlert, setHideErrAlert] = useState(true);

  const navigate = useNavigate();

  const classes = useStyles();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id');

  useEffect(() => {
    getQuestionData(id);
    getData(id);
  }, [title, delGame]);

  // get question for a specific game
  async function getQuestionData (gameId) {
    if (sessionStorage.getItem('token') == null) {
      navigate('/');
    }
    const res = await axios({
      method: 'get',
      url: 'http://localhost:5005/admin/quiz/' + gameId,
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
    })
    setCurQuestions(res.data.questions);
  }

  // get all games
  async function getData (gameId) {
    const res = await axios({
      method: 'get',
      url: 'http://localhost:5005/admin/quiz',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
    })
    const numOfGames = res.data.quizzes.length;
    for (let i = 0; i < numOfGames; i++) {
      if (parseInt(res.data.quizzes[i].id) === parseInt(gameId)) {
        setTitle(res.data.quizzes[i].name);
        putImag(res.data.quizzes[i].thumbnail);
        return;
      }
    }
  }
  // puts a placeholder image
  function putImag (imgData) {
    if (imgData != null) {
      setImg(imgData);
    } else {
      document.getElementById('img').setAttribute('src', 'PlaceHolder.png');
    }
  }

  // edits game by id
  async function editGame (id) {
    const newName = document.getElementById('newGameStats').value;
    if (newName === '') {
      setHideErrAlert(false);
      setHideSuccessAlert(true);
      return;
    }
    axios({
      method: 'put',
      url: 'http://localhost:5005/admin/quiz/' + id,
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      data: {
        questions: curQuestions,
        name: newName,
        thumbnail: uploadImg
      },

    }).then((response) => {
      document.getElementById('newGameStats').value = '';
      setTitle(newName);
      setHideSuccessAlert(false);
      setHideErrAlert(true);
    })
  }

  const handleImg = async (e) => {
    const file = e.target.files[0];
    uploadImg = await converBse64(file);
  }
  // converts to image to base 64
  const converBse64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
    });
  }

  function addQuestion () {
    navigate('/AddQuestion?' + 'id=' + id);
  }
  return (
    <div>
      <AppBarAuthenticated>
      </AppBarAuthenticated>
      <div className={classes.body}>
      <div>
        <img id = 'img' src = {img} alt = 'img of game' className={classes.thumbNail}></img>
          <div className={classes.gameTitle}>
            <h2>{title}</h2>
            <p>{curQuestions.length} Questions</p>
            <Button
            disableRipple
            class={classes.editGame}
            onClick={() => setOpen(true)}
            type = "editGame"
            >
                Edit Game
            </Button>
            <br></br>
            <Button
            disableRipple
            class={classes.addQuestionBtn}
            onClick={() => addQuestion()}
            >
                Add question
            </Button>
          </div>
        </div>
        {curQuestions.map((question, index) => (
          <div key = {index}>
            <QuestionComponent
            key = {index}
            delGame = {delGame}
            deleteWatcher = { val => setDelGame(val)}
            data = {question}>
            </QuestionComponent>
          </div>
        ))}
        <br/>
        </div>
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
              disableRipple
              type = 'closeEditModal'
              >
              <CloseIcon></CloseIcon>
            </Button>
              <br></br>
              <h2 className={classes.editGameTitle}>Edit {title} Game</h2>
              <div className={classes.textFieldDIv}>
              <h4>New title</h4>
                  <TextField
                  className={classes.textField}
                  id='newGameStats'
                  name='editGameInput'
                  label='Title' variant='outlined'/>
              </div>
              <h4>Upload Image</h4>
              <input
                  className={classes.inputImage}
                  type='file'
                  id='gameImage' name='gameImage'
                  accept='image/png, image/jpeg'
                  onChange ={ (e) => handleImg(e)}
              ></input>
              <br></br>
              <PurpleButton
                  type = 'editThisGame'
                  title = 'Edit Game'
                  id = 'editGameBtn'
                  onClick={() => editGame(id)}>
              </PurpleButton>
              <div className={classes.Alert} hidden = {hideSuccessAlert}>
                  <Alert severity='success'>Edit success</Alert>
              </div>
              <div className={classes.Alert} hidden = {hideErrAlert}>
              <Alert severity='error'>Title cannot be empty</Alert>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
  );
}
