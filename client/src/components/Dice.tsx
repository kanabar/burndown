import React from 'react';
import { type DiceTheme } from './DiceThemeSelector';

interface DiceProps {
  value: number | null;
  theme: DiceTheme;
  isRolling: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, theme, isRolling }) => {
  // CSS class for rolling animation
  const diceClass = `dice w-16 h-16 bg-white rounded-lg shadow-lg border-2 border-neutral-200 flex items-center justify-center ${isRolling ? 'dice-rolling' : ''}`;
  
  // Function to render dice value based on selected theme
  const renderDiceValue = () => {
    if (isRolling) return '?';
    if (value === null) return '?';
    
    // Different themes for dice values
    switch (theme) {
      case 'classic':
        // Simple numbers
        return value;
      
      case 'dots':
        // Unicode dice symbols
        const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return diceSymbols[value - 1];
      
      default:
        return value;
    }
  };
  
  return (
    <div className={diceClass}>
      <span className={`text-2xl font-bold text-primary flex items-center justify-center ${theme === 'dots' ? 'text-3xl' : ''}`}>
        {renderDiceValue()}
      </span>
    </div>
  );
};

export default Dice;