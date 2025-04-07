import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/lib/gameState';
import Dice from '@/components/Dice';
import DiceThemeSelector from '@/components/DiceThemeSelector';

const DiceRoller: React.FC = () => {
  const { 
    throwNumber, 
    throwResults, 
    remainingWork,
    isRolling, 
    isGameCompleted,
    diceTheme,
    isReplayMode,
    currentReplayStep,
    savedResults,
    rollDice,
    setDiceTheme,
    nextReplayStep,
    exitReplay
  } = useGameState();
  
  // Get the current dice value
  const currentDiceValue = throwResults[throwNumber - 2]; // -2 because throwNumber is 1-indexed and we want the previous result
  
  // CSS for dice animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .dice {
        transition: transform 0.8s ease-out;
      }
      .dice-rolling {
        transform: rotateX(720deg) rotateY(720deg);
      }
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
      .pulse-animation {
        animation: pulse 1.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Generate status message based on game state
  const getStatusMessage = () => {
    if (isReplayMode) {
      return `Replay mode - Step ${currentReplayStep} of ${savedResults.length}`;
    } else if (isGameCompleted) {
      if (remainingWork === 0) {
        return "All work completed!";
      } else if (throwNumber > 4) {
        return "All throws completed";
      }
    }
    return "Click the button to roll the dice";
  };
  
  return (
    <div className="bg-neutral-100 p-4 rounded-md mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-medium text-neutral-400 mb-2">
            Throw #{throwNumber > 4 ? 4 : throwNumber} of 4
            {remainingWork === 0 && throwNumber <= 4 && " (Early completion!)"}
          </h3>
          <p className="text-neutral-300">
            {getStatusMessage()}
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Dice visualization */}
          <div className="relative">
            <Dice 
              value={currentDiceValue} 
              theme={diceTheme}
              isRolling={isRolling}
            />
          </div>
          
          {/* Replay controls or normal throw button */}
          {isReplayMode ? (
            <div className="flex items-center space-x-2">
              <Button 
                onClick={nextReplayStep}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center"
                disabled={currentReplayStep >= savedResults.length}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                </svg>
                Next
              </Button>
              <Button 
                onClick={exitReplay}
                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-medium py-2 px-4 rounded-md shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                Exit Replay
              </Button>
            </div>
          ) : (
            !isGameCompleted && (
              <Button 
                onClick={rollDice}
                className={`bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md shadow-md transition duration-200 ${!isRolling && !isGameCompleted ? 'pulse-animation' : ''} focus:outline-none focus:ring-2 focus:ring-primary/50`}
                disabled={isRolling || isGameCompleted}
              >
                THROW DICE
              </Button>
            )
          )}
        </div>
      </div>
      
      {/* Dice theme selector */}
      <DiceThemeSelector 
        currentTheme={diceTheme} 
        onChange={setDiceTheme}
      />
    </div>
  );
};

export default DiceRoller;
