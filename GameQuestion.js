import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import AppBarNotAuthenicated from '../Components/AppBarNotAuthenicated';
import Lobby from '../Components/Lobby';
import Timer from '../Components/Timer';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';

const useStyles = makeStyles({
  root: {
    minHeight: '1100px'
  },
  body: {
    marginTop: '100px',
    alignItems: 'center',
  },
  textFieldDIv: {
    marginTop: '50px',
    width: '60%',
  },
  textField: {
    width: '50%',
  },
  primaryButton: {
    padding: '0 30px',
    height: 50,
    width: 240,
    borderRadius: 8,
    fontSize: '13pt',
    marginLeft: '20%',
    marginTop: '50px',
    background: 'transparent',
    fontWeight: 'bold',
    borderColor: '#CCCCFF',
    '&:hover': {
      borderColor: 'purple',
      cursor: 'pointer',
    },
  },
  img: {
    width: '40%',
    marginLeft: '30%',
    minWidth: '300px',
    minHeight: '200px'
  },
  video: {
    marginLeft: '30%',
    width: '640px',
    height: '360px'
  },
  question: {
    marginTop: '10px',
    textAlign: 'center',
    fontSize: '40px',
    marginLeft: '5%',
    width: '90%',
    wordWrap: 'break-word'

  },
  questionNo: {
    marginTop: '50px',
    textAlign: 'center',
    fontSize: '20px'
  },
  info: {
    marginLeft: '10%',
    fontSize: '20px',
    marginTop: '40px'
  },
  questionSection: {
    marginTop: '20px',
    marginLeft: '10%',
    width: '80%',
    backgroundColor: 'rgb(235, 235, 235)',
    minHeight: '100px',
    borderRadius: '10px',
  },
  answer: {
    marginLeft: '100px',
    fontSize: '20px',
    marginTop: '-35px',
    width: '80%',
    wordWrap: 'break-word'

  },
  footer: {
    minHeight: '100px'
  },
  timeLimit: {
    display: 'inline',
    marginLeft: '5%',
    marginTop: '-15px',
    position: 'absolute',
    fontSize: '20px',
  },
  modalBox: {
    marginLeft: '25%',
    marginTop: '10%',
    width: '50%',
    minHeight: '400px',
    backgroundColor: 'white',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '20px'
  },
  modalContainer: {
    alignItems: 'center',
    textAlign: 'center',

  },
})

let gameStated = false;
const trueNorth = [];

