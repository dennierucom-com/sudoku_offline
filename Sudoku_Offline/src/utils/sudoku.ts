/**
 * Sudoku game logic utilities.
 * Pure functions — no React dependencies.
 */

export type Board = number[][]; // 9x9, 0 = empty

// ─── Validation ────────────────────────────────────────────────────────────────

/** Check whether placing `num` at (row, col) is valid. */
export function isValidPlacement(
  board: Board,
  row: number,
  col: number,
  num: number,
): boolean {
  // Row check
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }

  // Column check
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }

  // 3×3 box check
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }

  return true;
}

/** Check if every cell is filled (no zeros) and valid. */
export function isBoardComplete(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  return true;
}

// ─── Board Generation ──────────────────────────────────────────────────────────

/** Fisher-Yates shuffle (mutates in-place). */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Create an empty 9×9 board filled with zeros. */
function emptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

/** Deep-clone a board. */
export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

/**
 * Fill the board using backtracking (randomised order so each call produces
 * a different valid solution).
 */
function fillBoard(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0) continue;

      const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      for (const n of nums) {
        if (isValidPlacement(board, r, c, n)) {
          board[r][c] = n;
          if (fillBoard(board)) return true;
          board[r][c] = 0;
        }
      }
      return false; // trigger backtrack
    }
  }
  return true; // board fully filled
}

/** Generate a complete, valid 9×9 Sudoku solution. */
export function generateSolvedBoard(): Board {
  const board = emptyBoard();
  fillBoard(board);
  return board;
}

// ─── Puzzle Generation ─────────────────────────────────────────────────────────

export interface Puzzle {
  /** The puzzle with some cells set to 0 (empty). */
  puzzle: Board;
  /** The complete solution. */
  solution: Board;
}

/**
 * Generate a Sudoku puzzle.
 *
 * @param cellsToRemove  How many cells to blank out.
 *   - Easy  ≈ 36
 *   - Medium ≈ 45
 *   - Hard  ≈ 54
 */
export function generatePuzzle(cellsToRemove: number = 40): Puzzle {
  const solution = generateSolvedBoard();
  const puzzle = cloneBoard(solution);

  // Build a shuffled list of all 81 cell positions
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  shuffle(positions);

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= cellsToRemove) break;
    puzzle[r][c] = 0;
    removed++;
  }

  return { puzzle, solution };
}
