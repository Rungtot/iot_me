import React from 'react';
import { RadialBarChart, RadialBar, Legend } from 'recharts';

const GaugeChart = ({ value, label }) => {
  console.log('GaugeChart value:', value); // Debugging log
  const data = [
    {
      name: label,
      value: value,
      fill: '#8884d8',
    },
  ];

  return (
    <RadialBarChart
      width={300}
      height={300}
      cx={150}
      cy={150}
      innerRadius={20}
      outerRadius={140}
      barSize={10}
      data={data}
      startAngle={180}
      endAngle={0}
    >
      <RadialBar minAngle={15} clockWise dataKey="value" />
      <Legend
        iconSize={10}
        layout="vertical"
        verticalAlign="middle"
        wrapperStyle={{
          top: 0,
          left: 350,
          lineHeight: '24px',
        }}
      />
    </RadialBarChart>
  );
};

export default GaugeChart;
