import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export const saveWorkout = async (userId, workoutData) => {
  try {
    const workoutsRef = collection(db, 'workouts');
    const docRef = await addDoc(workoutsRef, {
      userId,
      ...workoutData,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving workout:', error);
    throw error;
  }
};

export const getUserWorkouts = async (userId) => {
  try {
    const workoutsRef = collection(db, 'workouts');
    const q = query(workoutsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

export const updateWorkout = async (workoutId, updateData) => {
  try {
    const workoutRef = doc(db, 'workouts', workoutId);
    await updateDoc(workoutRef, updateData);
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};
