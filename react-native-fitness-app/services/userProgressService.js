import { db } from '../firebase/config';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';

export const updateUserProgress = async (userId, updateData) => {
  try {
    console.log('Updating progress with:', updateData);
    
    if (!userId) {
      throw new Error('No user ID provided');
    }

    const userStatsRef = doc(db, 'userStats', userId);
    let userStatsDoc = await getDoc(userStatsRef);
    let currentStats = userStatsDoc.exists() ? userStatsDoc.data() : null;

    if (!currentStats) {
      const initialStats = {
        level: 1,
        xp: 0,
        xpMax: 1000,
        stamina: 100,
        staminaMax: 100,
        chest: 0,
        arms: 0,
        abs: 0,
        legs: 0,
        back: 0,
        totalCalories: 0,
        totalExercises: 0,
        lastWorkout: null,
        streak: 0,
        coins: 100,
        inventory: {
          energyDrink: 5,
          apple: 3,
          friedEgg: 2,
          chickenLeg: 4,
        }
      };
      await setDoc(userStatsRef, initialStats);
      currentStats = initialStats;
    }

    let updates = { ...updateData };

    if (updateData.type === 'WORKOUT') {
      // Calculate XP gain
      const xpGained = (updateData.exercises || 0) * 10;
      let newXP = (currentStats.xp || 0) + xpGained;
      let newLevel = currentStats.level || 1;
      let newXPMax = currentStats.xpMax || 1000;

      // Level up check
      while (newXP >= newXPMax) {
        newXP -= newXPMax;
        newLevel++;
        newXPMax = Math.floor(newXPMax * 1.5);
      }

      // Update muscle stats directly
      const muscleTypes = ['abs', 'arms', 'chest', 'legs', 'back'];
      muscleTypes.forEach(muscle => {
        if (updateData[muscle]) {
          updates[muscle] = (currentStats[muscle] || 0) + updateData[muscle];
        }
      });

      updates = {
        ...updates,
        level: newLevel,
        xp: newXP,
        xpMax: newXPMax,
        totalCalories: (currentStats.totalCalories || 0) + (updateData.calories || 0),
        totalExercises: (currentStats.totalExercises || 0) + (updateData.exercises || 0),
        lastWorkout: new Date().toISOString(),
        streak: (currentStats.streak || 0) + 1,
        coins: currentStats.coins + ((updateData.exercises || 0) * 10),
      };
    }

    // Handle inventory updates
    if (updateData.inventory) {
      updates = {
        ...updates,
        inventory: {
          ...currentStats.inventory,
          ...updateData.inventory
        }
      };
    }

    // Handle direct coin updates
    if (updateData.coins !== undefined) {
      updates.coins = updateData.coins;
    }

    // Handle stamina updates
    if (updateData.stamina !== undefined) {
      updates.stamina = updateData.stamina;
    }

    console.log('Final updates to apply:', updates);
    await updateDoc(userStatsRef, updates);

    // Get and return the updated document
    const updatedDoc = await getDoc(userStatsRef);
    return updatedDoc.data();
  } catch (error) {
    console.error('Error in updateUserProgress:', error);
    throw error;
  }
};

export const getUserStats = async (userId) => {
  try {
    console.log('Getting stats for user:', userId);
    const userStatsRef = doc(db, 'userStats', userId);
    const userStatsDoc = await getDoc(userStatsRef);
    
    if (!userStatsDoc.exists()) {
      // Initialize new user stats
      const initialStats = {
        level: 1,
        xp: 0,
        xpMax: 1000,
        stamina: 100,
        staminaMax: 100,
        chest: 0,
        arms: 0,
        abs: 0,
        legs: 0,
        back: 0,
        totalCalories: 0,
        totalExercises: 0,
        lastWorkout: null,
        streak: 0,
        coins: 100,
        inventory: {
          energyDrink: 5,
          apple: 3,
          friedEgg: 2,
          chickenLeg: 4,
        }
      };
      await setDoc(userStatsRef, initialStats);
      return initialStats;
    }
    
    return userStatsDoc.data();
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};
