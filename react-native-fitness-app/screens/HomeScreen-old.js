import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FitnessCards from '../components/FitnessCards'; // Assuming you have a custom component for cards
import { FitnessItems } from '../Context'; // Assuming you have a context to manage fitness data
import BottomNavigation from './Navigation'; // Import the BottomNavigation component

const HomeScreen = () => {
  const [showIcon, setShowIcon] = useState(false); // Dark Mode Toggle
  const { calories, minutes, workout } = useContext(FitnessItems); // Context for fitness data

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>SIX PACK IN 30 DAYS</Text>

            {/* Dark Mode Toggle */}
            <TouchableOpacity onPress={() => setShowIcon(!showIcon)}>
              {showIcon ? (
                <Ionicons name="sunny" size={24} color="white" />
              ) : (
                <Ionicons name="moon" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {/* Fitness Cards Row */}
          <View style={styles.cardsRow}>
            {/* Calories Card */}
            <View style={styles.shadowCards}>
              <Text style={styles.cardTitle}>{calories.toFixed(2)}</Text>
              <Text>KCAL</Text>
            </View>

            {/* Workouts Card */}
            <View style={styles.shadowCards}>
              <Text style={styles.cardTitle}>{workout}</Text>
              <Text>WORKOUTS</Text>
            </View>

            {/* Minutes Card */}
            <View style={styles.shadowCards}>
              <Text style={styles.cardTitle}>{minutes}</Text>
              <Text>MINUTES</Text>
            </View>
          </View>
        </View>

        {/* Fitness Cards Section */}
        <FitnessCards />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Background color for the entire screen
  },
  scrollView: {
    marginTop: 20,
    marginBottom: 90, // Add margin at the bottom to avoid overlapping with the BottomNavigation
  },
  header: {
    backgroundColor: '#000000d7',
    paddingTop: 40,
    paddingHorizontal: 20,
    height: 160,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  shadowCards: {
    backgroundColor: '#ffffff',
    width: '32%',
    height: 80,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 20, // Adjust to set the desired bottom offset
    left: 0,
    right: 0,
    zIndex: 10, // Ensure it stays above other elements
  },
});

export default HomeScreen;
