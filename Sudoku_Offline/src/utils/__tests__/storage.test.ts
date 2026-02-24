import {
    GameState,
    MAX_SAVED_GAMES,
    addSavedGame,
    clearGameState,
    deleteSavedGame,
    hasSavedGame,
    loadGameState,
    loadSavedGames,
    saveGameState,
    storage,
    updateSavedGame
} from "../storage";

// Mock MMKV
jest.mock("react-native-mmkv", () => {
  return {
    MMKV: jest.fn().mockImplementation(() => {
      const store: Record<string, string> = {};
      return {
        set: jest.fn((key, value) => {
          store[key] = value;
        }),
        getString: jest.fn((key) => store[key] || null),
        delete: jest.fn((key) => {
          delete store[key];
        }),
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
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("storage utils", () => {
  const mockState: GameState = {
    board: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    puzzle: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    solution: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
    seconds: 120,
    lastUpdated: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    clearGameState();
    // Clear saved games too
    storage.delete("sudoku_saved_games");
  });

  it("should save game state", () => {
    saveGameState(mockState);
    expect(hasSavedGame()).toBe(true);
  });

  it("should load saved game state", () => {
    saveGameState(mockState);
    const loaded = loadGameState();
    expect(loaded).toEqual(mockState);
  });

  it("should return null if no game state is saved", () => {
    expect(loadGameState()).toBeNull();
  });

  it("should clear game state", () => {
    saveGameState(mockState);
    expect(hasSavedGame()).toBe(true);
    clearGameState();
    expect(hasSavedGame()).toBe(false);
    expect(loadGameState()).toBeNull();
  });

  it("should handle corrupted JSON", () => {
    // Manually set a malformed string
    storage.set("latest_sudoku_game", "invalid-json");
    expect(loadGameState()).toBeNull();
  });

  describe("multi-save logic", () => {
    it("should add a manual save", () => {
      const id = addSavedGame("Test Save", mockState);
      const savedGames = loadSavedGames();
      expect(savedGames.length).toBe(1);
      expect(savedGames[0].id).toBe(id);
      expect(savedGames[0].name).toBe("Test Save");
    });

    it("should load multiple saves in order (newest first)", () => {
      addSavedGame("Save 1", { ...mockState, seconds: 10 });
      addSavedGame("Save 2", { ...mockState, seconds: 20 });
      const savedGames = loadSavedGames();
      expect(savedGames.length).toBe(2);
      expect(savedGames[0].name).toBe("Save 2");
      expect(savedGames[1].name).toBe("Save 1");
    });

    it("should implement FIFO logic (max 10)", () => {
      for (let i = 1; i <= MAX_SAVED_GAMES + 2; i++) {
        addSavedGame(`Save ${i}`, { ...mockState, seconds: i });
      }
      const savedGames = loadSavedGames();
      expect(savedGames.length).toBe(MAX_SAVED_GAMES);
      expect(savedGames[0].name).toBe(`Save ${MAX_SAVED_GAMES + 2}`);
      expect(savedGames[MAX_SAVED_GAMES - 1].name).toBe("Save 3");
    });

    it("should delete a specific save", () => {
      const id1 = addSavedGame("Save 1", mockState);
      const id2 = addSavedGame("Save 2", mockState);
      deleteSavedGame(id1);
      const savedGames = loadSavedGames();
      expect(savedGames.length).toBe(1);
      expect(savedGames[0].id).toBe(id2);
    });

    it("should update an existing save", () => {
      const id = addSavedGame("Original Name", mockState);
      const newState = { ...mockState, seconds: 999 };
      updateSavedGame(id, newState);
      const savedGames = loadSavedGames();
      expect(savedGames[0].seconds).toBe(999);
      expect(savedGames[0].name).toBe("Original Name"); // Name should persist
    });
  });
});
