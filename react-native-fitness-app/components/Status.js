import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { auth } from "../firebase/config";
import { getUserStats } from "../services/userProgressService";
import { FitnessItems } from "../Context";

const Status = () => {
  const { workout } = useContext(FitnessItems);
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    xpMax: 1000,
    stamina: 100,
    staminaMax: 100,
    chest: 0,
    arms: 0,
    abs: 0,
    legs: 0,
    back: 0,
    totalCalories: 0,
    totalExercises: 0,
    coins: 0, // Add coins to initial state
  });

  useEffect(() => {
    const loadUserStats = async () => {
      if (auth.currentUser) {
        try {
          const stats = await getUserStats(auth.currentUser.uid);
          if (stats) {
            setUserStats(stats);
            console.log("Updated stats loaded:", stats);
          }
        } catch (error) {
          console.error("Error loading user stats:", error);
        }
      }
    };

    loadUserStats();
  }, [workout]);

  return (
    <ScrollView style={styles.container}>
      {/* First Row: Level, XP, Stamina, and Coins */}
      <View style={styles.centerRow}>
        <Text style={styles.levelText}>Level {userStats.level}</Text>
      </View>

      {/* Add Coins Display */}

      <View style={styles.xpContainer}>
        <Text style={styles.xpText}>XP</Text>
        <View style={styles.xpBar}>
          <View
            style={[
              styles.xpFill,
              { width: `${(userStats.xp / userStats.xpMax) * 100}%` },
            ]}
          />
        </View>
      </View>
      <View style={styles.staminaContainer}>
        <Image
          source={require("../assets/status/flash.png")}
          style={styles.staminaIcon}
        />
        <View style={styles.staminaBar}>
          <View
            style={[
              styles.staminaFill,
              {
                width: `${(userStats.stamina / userStats.staminaMax) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.coinsContainer}>
        <Image
          source={require("../assets/avatar/coins.png")}
          style={styles.coinsIcon}
        />
        <Text style={styles.coinsText}>{userStats.coins}</Text>
      </View>
      {/* Divider */}
      <View style={styles.divider} />
      {/* Second Row: Stats - chest, arms, abs, legs, back */}
      <View style={styles.row}>
        <View style={styles.column}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/status/chest.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>{userStats.chest}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/status/arm.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>{userStats.arms}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/status/abs.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>{userStats.abs}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/status/leg.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>{userStats.legs}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/status/back.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>{userStats.back}</Text>
          </View>
        </View>
      </View>
      {/* Divider */}
      <View style={styles.divider} />
      {/* Third Row: Stats - duration, calories, exercises in two columns */}
      <View style={styles.row}>
        <View style={styles.column}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/status/calories.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>
              {Number(userStats.totalCalories).toFixed(1)}
            </Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/status/chronometer.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>{userStats.duration}</Text>
          </View>
        </View>
      </View>
      {/* Last Row (still in two columns) */}
      <View style={styles.row}>
        <View style={styles.column}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/status/fitness.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>{userStats.totalExercises}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
    paddingHorizontal: 16,
  },
  centerRow: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  centerColumn: {
    alignItems: "flex-start", // Align XP bar and stamina to the left
    width: "100%", // Ensure it takes up full width
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  levelText: {
    fontSize: 24, // Larger font size for the level
    fontWeight: "bold", // Optional: Make the level text bold
    color: "#333", // You can change this color if needed
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginVertical: 4,
  },
  staminaIcon: {
    width: 25,
    height: 25,
    marginHorizontal: 4,
  },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginVertical: 8,
  },
  xpText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
    marginHorizontal: 8,
  },
  xpBar: {
    height: 10,
    width: "90%", // Set to full width
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 8,
  },
  xpFill: {
    height: "90%",
    backgroundColor: "#4caf50",
    borderRadius: 5,
  },
  staminaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    width: "90%", // Set to full width
  },
  staminaBar: {
    height: 10,
    width: "90%", // Set to full width
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginLeft: 8,
  },
  staminaFill: {
    height: "90%",
    backgroundColor: "#ff9800",
    borderRadius: 5,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 16,
  },
  coinsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    padding: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  coinsIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  coinsText: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Status;
