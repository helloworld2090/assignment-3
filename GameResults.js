import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import AppBarNotAuthenicated from '../Components/AppBarNotAuthenicated';
import axios from 'axios';

const useStyles = makeStyles({
  body: {
    marginTop: '100px',
    marginLeft: '10%',
  },
  QuestionComponent: {
    backgroundColor: 'rgb(235, 235, 235)',
    width: '80%',
    minWidth: '500px',
    borderRadius: '10px',
    marginTop: '50px',
    minHeight: '100px'

  },
  grade: {
    display: 'inline-block',
    marginLeft: '50%'
  },
  question: {
    display: 'inline-block',
    marginLeft: '50px',
    width: '80%',
    wordWrap: 'break-word'

  },
  questionNo: {
    marginLeft: '20px',
    display: 'inline-block',
  },
  pointsGained: {
    marginLeft: '20px',
    marginBottom: '20px'
  }
})

export default function GameResults () {
  const classes = useStyles();

  const [marking, setmarking] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [sumPts, setSumPts] = useState(0);
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(true);

  const [gameResults, setGameResults] = useState('');

  useEffect(() => {
    getResults();
  }, []);

  // gets the game results for a user
  async function getResults () {
    console.log('get results');
    const playerId = sessionStorage.getItem('playerId');
    const res = await axios({
      method: 'get',
      url: 'http://localhost:5005/play/' + playerId + '/results'
    })

    const storedObj = JSON.parse(sessionStorage.getItem('correctAns'));
    let grade;
    let pts;
    let totalPts = 0;
    let sumPoints = 0;
    for (let i = 0; i < storedObj.length; i++) {
      const jsonCorrect = JSON.stringify(storedObj[i].choicesId);
      const jsonInputted = JSON.stringify(res.data[i].answerIds);

      if (jsonCorrect === jsonInputted) {
        grade = 'correct';
        pts = JSON.stringify(storedObj[i].points);
        totalPts += parseFloat(pts);
      } else {
        grade = 'Incorrect'
        pts = 0
      }
      const newObj = {
        question: storedObj[i].question,
        grading: grade,
        points: pts
      }
      const tmp = marking;
      tmp.push(newObj)
      setmarking(tmp);
      sumPoints += parseFloat(JSON.stringify(storedObj[i].points));
    }
    setGameResults('Results breakdown');
    setTotalPoints(totalPts);
    setSumPts(sumPoints);
    setName(sessionStorage.getItem('name'));
    setLoading(false);
  }

  if (loading === true) {
    return (
      <div>
        loading
      </div>
    )
  }

  return (
    <div>
      <AppBarNotAuthenicated>
      </AppBarNotAuthenicated>
      <div className={classes.body}>
          <h2>{name},</h2>
          <h2> you scored: {totalPoints} / {sumPts}</h2>
          <br></br>
          <h2>{gameResults}</h2>
          {marking.map((mark, index) => (
            <div className={classes.QuestionComponent} key = {index} >
              <div className={classes.questionNo} >
              <h2>{index + 1 + '.'}</h2>
              </div>

                <div className={classes.question} >
                    <h2>{mark.question}</h2>
                </div>

                <div className={classes.grade} >
                    {mark.grading}
                </div>
                <div className={classes.pointsGained}>
                    points gained: {mark.points}
                </div>
              </div>
          ))}
      </div>
    </div>
  )
}
