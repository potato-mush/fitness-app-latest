import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import BottomNavigation from "./BottomNavigation"; // Import BottomNavigation
import TopNavigation from "../components/TopNavigation"; // Import TopNavigation
import LivingRoom from "../components/LivingRoom"; // Import LivingRoom component
import Bedroom from "../components/Bedroom"; // Import Bedroom component
import DiningArea from "../components/DiningArea"; // Import DiningArea component
import Status from "../components/Status"; // Import Status component

const AvatarScreen = () => {
  const [activeTab, setActiveTab] = useState("Living Room"); // State to manage the active tab

  // Function to render the active screen based on the selected tab
  const renderScreen = () => {
    switch (activeTab) {
      case "Living Room":
        return <LivingRoom />;
      case "Bed Room":
        return <Bedroom />;
      case "Dining Area":
        return <DiningArea />;
      case "Status":
        return <Status />;
      default:
        return <LivingRoom />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <TopNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Render the active screen */}
      {renderScreen()}

      {/* Render the BottomNavigation at the bottom of the screen */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // Content starts at the top of the screen
    // Remove alignItems: "center" to avoid centering the content
    paddingBottom: 80, // Space at the bottom for BottomNavigation
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20, // Margin for spacing
  },
});

export default AvatarScreen;
