
import React from 'react';
import Countdown from 'react-countdown';
import PropTypes from 'prop-types';

// timer component
const Timer = React.memo(props => {
  return (
    <div>
      <div>
          Time Left:
      </div>
      <Countdown
      overtime = {true}
      precision={3}
      date={Date.now() + props.time * 1000}/>
    </div>
  )
})
Timer.displayName = 'Timer';

Timer.propTypes = {
  time: PropTypes.number
};

export default Timer;
