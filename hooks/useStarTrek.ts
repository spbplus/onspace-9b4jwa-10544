import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalization } from './useLocalization';
import { GameState, LogEntry } from '@/types/game';
import {
  createNewGame,
  populateQuadrant,
  updateShipCondition,
  repairSystems,
  DifficultyLevel,
} from '@/services/gameEngine';
import { firePhasers, fireTorpedo, klingonAttack } from '@/services/combatEngine';
import { moveShip, dockAtStarbase } from '@/services/navigationEngine';
import {
  generateShortRangeScan,
  generateLongRangeScan,
  generateGalaxyMap,
  generateStatusReport,
  generateHelp,
} from '@/services/displayEngine';

export function useStarTrek() {
  const { t } = useLocalization();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [awaitingDifficulty, setAwaitingDifficulty] = useState(false);
  const [awaitingNewGameConfirmation, setAwaitingNewGameConfirmation] = useState(false);

  const addLog = useCallback((text: string, type: LogEntry['type'] = 'normal') => {
    setLogs(prev => [...prev, { text, type, timestamp: Date.now() }]);
  }, []);

  const addLogs = useCallback((texts: string[], type: LogEntry['type'] = 'normal') => {
    const newLogs = texts.map(text => ({
      text,
      type,
      timestamp: Date.now(),
    }));
    setLogs(prev => [...prev, ...newLogs]);
  }, []);

  const promptDifficultySelection = useCallback(() => {
    setLogs([]);
    setCommandHistory([]);
    setAwaitingDifficulty(true);
    
    addLog('======================================', 'info');
    addLog(`    ${t.gameTitle}`, 'info');
    addLog('======================================', 'info');
    addLog('', 'normal');
    addLog(t.difficulty.prompt, 'info');
    addLog('', 'normal');
    addLog(t.difficulty.options, 'normal');
    addLog('', 'normal');
  }, [addLog, t]);

  const startNewGame = useCallback((difficulty: DifficultyLevel = 'captain') => {
    const state = createNewGame(difficulty);
    populateQuadrant(state);
    setGameState(state);
    setAwaitingDifficulty(false);
    
    // Clear saved game
    AsyncStorage.removeItem('game_state').catch(error => {
      console.error('Failed to clear saved game:', error);
    });
    

    addLog('======================================', 'info');
    addLog(`    ${t.gameTitle} - ${t.status.stardate.toUpperCase()} ` + state.stardate.toFixed(1), 'info');
    addLog('======================================', 'info');
    addLog('', 'normal');
    addLog(t.missionBrief(state.klingonsRemaining, state.timeRemaining), 'info');
    addLog('', 'normal');
    addLog(t.typeHelpForHelp, 'normal');
    
    const scanLines = generateShortRangeScan(state, t);
    addLogs(scanLines, 'normal');
  }, [addLog, addLogs, t]);

  const processCommand = useCallback((input: string) => {
    // Handle new game confirmation
    if (awaitingNewGameConfirmation) {
      const trimmed = input.trim().toUpperCase();
      addLog('> ' + input, 'info');
      
      if (trimmed === 'Y' || trimmed === 'YES' || trimmed === 'Д' || trimmed === 'ДА') {
        addLog(t.messages.newGameYes, 'success');
        addLog('', 'normal');
        setAwaitingNewGameConfirmation(false);
        promptDifficultySelection();
        return;
      } else if (trimmed === 'N' || trimmed === 'NO' || trimmed === 'Н' || trimmed === 'НЕТ') {
        addLog(t.messages.newGameNo, 'info');
        setAwaitingNewGameConfirmation(false);
        return;
      } else {
        addLog(t.messages.invalidYesNo, 'error');
        return;
      }
    }
    
    // Handle difficulty selection
    if (awaitingDifficulty) {
      const trimmed = input.trim().toUpperCase();
      addLog('> ' + input, 'info');
      
      let difficulty: DifficultyLevel | null = null;
      
      if (trimmed === '1' || trimmed === 'LIEUTENANT' || trimmed === 'ЛЕЙТЕНАНТ') {
        difficulty = 'lieutenant';
      } else if (trimmed === '2' || trimmed === 'COMMANDER' || trimmed === 'КОММАНДЕР') {
        difficulty = 'commander';
      } else if (trimmed === '3' || trimmed === 'CAPTAIN' || trimmed === 'КАПИТАН') {
        difficulty = 'captain';
      } else {
        addLog(t.messages.unknownCommand, 'error');
        addLog('', 'normal');
        addLog(t.difficulty.options, 'normal');
        return;
      }
      
      startNewGame(difficulty);
      return;
    }
    
    if (!gameState) {
      addLog(t.messages.noGameInProgress, 'error');
      return;
    }

    if (gameState.destroyed || gameState.won) {
      addLog(t.messages.gameOver, 'error');
      return;
    }

    const trimmed = input.trim().toUpperCase();
    if (!trimmed) return;

    setCommandHistory(prev => [...prev, input]);
    addLog('> ' + input, 'info');

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    const newState = { ...gameState };
    let needsKlingonAttack = false;
    let autoShowSRS = false;

    try {
      switch (cmd) {
        case 'NAV':
          if (args.length < 2) {
            addLog(t.messages.usageNav, 'error');
          } else {
            const course = parseFloat(args[0]);
            const warp = parseFloat(args[1]);
            const result = moveShip(newState, course, warp, t);
            addLogs(result.messages);
            
            if (result.moved) {
              needsKlingonAttack = true;
              autoShowSRS = true;
            }
          }
          break;

        case 'SRS':
          addLogs(generateShortRangeScan(newState, t));
          break;

        case 'LRS':
          addLogs(generateLongRangeScan(newState, t));
          break;

        case 'PHA':
          if (args.length < 1) {
            addLog(t.messages.usagePha, 'error');
          } else {
            const energy = parseInt(args[0]);
            const result = firePhasers(newState, energy, t);
            addLogs(result.messages);
            needsKlingonAttack = !result.klingonDestroyed;
          }
          break;

        case 'TOR':
          if (args.length < 1) {
            addLog(t.messages.usageTor, 'error');
          } else {
            const course = parseFloat(args[0]);
            const result = fireTorpedo(newState, course, t);
            addLogs(result.messages);
            needsKlingonAttack = !result.klingonDestroyed;
          }
          break;

        case 'SHE':
          if (args.length < 1) {
            addLog(t.messages.usageShe, 'error');
          } else {
            const amount = parseInt(args[0]);
            
            if (newState.ship.systems.shields > 0) {
              addLog(t.messages.shieldControlDamaged, 'error');
            } else if (amount < 0) {
              addLog(t.messages.amountMustBePositive, 'error');
            } else if (amount > newState.ship.energy) {
              addLog(t.messages.insufficientEnergy, 'error');
            } else {
              newState.ship.energy -= amount;
              newState.ship.shields += amount;
              newState.ship.shieldsUp = newState.ship.shields > 0;
              addLog(t.messages.shieldsNowAt(newState.ship.shields));
            }
          }
          break;

        case 'DAM':
          addLogs(generateStatusReport(newState, t));
          break;

        case 'COM':
          addLogs(generateGalaxyMap(newState, t));
          break;

        case 'STA':
          addLogs(generateStatusReport(newState, t));
          break;

        case 'DOC':
          addLogs(dockAtStarbase(newState, t));
          break;

        case 'HEL':
          addLogs(generateHelp(t), 'info');
          break;
        
        case 'LANG':
          // This command is handled outside game state, continue to avoid "unknown command"
          return;

        case 'XXX':
          addLog(t.messages.youResigned, 'error');
          newState.destroyed = true;
          break;

        default:
          addLog(t.messages.unknownCommand, 'error');
      }

      // Auto repair while docked
      if (newState.ship.condition === 'DOCKED') {
        repairSystems(newState, 0.5);
      }

      // Check time
      if (newState.timeRemaining <= 0 && !newState.won && !newState.destroyed) {
        addLog('', 'error');
        addLog(t.messages.timeExpired, 'error');
        addLog(t.messages.federationConquered, 'error');
        newState.destroyed = true;
      }

      // Check victory
      if (newState.won) {
        addLog('', 'success');
        addLog(t.messages.missionAccomplished, 'success');
        addLog(t.messages.congratulations, 'success');
        addLog(t.messages.timeUsed(newState.initialTimeRemaining - newState.timeRemaining), 'success');
        addLog('', 'normal');
        addLog(t.messages.newGamePrompt, 'info');
        setAwaitingNewGameConfirmation(true);
      }
      
      // Check defeat
      if (newState.destroyed) {
        addLog('', 'normal');
        addLog(t.messages.newGamePrompt, 'info');
        setAwaitingNewGameConfirmation(true);
      }

      // Auto show short range scan after movement (BEFORE Klingon attack)
      if (autoShowSRS && !newState.destroyed && !newState.won) {
        addLogs(generateShortRangeScan(newState, t));
      }

      // Klingon counterattack (AFTER showing map, in RED)
      if (needsKlingonAttack && newState.currentKlingons.length > 0) {
        const attackResult = klingonAttack(newState, t);
        addLogs(attackResult.messages, 'error');
      }

      setGameState(newState);
      
      // Save game state after each command
      saveGameState(newState, logs);
    } catch (error) {
      addLog('Error processing command.', 'error');
      console.error(error);
    }
  }, [gameState, addLog, addLogs, t, logs, awaitingDifficulty, startNewGame]);

  const saveGameState = useCallback((state: GameState, currentLogs: LogEntry[]) => {
    const saveData = {
      gameState: state,
      logs: currentLogs,
      savedAt: Date.now(),
    };
    
    AsyncStorage.setItem('game_state', JSON.stringify(saveData)).catch(error => {
      console.error('Failed to save game state:', error);
    });
  }, []);

  const loadGameState = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('game_state');
      if (saved) {
        const saveData = JSON.parse(saved);
        setGameState(saveData.gameState);
        setLogs(saveData.logs || []);
        setIsLoaded(true);
        return true;
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
    return false;
  }, []);

  // Auto-load or start game on mount
  useEffect(() => {
    const initGame = async () => {
      const loaded = await loadGameState();
      if (!loaded) {
        promptDifficultySelection();
      }
    };
    initGame();
  }, [loadGameState, promptDifficultySelection]);

  return {
    gameState,
    logs,
    commandHistory,
    processCommand,
    promptDifficultySelection,
  };
}
