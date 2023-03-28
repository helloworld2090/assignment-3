import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import AppBarAuthenticated from '../Components/AppBarAuthenticated';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

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
})

export default function EditQuestion () {
  const navigate = useNavigate();
  const classes = useStyles();
  let uploadImg;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const gameId = urlParams.get('gameId');
  const questionId = urlParams.get('questionId');

  const [curTitle, setTitle] = useState('');
  const [curImg, setCurImg] = useState('');
  const [curQuestions, setCurQuestions] = useState(null);
  const [q1Checked, checkedQ1] = useState(false);
  const [q2Checked, checkedQ2] = useState(false);
  const [q3Checked, checkedQ3] = useState(false);
  const [q4Checked, checkedQ4] = useState(false);
  const [q5Checked, checkedQ5] = useState(false);
  const [q6Checked, checkedQ6] = useState(false);
  const [Questions, setQuestions] = useState([]);
  const [oldTitle, setOldTitle] = useState('');

  const [hideSuccessAlert, setHideSuccessAlert] = useState(true);
  const [hideErrAlert, setHideErrAlert] = useState(true);
  const [hideQuestionExists, setHideQuestionExists] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    getData(gameId);
  }, []);

  function checkQ1 () {
    if (q1Checked === false) {
      checkedQ1(true);
    } else {
      checkedQ1(false);
    }
  }
  function checkQ2 () {
    if (q2Checked === false) {
      checkedQ2(true);
    } else {
      checkedQ2(false);
    }
  }

  function checkQ3 () {
    if (q3Checked === false) {
      checkedQ3(true);
    } else {
      checkedQ3(false);
    }
  }
  function checkQ4 () {
    if (q4Checked === false) {
      checkedQ4(true);
    } else {
      checkedQ4(false);
    }
  }

  function checkQ5 () {
    if (q5Checked === false) {
      checkedQ5(true);
    } else {
      checkedQ5(false);
    }
  }

  function checkQ6 () {
    if (q6Checked === false) {
      checkedQ6(true);
    } else {
      checkedQ6(false);
    }
  }

  // get game data from id
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
    setQuestions(res.data.questions);
    populateForm(res.data.questions[questionId]);
    setCurQuestions(res.data.questions);
    setTitle(res.data.name);
    setCurImg(res.data.thumbnail);
  }

  // popualtes form by the existing data
  function populateForm (data) {
    document.getElementById('newQuestion').value = data.title;
    setOldTitle(data.title);

    for (let i = 0; i < data.choices.length; i++) {
      const numId = i + 1;
      document.getElementById('q' + numId).value = data.choices[i];
    }

    for (let i = 0; i < data.correct.length; i++) {
      const curCorrect = data.correct[i];
      checkboxes(curCorrect);
    }
    document.getElementById('timeLimit').value = data.timeLimit;
    document.getElementById('points').value = data.points;
  }

  // poplulates checkboxes
  function checkboxes (val) {
    if (val === 0) {
      checkedQ1(true);
    } else if (val === 1) {
      checkedQ2(true);
    } else if (val === 2) {
      checkedQ3(true);
    } else if (val === 3) {
      checkedQ4(true);
    } else if (val === 4) {
      checkedQ5(true);
    } else if (val === 5) {
      checkedQ6(true);
    }
  }

  // check if question already exists
  function checkExists (val) {
    for (let i = 0; i < Questions.length; i++) {
      if (Questions[i].title === val) {
        return true;
      }
    }
    return false;
  }

  // submits question
  async function submitQuestion () {
    const newTite = document.getElementById('newQuestion').value;
    if (checkExists(newTite) && oldTitle !== newTite) {
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

    if (newTite === '' || newChoices.length === 0 || newtimeLimit === '' || newPoints === '') {
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
      id: parseInt(questionId),
      title: newTite,
      choices: newChoices,
      correct: correctChoices,
      timeLimit: newtimeLimit,
      points: newPoints,
      url: questionUrl
    }
    curQuestions[questionId] = newQuestion;
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
    setHideSuccessAlert(false);
    setHideErrAlert(true);
    setHideQuestionExists(true);
    setOldTitle(newTite);
  }

  // gets the correct answer
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

  // convert image to base 64
  const converBse64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
    });
  };
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
        <h2>Edit Question {parseInt(questionId) + 1}</h2>
          <div>
            <div className={classes.textFieldDIv}>
                <TextField className={classes.textFieldTitle} id='newQuestion' label='Edit Title' InputLabelProps={{ shrink: true }} variant='outlined'/>
            </div>
            <div className={classes.textFieldDIv}>
              <h4>Edit possible answers</h4>
              <div className={classes.inline}>Check the correct answer.
              <br></br>
                1 check for single choice
                <br></br>
                2 or more checks for multiple choice
                </div>
                <TextField
                InputLabelProps={{ shrink: true }}
                className={classes.textField} id='q1' label='Edit answer 1' variant='outlined'/>
                  <Checkbox
                  checked = {q1Checked}
                  id= 'check0'
                  className={classes.checkBox}
                  color='success'
                  onClick = { () => checkQ1()}
                  />
                  <div className = {classes.ansDiv}>
                <TextField
                className={classes.textField}
                id='q2'
                label='Edit answer 2'
                variant='outlined'
                InputLabelProps={{ shrink: true }} />
                <Checkbox
                  checked = {q2Checked}
                  id= 'check1'
                  className={classes.checkBox}
                  color='success'
                  onClick = {() => checkQ2()}
                />
                </div>
                <div className = {classes.ansDiv}>
                    <TextField
                    className={classes.textField}
                    InputLabelProps={{ shrink: true }}
                    id='q3' label='Edit answer 3' variant='outlined'/>
                    <Checkbox
                    checked = {q3Checked}
                    id = 'check2'
                    className={classes.checkBox}
                    color='success'
                    onClick = { () => checkQ3()}
                    />
                </div>
                <div className = {classes.ansDiv}>
                    <TextField
                    className={classes.textField}
                    id='q4'
                    label='Edit answer 4'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'/>
                    <Checkbox
                    checked = {q4Checked}
                    id = 'check3'
                    className={classes.checkBox}
                    color='success'
                    onClick = { () => checkQ4()}
                    />
                </div>
                <div className = {classes.ansDiv}>
                    <TextField
                    className={classes.textField}
                    id='q5'
                    label='Edit answer 5'
                    InputLabelProps={{ shrink: true }}
                    variant='outlined'/>
                    <Checkbox
                      checked = {q5Checked}
                      id = 'check4'
                      className={classes.checkBox}
                      color='success'
                      onClick = {() => checkQ5()}
                      />
                </div>
                <div className = {classes.ansDiv}>
                    <TextField
                    className={classes.textField}
                    id='q6'
                    InputLabelProps={{ shrink: true }}
                    label='Edit answer 6'
                    variant='outlined'/>
                    <Checkbox
                        checked = {q6Checked}
                        id = 'check5'
                        className={classes.checkBox}
                        color='success'
                        onClick = {() => checkQ6()}
                      />
                </div>
                  </div>
                  <div className={classes.textFieldDIv}>
                      <h4>Edit Time Limit</h4>
                      <TextField
                      InputLabelProps={{ shrink: true }}
                      className={classes.smallField} id='timeLimit' label='seconds' variant='outlined'/>
                  </div>
                  <div className={classes.textFieldDIv}>
                      <h4>Edit Question Points</h4>
                      <TextField
                      InputLabelProps={{ shrink: true }}
                      className={classes.smallField} id='points' label='Points' variant='outlined'/>
                  </div>
                  <div className = {classes.url}>
                      <h4>New Youtube URL or Image</h4>
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
                    Save Changes
                </Button>
                <div className={classes.Alert} hidden = {hideSuccessAlert}>
                    <Alert severity='success'>Changes Saved</Alert>
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
