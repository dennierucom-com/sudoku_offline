import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import type { Board } from "../utils/sudoku";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BOARD_PADDING = 16;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - BOARD_PADDING * 2) / 9);

interface Props {
  board: Board;
  /** Original puzzle — non-zero cells are clues (read-only). */
  puzzle: Board;
  selectedCell: [number, number] | null;
  onCellPress: (row: number, col: number) => void;
}

export default function SudokuBoard({
  board,
  puzzle,
  selectedCell,
  onCellPress,
}: Props) {
  const isSelected = (r: number, c: number) =>
    selectedCell?.[0] === r && selectedCell?.[1] === c;

  const isHighlighted = (r: number, c: number) => {
    if (!selectedCell) return false;
    const [sr, sc] = selectedCell;
    // Same row or column
    return r === sr || c === sc;
  };

  const isClue = (r: number, c: number) => puzzle[r][c] !== 0;

  return (
    <View style={styles.board}>
      {board.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((cell, c) => {
            const selected = isSelected(r, c);
            const highlighted = isHighlighted(r, c);
            const clue = isClue(r, c);

            return (
              <TouchableOpacity
                key={c}
                activeOpacity={0.6}
                onPress={() => onCellPress(r, c)}
                style={[
                  styles.cell,
                  highlighted && styles.highlightedCell,
                  selected && styles.selectedCell,
                  // Thick borders for 3x3 grids
                  (c === 2 || c === 5) && styles.thickRight,
                  (r === 2 || r === 5) && styles.thickBottom,
                ]}
              >
                <Text
                  style={[
                    styles.cellText,
                    clue ? styles.clueText : styles.userText,
                  ]}
                >
                  {cell !== 0 ? String(cell) : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    borderWidth: 2,
    borderColor: "#1A1A1A",
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: "rgba(26, 26, 26, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCell: {
    backgroundColor: "#E8F0FE",
  },
  highlightedCell: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  thickRight: {
    borderRightWidth: 1.5,
    borderRightColor: "#1A1A1A",
  },
  thickBottom: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#1A1A1A",
  },
  cellText: {
    fontSize: 20,
  },
  clueText: {
    fontWeight: "700",
    color: "#1A1A1A",
  },
  userText: {
    fontWeight: "700",
    color: "#477eeb",
  },
});
