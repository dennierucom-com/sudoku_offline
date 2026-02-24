import { storage, saveGameState, loadGameState, clearGameState, hasSavedGame, GameState } from '../storage';
import { Platform } from 'react-native';

// Mock MMKV
jest.mock('react-native-mmkv', () => {
  return {
    MMKV: jest.fn().mockImplementation(() => {
      const store: Record<string, string> = {};
      return {
        set: jest.fn((key, value) => { store[key] = value; }),
        getString: jest.fn((key) => store[key] || null),
        delete: jest.fn((key) => { delete store[key]; }),
        contains: jest.fn((key) => key in store),
      };
    }),
  };
});

// Mock localStorage for web tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('storage utils', () => {
  const mockState: GameState = {
    board: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    puzzle: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    solution: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    seconds: 120,
    lastUpdated: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    clearGameState();
  });

  it('should save game state', () => {
    saveGameState(mockState);
    expect(hasSavedGame()).toBe(true);
  });

  it('should load saved game state', () => {
    saveGameState(mockState);
    const loaded = loadGameState();
    expect(loaded).toEqual(mockState);
  });

  it('should return null if no game state is saved', () => {
    expect(loadGameState()).toBeNull();
  });

  it('should clear game state', () => {
    saveGameState(mockState);
    expect(hasSavedGame()).toBe(true);
    clearGameState();
    expect(hasSavedGame()).toBe(false);
    expect(loadGameState()).toBeNull();
  });

  it('should handle corrupted JSON', () => {
    // Manually set a malformed string
    storage.set('latest_sudoku_game', 'invalid-json');
    expect(loadGameState()).toBeNull();
  });
});
