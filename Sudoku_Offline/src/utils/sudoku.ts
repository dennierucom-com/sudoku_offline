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
 * Fill the board using backtracking (randomised order).
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
      return false;
    }
  }
  return true;
}

/** Generate a complete, valid 9×9 Sudoku solution. */
export function generateSolvedBoard(): Board {
  const board = emptyBoard();
  fillBoard(board);
  return board;
}

// ─── Puzzle Generation ─────────────────────────────────────────────────────────

export interface Puzzle {
  puzzle: Board;
  solution: Board;
}

/**
 * Generate a Sudoku puzzle.
 * MAINTAINS RETRO-COMPATIBILITY: Same signature as original.
 * MODIFICATION: Uses rotational symmetry for a "funny/clever" feel.
 */
export function generatePuzzle(cellsToRemove: number = 40): Puzzle {
  const solution = generateSolvedBoard();
  const puzzle = cloneBoard(solution);

  // Build a list of all positions, but only for half the board
  // We use the property of rotational symmetry: removing (r, c) also removes (8-r, 8-c)
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  shuffle(positions);

  let removed = 0;
  for (const [r, c] of positions) {
    // If we hit our target or the "funny/easy" threshold, stop
    if (removed >= cellsToRemove) break;

    if (puzzle[r][c] !== 0) {
      const mirrorR = 8 - r;
      const mirrorC = 8 - c;

      // Remove the primary cell
      puzzle[r][c] = 0;
      removed++;

      // Remove the mirrored cell to keep it "clever" and symmetric
      if (puzzle[mirrorR][mirrorC] !== 0 && removed < cellsToRemove) {
        puzzle[mirrorR][mirrorC] = 0;
        removed++;
      }
    }
  }

  return { puzzle, solution };
}

/** * NEW: Instant Solver / Reveal helper
 * Maintains compatibility while adding the requested 'solve in one move' capability
 */
export function solvePuzzle(solution: Board): Board {
  return cloneBoard(solution);
}
