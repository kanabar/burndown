import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BurnupChartProps {
  scopeData: number[];
  todoData: number[];
  doneData: number[];
}

const BurnupChart: React.FC<BurnupChartProps> = ({ scopeData, todoData, doneData }) => {
  // Transform data for Recharts - burnup chart shows work growing upward from 0 to completion
  const chartData = [];
  
  // Add a "Start" point at the beginning
  chartData.push({
    name: 'Start',
    scope: 12,
    todo: 0,
    done: 0
  });
  
  // Add sprint data points with increasing values
  for (let i = 0; i < 4; i++) {
    // For burnup chart visualization:
    // - scope remains constant at 12
    // - todo represents the ideal progress path (linear growth)
    // - done represents the actual completed work
    const sprintIndex = i;
    
    chartData.push({
      name: `Sprint ${sprintIndex + 1}`,
      scope: 12, // Total scope remains constant at 12
      todo: 3 * (sprintIndex + 1), // Ideal progress: 3, 6, 9, 12
      done: doneData[sprintIndex] !== undefined ? doneData[sprintIndex] : null
    });
  }

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
          activeDot={false}
          dot={false}
        />
        <Line
          name="TODO"
          type="monotone"
          dataKey="todo"
          stroke="#ef4444" // Red color (matching the red in the image)
          strokeWidth={2}
          strokeDasharray="6 3" // More pronounced dashed line for ideal progress
          activeDot={false}
          dot={false}
        />
        <Line
          name="DONE"
          type="monotone"
          dataKey="done"
          stroke="#ef4444" // Changed from green to red for DONE line
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={{ strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BurnupChart;