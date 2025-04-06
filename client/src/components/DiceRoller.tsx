import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/lib/gameState';

const DiceRoller: React.FC = () => {
  const { 
    throwNumber, 
    throwResults, 
    remainingWork,
    isRolling, 
    isGameCompleted,
    rollDice 
  } = useGameState();
  
  // Get the current dice value
  const currentDiceValue = throwResults[throwNumber - 2]; // -2 because throwNumber is 1-indexed and we want the previous result
  
  // Apply dice rolling animation class
  const diceClass = `dice w-16 h-16 bg-white rounded-lg shadow-lg border-2 border-neutral-200 flex items-center justify-center ${isRolling ? 'dice-rolling' : ''}`;
  
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
    if (isGameCompleted) {
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
      <div className="flex flex-col md:flex-row items-center justify-between">
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
            <div className={diceClass}>
              <span className="text-2xl font-bold text-primary">
                {isRolling ? '?' : (currentDiceValue !== null ? currentDiceValue : '?')}
              </span>
            </div>
          </div>
          
          {/* Throw button */}
          {!isGameCompleted && (
            <Button 
              onClick={rollDice}
              className={`bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md shadow-md transition duration-200 ${!isRolling && !isGameCompleted ? 'pulse-animation' : ''} focus:outline-none focus:ring-2 focus:ring-primary/50`}
              disabled={isRolling || isGameCompleted}
            >
              THROW DICE
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiceRoller;
