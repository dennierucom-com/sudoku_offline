import {
  isValidPlacement,
  isBoardComplete,
  cloneBoard,
  generateSolvedBoard,
  generatePuzzle,
} from '../sudoku';

describe('sudoku utils', () => {
  const emptyBoard = () => Array.from({ length: 9 }, () => Array(9).fill(0));

  describe('isValidPlacement', () => {
    it('should return true for a valid placement', () => {
      const board = emptyBoard();
      expect(isValidPlacement(board, 0, 0, 5)).toBe(true);
    });

    it('should return false if number exists in the same row', () => {
      const board = emptyBoard();
      board[0][5] = 5;
      expect(isValidPlacement(board, 0, 0, 5)).toBe(false);
    });

    it('should return false if number exists in the same column', () => {
      const board = emptyBoard();
      board[5][0] = 5;
      expect(isValidPlacement(board, 0, 0, 5)).toBe(false);
    });

    it('should return false if number exists in the same 3x3 box', () => {
      const board = emptyBoard();
      board[1][1] = 5;
      expect(isValidPlacement(board, 0, 0, 5)).toBe(false);
    });
  });

  describe('isBoardComplete', () => {
    it('should return false for an empty board', () => {
      const board = emptyBoard();
      expect(isBoardComplete(board)).toBe(false);
    });

    it('should return false for a partially filled board', () => {
      const board = emptyBoard();
      board[0][0] = 1;
      expect(isBoardComplete(board)).toBe(false);
    });

    it('should return true for a completely filled board', () => {
      const board = Array.from({ length: 9 }, () => Array(9).fill(1));
      expect(isBoardComplete(board)).toBe(true);
    });
  });

  describe('cloneBoard', () => {
    it('should create a deep copy of the board', () => {
      const board = emptyBoard();
      const cloned = cloneBoard(board);
      expect(cloned).toEqual(board);
      expect(cloned).not.toBe(board);
      
      cloned[0][0] = 5;
      expect(board[0][0]).toBe(0);
    });
  });

  describe('generateSolvedBoard', () => {
    it('should generate a valid and complete board', () => {
      const board = generateSolvedBoard();
      expect(isBoardComplete(board)).toBe(true);
      
      // Verify validity of some random cells
      for (let i = 0; i < 5; i++) {
        const r = Math.floor(Math.random() * 9);
        const c = Math.floor(Math.random() * 9);
        const val = board[r][c];
        board[r][c] = 0;
        expect(isValidPlacement(board, r, c, val)).toBe(true);
        board[r][c] = val;
      }
    });
  });

  describe('generatePuzzle', () => {
    it('should generate a puzzle with correct number of removed cells', () => {
      const cellsToRemove = 40;
      const { puzzle, solution } = generatePuzzle(cellsToRemove);
      
      let emptyCount = 0;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (puzzle[r][c] === 0) emptyCount++;
          else expect(puzzle[r][c]).toBe(solution[r][c]);
        }
      }
      
      expect(emptyCount).toBe(cellsToRemove);
    });
  });
});
