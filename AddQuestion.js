import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import AppBarAuthenticated from '../Components/AppBarAuthenticated';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const useStyles = makeStyles({
  body: {
    marginTop: '100px',
    marginLeft: '15%',
    minHeight: '1300px'
  },
  ansDiv: {
    marginTop: '20px'
  },
  textField: {
    width: 400,
  },
  textFieldTitle: {
    width: 600
  },
  textFieldDIv: {
    marginTop: '50px',
    width: 600,
  },
  smallField: {
    width: 100,
  },
  checkBox: {
    height: 50,
  },
  inline: {
    position: 'absolute',
    marginLeft: 500,
    marginTop: 200,
    color: 'green'
  },
  primaryButton: {
    padding: '0 30px',
    height: 50,
    width: 250,
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
    marginLeft: '5%'
  },

  backBtn: {
    position: 'absolute',
    minWidth: '70px',
    minHeight: '30px',
    borderRadius: 8,
    fontSize: '10pt',
    background: 'transparent',
    marginLeft: '30px',
    marginTop: '-20px',
    '&:hover': {
      borderColor: 'purple',
      cursor: 'pointer',
    }
  },
  Alert: {
    marginLeft: '0%',
    width: '50%'
  },

})

export default function AddQuestion () {
  const navigate = useNavigate();
  const classes = useStyles();
  let uploadImg;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const gameId = urlParams.get('id');
  const [curTitle, setTitle] = useState('');
  const [curImg, setCurImg] = useState('');
  const [curQuestions, setCurQuestions] = useState(null);
  const [Questions, setQuestions] = useState([]);

  const [q1Checked, setQ1Checked] = useState(false);
  const [q2Checked, setQ2Checked] = useState(false);
  const [q3Checked, setQ3Checked] = useState(false);
  const [q4Checked, setQ4Checked] = useState(false);
  const [q5Checked, setQ5Checked] = useState(false);
  const [q6Checked, setQ6CheckedQ6] = useState(false);

  const [hideSuccessAlert, setHideSuccessAlert] = useState(true);
  const [hideErrAlert, setHideErrAlert] = useState(true);
  const [hideQuestionExists, setHideQuestionExists] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getData(gameId);
  }, []);

  function checkQ1 () {
    if (q1Checked === false) {
      setQ1Checked(true);
    } else {
      setQ1Checked(false);
    }
  }

  function checkQ2 () {
    if (q2Checked === false) {
      setQ2Checked(true);
    } else {
      setQ2Checked(false);
    }
  }

  function checkQ3 () {
    if (q3Checked === false) {
      setQ3Checked(true);
    } else {
      setQ3Checked(false);
    }
  }

  function checkQ4 () {
    if (q4Checked === false) {
      setQ4Checked(true);
    } else {
      setQ4Checked(false);
    }
  }

  function checkQ5 () {
    if (q5Checked === false) {
      setQ5Checked(true);
    } else {
      setQ5Checked(false);
    }
  }

  function checkQ6 () {
    if (q6Checked === false) {
      setQ6CheckedQ6(true);
    } else {
      setQ6CheckedQ6(false);
    }
  }

  // get game data
  async function getData (gameId) {
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
    const tmp = [];
    for (let i = 0; i < res.data.questions.length; i++) {
      tmp.push(res.data.questions[i].title);
    }
    setQuestions(tmp);
    setCurQuestions(res.data.questions);
    setTitle(res.data.name);
    setCurImg(res.data.thumbnail);
  }

  // check if question exists
  function checkExists (val) {
    for (let i = 0; i < Questions.length; i++) {
      if (Questions[i] === val) {
        return true;
      }
    }
    return false;
  }

  // submit the question
  async function submitQuestion () {
    const newId = curQuestions.length;
    const newTitle = document.getElementById('newQuestion').value;
    if (checkExists(newTitle)) {
      setHideQuestionExists(false);
      setHideErrAlert(true);
      setHideSuccessAlert(true);
      return;
    }

    const newChoices = [];
    for (let i = 1; i <= 6; i++) {
      if (document.getElementById('q' + i).value !== '') {
        newChoices.push(document.getElementById('q' + i).value);
      }
    }
    const correctChoices = getCorrectAns();
    const newtimeLimit = document.getElementById('timeLimit').value;
    const newPoints = document.getElementById('points').value;
    const questionUrl = getUrl();

    if (newTitle === '' || newChoices.length === 0 || newtimeLimit === '' || newPoints === '') {
      setHideErrAlert(false);
      setHideSuccessAlert(true);
      setHideQuestionExists(true);
      return;
    }
    if (isNaN(newPoints) || isNaN(newtimeLimit)) {
      alert('Error: Points and Time Limit must be numbers');
      return false;
    }

    const newQuestion = {
      id: newId,
      title: newTitle,
      choices: newChoices,
      correct: correctChoices,
      timeLimit: newtimeLimit,
      points: newPoints,
      url: questionUrl
    }
    curQuestions.push(newQuestion);

    await axios({
      method: 'put',
      url: 'http://localhost:5005/admin/quiz/' + gameId,
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      data: {
        questions: curQuestions,
        name: curTitle,
        thumbnailQuestion: curImg
      },

    })
    clearData();
    resetCheckBox();
    setHideSuccessAlert(false);
    setHideErrAlert(true);
    setHideQuestionExists(true);
  }

  // reset checkboxes
  function resetCheckBox () {
    setQ1Checked(false);
    setQ2Checked(false);
    setQ3Checked(false);
    setQ4Checked(false);
    setQ5Checked(false);
    setQ6CheckedQ6(false);
  }

  // get the correct ans from checkboxes
  function getCorrectAns () {
    const correctAnsArr = [];
    if (q1Checked === true) {
      correctAnsArr.push(0);
    }
    if (q2Checked === true) {
      correctAnsArr.push(1);
    }
    if (q3Checked === true) {
      correctAnsArr.push(2);
    }
    if (q4Checked === true) {
      correctAnsArr.push(3);
    }
    if (q5Checked === true) {
      correctAnsArr.push(4);
    }
    if (q6Checked === true) {
      correctAnsArr.push(5);
    }
    return correctAnsArr;
  }

  // clear all data in textfields
  function clearData () {
    document.getElementById('newQuestion').value = '';
    document.getElementById('q1').value = '';
    document.getElementById('q2').value = '';
    document.getElementById('q3').value = '';
    document.getElementById('q4').value = '';
    document.getElementById('q5').value = '';
    document.getElementById('q6').value = '';
    document.getElementById('timeLimit').value = '';
    document.getElementById('points').value = '';

    document.getElementById('youtubeURL').value = '';
    document.getElementById('questionImage').value = '';
  }

  // get the youtube url
  function getUrl () {
    if (document.getElementById('youtubeURL').value !== '') {
      return document.getElementById('youtubeURL').value;
    }
    if (uploadImg != null) {
      return uploadImg;
    }
    return '';
  }

  function back () {
    navigate('/EditGame?id=' + gameId);
  }

  const handleImg = async (e) => {
    const file = e.target.files[0];
    uploadImg = await converBse64(file);
  }

  // convert the image to base64
  const converBse64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
    });
  }

  return (
    <div>
        <AppBarAuthenticated>
        </AppBarAuthenticated>
        <Button
            disableRipple
            class={classes.backBtn}
            onClick={() => back()}
        >
        Back
        </Button>
          <div className={classes.body}>
            <br/>
            <h2>Add New Question</h2>
            <div>
              <div className={classes.textFieldDIv}>
                  <TextField className={classes.textFieldTitle} id='newQuestion' label='new Question' variant='outlined'/>
              </div>
              <div className={classes.textFieldDIv}>
                  <h4>Add 2 - 6 possible answers</h4>
                  <div className={classes.inline}>Check the correct answer.
                  <br></br>
                  1 check for single choice
                  <br></br>
                  2 or more checks for multiple choice
                  </div>
                    <TextField
                    className={classes.textField} id='q1' label='answer1' variant='outlined'/>
                    <Checkbox
                    id= '1'
                    className={classes.checkBox}
                    color='success'
                    checked = {q1Checked}
                    onClick = { () => checkQ1()}
                    />
                <div className = {classes.ansDiv}>
                  <TextField className={classes.textField} id='q2' label='answer2' variant='outlined'/>
                  <Checkbox
                      className={classes.checkBox}
                      color='success'
                      checked = {q2Checked}
                      onClick = { () => checkQ2()}
                      />
                </div>
                  <div className = {classes.ansDiv}>
                    <TextField className={classes.textField} id='q3' label='answer3' variant='outlined'/>
                    <Checkbox
                        className={classes.checkBox}
                        color='success'
                        checked = {q3Checked}
                        onClick = { () => checkQ3()}
                    />
                  </div>
                    <div className = {classes.ansDiv}>
                      <TextField className={classes.textField} id='q4' label='answer4' variant='outlined'/>
                      <Checkbox
                      className={classes.checkBox}
                      color='success'
                      checked = {q4Checked}
                      onClick = { () => checkQ4()}
                      />
                    </div> <div className = {classes.ansDiv}>
                      <TextField className={classes.textField} id='q5' label='answer5' variant='outlined'/>
                      <Checkbox
                        className={classes.checkBox}
                        color='success'
                        checked = {q5Checked}
                        onClick = { () => checkQ5()}
                      />
                      </div> <div className = {classes.ansDiv}>
                        <TextField className={classes.textField} id='q6' label='answer6' variant='outlined'/>
                        <Checkbox
                          className={classes.checkBox}
                          color='success'
                          checked = {q6Checked}
                          onClick = { () => checkQ6()}
                          />
                      </div>
                  </div>
                  <div className={classes.textFieldDIv}>
                      <h4>Add Time Limit</h4>
                      <TextField className={classes.smallField} id='timeLimit' label='seconds' variant='outlined'/>
                  </div>
                  <div className={classes.textFieldDIv}>
                      <h4>Add Question Points</h4>
                      <TextField className={classes.smallField} id='points' label='Points' variant='outlined'/>
                  </div>
                  <div className={classes.url}>
                    <h4>Youtube URL Or Upload an Image</h4>
                    <TextField className={classes.textField} id='youtubeURL' label='Youtube URL' variant='outlined'/>
                    <input
                      className={classes.inputImage}
                      type='file'
                      id='questionImage' name='questionImage'
                      accept='image/png, image/jpeg'
                      onChange ={ (e) => handleImg(e)}
                    ></input>
                  </div>
              </div>
              <Button
                  disableRipple
                  class={classes.primaryButton}
                  onClick={() => submitQuestion()}
              >
                  Add New Question
              </Button>
              <div className={classes.Alert} hidden = {hideSuccessAlert}>
                  <Alert severity='success'>Question Added</Alert>
              </div>
              <div className={classes.Alert} hidden = {hideErrAlert}>
                  <Alert severity='error'>Title, Answers, Time Limit and Points Cannot be Empty</Alert>
              </div>
              <div className={classes.Alert} hidden = {hideQuestionExists}>
                  <Alert severity='error'>Question already exists</Alert>
              </div>

          </div>
      </div>
  )
}
