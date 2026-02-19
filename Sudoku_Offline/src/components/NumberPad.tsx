import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  onNumberPress: (num: number) => void;
  onErase: () => void;
}

export default function NumberPad({ onNumberPress, onErase }: Props) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {numbers.map((n) => (
          <TouchableOpacity
            key={n}
            style={styles.button}
            activeOpacity={0.6}
            onPress={() => onNumberPress(n)}
          >
            <Text style={styles.buttonText}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, styles.eraseButton]}
        activeOpacity={0.6}
        onPress={onErase}
      >
        <Text style={[styles.buttonText, styles.eraseText]}>Erase</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    gap: 6,
  },
  button: {
    width: 36,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#e3f2fd",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1565c0",
  },
  eraseButton: {
    width: 80,
    backgroundColor: "#ffebee",
  },
  eraseText: {
    color: "#c62828",
    fontSize: 14,
  },
});
