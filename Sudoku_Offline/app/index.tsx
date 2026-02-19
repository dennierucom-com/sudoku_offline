import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import SudokuBoard from "../src/components/SudokuBoard";
import NumberPad from "../src/components/NumberPad";
import {
  generatePuzzle,
  cloneBoard,
  isValidPlacement,
  isBoardComplete,
  type Board,
} from "../src/utils/sudoku";

export default function GameScreen() {
  const [board, setBoard] = useState<Board>([]);
  const [puzzle, setPuzzle] = useState<Board>([]);
  const [solution, setSolution] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null,
  );

  const startNewGame = useCallback(() => {
    const { puzzle: p, solution: s } = generatePuzzle(40);
    setPuzzle(p);
    setSolution(s);
    setBoard(cloneBoard(p));
    setSelectedCell(null);
  }, []);

  // Generate the first puzzle on mount
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleCellPress = useCallback(
    (row: number, col: number) => {
      // Don't select clue cells
      if (puzzle.length > 0 && puzzle[row][col] !== 0) return;
      setSelectedCell([row, col]);
    },
    [puzzle],
  );

  const handleNumberPress = useCallback(
    (num: number) => {
      if (!selectedCell) return;
      const [r, c] = selectedCell;

      // Don't overwrite clues
      if (puzzle[r][c] !== 0) return;

      // Create a temporary board without the current cell value for validation
      const temp = cloneBoard(board);
      temp[r][c] = 0;

      if (!isValidPlacement(temp, r, c, num)) {
        // Still place it but in the future we could show an error style
        // For now, just ignore invalid placements
        return;
      }

      const newBoard = cloneBoard(board);
      newBoard[r][c] = num;
      setBoard(newBoard);

      // Check for win
      if (isBoardComplete(newBoard)) {
        Alert.alert("🎉 Congratulations!", "You solved the puzzle!", [
          { text: "New Game", onPress: startNewGame },
        ]);
      }
    },
    [selectedCell, puzzle, board, startNewGame],
  );

  const handleErase = useCallback(() => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (puzzle[r][c] !== 0) return; // can't erase clues

    const newBoard = cloneBoard(board);
    newBoard[r][c] = 0;
    setBoard(newBoard);
  }, [selectedCell, puzzle, board]);

  // Wait for the first puzzle to be generated
  if (board.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Generating puzzle…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <SudokuBoard
        board={board}
        puzzle={puzzle}
        selectedCell={selectedCell}
        onCellPress={handleCellPress}
      />

      <NumberPad onNumberPress={handleNumberPress} onErase={handleErase} />

      <TouchableOpacity style={styles.newGameBtn} onPress={startNewGame}>
        <Text style={styles.newGameText}>New Game</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  newGameBtn: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#1565c0",
  },
  newGameText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
