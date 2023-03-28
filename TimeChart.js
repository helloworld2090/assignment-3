import React from 'react';
import PropTypes from 'prop-types';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// bar chart of times taken
export default function TimeChart (props) {
  const labels = props.questions;
  const data = {
    labels: labels,
    datasets: [{
      label: 'Time Taken',
      backgroundColor: 'purple',
      data: props.times,
    }]
  };
  return (
    <Bar data={data} />
  );
}

TimeChart.propTypes = {
  times: PropTypes.array,
  questions: PropTypes.array

};
