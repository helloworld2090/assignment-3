
import React from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  primaryButton: {
    padding: '0 30px',
    height: 50,
    width: 200,
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

// purple button component
const PurpleButton = (props) => {
  const classes = useStyles();
  return (
          <Button
          disableRipple
          class={classes.primaryButton}
          onClick={props.onClick}
          id = {props.id}
          type = {props.type}
      >
          {props.title}
      </Button>
  )
}
PurpleButton.propTypes = {
  onClick: PropTypes.any,
  id: PropTypes.string,
  type: PropTypes.any,
  title: PropTypes.string
};

export default PurpleButton