export default function GameQuestion () {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const classes = useStyles();
  const [tmpTitle, setTmpTitle] = useState(0);
  const [curImg, setCurImg] = useState('');
  const [curTitle, setCurTitle] = useState('');
  const [curNum, setCurNum] = useState('');
  const [qustions, setQuestions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(0);
  const [correctAns, setCorrectAns] = useState('');
  const [points, setPoints] = useState(null);

  const [modalCorrect, setModalCorrect] = useState([]);
  const [modalResponse, setModalResponse] = useState([]);
  const [checkBox0, setcheckBox0] = useState(false);
  const [checkBox1, setcheckBox1] = useState(false);
  const [checkBox2, setcheckBox2] = useState(false);
  const [checkBox3, setcheckBox3] = useState(false);
  const [checkBox4, setcheckBox4] = useState(false);
  const [checkBox5, setcheckBox5] = useState(false);
  const [hiddenVideo, setHiddenVideo] = useState(true);
  const [hiddenImage, setHiddenImage] = useState(true);

  let placeHolderTitle = null;
  let responseArr = [];
  let quesArr = [];
  let ran = false;
  let i1;
  let i2;

  const Hmap = {
    0: checkBox0,
    1: checkBox1,
    2: checkBox2,
    3: checkBox3,
    4: checkBox4,
    5: checkBox5
  }

  useEffect(() => {
    getData();
    i1 = setInterval(watchServer, 2000);
    i2 = setInterval(watchAns, 1000);
  }, [tmpTitle]);

  // watch the server for ansers every 2s
  async function watchAns () {
    const ansIds = [];
    for (let i = 0; i < 6; i++) {
      if (document.getElementById(String(i)) != null && document.getElementById(String(i)).checked === true) {
        ansIds.push(i);
      }
    }
    if (ansIds.length === 0) {
      return;
    }

    const playerId = sessionStorage.getItem('playerId');
    const res = await axios({
      method: 'put',
      url: 'http://localhost:5005/play/' + playerId + '/answer',
      data: {
        answerIds: ansIds
      }
    }).catch(() => {
      if (tmpTitle !== 0) {
        getCorectAns();
        setOpen(true);
        window.scrollTo(0, 0);
      }
    })
    if (res != null) {
      validate();
    }
  }

  // watch the server for changes every 1s
  async function watchServer () {
    const playerId = sessionStorage.getItem('playerId');
    const res = await axios({
      method: 'get',
      url: 'http://localhost:5005/play/' + playerId + '/question'
    })
      .catch(() => {
        if (tmpTitle !== 0) {
          clearInterval(i1);
          clearInterval(i2);
          sessionStorage.setItem('correctAns', JSON.stringify(trueNorth));
          navigate('/GameResults?playId=' + playerId);
        } else {
          if (gameStated === true) {
            clearInterval(i1);
            clearInterval(i2);
          }
          console.log('game not started');
        }
      })
    if (res == null) {
      return;
    }

    if (res.data.question.title !== placeHolderTitle) {
      setTmpTitle(res.data.question.title);
      const newTimeLimit = parseFloat(res.data.question.timeLimit);
      if (newTimeLimit === timeLimit) {
        setTimeLimit(newTimeLimit - 1);
      } else {
        setTimeLimit(newTimeLimit);
      }
      setPoints(res.data.question.points)
      placeHolderTitle = res.data.question.title;
      setOpen(false);
      handleNullInput(res.data.question.timeLimit);
      quesArr = res.data.question.choices;
      ran = false;
      gameStated = true;
    }
  }

  // account for null input
  function handleNullInput (countDown) {
    const timeInMiliSeconds = countDown * 1000;
    setTimeout(sendRes, timeInMiliSeconds);
  }

  // send user result
  async function sendRes () {
    let count = 0;
    for (let i = 0; i < 6; i++) {
      if (document.getElementById(String(i)) != null && document.getElementById(String(i)).checked === true) {
        count += 1;
      }
    }
    if (count === 0) {
      getCorectAns();
      setOpen(true);
      window.scrollTo(0, 0);
    }
  }

  // validates user input
  async function validate () {
    const ansIds = [];
    for (let i = 0; i < 6; i++) {
      if (document.getElementById(String(i)) != null && document.getElementById(String(i)).checked === true) {
        ansIds.push(i);
      }
    }
    console.log(ansIds.length);
    if (ansIds.length > 0) {
      submitAns(ansIds);
      responseArr = ansIds;
    } else {
      submitAns([-1]);
      responseArr = [];
    }
  }

  // gets question data
  async function getData () {
    const playerId = sessionStorage.getItem('playerId');
    const res = await axios({
      method: 'get',
      url: 'http://localhost:5005/play/' + playerId + '/question'
    })
    quesArr = [];
    setCurImg(res.data.question.url);
    setCurTitle(res.data.question.title);
    setCurNum(res.data.question.id + 1);
    setQuestions(res.data.question.choices);
    quesArr = res.data.question.choices;
    const correctIds = {
      choicesId: res.data.question.correct,
      question: res.data.question.title,
      points: parseFloat(res.data.question.points)
    };
    trueNorth.push(correctIds);
    const urlHeader = res.data.question.url.slice(0, 4);

    if (urlHeader === 'http') {
      setHiddenVideo(false);
      setHiddenImage(true);
    } else if (urlHeader === 'data') {
      setHiddenVideo(true);
      setHiddenImage(false);
    } else {
      setHiddenVideo(true);
      setHiddenImage(true);
    }
  }

  // get the correct answer
  async function getCorectAns () {
    const playerId = sessionStorage.getItem('playerId');
    const res = await axios({
      method: 'get',
      url: 'http://localhost:5005/play/' + playerId + '/answer'
    })
    const correctArr = res.data.answerIds[0];
    if (responseArr === []) {
      console.log('wrong')
    }
    const a = JSON.stringify(correctArr);
    const b = JSON.stringify(responseArr);
    let correctRes = false;
    if (a === b) {
      setCorrectAns('correct')
      correctRes = true;
    } else {
      setCorrectAns('Incorrect')
    }

    if (ran === false) {
      let tmp = []
      for (let i = 0; i < correctArr.length; i++) {
        tmp.push(quesArr[correctArr[i]]);
      }
      setModalCorrect(tmp);
      if (correctRes === true) {
        setModalResponse(tmp);
        resetCheckBox();
        ran = true;
        return;
      }

      tmp = [];
      for (let i = 0; i < responseArr.length; i++) {
        tmp.push(quesArr[responseArr[i]]);
      }

      setModalResponse(tmp);
      resetCheckBox();
    }
    ran = true;
  }

  // submits the correct answer
  async function submitAns (ansID) {
    if (ansID == null) {
      return;
    }
    const playerId = sessionStorage.getItem('playerId');
    await axios({
      method: 'put',
      url: 'http://localhost:5005/play/' + playerId + '/answer',
      data: {
        answerIds: ansID
      }
    })
  }

  // checks default values
  function checkDefault () {
    let count = 0;
    for (let i = 0; i < 6; i++) {
      if (document.getElementById(String(i)) != null && document.getElementById(String(i)).checked === true) {
        count += 1;
      }
    }
    if (count === 0) {
      submitAns([-1]);
    }
  }

  // checks the checkboxes by value
  function check (val) {
    const index = val.index
    if (index === 0) {
      if (checkBox0 === false) {
        setcheckBox0(true);
      } else {
        setcheckBox0(false);
        checkDefault();
      }
    } else if (index === 1) {
      if (checkBox1 === false) {
        setcheckBox1(true);
      } else {
        setcheckBox1(false);
        checkDefault();
      }
    } else if (index === 2) {
      if (checkBox2 === false) {
        setcheckBox2(true);
      } else {
        setcheckBox2(false);
        checkDefault();
      }
    } else if (index === 3) {
      if (checkBox3 === false) {
        setcheckBox3(true);
      } else {
        setcheckBox3(false);
        checkDefault();
      }
    } else if (index === 4) {
      if (checkBox4 === false) {
        setcheckBox4(true);
      } else {
        setcheckBox4(false);
        checkDefault();
      }
    } else if (index === 5) {
      if (checkBox5 === false) {
        setcheckBox5(true);
      } else {
        setcheckBox5(false);
        checkDefault();
      }
    }
  }

  // reset the checkbox
  function resetCheckBox () {
    setcheckBox0(false);
    setcheckBox1(false);
    setcheckBox2(false);
    setcheckBox3(false);
    setcheckBox4(false);
    setcheckBox5(false);
  }
  if (tmpTitle === 0) {
    return (
      <Lobby started = {tmpTitle}>
      </Lobby>
    )
  }
  /*
  let index = 1;
  let test = {`"checkBox${index}`};
  console.log(test);
  */

  return (
    <div className={classes.root}>
        <AppBarNotAuthenicated>
        </AppBarNotAuthenicated>
        <div className={classes.body}>
          <div className={classes.timeLimit}>
              <Timer time = {timeLimit - 1}></Timer>
              <br/>
          </div>
          <div hidden = {hiddenImage} >
              <img
              alt = "game Image"
              className={classes.img}
              src= {curImg}/>
          </div>
          <div hidden = {hiddenVideo}>
          <iframe className={classes.video}
              src={curImg + '?autoplay=1'}
              allow='autoplay'>
          </iframe>
          </div>
            <div className={classes.questionNo}>Question {curNum} ({points} Points).</div>
            <div className={classes.question}>
                {curTitle}
            </div>
          </div>
          <div className={classes.info}>Check correct Answer(s)</div>
          {qustions.map((question, index) => (
          <div className={classes.questionSection} key = {index}>
            <Checkbox
              checked = {Hmap[index]}
            onClick = {() => check({ index })}
            id = {index}
            style={{
              transform: 'scale(1.8)',
              marginTop: '25px',
              marginLeft: '25px',
            }}
            />
            <div className={classes.answer}>
                {question}
            </div>
          </div>
          ))}
        <div className={classes.footer}>
          <div className={classes.modalContainer}>
            <Modal
                open={open}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
            <Box class={classes.modalBox}>
                <br></br>
                <h1 className={classes.newGameTitle}>Times Up</h1>
                <h2 className={classes.newGameTitle}>your answer is {correctAns}</h2>
                <div className={classes.newGameTitle}>correct Answer(s) :</div>
                {modalCorrect.map((correct, index) => (
                    <div key = {index}>{correct}</div>
                ))}
                <br></br>
                <div className={classes.newGameTitle}>your Answer(s):</div>
                {modalResponse.map((response, index) => (
                  <div key = {index} >{response}</div>
                ))}
            </Box>
        </Modal>
      </div>
    </div>
  </div>
  )
}
