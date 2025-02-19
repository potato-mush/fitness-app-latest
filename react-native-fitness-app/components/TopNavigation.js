// ../components/TopNavigation.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TopNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 1, label: "Living Room" },
    { id: 2, label: "Bed Room" },
    { id: 3, label: "Dining\nArea" }, // Multi-line text
    { id: 4, label: "Status" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        // Remove newline characters for comparison
        const tabLabel = tab.label.replace("\n", " ");

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tabLabel && styles.activeTab,
            ]}
            onPress={() => {
              console.log("Pressed:", tabLabel); // Debugging
              setActiveTab(tabLabel);
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tabLabel && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
  },
  tab: {
    width: "23%", // Each tab takes up 23% of the width
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Default background color
    borderRadius: 10, // Rounded corners
    borderWidth: 1, // Border for the box
    borderColor: "#ddd", // Border color
  },
  activeTab: {
    backgroundColor: "#15B392", // Active tab background color
    borderColor: "#15B392", // Active tab border color
  },
  tabText: {
    fontSize: 14,
    color: "#666", // Default text color
    textAlign: "center",
  },
  activeTabText: {
    color: "#fff", // Active tab text color
    fontWeight: "bold",
  },
});

export default TopNavigation;