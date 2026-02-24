import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PAD_PADDING = 20;
const PAD_WIDTH = SCREEN_WIDTH - PAD_PADDING * 2;

interface Props {
  onNumberPress: (num: number) => void;
  onErase: () => void;
  onClearAll: () => void;
  onSave: () => void;
}

export default function NumberPad({
  onNumberPress,
  onErase,
  onClearAll,
  onSave,
}: Props) {
  const pressCountRef = useRef<Record<number, number>>({});

  function getNextNumber(base: number): number {
    const count = pressCountRef.current[base] || 0;
    const result = base + (count % 3);
    pressCountRef.current[base] = count + 1;
    return result;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.pillWrapper}>
          <TouchableOpacity
            style={styles.numbersButton}
            onPress={() => onNumberPress(getNextNumber(1))}
          >
            <Text style={styles.numbersButtonText}>1 2 3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numbersButton}
            onPress={() => onNumberPress(getNextNumber(4))}
          >
            <Text style={styles.numbersButtonText}>4 5 6</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.numbersButton}
            onPress={() => onNumberPress(getNextNumber(7))}
          >
            <Text style={styles.numbersButtonText}>7 8 9</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.backspaceButton}
          activeOpacity={0.5}
          onPress={onErase}
        >
          <MaterialIcons name="backspace" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backspaceButton}
          activeOpacity={0.5}
          onPress={onClearAll}
        >
          <MaterialIcons name="delete-sweep" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.5}
          onPress={onSave}
        >
          <MaterialIcons name="save" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: PAD_WIDTH,
    marginTop: 32,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  pillWrapper: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
  },
  pill: {
    flexDirection: "row",
    height: 56,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 28,
    overflow: "hidden",
  },
  numberButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  backspaceButton: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButton: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  numbersButton: {
    flex: 1,
    flexDirection: "row",
    height: 52,
    borderRadius: 26,
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
  numbersButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
