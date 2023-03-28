import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@material-ui/core';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  questionSection: {
    textAlign: 'center',
    alignContent: 'center',
    backgroundColor: 'rgb(235, 235, 235)',
    marginTop: '50px',
    minHeight: '230px',
    minWidth: '310px',
    width: '50%',
    marginLeft: '25%',
    borderRadius: '10px'
  },
  question: {
    paddingTop: '0px',
    marginLeft: '210px'
  },
  seconds: {
    marginTop: '-40px',
    marginLeft: '210px',
    position: 'absolute'
  },
  editSection: {
    marginLeft: '0',
    marginTop: '0px'
  },
  editBtn: {
    minHeight: '80px',
    maxHeight: '80px',
  },
  editIcon: {
  },
  delIcon: {
    color: 'red'
  },
  questionImg: {
    maxWidth: '300px',
    marginTop: '10px',
    borderRadius: '10px',
  },
  questionNo: {
    fontWeight: '400',
    fontSize: '17px'
  },
  test: {
    marginLeft: '5%',
    width: '90%',
    wordWrap: 'break-word'
  },
  video: {
    maxWidth: '300px',
    borderRadius: '10px',
    marginTop: '10px'
  },
  modalContainer: {
    alignItems: 'center',
    textAlign: 'center',
  },
  modalBox: {
    marginLeft: '25%',
    marginTop: '10%',
    width: '50%',
    minHeight: '300px',
    backgroundColor: 'white',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '20px'
  },
  newGameTitle: {
    with: '80%',
    wordWrap: 'break-word'
  },
  closeIcon: {
    marginLeft: '90%',
    marginTop: '5px',
    border: 'transparent',
    background: 'transparent',
    '&:hover': {
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
})

export default function QuestionComponent (props) {
  const navigate = useNavigate();
  const questionNo = props.data.id;
  const classes = useStyles();

  const [hiddenVideo, setHiddenVideo] = useState(true);
  const [hiddenImage, setHiddenImage] = useState(true);
  const [open, setOpen] = useState(false);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const gameId = urlParams.get('id');

  useEffect(() => {
    getMedia();
  }, [])

  function handleClose () {
    setOpen(false);
  }

  // get the img or video
  function getMedia () {
    const urlHeader = String(props.data.url.slice(0, 4));
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

  // edit a question
  function editQustion () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gameId = urlParams.get('id');
    navigate('/EditQuestion?' + 'gameId=' + gameId + '&questionId=' + props.data.id);
  }

  async function deleteQuestion () {
    const res = await axios({
      method: 'get',
      url: 'http://localhost:5005/admin/quiz/' + gameId,
      headers: {
        Authorization: sessionStorage.getItem('token')
      },
    })
    const curTitle = res.data.name;
    const curImg = res.data.thumbnail;

    let tmp = []
    for (let i = 0; i < res.data.questions.length; i++) {
      if (i !== questionNo) {
        tmp.push(res.data.questions[i]);
      }
    }
    // resetting ids
    for (let i = 0; i < tmp.length; i++) {
      const placeholderVal = tmp[i];
      placeholderVal.id = i;
      tmp[i] = placeholderVal;
    }

    await axios({
      method: 'put',
      url: 'http://localhost:5005/admin/quiz/' + gameId,
      headers: {
        Authorization: sessionStorage.getItem('token'),
      },
      data: {
        questions: tmp,
        name: curTitle,
        thumbnailQuestion: curImg
      },
    })
    props.deleteWatcher(props.delGame + 1);
    handleClose();
    window.location.reload();
    tmp = [];
  }

  return (
    <div className={classes.questionSection}>
      <div>
        Question {questionNo + 1}.
      </div>

      <div hidden = {hiddenImage} >
        <img
        id = 'question Image'
        className={classes.questionImg}
        src = {props.data.url}/>
      </div>
      <div hidden = {hiddenVideo}>
        <iframe className={classes.video}
          src={props.data.url + '?autoplay=0'}
        >
        </iframe>
      </div>
      <h2 className={classes.test} id = "qTitle">
        {props.data.title}
      </h2>
      <div id = 'questionTimeLimit'>
        {props.data.timeLimit}  Seconds
      </div>
      <div className={classes.editSection}>
        <Button
          className={classes.editBtn}
          onClick ={ () => editQustion()}
        >
        <EditIcon className={classes.editIcon} fontSize='large' ></EditIcon>
        </Button>
        <Button
          onClick ={ () => setOpen(true)}
          className={classes.editBtn}>
          <DeleteIcon className={classes.delIcon} fontSize='large'></DeleteIcon>
        </Button>
        </div>
      <div>
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
        >
          <CloseIcon></CloseIcon>
        </Button>
        <h2 id = 'deleteTxt' className={classes.newGameTitle}>Delete {props.data.title}?</h2>
        <div className={classes.textFieldDIv}>
        </div>
        <Button
          disableRipple
          class={classes.gameResultsBtn}
          onClick={() => handleClose()}
        >
          No
        </Button>
        <Button
          disableRipple
          class={classes.gameResultsBtn}
          onClick={() => deleteQuestion()}
        >
          Yes
        </Button>
      </Box>
    </Modal>
    </div>
  </div>
  )
}

QuestionComponent.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    url: PropTypes.string,
    title: PropTypes.string,
    timeLimit: PropTypes.number
  }),
  delGame: PropTypes.any,
  deleteWatcher: PropTypes.any
};
