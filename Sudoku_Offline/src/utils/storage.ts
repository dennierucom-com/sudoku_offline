import { Platform } from "react-native";
import { Board } from "./sudoku";

// react-native-mmkv doesn't support web because it uses JSI.
// We've implemented a simple fallback using localStorage for the web.
const createStorage = () => {
  if (Platform.OS === "web") {
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

export interface SavedGame extends GameState {
  id: string;
  name: string;
}

const GAME_STATE_KEY = "latest_sudoku_game";
const SAVED_GAMES_KEY = "sudoku_saved_games";
export const MAX_SAVED_GAMES = 10;

export const saveGameState = (state: GameState) => {
  storage.set(GAME_STATE_KEY, JSON.stringify(state));
};

export const loadGameState = (): GameState | null => {
  const json = storage.getString(GAME_STATE_KEY);
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to parse game state", e);
    return null;
  }
};

export const clearGameState = () => {
  storage.delete(GAME_STATE_KEY);
};

export const hasSavedGame = (): boolean => {
  return storage.contains(GAME_STATE_KEY);
};

export const loadSavedGames = (): SavedGame[] => {
  const json = storage.getString(SAVED_GAMES_KEY);
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to parse saved games", e);
    return [];
  }
};

export const addSavedGame = (name: string, state: GameState): string => {
  const savedGames = loadSavedGames();
  const id = Date.now().toString();
  const newSave: SavedGame = {
    ...state,
    id,
    name,
  };

  savedGames.unshift(newSave); // Add to beginning (most recent)

  if (savedGames.length > MAX_SAVED_GAMES) {
    savedGames.pop(); // Remove oldest
  }

  storage.set(SAVED_GAMES_KEY, JSON.stringify(savedGames));
  return id;
};

export const deleteSavedGame = (id: string) => {
  const savedGames = loadSavedGames();
  const filtered = savedGames.filter((g) => g.id !== id);
  storage.set(SAVED_GAMES_KEY, JSON.stringify(filtered));
};

export const updateSavedGame = (id: string, state: GameState) => {
  const savedGames = loadSavedGames();
  const index = savedGames.findIndex((g) => g.id === id);
  if (index !== -1) {
    savedGames[index] = {
      ...savedGames[index],
      ...state,
      lastUpdated: Date.now(),
    };
    storage.set(SAVED_GAMES_KEY, JSON.stringify(savedGames));
  }
};
