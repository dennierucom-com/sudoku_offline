import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
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
  const [seconds, setSeconds] = useState(0);

  const startNewGame = useCallback(() => {
    const { puzzle: p, solution: s } = generatePuzzle(40);
    setPuzzle(p);
    setSolution(s);
    setBoard(cloneBoard(p));
    setSelectedCell(null);
    setSeconds(0);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCellPress = useCallback(
    (row: number, col: number) => {
      if (puzzle.length > 0 && puzzle[row][col] !== 0) return;
      setSelectedCell([row, col]);
    },
    [puzzle],
  );

  const handleNumberPress = useCallback(
    (num: number) => {
      if (!selectedCell) return;
      const [r, c] = selectedCell;
      if (puzzle[r][c] !== 0) return;

      const newBoard = cloneBoard(board);
      newBoard[r][c] = num;
      setBoard(newBoard);

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
    if (puzzle[r][c] !== 0) return;

    const newBoard = cloneBoard(board);
    newBoard[r][c] = 0;
    setBoard(newBoard);
  }, [selectedCell, puzzle, board]);

  const handleHint = useCallback(() => {
    const emptyCells: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) return;

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = cloneBoard(board);
    newBoard[r][c] = solution[r][c];
    setBoard(newBoard);
    setSelectedCell([r, c]);

    if (isBoardComplete(newBoard)) {
      Alert.alert("🎉 Congratulations!", "You solved the puzzle!", [
        { text: "New Game", onPress: startNewGame },
      ]);
    }
  }, [board, solution, startNewGame]);

  const handleSolve = useCallback(() => {
    setBoard(cloneBoard(solution));
    setSelectedCell(null);
    Alert.alert("Solved", "The board has been filled with the solution.", [
      { text: "New Game", onPress: startNewGame },
      { text: "OK" },
    ]);
  }, [solution, startNewGame]);

  if (board.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Generating puzzle…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.timerBadge}>
          <MaterialIcons name="schedule" size={14} color="#1A1A1A" />
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        <SudokuBoard
          board={board}
          puzzle={puzzle}
          selectedCell={selectedCell}
          onCellPress={handleCellPress}
        />

        <NumberPad onNumberPress={handleNumberPress} onErase={handleErase} />
      </View>

      {/* Footer Controls */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.hintButton} onPress={handleHint}>
          <MaterialIcons name="lightbulb-outline" size={20} color="#1978e5" />
          <Text style={styles.hintButtonText}>Hint</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.solveButton} onPress={handleSolve}>
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.solveButtonText}>Solve</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="grid-on" size={28} color="#1978e5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons
            name="military-tech"
            size={28}
            color="rgba(26, 26, 26, 0.3)"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons
            name="history"
            size={28}
            color="rgba(26, 26, 26, 0.3)"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons
            name="settings"
            size={28}
            color="rgba(26, 26, 26, 0.3)"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7f8",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: "flex-end",
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 26, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  timerText: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  hintButton: {
    flex: 1,
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(25, 120, 229, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  hintButtonText: {
    color: "#1978e5",
    fontSize: 16,
    fontWeight: "700",
  },
  solveButton: {
    flex: 1,
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1978e5",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#1978e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  solveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  navBar: {
    flexDirection: "row",
    height: 64,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(26, 26, 26, 0.05)",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 8,
  },
  navItem: {
    padding: 8,
  },
});
