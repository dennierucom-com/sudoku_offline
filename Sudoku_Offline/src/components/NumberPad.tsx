import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;
const PAD_PADDING = 20;
const PAD_WIDTH = SCREEN_WIDTH - PAD_PADDING * 2;

interface Props {
  onNumberPress: (num: number) => void;
  onErase: () => void;
}

function NumberGroup({ nums, onPress }: { nums: number[]; onPress: (n: number) => void }) {
  return (
    <View style={styles.pill}>
      {nums.map((n) => (
        <TouchableOpacity
          key={n}
          style={styles.numberButton}
          activeOpacity={0.5}
          onPress={() => onPress(n)}
        >
          <Text style={styles.numberText}>{n}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function NumberPad({ onNumberPress, onErase }: Props) {
  return (
    <View style={styles.container}>
      {/* Row 1: [1 2 3] + backspace */}
      <View style={styles.row}>
        <View style={styles.pillWrapper}>
          <NumberGroup nums={[1, 2, 3]} onPress={onNumberPress} />
        </View>
        <TouchableOpacity
          style={styles.backspaceButton}
          activeOpacity={0.5}
          onPress={onErase}
        >
          <MaterialIcons name="backspace" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Row 2: [4 5 6] full-width */}
      <NumberGroup nums={[4, 5, 6]} onPress={onNumberPress} />

      {/* Row 3: [7 8 9] full-width */}
      <NumberGroup nums={[7, 8, 9]} onPress={onNumberPress} />
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
  backspaceButton: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
