import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BurnupChartProps {
  scopeData: number[];
  todoData: number[];
  doneData: number[];
}

const BurnupChart: React.FC<BurnupChartProps> = ({ scopeData, todoData, doneData }) => {
  // Transform data for Recharts
  const chartData = scopeData.map((scope, index) => {
    return {
      name: `Sprint ${index + 1}`,
      scope,
      todo: todoData[index] !== undefined ? todoData[index] : null,
      done: doneData[index] !== undefined ? doneData[index] : null
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
            value: 'Sprints', 
            position: 'insideBottomRight', 
            offset: -10 
          }} 
        />
        <YAxis 
          domain={[0, 12]} 
          label={{ 
            value: 'Story Points', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }} 
        />
        <Tooltip />
        <Legend />
        <Line
          name="Scope"
          type="monotone"
          dataKey="scope"
          stroke="#3b82f6" // Blue color (matching the blue in the image)
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={{ strokeWidth: 2 }}
        />
        <Line
          name="TODO"
          type="monotone"
          dataKey="todo"
          stroke="#ef4444" // Red color (matching the red in the image)
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={{ strokeWidth: 2 }}
        />
        <Line
          name="DONE"
          type="monotone"
          dataKey="done"
          stroke="#10b981" // Green color (matching the green in the image)
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={{ strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BurnupChart;