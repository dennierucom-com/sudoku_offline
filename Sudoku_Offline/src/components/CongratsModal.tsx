import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface CongratsModalProps {
  visible: boolean;
  time: string;
  onHome: () => void;
  onNewGame: () => void;
}

const { width } = Dimensions.get("window");

const CongratsModal: React.FC<CongratsModalProps> = ({
  visible,
  time,
  onHome,
  onNewGame,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="emoji-events" size={60} color="#FFD700" />
          </View>

          <Text style={styles.title}>Congrats!</Text>
          <Text style={styles.message}>
            You've successfully solved the puzzle!
          </Text>

          <View style={styles.statsRow}>
            <MaterialIcons name="schedule" size={18} color="#94A3B8" />
            <Text style={styles.timeLabel}>Time Taken:</Text>
            <Text style={styles.timeValue}>{time}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.newGameButton} onPress={onNewGame}>
              <Text style={styles.newGameButtonText}>New Game</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.homeButton} onPress={onHome}>
              <MaterialIcons name="home" size={20} color="#1978e5" />
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    width: Math.min(width - 48, 400),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 32,
    gap: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  timeValue: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "700",
    fontFamily: "monospace",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  newGameButton: {
    backgroundColor: "#1978e5",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#1978e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  newGameButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  homeButton: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: "rgba(25, 120, 229, 0.2)",
    gap: 8,
  },
  homeButtonText: {
    color: "#1978e5",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default CongratsModal;
