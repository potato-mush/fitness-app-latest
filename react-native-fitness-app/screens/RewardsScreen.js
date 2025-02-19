import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ConfettiPiece = ({ startPosition }) => {
  const animatedValue = new Animated.Value(0);
  const [color] = useState(
    ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][
      Math.floor(Math.random() * 5)
    ]
  );

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.7],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (Math.random() - 0.5) * 200],
  });

  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${Math.random() * 360}deg`],
  });

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          backgroundColor: color,
          transform: [
            { translateX },
            { translateY },
            { rotate },
          ],
          left: startPosition,
        },
      ]}
    />
  );
};

const RewardsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { completedExercises = 0, caloriesBurned = 0 } = route.params || {};
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);
  const [confetti] = useState(Array(30).fill(0)); // Increased number of confetti pieces

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {confetti.map((_, index) => (
        <ConfettiPiece
          key={index}
          startPosition={Math.random() * width}
        />
      ))}
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Text style={styles.congratsText}>🎉 Congratulations! 🎉</Text>
        <Text style={styles.achievementText}>Workout Complete!</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Exercises Completed: {completedExercises}</Text>
          <Text style={styles.statsText}>Calories Burned: {Number(caloriesBurned).toFixed(1)}</Text>
          <Text style={styles.bonusText}>+50 XP Earned!</Text>
        </View>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  achievementText: {
    fontSize: 24,
    color: '#32CD32',
    marginBottom: 20,
  },
  statsContainer: {
    backgroundColor: '#2c2c2e',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  statsText: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 10,
  },
  confettiPiece: {
    position: 'absolute',
    top: -20,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#32CD32',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bonusText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default RewardsScreen;
