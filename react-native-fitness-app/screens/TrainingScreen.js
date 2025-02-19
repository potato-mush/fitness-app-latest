import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import FitnessCards from "../components/FitnessCards"; // Assuming you have a FitnessCards component for displaying exercises
import fitnessData from "../data/fitness"; // Assuming fitness.js is in the data folder
import BottomNavigation from "./BottomNavigation"; // Import the BottomNavigation component

const TrainingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Select an <Text style={styles.exerciseText}>Exercise</Text>
      </Text>
      
      {/* List of workouts */}
      <ScrollView style={styles.workoutContainer}>
        {fitnessData.map((workout) => (
          <FitnessCards key={workout.id} workout={workout} />
        ))}
      </ScrollView>

      {/* Bottom Navigation Component */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    width: 150,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  exerciseText: {
    color: "#15B392", // Color for "Exercise"
  },
  workoutContainer: {
    flex: 1,
    marginBottom: 120,
  },
});

export default TrainingScreen;
