import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppBarAuthenticated from '../Components/AppBarAuthenticated';
import { Grid, makeStyles } from '@material-ui/core';
import GameItem from '../Components/GameItem';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  body: {
    marginLeft: '10%',
    marginTop: '100px',
    maxWidth: '80%'
  },
  textFieldDIv: {
    marginTop: '80px',
    width: 600,
  },
  textField: {
    width: 400,
  },
  primaryButton: {
    padding: '0 30px',
    height: 50,
    width: 140,
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
  link: {
    marginLeft: '10px',
    color: '#89589C',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  gridClass: {
    marginTop: '0px',
    minWidth: '200px',
    maxWidth: '300px',
    minHeight: '275px',
    marginLeft: '20px'
  },
  inlineGrid: {
    alignItems: 'center',
    textAlign: 'center'
  },
})

export default function DashBoard () {
  const classes = useStyles();
  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addGame, setAddGame] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [addGame]);

  // get all game data
  async function getData () {
    if (sessionStorage.getItem('token') == null) {
      navigate('/');
    }
    const res = await axios({
      method: 'get',
      url: 'http://localhost:5005/admin/quiz',
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
    })
    setGames(res.data.quizzes);
    setLoading(false);
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <AppBarAuthenticated
          curGame = {addGame}
          addNewGame = { val => setAddGame(val)}
      >
      </AppBarAuthenticated>
      <div className={classes.body}>
        <Grid container spacing={2}>
        {games.map((gameItem, index) => (
          <Grid item xs={6} sm={4} md={4} className={classes.gridClass} key = {index}>
            <GameItem
            game = {gameItem}
            ></GameItem>
          </Grid>
        ))}
        </Grid>
      </div>
    </div>
  )
}
