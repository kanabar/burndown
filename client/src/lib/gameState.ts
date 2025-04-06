import { create } from 'zustand';

interface GameState {
  throwNumber: number;
  remainingWork: number;
  throwResults: (number | null)[];
  idealBurndown: number[];
  actualBurndown: number[];
  isRolling: boolean;
  isGameCompleted: boolean;
  
  // Actions
  rollDice: () => void;
  updateState: (diceValue: number) => void;
  restartGame: () => void;
  setIsRolling: (isRolling: boolean) => void;
}

export const useGameState = create<GameState>((set, get) => ({
  throwNumber: 1,
  remainingWork: 12,
  throwResults: [null, null, null, null],
  idealBurndown: [12, 9, 6, 3, 0],
  actualBurndown: [12],
  isRolling: false,
  isGameCompleted: false,
  
  rollDice: () => {
    const { isRolling, throwNumber, isGameCompleted } = get();
    
    // Don't roll if already rolling or game completed
    if (isRolling || throwNumber > 4 || isGameCompleted) return;
    
    set({ isRolling: true });
    
    // Wait 800ms to simulate rolling animation
    setTimeout(() => {
      // Generate random number between 1 and 6
      const diceValue = Math.floor(Math.random() * 6) + 1;
      get().updateState(diceValue);
      set({ isRolling: false });
    }, 800);
  },
  
  updateState: (diceValue: number) => {
    const { throwNumber, remainingWork, throwResults, actualBurndown } = get();
    
    // Update throw results
    const newThrowResults = [...throwResults];
    newThrowResults[throwNumber - 1] = diceValue;
    
    // Update remaining work (subtract dice value)
    const newRemainingWork = Math.max(0, remainingWork - diceValue);
    
    // Update actual burndown data
    const newActualBurndown = [...actualBurndown, newRemainingWork];
    
    // Check if game is completed
    const isGameCompleted = throwNumber >= 4;
    
    set({
      throwResults: newThrowResults,
      remainingWork: newRemainingWork,
      actualBurndown: newActualBurndown,
      throwNumber: throwNumber + 1,
      isGameCompleted
    });
  },
  
  restartGame: () => {
    set({
      throwNumber: 1,
      remainingWork: 12,
      throwResults: [null, null, null, null],
      idealBurndown: [12, 9, 6, 3, 0],
      actualBurndown: [12],
      isRolling: false,
      isGameCompleted: false
    });
  },
  
  setIsRolling: (isRolling: boolean) => {
    set({ isRolling });
  }
}));
