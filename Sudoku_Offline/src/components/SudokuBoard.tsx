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
const BOARD_PADDING = 20;
const BOARD_SIZE = SCREEN_WIDTH - BOARD_PADDING * 2;
const CELL_SIZE = Math.floor(BOARD_SIZE / 9);

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

  const isClue = (r: number, c: number) => puzzle[r][c] !== 0;

  return (
    <View style={styles.boardOuter}>
      <View style={styles.board}>
        {board.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((cell, c) => {
              const selected = isSelected(r, c);
              const clue = isClue(r, c);

              return (
                <TouchableOpacity
                  key={c}
                  activeOpacity={0.7}
                  onPress={() => onCellPress(r, c)}
                  style={[
                    styles.cell,
                    selected && styles.selectedCell,
                    // Thick right border after columns 2 and 5
                    (c === 2 || c === 5) && styles.thickRight,
                    // Thick bottom border after rows 2 and 5
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
    </View>
  );
}

const styles = StyleSheet.create({
  boardOuter: {
    alignSelf: "center",
    borderWidth: 2.5,
    borderColor: "#1A1A1A",
    backgroundColor: "#fff",
  },
  board: {
    // Inner container for the grid rows
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  selectedCell: {
    backgroundColor: "#E8F0FE",
  },
  thickRight: {
    borderRightWidth: 2,
    borderRightColor: "#1A1A1A",
  },
  thickBottom: {
    borderBottomWidth: 2,
    borderBottomColor: "#1A1A1A",
  },
  cellText: {
    fontSize: CELL_SIZE * 0.48,
  },
  clueText: {
    fontWeight: "700",
    color: "#1A1A1A",
  },
  userText: {
    fontWeight: "600",
    color: "#4A90D9",
  },
});
