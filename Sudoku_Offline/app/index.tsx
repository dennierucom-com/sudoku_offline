import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import { loadGameState, hasSavedGame, GameState } from "../src/utils/storage";

const COLORS = {
  primary: "#1978e5",
  charcoal: "#1A1A1A",
  backgroundLight: "#F6F7F8",
  white: "#FFFFFF",
  slate400: "#94A3B8",
  slate100: "#F1F5F9",
  emerald600: "#059669",
  emerald100: "#D1FAE5",
  amber600: "#D97706",
  amber100: "#FEF3C7",
  rose600: "#E11D48",
  rose100: "#FFE4E6",
};

export default function Home() {
  const router = useRouter();
  const [savedGame, setSavedGame] = React.useState<GameState | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const state = loadGameState();
      setSavedGame(state);
    }, []),
  );

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateProgress = (board: number[][], puzzle: number[][]) => {
    let filled = 0;
    let total = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (puzzle[r][c] === 0) {
          total++;
          if (board[r][c] !== 0) filled++;
        }
      }
    }
    return total === 0 ? 0 : Math.round((filled / total) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.iconContainer}>
              <MaterialIcons
                name="grid-view"
                size={24}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.headerTitle}>Sudoku</Text>
          </View>
        </View>

        {/* Primary Action: New Game */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.newGameButton}
            onPress={() =>
              router.push({ pathname: "/game", params: { newGame: "true" } })
            }
          >
            <MaterialIcons name="add-circle" size={24} color={COLORS.white} />
            <Text style={styles.newGameButtonText}>New Game</Text>
          </TouchableOpacity>
        </View>

        {/* Resume Section */}
        {savedGame && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONTINUE PLAYING</Text>
            <TouchableOpacity
              style={styles.resumeCard}
              onPress={() => router.push("/game")}
            >
              {/* Mini Grid Preview */}
              <View style={styles.miniGrid}>
                {[0, 1, 2].map((row) => (
                  <View key={row} style={styles.miniGridRow}>
                    {[0, 1, 2].map((col) => {
                      const val = savedGame.board[row][col];
                      return (
                        <View key={col} style={styles.miniCell}>
                          {val !== 0 && (
                            <Text
                              style={[
                                styles.miniCellText,
                                {
                                  color:
                                    savedGame.puzzle[row][col] !== 0
                                      ? COLORS.charcoal
                                      : COLORS.primary,
                                },
                              ]}
                            >
                              {val}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
              <View style={styles.resumeInfo}>
                <Text style={styles.percentComplete}>
                  {calculateProgress(savedGame.board, savedGame.puzzle)}%
                  Complete
                </Text>
                <Text style={styles.elapsedTime}>
                  {formatTime(savedGame.seconds)}{" "}
                  <Text style={styles.elapsedLabel}>elapsed</Text>
                </Text>
                <View style={styles.resumeLink}>
                  <Text style={styles.resumeLinkText}>Resume Game</Text>
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={12}
                    color={COLORS.primary}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Local Saves List */}
        <View style={styles.section}>
          <View style={styles.savesHeader}>
            <Text style={styles.sectionTitle}>LOCAL SAVES</Text>
            <View style={styles.slotsBadge}>
              <Text style={styles.slotsBadgeText}>10 SLOTS</Text>
            </View>
          </View>

          <View style={styles.saveCard}>
            <View>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: COLORS.emerald100 },
                ]}
              >
                <Text
                  style={[styles.difficultyText, { color: COLORS.emerald600 }]}
                >
                  EASY
                </Text>
              </View>
              <View style={styles.saveTimeContainer}>
                <MaterialIcons
                  name="schedule"
                  size={14}
                  color={COLORS.slate400}
                />
                <Text style={styles.saveTime}>04:20</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.resumeButtonSmall}>
              <Text style={styles.resumeButtonSmallText}>Resume</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.saveCard}>
            <View>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: COLORS.amber100 },
                ]}
              >
                <Text
                  style={[styles.difficultyText, { color: COLORS.amber600 }]}
                >
                  MEDIUM
                </Text>
              </View>
              <View style={styles.saveTimeContainer}>
                <MaterialIcons
                  name="schedule"
                  size={14}
                  color={COLORS.slate400}
                />
                <Text style={styles.saveTime}>08:15</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.resumeButtonSmall}>
              <Text style={styles.resumeButtonSmallText}>Resume</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.saveCard}>
            <View>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: COLORS.rose100 },
                ]}
              >
                <Text
                  style={[styles.difficultyText, { color: COLORS.rose600 }]}
                >
                  HARD
                </Text>
              </View>
              <View style={styles.saveTimeContainer}>
                <MaterialIcons
                  name="schedule"
                  size={14}
                  color={COLORS.slate400}
                />
                <Text style={styles.saveTime}>15:50</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.resumeButtonSmall}>
              <Text style={styles.resumeButtonSmallText}>Resume</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.scrollNote}>Scroll down to view more saves</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={24} color={COLORS.primary} />
          <Text style={[styles.navText, { color: COLORS.primary }]}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="bar-chart" size={24} color={COLORS.slate400} />
          <Text style={styles.navText}>STATS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="settings" size={24} color={COLORS.slate400} />
          <Text style={styles.navText}>SETTINGS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    backgroundColor: "rgba(25, 120, 229, 0.1)",
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.charcoal,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  newGameButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 32,
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  newGameButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.slate400,
    letterSpacing: 1.2,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  resumeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    borderWidth: 1,
    borderColor: COLORS.slate100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  miniGrid: {
    width: 96,
    height: 96,
    backgroundColor: COLORS.slate100,
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  miniGridRow: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
  },
  miniCell: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  miniCellText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
  },
  resumeInfo: {
    flex: 1,
    gap: 4,
  },
  percentComplete: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.slate400,
  },
  elapsedTime: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.charcoal,
  },
  elapsedLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: COLORS.slate400,
  },
  resumeLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  resumeLinkText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  savesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  slotsBadge: {
    backgroundColor: COLORS.slate100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  slotsBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.slate400,
  },
  saveCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.slate100,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "800",
  },
  saveTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  saveTime: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.charcoal,
  },
  resumeButtonSmall: {
    backgroundColor: "rgba(25, 120, 229, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resumeButtonSmallText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  scrollNote: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.slate400,
    fontWeight: "600",
    marginTop: 8,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.slate100,
    paddingBottom: 20,
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.slate400,
  },
});
