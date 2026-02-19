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
const BOARD_PADDING = 8;
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
    // Same row, column, or 3×3 box
    return (
      r === sr ||
      c === sc ||
      (Math.floor(r / 3) === Math.floor(sr / 3) &&
        Math.floor(c / 3) === Math.floor(sc / 3))
    );
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
                  selected && styles.selectedCell,
                  !selected && highlighted && styles.highlightedCell,
                  // Thicker borders for 3×3 sub-grid edges
                  c % 3 === 0 && c !== 0 && styles.thickLeft,
                  r % 3 === 0 && r !== 0 && styles.thickTop,
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
    borderColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  selectedCell: {
    backgroundColor: "#bbdefb",
  },
  highlightedCell: {
    backgroundColor: "#e3f2fd",
  },
  thickLeft: {
    borderLeftWidth: 2,
    borderLeftColor: "#333",
  },
  thickTop: {
    borderTopWidth: 2,
    borderTopColor: "#333",
  },
  cellText: {
    fontSize: CELL_SIZE * 0.5,
  },
  clueText: {
    fontWeight: "700",
    color: "#222",
  },
  userText: {
    fontWeight: "400",
    color: "#1565c0",
  },
});
