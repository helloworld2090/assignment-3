import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import AppBarAuthenticated from '../Components/AppBarAuthenticated';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const useStyles = makeStyles({
  body: {
    marginTop: '100px',
    marginLeft: '15%',
    minHeight: '1300px'
  },
  gameImage: {
    maxWidth: '20%',
    minWidth: '200px',
    position: 'absolute',
    marginLeft: '500px',
    marginTop: '-150px'

  },
  serachResult: {
    marginTop: '100px',
    width: '80%',
    wordWrap: 'break-word'
  },

  editGameBtn: {
    width: '150px',
    height: 40,
    marginTop: '2%',
    marginLeft: '1%',
    borderRadius: 10,
    fontSize: 'small',
    background: 'transparent',
    borderWidth: 'thin',
    borderColor: '#CCCCFF',
    '&:hover': {
      cursor: 'pointer',
      borderColor: 'purple',
    },
  },
  delGameBtn: {
    width: '150px',
    height: 40,
    marginTop: '2%',
    marginLeft: '1%',
    borderRadius: 10,
    fontSize: 'small',
    background: 'transparent',
    borderWidth: 'thin',
    borderColor: '#E29295',
    '&:hover': {
      cursor: 'pointer',
      borderColor: 'red',
    },
  },
  modalBox2: {
    marginLeft: '25%',
    marginTop: '10%',
    width: '50%',
    height: 300,
    backgroundColor: 'white',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '20px'
  },
  gameResultsBtn: {
    padding: '0 30px',
    height: 50,
    width: 140,
    marginTop: '30px',
    marginLeft: '30px',
    borderRadius: 8,
    fontSize: '13pt',
    background: 'transparent',
    fontWeight: 'bold',
    borderColor: '#CCCCFF',
    '&:hover': {
      borderColor: 'purple',
      cursor: 'pointer',
    },
  },
  newGameTitle: {
    width: '90%',
    marginLeft: '5%',
    wordWrap: 'break-word'

  }
})

export default function SearchPage () {
  const classes = useStyles();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [gameImg, setGameImg] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [time, setTime] = useState('');
  const [hideResult, setHideResult] = useState(true);
  const [gameId, setGameId] = useState(null);
  const [deleteQuestionModal, setDeleteQuestionModal] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  function handleOptions () {
    return games;
  }

  // gets question data
  async function getData () {
    const res = await axios({
      method: 'get',
      url: 'http://localhost:5005/admin/quiz',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
    })
    const tmp = [];
    for (let i = 0; i < res.data.quizzes.length; i++) {
      tmp.push(res.data.quizzes[i].name);
    }
    setGames(tmp);
  }

  // handles serach value
  async function search (val) {
    const res = await axios({
      method: 'get',
      url: 'http://localhost:5005/admin/quiz',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
    })

    let targetGame = null;
    for (let i = 0; i < res.data.quizzes.length; i++) {
      if (res.data.quizzes[i].name === val) {
        targetGame = res.data.quizzes[i];
      }
    }
    if (targetGame == null) {
      return;
    }
    const targetId = targetGame.id;
    const res1 = await axios({
      method: 'get',
      url: 'http://localhost:5005/admin/quiz/' + targetId,
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
    })
    setNumQuestions('number of Questions: ' + res1.data.questions.length);
    setGameImg(targetGame.thumbnail);
    setGameTitle(targetGame.name);
    const totalTime = getTotalTime(res1.data.questions);
    setTime('Total duration: ' + totalTime + 's');
    setHideResult(false);
    setGameId(targetId);
  }

  // get the total time of a question
  function getTotalTime (data) {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      count += parseFloat(data[i].timeLimit);
    }
    return count;
  }
  function gotoEdit () {
    navigate('/EditGame?id=' + gameId);
  }

  function openDelModal () {
    setDeleteQuestionModal(true);
  }

  // deletes a game
  async function deleteGame () {
    await axios({
      method: 'delete',
      url: 'http://localhost:5005/admin/quiz/' + gameId,
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
    })
    window.location.reload();
  }

  return (
    <div>
      <AppBarAuthenticated>
      </AppBarAuthenticated>

    <div className={classes.body}>
      <Autocomplete
        disablePortal
        autoSelect = {false}
        freeSolo
        clearOnBlur={false}
        options={handleOptions()}
        sx={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            name = 'searchBar'
            {...params}
            label='Find your Game'
            variant='standard'
            style={{
              width: '100%',
              margin: '20px 0',
            }}
          />
        )}
        onChange={(e, value) => {
          search(value);
        }}
        />
      <div className={classes.serachResult} hidden = {hideResult}>
        <h2>{gameTitle}</h2>
        <div>{numQuestions}</div>
        <br/>
        <div>{time}</div>
        <Button
          class={classes.editGameBtn}
          disableRipple
          onClick = {() => gotoEdit()}
        >Edit</Button>
        <br/>
        <Button
          class={classes.delGameBtn}
          disableRipple
          type = 'delGameBtn'
          onClick = {() => openDelModal()}
        >Delete Game</Button>
      </div>

      <img
      alt = "Game Image"
      className={classes.gameImage}
      src = {gameImg}/>
    </div>
    <Modal
      open={deleteQuestionModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box class={classes.modalBox2}>
        <br></br>
        <h4 className={classes.newGameTitle}>{'Delete ' + gameTitle + '?'}</h4>
        <Button
          disableRipple
          class={classes.gameResultsBtn}
          onClick={() => { setDeleteQuestionModal(false) }}
        >
          No
        </Button>

        <Button
          type = 'yesDelGame'
          disableRipple
          class={classes.gameResultsBtn}
          onClick={() => deleteGame()}
        >
          Yes
        </Button>
        <br/>
      </Box>
    </Modal>

  </div>
  )
}
