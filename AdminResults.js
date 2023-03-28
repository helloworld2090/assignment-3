
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import AppBarAuthenticated from '../Components/AppBarAuthenticated';
import Chart from '../Components/Chart';
import TimeChart from '../Components/TimeChart';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  body: {
    marginLeft: '10%',
    marginTop: '100px',
  },
  QuestionComponent: {
    backgroundColor: 'rgb(235, 235, 235)',
    width: '80%',
    borderRadius: '10px',
    marginTop: '50px',
    minHeight: '100px'
  },
  question: {
    display: 'inline-block',
    marginLeft: '50px'
  },
  questionNo: {
    marginLeft: '20px',
    display: 'inline-block',
  },
  pointsGained: {
    marginLeft: '20px',
    marginBottom: '20px'
  },
  barChartPercentages: {
    marginTop: '100px',
    maxWidth: '90%',
    textAlign: 'center'
  },
  barChartTimes: {
    marginTop: '150px',
    maxWidth: '90%',
    textAlign: 'center'
  },
  xLabel: {
    position: 'absolute',
    marginLeft: '82%',
    marginTop: '-20px'
  },
  yLabel: {
    position: 'absolute',
    marginTop: '-20px'
  },
  footer: {
    minHeight: '100px'
  }
});

export default function AdminResults () {
  const classes = useStyles();
  const navigate = useNavigate();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const sessionId = urlParams.get('sessionId');
  const gameId = urlParams.get('gameId');

  const [playerRank, setPlayerRank] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [percentages, setPercentages] = useState([]);
  const [timLimits, setTimeLimits] = useState([]);

  useEffect(() => {
    getQuestionData();
  }, []);

  // get question data
  async function getQuestionData () {
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

    const res2 = await axios({
      method: 'get',
      url: 'http://localhost:5005/admin/session/' + sessionId + '/results',
      headers: {
        Authorization: sessionStorage.getItem('token')
      }
    })
    let tmp = [];

    for (let i = 0; i < res2.data.results.length; i++) {
      const player = calculateRank(res2.data.results[i], res.data.questions);
      tmp.push(player);
    }
    tmp = sortByKey(tmp, 'score');
    setPlayerRank(tmp);

    const percentage = calculatePercentage(res2.data.results, res.data.questions);
    let arr1 = [];
    let newStr;
    for (let i = 0; i < percentage.length; i++) {
      newStr = percentage[i].question;
      arr1.push(newStr);
    }
    setQuestions(arr1);
    arr1 = [];
    const arr2 = [];
    console.log(percentage.length);
    for (let i = 0; i < percentage.length; i++) {
      arr1.push(percentage[i].percentage * 100);
      arr2.push(res.data.questions[i].timeLimit);
    }
    setPercentages(arr1);
    setTimeLimits(arr2);
  }

  // calulcates rank by counting number of correct responses
  function calculateRank (playerData, QuestionData) {
    let countScore = 0;
    for (let i = 0; i < QuestionData.length; i++) {
      const userAns = JSON.stringify(playerData.answers[i].answerIds);
      const trueAns = JSON.stringify(QuestionData[i].correct);

      if (userAns === trueAns) {
        countScore += parseFloat(QuestionData[i].points);
      }
    }
    return { name: playerData.name, score: countScore };
  }

  // https://stackoverflow.com/questions/8837454/sort-array-of-objects-by-single-key-with-date-value
  // by David Brainer
  function sortByKey (array, key) {
    return array.sort(function (a, b) {
      const x = a[key]; const y = b[key];
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
  }

  // calulates the percentage correct on the graph
  function calculatePercentage (playerData, QuestionData) {
    const numPlayers = playerData.length;
    const Qpercentage = [];

    for (let i = 0; i < QuestionData.length; i++) {
      let count = 0;
      const trueAns = JSON.stringify(QuestionData[i].correct);

      for (let j = 0; j < playerData.length; j++) {
        const userAns = JSON.stringify(playerData[j].answers[i].answerIds);
        if (trueAns === userAns) {
          count += 1;
        }
      }
      Qpercentage.push({ questionNo: i, question: QuestionData[i].title, percentage: count / numPlayers })
    }
    return Qpercentage;
  }

  return (
    <div>
      <AppBarAuthenticated>
      </AppBarAuthenticated>
      <div className={classes.body}>
          <h2>Player Rankings</h2>
          {playerRank.map((player, index) => (
            <div key = {index} className={classes.QuestionComponent}>
              <div className={classes.questionNo} >
                <h2>{index + 1 + '.'}</h2>
              </div>
              <div className={classes.question} >
                <h2>{player.name}</h2>
              </div>
              <div className={classes.pointsGained}>
                Points scored: {player.score}
              </div>
            </div>
          ))}

          <div className={classes.barChartPercentages}>
            <h2>Graph of correct Responses</h2>
            <p className={classes.yLabel}>%</p>
            <Chart
            questions = {questions}
            percentages = {percentages}
            />
            <p className={classes.xLabel}>Question</p>
          </div>
          <div className={classes.barChartTimes}>
            <h2>Graph of Question Times</h2>
            <p className={classes.yLabel}>Seconds</p>
            <TimeChart
            questions = {questions}
            times = {timLimits}
            />
            <p className={classes.xLabel}>Question</p>
          </div>
      </div>
      <div className={classes.footer}>
      </div>
    </div>
  )
}
