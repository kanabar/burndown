import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BurnupChartProps {
  scopeData: number[];
  todoData: number[];
  doneData: number[];
}

const BurnupChart: React.FC<BurnupChartProps> = ({ scopeData, todoData, doneData }) => {
  // Transform data for Recharts
  // For burnup chart, we'll create data points that show progress upward towards completion
  const chartData = scopeData.map((scope, index) => {
    return {
      name: `Sprint ${index + 1}`,
      scope,
      todo: 0, // We'll visualize TODO as the gap between scope and done
      done: doneData[index] !== undefined ? doneData[index] : null
    };
  });
  
  // Add a "Start" point at the beginning
  chartData.unshift({
    name: 'Start',
    scope: 12,
    todo: 0,
    done: 0
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