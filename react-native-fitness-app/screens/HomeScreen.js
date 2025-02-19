import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FitnessCards from "../components/FitnessCards";
import { FitnessItems } from "../Context";
import BottomNavigation from "./BottomNavigation";
import { Calendar } from "react-native-calendars";
import { auth } from '../firebase/config';
import { getUserStats, updateUserProgress } from '../services/userProgressService';
import { initializeAuth } from '../services/authService';

const HomeScreen = () => {
  const [showIcon, setShowIcon] = useState(false);
  const { calories, minutes, workout, setWorkoutHistory } =
    useContext(FitnessItems);

  // Sample workout history data
  const [workoutHistory, setWorkoutHistoryState] = useState([
    { date: "2025-01-01", workout: true },
    { date: "2025-01-02", workout: false },
    { date: "2025-01-03", workout: true },
  ]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeAuth();
        await loadWorkoutHistory();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();
  }, []);

  const loadWorkoutHistory = async () => {
    if (auth.currentUser) {
      try {
        const stats = await getUserStats(auth.currentUser.uid);
        console.log('Loaded stats:', stats); // Debug log
        if (stats && stats.lastWorkout) {
          setWorkoutHistoryState(prev => {
            const today = new Date().toISOString().split('T')[0];
            return [...prev, { date: today, workout: true }];
          });
        }
      } catch (error) {
        console.error('Error loading workout history:', error);
      }
    } else {
      console.log('No authenticated user'); // Debug log
    }
  };

  const markWorkoutDay = async () => {
    try {
      if (!auth.currentUser) {
        await initializeAuth();
      }
      
      const workoutData = {
        type: 'CHEST', // Change this based on actual workout type
        calories: 150,
        exercises: 5, // Update with actual number of exercises completed
        timestamp: new Date().toISOString(),
        muscleGroups: ['chest', 'arms'] // Add relevant muscle groups
      };

      console.log('Starting workout:', workoutData);
      
      const updatedStats = await updateUserProgress(auth.currentUser.uid, workoutData);
      console.log('Updated stats:', updatedStats);

      // Update calendar
      setWorkoutHistoryState(prev => {
        const today = new Date().toISOString().split('T')[0];
        return [...prev, { date: today, workout: true }];
      });

      // Force refresh stats display
      await loadWorkoutHistory();
      
    } catch (error) {
      console.error('Error in markWorkoutDay:', error);
    }
  };

  const markedDates = workoutHistory.reduce((acc, { date, workout }) => {
    if (date === today) {
      acc[date] = {
        selected: true,
        selectedColor: "rgba(0, 150, 136, 1)",
        marked: true,
        dotColor: "transparent",
      };
    } else if (workout) {
      acc[date] = {
        marked: true,
        dotColor: "orange",
      };
    } else {
      acc[date] = {
        marked: true,
        dotColor: "gray",
      };
    }
    return acc;
  }, {});

  // Calculate the streak dynamically based on workout history
  // Calculate the streak dynamically based on workout history
  const streak = (() => {
    let currentStreak = 0;
    let todayFound = false;

    // Start from the most recent day and check consecutive workout days
    for (let i = workoutHistory.length - 1; i >= 0; i--) {
      if (workoutHistory[i].date === today) {
        todayFound = true;
        if (workoutHistory[i].workout) {
          currentStreak++; // Count the streak if workout is done today
        }
        break;
      }
    }

    // If today is found, check for consecutive workout days before today
    if (todayFound) {
      for (let i = workoutHistory.length - 2; i >= 0; i--) {
        if (workoutHistory[i].workout) {
          currentStreak++; // Count the streak for consecutive days
        } else {
          break; // Stop if a day without a workout is found
        }
      }
    }

    return currentStreak;
  })();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <Text style={styles.ScreenText}>HOME</Text>
        {/* Grouped Icons Box Before Calendar */}
        <View style={styles.iconBox}>
          <View style={styles.iconCard}>
            <View style={styles.iconImageWrapper}>
              <Image
                source={require("../assets/medalist.png")}
                style={[styles.iconImage, { width: 24, height: 24 }]}
              />
              <View style={styles.circle}></View> {/* The small circle */}
            </View>
            <Text style={styles.iconText}>Badges</Text>
            <Text style={styles.iconCount}>5</Text>
          </View>

          <View style={styles.iconCard}>
            <View style={styles.iconImageWrapper}>
              <Image
                source={require("../assets/target.png")}
                style={[styles.iconImage, { width: 24, height: 24 }]}
              />
              <View style={styles.circle}></View> {/* The small circle */}
            </View>
            <Text style={styles.iconText}>Challenges</Text>
            <Text style={styles.iconCount}>3</Text>
          </View>

          <View style={styles.iconCard}>
            <View style={styles.iconImageWrapper}>
              <Image
                source={require("../assets/milestone.png")}
                style={[styles.iconImage, { width: 24, height: 24 }]}
              />
              <View style={styles.circle}></View> {/* The small circle */}
            </View>
            <Text style={styles.iconText}>Milestones</Text>
            <Text style={styles.iconCount}>10</Text>
          </View>
        </View>
        {/* Recommendation Section */}
        <Text style={styles.recommendedTitle}>Recommended for you</Text>
        <View style={styles.recommendationBox}>
          <View style={styles.recommendationTextBox}>
            <Text style={styles.recommendationTitle}>
              Full Body 7x4 Workout
            </Text>
            <Text style={styles.recommendationDescription}>
              This workout is designed to maximize your results in less time,
              making it the perfect addition to your routine!
            </Text>
          </View>

          <View style={styles.recommendationImageWrapper}>
            <Image
              source={require("../assets/workout-image.png")}
              style={styles.recommendationImage}
            />
          </View>

          <TouchableOpacity style={styles.startButton} onPress={markWorkoutDay}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarContainer}>
          <Text style={styles.calendarTitle}>Workout History</Text>

          <View style={styles.calendarBox}>
            <Calendar
              current={today}
              monthFormat={"yyyy MMMM"}
              theme={{
                todayTextColor: "orange",
                arrowColor: "black",
                monthTextColor: "black",
                textMonthFontWeight: "bold",
                textDayFontSize: 16,
              }}
              markedDates={markedDates}
              renderArrow={(direction) => (
                <Ionicons
                  name={
                    direction === "left" ? "chevron-back" : "chevron-forward"
                  }
                  size={24}
                  color="black"
                />
              )}
              renderHeader={(date) => {
                const monthNames = [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ];
                const monthYear = `${
                  monthNames[date.getMonth()]
                } ${date.getFullYear()}`;
                return <Text style={styles.calendarHeader}>{monthYear}</Text>;
              }}
            />

            {/* Streak Display */}
            <View style={styles.streakContainer}>
              <Text style={styles.streakText}>Daily Streak</Text>
              <View style={styles.streakIconCountGroup}>
                <Ionicons name="flame" size={30} color="orange" />
                <Text style={styles.streakCount}>{streak}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8", // Background color for the entire screen
  },
  ScreenText: {
    margin: 20,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 0,
  },
  scrollView: {
    marginBottom: 90, // Add margin at the bottom to avoid overlapping with the BottomNavigation
  },
  header: {
    backgroundColor: "#000000d7",
    paddingTop: 40,
    paddingHorizontal: 20,
    height: 160,
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 50,
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  cardsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  shadowCards: {
    backgroundColor: "#ffffff",
    width: "32%",
    height: 80,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  iconBox: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconCard: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 14,
  },
  iconCount: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "bold",
  },
  imageWrapper: {
    position: "relative", // Needed to position the circle inside the image wrapper
    alignItems: "center",
    justifyContent: "center",
  },

  circle: {
    position: "absolute",
    bottom: 0, // Adjust this to position the circle closer or further
    right: 0, // Adjust this for the desired distance from the bottom-right corner
    width: 12,
    height: 12,
    borderRadius: 12, // Make it circular
    backgroundColor: "rgba(115, 236, 139, 0.8)", // You can choose the color
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    margin: 20,
    marginTop: 0,
    marginBottom: 0,
  },
  recommendationBox: {
    backgroundColor: "#15b392",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "column", // Stack children vertically
    alignItems: "flex-start", // Align children to the start (left)
    position: "relative",
    overflow: "visible", // Allow image to overflow outside the box at the top
  },
  recommendationTextBox: {
    flex: 1,
    justifyContent: "space-between", // Ensure the button is pushed to the bottom
    zIndex: 2,
    width: "100%", // Ensure it takes up the full width of the container
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    width: 150,
    marginBottom: 12,
  },
  recommendationDescription: {
    fontSize: 13,
    color: "white",
  },
  recommendationImageWrapper: {
    width: 180, // Larger size to make the image exceed the container
    height: 230,
    position: "absolute",
    right: -10, // Align it to the right edge
    bottom: 0, // Position it so that the bottom of the image is aligned with the bottom of the container
    top: -40, // Allow the image to overflow at the top
    zIndex: 1,
  },
  recommendationImage: {
    position: "absolute",
    right: -20, // Align it to the right edge
    bottom: 0, // Position it so that the bottom of the image is aligned with the bottom of the container
    top: 12,
    width: "100%",
    height: 230,
    resizeMode: "cover",
  },
  startButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: "center",
    width: "50%", // Make sure the button spans the full width
    marginTop: 12, // Ensure some space between description and button
    zIndex: 2,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  calendarBox: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
  },
  calendarHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginVertical: 10,
  },
  streakContainer: {
    marginTop: 20,
  },
  streakText: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  streakIconCountGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "left",
  },
  streakCount: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 14,
  },
});

export default HomeScreen;
