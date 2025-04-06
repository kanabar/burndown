import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BurndownChartProps {
  idealData: number[];
  actualData: number[];
}

const BurndownChart: React.FC<BurndownChartProps> = ({ idealData, actualData }) => {
  // Transform data for Recharts
  const chartData = idealData.map((ideal, index) => {
    return {
      name: index === 0 ? 'Start' : `Throw ${index}`,
      ideal,
      actual: actualData[index] !== undefined ? actualData[index] : null
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          label={{ 
            value: 'Time Period', 
            position: 'insideBottomRight', 
            offset: -10 
          }} 
        />
        <YAxis 
          domain={[0, 12]} 
          label={{ 
            value: 'Remaining Work', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }} 
        />
        <Tooltip />
        <Legend />
        <Line
          name="Ideal Progress"
          type="monotone"
          dataKey="ideal"
          stroke="#3b82f6"
          strokeWidth={2}
          activeDot={false}
          dot={false}
        />
        <Line
          name="Actual Progress"
          type="monotone"
          dataKey="actual"
          stroke="#ef4444"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={{ strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BurndownChart;
