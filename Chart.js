
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

// chart of % correct responses
export default function Chart (props) {
  const labels = props.questions;
  const data = {
    labels: labels,
    datasets: [{
      label: '% of correct responses',
      backgroundColor: 'purple',
      data: props.percentages,
    }]
  };
  return <Bar data={data} />;
}

Chart.propTypes = {
  questions: PropTypes.array,
  percentages: PropTypes.array
}
