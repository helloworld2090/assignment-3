
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import AppBarNotAuthenicated from '../Components/AppBarNotAuthenicated';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import PurpleButton from '../Components/PurpleButton';

const useStyles = makeStyles({
  body: {
    marginTop: '150px',
    alignItems: 'center',
    textAlign: 'center'
  },
  progressContainer: {
    marginLeft: '20%',
    width: '60%'
  },
  joke: {
    marginTop: '50px'
  },
  jokeSection: {
    marginTop: '200px',
  },
  primaryButton: {
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
})

// entertaining and pleasant lobby
export default function Lobby (props) {
  const classes = useStyles();
  const [jokes, setJokes] = useState('');

  useEffect(() => {
    getJoke();
  }, []);
  async function getJoke () {
    const res = await axios({
      method: 'get',
      url: 'https://api.chucknorris.io/jokes/random',
    })
    setJokes(res.data.value);
  }

  return (
      <div>
          <AppBarNotAuthenicated></AppBarNotAuthenicated>
          <div className={classes.body}>
              <h2>Waiting for admin to start</h2>
              <div className={classes.progressContainer}>
                  <LinearProgress color='secondary' />
              </div>

              <div className={classes.jokeSection}>
              <h2>Chuck Norris Jokes Generator</h2>
                  <div className={classes.joke}>{jokes}
              </div>
              <PurpleButton
                  id= 'jokeBtn'
                  title = 'Get another Joke'
                  onClick={() => getJoke()}
              >
              </PurpleButton>

          </div>
          </div>
      </div>

  )
}
