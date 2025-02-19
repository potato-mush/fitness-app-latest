import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [circlePosition] = useState(new Animated.Value(0)); // This controls the circle position
  const [iconPosition] = useState(new Animated.Value(0)); // This controls icon bounce
  const navigation = useNavigation();

  // Update activeTab when screen is focused
  useFocusEffect(
    useCallback(() => {
      const currentScreen =
        navigation.getState().routes[navigation.getState().index].name;
      // Only update activeTab if it's not the same as the current tab
      if (activeTab !== currentScreen.toLowerCase()) {
        setActiveTab(currentScreen.toLowerCase());
      }
    }, [navigation, activeTab])
  );

  useEffect(() => {
    // Animate the circle position based on activeTab
    Animated.spring(circlePosition, {
      toValue:
        activeTab === "home"
          ? 0
          : activeTab === "achievements"
          ? 1
          : activeTab === "training"
          ? 2
          : activeTab === "avatar"
          ? 3
          : activeTab === "settings"
          ? 4
          : 0,
      useNativeDriver: true,
      speed: 10,
    }).start();

    // Optional: Animate icon position with a bounce effect
    Animated.spring(iconPosition, {
      toValue: activeTab ? -18 : 0,
      useNativeDriver: true,
    }).start();
  }, [activeTab, circlePosition, iconPosition]);

  const handlePress = (tab, screen) => {
    setActiveTab(tab); // Set the active tab
    navigation.navigate(screen); // Navigate to the screen
  };

  return (
    <View style={styles.navContainer}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [
              {
                translateX: circlePosition.interpolate({
                  inputRange: [0, 1, 2, 3, 4],
                  outputRange: [6, 73, 140, 207, 272], // Adjust positions accordingly
                }),
              },
            ],
          },
        ]}
      />

      {["home", "achievements", "training", "avatar", "settings"].map(
        (tab, index) => {
          const iconNames = {
            home: "home",
            achievements: "trophy",
            training: "fitness",
            avatar: "person",
            settings: "person-circle",
          };

          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.navItem,
                activeTab === tab && styles.activeNavItem,
              ]}
              onPress={() =>
                handlePress(tab, tab.charAt(0).toUpperCase() + tab.slice(1))
              }
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      translateY: activeTab === tab ? iconPosition : 0,
                    },
                  ],
                }}
              >
                <Ionicons
                  name={iconNames[tab]}
                  size={24}
                  color={activeTab === tab ? "#FFFFFF" : "#15B392"}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        }
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "white",
    height: 75,
    borderRadius: 50,
    position: "absolute", // Makes it fixed
    bottom: 40, // Adjust position from the bottom
    left: 10,
    right: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10, // Ensure it stays above other components
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
    width: width / 6,
    height: 60,
    borderRadius: 30,
  },
  activeNavItem: {
    backgroundColor: "transparent",
  },
  circle: {
    position: "absolute",
    top: -10,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#15B392",
    zIndex: -1,
  },
});

export default BottomNavigation;
