import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import BottomNavigation from "./BottomNavigation"; // Import the BottomNavigation component
import achievements from "../data/achievementsData"; // Import the achievements data
import milestones from "../data/milestonesData"; // Import the milestones data

const { width } = Dimensions.get("window"); // Get the screen width

const AchievementsScreen = () => {
  const [activeTab, setActiveTab] = useState("achievements"); // State to manage the active tab
  const linePosition = useRef(new Animated.Value(0)).current; // Animated value for the green line position

  // Function to handle tab press and animate the green line
  const handleTabPress = (tab, index) => {
    setActiveTab(tab);
    Animated.timing(linePosition, {
      toValue: index * (width / 2), // Move the line to the position of the active tab
      duration: 300, // Animation duration
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Track your <Text style={styles.spanText}>Progress</Text>
      </Text>

      {/* Top Navigation Bar */}
      <View style={styles.topNavigation}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "achievements"
              ? styles.activeTab
              : styles.inactiveTab,
          ]}
          onPress={() => handleTabPress("achievements", 0)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "achievements" && styles.activeTabText,
            ]}
          >
            Achievements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "milestones" ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => handleTabPress("milestones", 1)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "milestones" && styles.activeTabText,
            ]}
          >
            Milestones
          </Text>
        </TouchableOpacity>

        {/* Green Line */}
        <Animated.View
          style={[
            styles.greenLine,
            {
              transform: [{ translateX: linePosition }], // Animate the line's position
            },
          ]}
        />
      </View>

      {/* Scrollable list of achievements or milestones */}
      <ScrollView style={styles.achievementsList}>
        {activeTab === "achievements"
          ? achievements.map((achievement) => (
              <View key={achievement.id} style={styles.itemContainer}>
                {/* Image on the Left */}
                <View style={styles.imageContainer}>
                  <Image source={achievement.image} style={styles.image} />
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                  <Text style={styles.itemName}>{achievement.name}</Text>
                  <Text style={styles.itemDescription}>
                    {achievement.description}
                  </Text>
                </View>

                {/* Progress Bar and Count */}
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>2/10</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${20}%` }]} // Example: 20% progress
                    />
                  </View>
                </View>
              </View>
            ))
          : milestones.map((milestone) => (
              <View key={milestone.id} style={styles.itemContainer}>
                {/* Image on the Left */}
                <View style={styles.imageContainer}>
                  <Image source={milestone.image} style={styles.image} />
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                  <Text style={styles.itemName}>{milestone.name}</Text>
                  <Text style={styles.itemDescription}>
                    {milestone.description}
                  </Text>
                </View>

                {/* Progress Bar and Count */}
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>2/10</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${20}%` }]} // Example: 20% progress
                    />
                  </View>
                </View>
              </View>
            ))}
      </ScrollView>

      {/* Render the BottomNavigation at the bottom of the screen */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Align content at the top, leaving space for the bottom navigation
    alignItems: "center",
    paddingBottom: 140, // Make space at the bottom for the BottomNavigation component
    backgroundColor: "#fff",
  },
  header: {
    width: 200,
    fontSize: 32,
    fontWeight: "bold",
    margin: 20,
  },
  spanText: {
    color: "#15B392", // Color for "Exercise"
  },
  topNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
    position: "relative", // Needed for the green line positioning
  },
  tab: {
    padding: 10,
    width: "50%", // Each tab takes half the width
    alignItems: "center",
  },
  inactiveTab: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.07)",
    borderColor: "rgba(0, 0, 0, 0.05)",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    elevation: 2,
  },
  activeTab: {
    // No shadow for active tab
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#15B392", // Highlight the active tab text
    fontWeight: "bold",
  },
  greenLine: {
    position: "absolute",
    left: 0,
    bottom: 0,
    height: 2,
    width: "50%", // Matches the width of a single tab
    backgroundColor: "#15B392",
  },
  achievementsList: {
    width: "100%",
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff", // White background
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000", // Box shadow
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2, // For Android
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#73EC8B", // Background color for the image container
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10, // Add some spacing between image and text
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 13,
    color: "#666",
  },
  progressContainer: {
    alignItems: "flex-end",
  },
  progressText: {
    fontSize: 14,
    color: "#15B392",
    fontWeight: "bold",
    marginBottom: 5,
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#15B392",
    borderRadius: 3,
  },
});

export default AchievementsScreen;
