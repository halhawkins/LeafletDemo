import React, { FC } from 'react';
import { Line } from 'react-chartjs-2';
import './GraphComponent.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineGraphProps {
  xValues: (string | number)[];
  yValues: (string | number)[];
  xLabel?: string;
  yLabel?: string;
  chartTitle?: string;
  lineColor?: string;
}

const GraphComponent: FC<LineGraphProps> = ({
  xValues,
  yValues,
  xLabel = 'Magnitude',
  yLabel = 'Value',
  chartTitle = 'Line Graph',
  lineColor = 'rgba(75,192,192,1)',
}) => {
  const data = {
    labels: xValues,
    datasets: [
      {
        label: yLabel,
        data: yValues,
        fill: false,
        borderColor: lineColor,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false as const,
    scales: {
      x: {
        title: {
          display: true,
          text: xLabel,
        },
      },
      y: {
        title: {
          display: true,
          text: yLabel,
        },
      },
    },
    plugins: {
      title: {
        display: !!chartTitle,
        text: chartTitle,
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div style={{overflow: "hidden", width: "100%", padding: "1rem"}} className='gradient'>
      <Line data={data} options={options} style={{height: '18rem', marginRight: "3rem", backgroundColor: "transparent", fill: "black"}}/>
    </div>
  );
};

export default GraphComponent;
