import React from 'react';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/lib/gameState';

// Define the available dice themes
export type DiceTheme = 'classic' | 'dots' | 'tech' | 'pixel';

interface DiceThemeSelectorProps {
  onChange: (theme: DiceTheme) => void;
  currentTheme: DiceTheme;
}

const DiceThemeSelector: React.FC<DiceThemeSelectorProps> = ({ onChange, currentTheme }) => {
  // Theme options with their preview display
  const themes: { id: DiceTheme; name: string; preview: string }[] = [
    { 
      id: 'classic', 
      name: 'Classic', 
      preview: '123' 
    },
    { 
      id: 'dots', 
      name: 'Dots', 
      preview: '⚀⚁⚂' 
    },
    { 
      id: 'tech', 
      name: 'Tech', 
      preview: '0x1' 
    },
    { 
      id: 'pixel', 
      name: 'Pixel', 
      preview: '█▋▍' 
    },
  ];

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-neutral-400 mb-2">Dice Theme:</h3>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme) => (
          <Button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            variant={currentTheme === theme.id ? "default" : "outline"}
            className={`h-9 px-3 text-xs ${
              currentTheme === theme.id 
                ? "bg-primary text-white" 
                : "bg-white hover:bg-neutral-50"
            }`}
          >
            <span className="mr-1">{theme.preview}</span>
            {theme.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DiceThemeSelector;