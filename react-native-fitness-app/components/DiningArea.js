import React, { useState, useEffect } from "react";
import {
  PanResponder,
  Animated,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Store from "./Store"; // Import the Store component
import { FOOD_STATS } from '../constants/gameConstants';
import { auth } from '../firebase/config';
import { getUserStats, updateUserProgress } from '../services/userProgressService';

const CustomDraggable = ({ children, onDragRelease, disabled }) => {
  const [pan] = useState(new Animated.ValueXY());

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled, // Disable dragging if `disabled` is true
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gestureState) => {
      onDragRelease(e, gestureState, {
        left: gestureState.moveX,
        top: gestureState.moveY,
      });
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[pan.getLayout(), styles.draggable, { zIndex: 2 }]} // Ensure draggable items are on top
    >
      {children}
    </Animated.View>
  );
};

const DiningArea = () => {
  const [foodCounts, setFoodCounts] = useState({});
  const [isStoreOpen, setIsStoreOpen] = useState(false); // Store visibility toggle
  const [userStats, setUserStats] = useState({ stamina: 0, coins: 0 });

  // Define fixed food order
  const foodOrder = ['energyDrink', 'apple', 'friedEgg', 'chickenLeg'];

  useEffect(() => {
    loadUserStats();
  }, [isStoreOpen]); // Reload stats when store closes

  const loadUserStats = async () => {
    if (auth.currentUser) {
      try {
        const stats = await getUserStats(auth.currentUser.uid);
        console.log('Loaded user stats:', stats); // Debug log
        if (stats) {
          setUserStats(stats);
          setFoodCounts(stats.inventory || {});
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
  };

  const handleStoreToggle = () => {
    setIsStoreOpen(!isStoreOpen); // Toggle store visibility
  };

  const handleDrop = async (food) => {
    // Check if stamina is already at max
    if (userStats.stamina >= 100) {
      Alert.alert('Stamina Full!', 'Your avatar is already at full stamina');
      return;
    }

    if (foodCounts[food] > 0) {
      try {
        const newStamina = Math.min(100, userStats.stamina + FOOD_STATS[food].staminaGain);
        
        if (newStamina > userStats.stamina) {
          // Update stamina and inventory in Firebase
          const updatedStats = await updateUserProgress(auth.currentUser.uid, {
            stamina: newStamina,
            inventory: {
              [food]: foodCounts[food] - 1
            }
          });
          
          setUserStats(updatedStats);
          setFoodCounts(updatedStats.inventory);
          
          Alert.alert(
            'Stamina Restored!',
            `+${FOOD_STATS[food].staminaGain} Stamina`
          );
        } else {
          Alert.alert('Stamina Full!', 'Your avatar cannot gain any more stamina');
        }
      } catch (error) {
        console.error('Error updating stats:', error);
      }
    } else {
      Alert.alert('No more food left!');
    }
  };

  const foodImages = {
    energyDrink: require("../assets/avatar/energy-drink.png"),
    apple: require("../assets/avatar/apple.png"),
    friedEgg: require("../assets/avatar/fried-egg.png"),
    chickenLeg: require("../assets/avatar/chicken-leg.png"),
  };

  return (
    <View style={styles.container}>
      {/* Top Stats Bar - Only display coins and store button */}
      <View style={styles.statsContainer}>
        <View style={styles.coinContainer}>
          <Image source={require("../assets/avatar/coins.png")} style={styles.icon} />
          <Text style={styles.coinText}>{userStats.coins}</Text>
        </View>
        <TouchableOpacity
          style={styles.storeButton}
          onPress={handleStoreToggle}
        >
          <Image
            source={require("../assets/avatar/cart.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Stamina Display */}
      <View style={styles.staminaRow}>
        <View style={styles.staminaContainer}>
          <Image source={require("../assets/status/flash.png")} style={styles.icon} />
          <Text style={styles.staminaText}>{userStats.stamina}/100</Text>
        </View>
      </View>

      {/* Food Row with Draggable Items */}
      <View style={styles.foodRow}>
        {foodOrder.map((food) => (
          <View key={food} style={styles.foodContainer}>
            <CustomDraggable
              onDragRelease={(event, gestureState, bounds) => {
                // Check if the food is dropped in the avatar area
                if (
                  bounds.left > 100 &&
                  bounds.top > 400 &&
                  bounds.left < 200 &&
                  bounds.top < 500
                ) {
                  // Only call handleDrop if stamina isn't full
                  if (userStats.stamina < 100) {
                    handleDrop(food);
                  } else {
                    Alert.alert('Stamina Full!', 'Your avatar is already at full stamina');
                  }
                }
              }}
              disabled={foodCounts[food] === 0 || userStats.stamina >= 100}
            >
              <Image
                source={foodImages[food]}
                style={[
                  styles.foodImage,
                  (!foodCounts[food] || foodCounts[food] === 0) && styles.disabledFood, // Apply disabled style if count is 0
                ]}
              />
            </CustomDraggable>
            <View style={styles.foodCountContainer}>
              <Text style={styles.foodCount}>{foodCounts[food] || 0}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Avatar at the Bottom */}
      <View style={styles.avatarContainer}>
        <Image
          source={require("../assets/avatar/Awake.png")}
          style={styles.avatarImage}
        />
      </View>

      {/* Update Store Modal */}
      {isStoreOpen && (
        <Store
          visible={isStoreOpen}
          onClose={() => {
            handleStoreToggle();
            loadUserStats(); // Reload stats after store closes
          }}
          userStats={userStats}
          setUserStats={setUserStats}
          setFoodCounts={setFoodCounts}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    zIndex: 1, // Ensure top row is above the avatar
  },
  storeButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
  coinText: {
    color: "#FFCC33",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 5,
  },
  foodRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
    zIndex: 2, // Ensure food items are above the avatar
  },
  foodContainer: {
    alignItems: "center",
    position: "relative", // Required for absolute positioning of the food count
  },
  foodImage: {
    width: 50,
    height: 50,
  },
  disabledFood: {
    opacity: 0.5, // Make the food item semi-transparent when disabled
  },
  foodCountContainer: {
    backgroundColor: "#EC808D",
    padding: 3,
    paddingHorizontal: 7,
    borderRadius: 18,
    color: "white",
    position: "relative",
    zIndex: 2,
    top: 30,
    left: 25,
  },
  foodCount: {
    color: "white",
    fontSize: 14,
  },
  avatarContainer: {
    position: "absolute",
    bottom: 50,
    zIndex: 0, // Ensure the avatar is below the draggable items
  },
  avatarImage: {
    maxWidth: 350,
    width: 350,
    height: 350,
  },
  draggable: {
    position: "absolute",
    zIndex: 2, // Ensure draggable items are on top
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  staminaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staminaText: {
    color: '#ff9800',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  staminaRow: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
});

export default DiningArea;
