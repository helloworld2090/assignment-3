
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from '@material-ui/core';
import Button from '@mui/material/Button';

const useStyles = makeStyles({
  appBar: {
    background: '#F3F3F3',
    height: 60,
    top: 0,
    width: '100%',
    position: 'fixed',
    zIndex: 99,
    borderBottom: '1px solid #CCCCFF',
  },
  title: {
    marginLeft: '100px',
  },
  appBarBtn: {
    marginLeft: '50px',
    marginTop: '10px',
    height: '50px',
    minWidth: '100px',
    border: 'none',
    background: 'none',
    borderBottom: '3px solid transparent',
    '&:hover': {
      cursor: 'pointer',
      borderBottom: '3px solid #89589C',
    },
  },
})

// join a new game
function joinGame () {
  window.open('http://localhost:3000/GameSession', '_blank').focus();
}

export default function AppBarNotAuthenicated () {
  const classes = useStyles();
  return (
    <div>
      <AppBar position='static' class={classes.appBar}>
        <Toolbar>
          <h4 className = {classes.title}>Big Brain</h4>
          <Button
              data-testid = 'btn1'
              class={classes.appBarBtn}
              onClick={() => joinGame()}
              disableRipple
          >
              Join a Game
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}
