
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  main: {
    minHeight: '360px',
    maxWidth: '100%'
  },
  divider: {
    minHeight: '20px'
  },
  gameBtn: {
    display: 'inline',
  },
  img: {
    borderRadius: '10px',
    width: '100%',
    minHeight: '160px',
    maxHeight: '160px',

    '&:hover': {
      cursor: 'pointer',
    },
  },
  title: {
    marginTop: '0%',
    textAlign: 'center',
    width: '90%',
    wordWrap: 'break-word'
  },
  delTitle: {
    width: '90%',
    marginLeft: '5%',
    wordWrap: 'break-word'
  },
  newStartedTitle: {
    width: '90%',
    marginLeft: '5%',
    wordWrap: 'break-word'
  },
  editGameBtn: {
    width: '30%',
    height: 40,
    marginTop: '5%',
    marginLeft: '3%',
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
  startGameBtn: {
    width: '30%',
    height: 40,
    marginTop: '5%',
    marginLeft: '3%',
    borderRadius: 10,
    fontSize: 'small',
    background: 'transparent',
    borderWidth: 'thin',
    borderColor: '#A0DCAB',
    '&:hover': {
      cursor: 'pointer',
      borderColor: 'green',
    },
  },
  delGameBtn: {
    width: '30%',
    height: 40,
    marginTop: '5%',
    marginLeft: '3%',
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
  advGameBtn: {
    width: '90%',
    height: 40,
    marginTop: '5%',
    marginLeft: '6%',
    borderRadius: 10,
    fontSize: 'small',
    background: 'transparent',
    borderWidth: 'thin',
    borderColor: 'rgb(215, 215, 215)',
    '&:hover': {
      cursor: 'pointer',
      borderColor: 'black',
    },
  },
  modalBox: {
    marginLeft: '20%',
    marginTop: '10%',
    width: '60%',
    backgroundColor: 'white',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '20px'
  },

  modalBox2: {
    marginLeft: '25%',
    marginTop: '10%',
    width: '50%',
    backgroundColor: 'white',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '20px'
  },
  copyClipboard: {
    padding: '0 30px',
    height: 50,
    width: 240,
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

  modalContainer: {
    alignItems: 'center',
    textAlign: 'center',
  },
  closeIcon: {
    marginLeft: '85%',
    marginTop: '5px',
    border: 'transparent',
    background: 'transparent',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  Alert: {
    marginLeft: '30%',
    width: '40%'
  },
  delAlert: {
    marginLeft: '30%',
    width: '45%',
    marginTop: '20px'
  }
});

export default function GameItem (props) {
  const [numQuestions, setNumQuestions] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSession, setGameSession] = useState(null);
  const [gameLink, setLink] = useState(null);
  const [numAdvanced, setNumAdvanced] = useState(0);
  const [startStopText, setStartStopText] = useState('');

  const [open, setOpen] = useState(false);
  const [openResults, setOpenResults] = useState(false);
  const [deleteQuestionModal, setDeleteQuestionModal] = useState(false);
  const [copiedHidden, setCopiedHidden] = useState(true);
  const [delErrHidden, setDelErrHidden] = useState(true);

  const handleClose = () => {
    setOpen(false)
    setCopiedHidden(true);
  }
  const handleCloseResults = () => setOpenResults(false);

  const navigate = useNavigate();
  const classes = useStyles();
  const gameId = props.game.id;
  const gameImg = props.game.thumbnail;

  useEffect(() => {
    getData(gameId);
  }, []);

  // get game data from id
  async function getData (gameId) {
    const res = await axios({
      method: 'get',
      url: 'http://localhost:5005/admin/quiz/' + gameId,
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
    })
    setNumQuestions(res.data.questions.length);
    // find total time
    let total = 0;
    for (let i = 0; i < res.data.questions.length; i++) {
      total += parseFloat(res.data.questions[i].timeLimit);
    }
    total = total.toFixed(1);
    setTotalTime(total);
    // get if the session if currently active
    if (res.data.active == null) {
      setGameStarted(false);
      setStartStopText('Start');
    } else {
      setGameStarted(true);
      setStartStopText('Stop');
    }
  }

  function editGame (gameId) {
    navigate('/EditGame?id=' + gameId.gameId);
  }

  function getResults () {
    navigate('/AdminResults?sessionId=' + gameSession + '&gameId=' + gameId);
  }

  // starts a new game
  async function startGame (gameId) {
    const id = gameId.gameId;
    if (gameStarted === false) {
      setStartStopText('Stop');
      await axios({
        method: 'post',
        url: 'http://localhost:5005/admin/quiz/' + id + '/start',
        headers: {
          Authorization: sessionStorage.getItem('token')
        },
      })

      setGameStarted(true);
      setOpen(true);

      const res2 = await axios({
        method: 'get',
        url: 'http://localhost:5005/admin/quiz/' + id,
        headers: {
          Authorization: sessionStorage.getItem('token')
        },
      })
      setLink('http://localhost:3000/GameSession?Sesssion=' + res2.data.active);
      setGameSession(res2.data.active);
    } else {
      await axios({
        method: 'post',
        url: 'http://localhost:5005/admin/quiz/' + id + '/end',
        headers: {
          Authorization: sessionStorage.getItem('token')
        },
      })
      setStartStopText('Start');

      setGameStarted(false);
      setNumAdvanced(0);
      setOpenResults(true);
    }
  }

  function openDelModal () {
    setDeleteQuestionModal(true);
  }

  // deletes a game
  async function deleteGame () {
    if (gameStarted === true) {
      setDelErrHidden(false);
      return;
    }
    await axios({
      method: 'delete',
      url: 'http://localhost:5005/admin/quiz/' + gameId,
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
    })
    setDeleteQuestionModal(false);
    window.location.reload();
  }

  // advances a game
  async function advanceGame (id) {
    if (numAdvanced <= numQuestions - 1) {
      console.log(1);
      await axios({
        method: 'post',
        url: 'http://localhost:5005/admin/quiz/' + id.gameId + '/advance',
        headers: {
          Authorization: sessionStorage.getItem('token')
        },
      })
      let tmp = numAdvanced;
      tmp += 1;
      setNumAdvanced(tmp);
    } else {
    // reach end of quiz so end session
      await axios({
        method: 'post',
        url: 'http://localhost:5005/admin/quiz/' + id.gameId + '/end',
        headers: {
          Authorization: sessionStorage.getItem('token')
        },
      })
      setStartStopText('Start');
      setGameStarted(false);
      setNumAdvanced(0);
      setOpenResults(true);
    }
  }

  return (
    <div className={classes.main}>
      <img
        alt = "game Image"
        className={classes.img}
        src={gameImg}
      />
      <div className={classes.title}>
          <b id = "gameTitle">{props.game.name}</b>
      </div>

      <div className={classes.title}>
          <div>{numQuestions} Question(s)</div>
      </div>
      <div className={classes.title}>
          <div>Total Duration: {totalTime}s</div>
      </div>

      <div className={classes.gameBtn}></div>
      <Button
        id = 'startGameBtn'
        disableRipple
        class={classes.startGameBtn}
        onClick={() => startGame({ gameId })}
        type = 'startStopGameBtn'
        >
          <div id = {'startGame' + gameId}>{startStopText}</div>
      </Button>
      <Button
          disableRipple
          id = {props.game.id}
          class={classes.editGameBtn}
          onClick={() => editGame({ gameId })}>
          <div id = {'editGame' + gameId}>Edit</div>
      </Button>

      <Button
          disableRipple
          id = {props.game.id}
          class={classes.delGameBtn}
          onClick={() => openDelModal()}>
          <div id = {'deGame' + gameId}>Delete</div>
      </Button>

      <div hidden = {!gameStarted}>
        <Button
            disableRipple
            id = {props.game.id}
            class={classes.advGameBtn}
            onClick={() => advanceGame({ gameId })}>
            Advance Game
        </Button>
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
            type = 'closeIcon'
            >
              <CloseIcon></CloseIcon>
            </Button>
            <h1 className={classes.newStartedTitle}>Started {props.game.name}</h1>
            <h3 className={classes.newGameTitle}>game Link</h3>
            <p className={classes.gameLink}>{gameLink}</p>
            <Button
                disableRipple
                class={classes.copyClipboard}
                onClick={() => {
                  navigator.clipboard.writeText(gameLink);
                  setCopiedHidden(false);
                }}
                >
              Copy to Clipboard
            </Button>
            <div className={classes.Alert} hidden = {copiedHidden}>
              <Alert severity='success'>Link Copied</Alert>
            </div>
          </Box>
        </Modal>
      </div>

      <div className={classes.modalContainer}>
        <Modal
          open={openResults}
          onClose={handleCloseResults}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box class={classes.modalBox2}>
            <br></br>
            <h4 className={classes.newGameTitle}>Get game Results?</h4>
            <Button
                disableRipple
                class={classes.gameResultsBtn}
                onClick={() => handleCloseResults()}
                >
              No
            </Button>
            <Button
                disableRipple
                class={classes.gameResultsBtn}
                onClick={() => getResults()}
                type = 'gameResultsBtn'
                >
              Yes
            </Button>
            <div className={classes.divider}>
          </div>
          </Box>
        </Modal>
        </div>
        <div className={classes.modalContainer}>
        <Modal
          open={deleteQuestionModal}
          onClose={handleCloseResults}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box class={classes.modalBox2}>
            <br></br>
            <h4 className={classes.delTitle}>Delete {props.game.name}</h4>
            <Button
              disableRipple
              class={classes.gameResultsBtn}
              onClick={() => { setDeleteQuestionModal(false); setDelErrHidden(true) }}
            >
              No
            </Button>

            <Button
              disableRipple
              class={classes.gameResultsBtn}
              onClick={() => deleteGame()}
            >
              Yes
            </Button>
            <div className={classes.divider}/>
            <div className={classes.delAlert} hidden = {delErrHidden}>
              <Alert severity='warning'>Stop this game before deleting</Alert>
            </div>
          </Box>
        </Modal>
      </div>
  </div>
  );
}

GameItem.propTypes = {
  game: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    thumbnail: PropTypes.string
  }),
};
