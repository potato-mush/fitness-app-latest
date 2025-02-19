import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { FitnessContext } from './Context';
import StackNavigator from './StackNavigator';
import { StatusBar } from 'expo-status-bar';
import { auth } from './firebase/config';
import { initializeAuth } from './services/authService';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeAuth();
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FitnessContext>
      <StatusBar style="light" backgroundColor='#000' />
      <StackNavigator />
    </FitnessContext>
  );
}
