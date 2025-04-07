import { create } from 'zustand';

import { type DiceTheme } from '@/components/DiceThemeSelector';

interface GameState {
  throwNumber: number;
  remainingWork: number;
  throwResults: (number | null)[];
  idealBurndown: number[];
  actualBurndown: number[];
  // Burnup chart data
  scopeData: number[];
  todoData: number[];
  doneData: number[];
  isRolling: boolean;
  isGameCompleted: boolean;
  diceTheme: DiceTheme;
  isReplayMode: boolean;
  savedResults: number[];
  currentReplayStep: number;
  
  // Actions
  rollDice: () => void;
  updateState: (diceValue: number) => void;
  restartGame: () => void;
  setIsRolling: (isRolling: boolean) => void;
  setDiceTheme: (theme: DiceTheme) => void;
  startReplay: () => void;
  nextReplayStep: () => void;
  exitReplay: () => void;
}

export const useGameState = create<GameState>((set, get) => ({
  throwNumber: 1,
  remainingWork: 12,
  throwResults: [null, null, null, null],
  idealBurndown: [12, 9, 6, 3, 0],
  actualBurndown: [12],
  // Initialize burnup chart data
  scopeData: [12, 12, 12, 12],         // Total scope remains constant at 12 points
  todoData: [0, 0, 0, 0],              // TODO starts at 0 for burnup (to be calculated inversely)
  doneData: [0, 0, 0, 0],              // DONE starts at 0 and will increase
  isRolling: false,
  isGameCompleted: false,
  diceTheme: 'classic', // Default theme
  isReplayMode: false,
  savedResults: [],
  currentReplayStep: 0,
  
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
    const { throwNumber, remainingWork, throwResults, actualBurndown, todoData, doneData } = get();
    
    // Update throw results
    const newThrowResults = [...throwResults];
    newThrowResults[throwNumber - 1] = diceValue;
    
    // Update remaining work (subtract dice value)
    const newRemainingWork = Math.max(0, remainingWork - diceValue);
    
    // Update actual burndown data
    const newActualBurndown = [...actualBurndown, newRemainingWork];
    
    // Update burnup chart data
    const newTodoData = [...todoData];
    const newDoneData = [...doneData];
    
    // Update DONE for the current sprint (increasing from 0 toward 12)
    // For burnup chart, DONE should always increase or stay the same, never decrease
    const workDone = 12 - newRemainingWork;
    newDoneData[throwNumber - 1] = workDone;
    
    // We no longer propagate the DONE value to future sprints
    // This allows the chart to show DONE line only up to the current sprint
    
    // For burnup chart, TODO is the difference between scope and done
    // We're keeping it at 0 and letting the chart visually show the difference
    
    // Check if game is completed (all 4 throws or 0 remaining work)
    const isGameCompleted = throwNumber >= 4 || newRemainingWork === 0;
    
    set({
      throwResults: newThrowResults,
      remainingWork: newRemainingWork,
      actualBurndown: newActualBurndown,
      todoData: newTodoData,
      doneData: newDoneData,
      throwNumber: throwNumber + 1,
      isGameCompleted
    });
  },
  
  restartGame: () => {
    const { diceTheme } = get();
    set({
      throwNumber: 1,
      remainingWork: 12,
      throwResults: [null, null, null, null],
      idealBurndown: [12, 9, 6, 3, 0],
      actualBurndown: [12],
      // Reset burnup chart data
      scopeData: [12, 12, 12, 12],
      todoData: [0, 0, 0, 0],
      doneData: [0, 0, 0, 0],
      isRolling: false,
      isGameCompleted: false,
      // Reset replay state
      isReplayMode: false,
      savedResults: [],
      currentReplayStep: 0,
      diceTheme // Maintain the current theme
    });
  },
  
  setIsRolling: (isRolling: boolean) => {
    set({ isRolling });
  },
  
  setDiceTheme: (theme: DiceTheme) => {
    set({ diceTheme: theme });
  },
  
  // Replay functionality
  startReplay: () => {
    const { throwResults } = get();
    
    // Filter out null values and save valid dice results
    const validResults = throwResults.filter(result => result !== null) as number[];
    
    // Only start replay if we have results to replay
    if (validResults.length === 0) return;
    
    // Reset the game state but keep the results for replay
    set({
      throwNumber: 1,
      remainingWork: 12,
      throwResults: [null, null, null, null],
      idealBurndown: [12, 9, 6, 3, 0],
      actualBurndown: [12],
      // Reset burnup chart data
      scopeData: [12, 12, 12, 12],
      todoData: [0, 0, 0, 0],
      doneData: [0, 0, 0, 0],
      isRolling: false,
      isGameCompleted: false,
      // Set replay mode
      isReplayMode: true,
      savedResults: validResults,
      currentReplayStep: 0
    });
  },
  
  nextReplayStep: () => {
    const { currentReplayStep, savedResults, isReplayMode } = get();
    
    // Only proceed if in replay mode and there are steps left
    if (!isReplayMode || currentReplayStep >= savedResults.length) return;
    
    // Get the next dice value from saved results
    const nextDiceValue = savedResults[currentReplayStep];
    
    // Apply the dice roll result
    get().updateState(nextDiceValue);
    
    // Increment the replay step
    set({ currentReplayStep: currentReplayStep + 1 });
    
    // If this was the last step, exit replay mode when done
    if (currentReplayStep + 1 >= savedResults.length) {
      // Small delay to allow the last state update to be visible
      setTimeout(() => {
        set({ isReplayMode: false });
      }, 500);
    }
  },
  
  exitReplay: () => {
    // Exit replay mode but keep the current game state
    set({ 
      isReplayMode: false,
      savedResults: [],
      currentReplayStep: 0
    });
  }
}));
