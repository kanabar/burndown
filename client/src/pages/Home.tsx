import React, { useState } from 'react';
import BurndownChart from '@/components/BurndownChart';
import BurnupChart from '@/components/BurnupChart';
import DiceRoller from '@/components/DiceRoller';
import Dice from '@/components/Dice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameState } from '@/lib/gameState';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState("burndown");
  
  const { 
    throwNumber,
    remainingWork,
    throwResults,
    idealBurndown,
    actualBurndown,
    scopeData,
    todoData,
    doneData,
    isGameCompleted,
    diceTheme,
    restartGame
  } = useGameState();
  
  // Calculate progress status
  const getProgressStatus = () => {
    const ideal = idealBurndown[throwNumber - 1];
    const actual = remainingWork;
    
    if (throwNumber === 1) {
      return {
        message: 'Not started yet',
        color: 'text-neutral-300'
      };
    } else if (actual > ideal) {
      return {
        message: 'Behind schedule',
        color: 'text-red-500'
      };
    } else if (actual < ideal) {
      return {
        message: 'Ahead of schedule',
        color: 'text-green-500'
      };
    } else {
      return {
        message: 'On schedule',
        color: 'text-blue-500'
      };
    }
  };
  
  // Get final message based on remaining work
  const getFinalMessage = () => {
    const finalRemaining = remainingWork;
    
    if (finalRemaining === 0) {
      return {
        message: 'Perfect! You completed all the work!',
        bgColor: 'bg-green-100 text-green-700'
      };
    } else if (finalRemaining <= 3) {
      return {
        message: 'You did not complete the backlog as planned in 4 sprints.',
        bgColor: 'bg-blue-100 text-blue-700'
      };
    } else if (finalRemaining <= 6) {
      return {
        message: 'You did not complete the backlog as planned in 4 sprints.',
        bgColor: 'bg-yellow-100 text-yellow-700'
      };
    } else {
      return {
        message: 'You did not complete the backlog as planned in 4 sprints.',
        bgColor: 'bg-red-100 text-red-700'
      };
    }
  };
  
  const progressStatus = getProgressStatus();
  const finalMessage = getFinalMessage();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-400 mb-2">Agile Charts Tutorial</h1>
        <p className="text-neutral-300 text-lg md:text-xl">Learn burndown and burnup charts using dice rolls</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instruction Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1 order-2 lg:order-1">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
            <span className="bg-primary text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">1</span>
            How It Works
          </h2>
          <div className="space-y-4">
            <p className="text-neutral-400">
              {activeTab === "burndown" 
                ? "A burndown chart shows how work decreases over time toward completion."
                : "A burnup chart shows how completed work and scope change over time."}
            </p>
            <div className="bg-neutral-100 p-4 rounded-md">
              <h3 className="font-medium text-primary mb-2">The Chart Elements:</h3>
              {activeTab === "burndown" ? (
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li><span className="font-medium text-blue-500">Blue line</span>: Ideal progress (from 12 to 0)</li>
                  <li><span className="font-medium text-red-500">Red line</span>: Actual progress (based on your dice throws)</li>
                  <li>Y-axis: Remaining work (12 to 0)</li>
                  <li>X-axis: Four time periods (dice throws)</li>
                </ul>
              ) : (
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li><span className="font-medium text-blue-500">Blue line</span>: Total scope (constant at 12)</li>
                  <li><span className="font-medium text-red-500">Red line</span>: TODO work (decreases over time)</li>
                  <li><span className="font-medium text-green-500">Green line</span>: DONE work (increases over time)</li>
                  <li>Y-axis: Story points (0 to 12)</li>
                  <li>X-axis: Four sprints (dice throws)</li>
                </ul>
              )}
            </div>
            <div className="bg-neutral-100 p-4 rounded-md">
              <h3 className="font-medium text-primary mb-2">Reading The Chart:</h3>
              {activeTab === "burndown" ? (
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li>Red line above blue → Behind schedule</li>
                  <li>Red line below blue → Ahead of schedule</li>
                  <li>Red line matching blue → On schedule</li>
                </ul>
              ) : (
                <ul className="list-disc pl-5 space-y-2 text-neutral-400">
                  <li>Increasing green line → Work being completed</li>
                  <li>Gap between blue and green → Remaining work</li>
                  <li>Green meeting blue → All work completed</li>
                </ul>
              )}
            </div>
            <div className="bg-neutral-100 p-4 rounded-md">
              <h3 className="font-medium text-primary mb-2">Example:</h3>
              <p className="text-neutral-400">
                {activeTab === "burndown"
                  ? "From the burndown chart, you can see how your progress compares to the ideal path. This helps teams identify if they're on track to complete work within the planned time frame."
                  : "The burnup chart makes it easier to see how much work is completed (green) vs remaining (red) and accommodates scope changes (blue) which are common in real projects."}
              </p>
            </div>
          </div>
        </div>

        {/* Chart Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2 order-1 lg:order-2">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <span className="bg-primary text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">2</span>
              Interactive Charts
            </div>
            <Tabs defaultValue="burndown" className="w-auto" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="burndown">Burndown</TabsTrigger>
                <TabsTrigger value="burnup">Burnup</TabsTrigger>
              </TabsList>
            </Tabs>
          </h2>
          
          {/* Chart container */}
          <div className="h-64 md:h-80 mb-6">
            {activeTab === "burndown" ? (
              <BurndownChart 
                idealData={idealBurndown} 
                actualData={actualBurndown}
              />
            ) : (
              <BurnupChart
                scopeData={scopeData}
                todoData={todoData}
                doneData={doneData}
              />
            )}
          </div>
          
          {/* Progress indicators */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-neutral-100 p-4 rounded-md">
              <h3 className="font-medium text-neutral-400 mb-1">Remaining Work</h3>
              <p className="text-3xl font-bold text-primary">{remainingWork}</p>
            </div>
            <div className="bg-neutral-100 p-4 rounded-md">
              <h3 className="font-medium text-neutral-400 mb-1">Progress Status</h3>
              <p className={`text-lg font-medium ${progressStatus.color}`}>{progressStatus.message}</p>
            </div>
          </div>
          
          {/* Dice rolling section */}
          <DiceRoller />
          
          {/* Results summary */}
          {isGameCompleted && (
            <div className="bg-neutral-100 p-4 rounded-md">
              <h3 className="font-medium text-primary mb-2">
                Results Summary
                {remainingWork === 0 && throwNumber <= 4 && " (Early Completion!)"}
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {throwResults.map((result, index) => {
                  return (
                    <div key={index} className={`p-3 bg-white rounded-md text-center shadow-sm ${result === null ? 'opacity-50' : ''}`}>
                      <p className="text-xs text-neutral-300">Throw {index + 1}</p>
                      <div className="flex justify-center">
                        {result !== null ? (
                          <Dice 
                            value={result} 
                            theme={diceTheme}
                            isRolling={false}
                          />
                        ) : (
                          <p className="text-xl font-bold text-primary">-</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {remainingWork === 0 && (
                <div className="text-center p-3 mb-3 rounded-md font-medium bg-green-100 text-green-700">
                  You completed all the work in just {throwNumber - 1} throws!
                </div>
              )}
              <div className={`text-center p-3 rounded-md font-medium ${finalMessage.bgColor}`}>
                {finalMessage.message}
              </div>
              <Button 
                className="w-full mt-3 bg-secondary hover:bg-secondary/90 text-white font-medium py-2 px-4 rounded-md shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/50"
                onClick={restartGame}
              >
                Start New Simulation
              </Button>
            </div>
          )}
        </div>
        
        {/* Explanation Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-3 order-3">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
            <span className="bg-primary text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">3</span>
            Understanding Your Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-neutral-400 text-lg">How to Interpret:</h3>
              <div className="bg-neutral-100 p-4 rounded-md">
                <p className="mb-2">Each dice roll simulates work completed in a time period:</p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                  <li>Higher numbers = More work completed</li>
                  <li>Lower numbers = Less work completed</li>
                </ul>
              </div>
              <div className="bg-neutral-100 p-4 rounded-md">
                <p className="mb-2">The ideal line shows constant progress:</p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                  <li>12 → 9 → 6 → 3 → 0</li>
                  <li>3 units of work completed per period</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-neutral-400 text-lg">Real-World Application:</h3>
              <div className="bg-neutral-100 p-4 rounded-md">
                <p className="mb-2">In Agile project management:</p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                  <li>Y-axis: Story points or tasks remaining</li>
                  <li>X-axis: Sprint days or iterations</li>
                  <li>Team tracks their daily progress against ideal</li>
                </ul>
              </div>
              <div className="bg-neutral-100 p-4 rounded-md">
                <p className="mb-2">Comparing chart types:</p>
                <ul className="list-disc pl-5 space-y-1 text-neutral-400">
                  <li><strong>Burndown</strong>: Simple to read, focuses on work remaining</li>
                  <li><strong>Burnup</strong>: Shows scope changes, visualizes both work done and remaining</li>
                  <li>Both provide visual progress tracking and early warning of issues</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-neutral-300 text-sm">
        <p>Interactive Chart Simulator | Comparing Burndown and Burnup Charts | Created for educational purposes</p>
      </footer>
    </div>
  );
};

export default Home;
