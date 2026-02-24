import { MMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';
import { Board } from './sudoku';

// react-native-mmkv doesn't support web because it uses JSI.
// We've implemented a simple fallback using localStorage for the web.
const createStorage = () => {
  if (Platform.OS === 'web') {
    return {
      set: (key: string, value: string) => localStorage.setItem(key, value),
      getString: (key: string) => localStorage.getItem(key),
      delete: (key: string) => localStorage.removeItem(key),
      contains: (key: string) => localStorage.getItem(key) !== null,
    };
  }
  return new MMKV();
};

// @ts-ignore
export const storage = createStorage();

export interface GameState {
  board: Board;
  puzzle: Board;
  solution: Board;
  seconds: number;
  lastUpdated: number;
}

const GAME_STATE_KEY = 'latest_sudoku_game';

export const saveGameState = (state: GameState) => {
  storage.set(GAME_STATE_KEY, JSON.stringify(state));
};

export const loadGameState = (): GameState | null => {
  const json = storage.getString(GAME_STATE_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to parse game state', e);
    return null;
  }
};

export const clearGameState = () => {
  storage.delete(GAME_STATE_KEY);
};

export const hasSavedGame = (): boolean => {
  return storage.contains(GAME_STATE_KEY);
};
