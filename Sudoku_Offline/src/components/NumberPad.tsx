import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CONTAINER_MAX_WIDTH = 400;
const ACTUAL_WIDTH = Math.min(SCREEN_WIDTH - 32, CONTAINER_MAX_WIDTH);

interface Props {
  onNumberPress: (num: number) => void;
  onErase: () => void;
}

export default function NumberPad({ onNumberPress, onErase }: Props) {
  const Group = ({ nums }: { nums: number[] }) => (
    <View style={styles.group}>
      {nums.map((n) => (
        <TouchableOpacity
          key={n}
          style={styles.numberButton}
          activeOpacity={0.6}
          onPress={() => onNumberPress(n)}
        >
          <Text style={styles.numberText}>{n}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.groupWrapper}>
          <Group nums={[1, 2, 3]} />
        </View>
        <TouchableOpacity style={styles.backspaceButton} activeOpacity={0.6} onPress={onErase}>
          <MaterialIcons name="backspace" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Group nums={[4, 5, 6]} />
      </View>

      <View style={styles.row}>
        <Group nums={[7, 8, 9]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ACTUAL_WIDTH,
    marginTop: 40,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  groupWrapper: {
    flex: 4,
  },
  group: {
    flexDirection: "row",
    height: 64,
    backgroundColor: "rgba(26, 26, 26, 0.05)",
    borderRadius: 32,
    overflow: "hidden",
    flex: 1,
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
  },
  backspaceButton: {
    flex: 1,
    height: 64,
    backgroundColor: "rgba(26, 26, 26, 0.05)",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
