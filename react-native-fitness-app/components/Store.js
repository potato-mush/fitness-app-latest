import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Alert } from "react-native";
import { auth } from '../firebase/config';
import { updateUserProgress } from '../services/userProgressService';
import { FOOD_STATS } from '../constants/gameConstants';

const Store = ({ visible, onClose, userStats, setUserStats, setFoodCounts }) => {
  const foodOrder = ['energyDrink', 'apple', 'friedEgg', 'chickenLeg'];

  const foodImages = {
    energyDrink: require('../assets/avatar/energy-drink.png'),
    apple: require('../assets/avatar/apple.png'),
    friedEgg: require('../assets/avatar/fried-egg.png'),
    chickenLeg: require('../assets/avatar/chicken-leg.png'),
  };

  const formatItemName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const buyItem = async (itemType) => {
    console.log('Attempting purchase:', itemType);
    const cost = FOOD_STATS[itemType].cost;
    
    if (userStats.coins >= cost) {
      try {
        // Update both coins and inventory
        const updateData = {
          coins: userStats.coins - cost,
          inventory: {
            [itemType]: (userStats.inventory?.[itemType] || 0) + 1
          }
        };

        const updatedStats = await updateUserProgress(auth.currentUser.uid, updateData);
        console.log('Purchase successful:', updatedStats);

        setUserStats(updatedStats);
        setFoodCounts(updatedStats.inventory);

        Alert.alert(
          'Purchase Successful!',
          `Bought 1 ${formatItemName(itemType)}`
        );
      } catch (error) {
        console.error('Purchase error:', error);
        Alert.alert('Error', 'Failed to make purchase');
      }
    } else {
      Alert.alert(
        'Insufficient Coins',
        `You need ${cost} coins but have ${userStats.coins} coins`
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.storeButton}
            onPress={onClose}
          >
            <Image
              source={require("../assets/avatar/cart.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <View style={styles.coinContainer}>
            <Image
              source={require("../assets/avatar/coins.png")}
              style={styles.icon}
            />
            <Text style={styles.coinText}>{userStats.coins}</Text>
          </View>
        </View>

        {/* Food Row */}
        <View style={styles.foodRow}>
          {foodOrder.map((food) => (
            <TouchableOpacity
              key={food}
              style={styles.foodContainer}
              onPress={() => buyItem(food)}
            >
              <Image
                source={foodImages[food]}
                style={styles.foodImage}
              />
              <View style={styles.priceTag}>
                <Image
                  source={require("../assets/avatar/coins.png")}
                  style={styles.smallCoinIcon}
                />
                <Text style={styles.priceText}>{FOOD_STATS[food].cost}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    zIndex: 10,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  storeButton: {
    padding: 10,
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
    flexWrap: "wrap",
  },
  foodContainer: {
    alignItems: "center",
    width: "45%",
    marginVertical: 10,
  },
  foodImage: {
    width: 100,
    height: 100,
  },
  priceTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 15,
    marginTop: 5,
  },
  smallCoinIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  priceText: {
    fontWeight: "bold",
    color: "#FFCC33",
  },
});

export default Store;
