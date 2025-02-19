import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For sun and moon icons

const Bedroom = () => {
  const [isAsleep, setIsAsleep] = useState(false); // State to manage sleep/wake

  // Function to toggle sleep/wake state
  const toggleSleep = () => {
    setIsAsleep((prev) => !prev); // This line toggles the state between 'true' and 'false'
  };

  return (
    <View style={styles.container}>
      {/* Bed Image */}
      <Image
        source={require("../assets/avatar/bed.png")}
        style={styles.bedImage}
      />

      {/* Blanket Image */}
      <Image
        source={require("../assets/avatar/blanket.png")}
        style={styles.blanketImage}
      />

      {/* Avatar Image (Asleep or Awake) */}
      <Image
        source={
          isAsleep
            ? require("../assets/avatar/Asleep.png")
            : require("../assets/avatar/Awake.png")
        }
        style={styles.avatarImage}
      />

      {/* Toggle Button (Sun/Moon) */}
      <TouchableOpacity style={styles.toggleButton} onPress={toggleSleep}>
        <Ionicons
          name={isAsleep ? "moon" : "sunny"}
          size={28} // Increased icon size for better visibility
          color={isAsleep ? "#000" : "#FFD700"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative", // Needed for zIndex to work
    backgroundColor: "#f0f0f0", // Background color for the bedroom
    alignItems: "center", // Center the content horizontally
    justifyContent: "flex-start", // Start the content from the top
    paddingBottom: 50, // Space at the bottom for BottomNavigation (if needed)
  },
  bedImage: {
    width: "100%", // Bed takes up the full width of the screen
    height: "100%", // Bed height is 50% of the screen
    resizeMode: "contain",
    position: "absolute", // Position the bed absolutely
    bottom: 0, // Position the bed at the bottom of the screen
    zIndex: 1, // Bed is at the bottom layer
  },
  blanketImage: {
    width: "100%", // Blanket takes up the full width of the screen
    height: "100%", // Blanket height is 50% of the screen
    resizeMode: "contain",
    position: "absolute", // Position the blanket absolutely
    bottom: 0, // Position the blanket slightly above the bed
    zIndex: 3, // Blanket is above the bed
  },
  avatarImage: {
    width: "35%", // Avatar takes up 35% of the screen width
    height: "35%", // Avatar takes up 35% of the screen height
    resizeMode: "contain",
    position: "absolute", // Position the avatar absolutely
    top: "13%", // Position the avatar just above the blanket
    left: "32%", // Center the avatar horizontally
    zIndex: 2, // Avatar is on top
  },
  toggleButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Higher elevation to ensure it is above other elements
    zIndex: 4, // Ensure it's above all images (bed, blanket, avatar)
  },
});

export default Bedroom;
