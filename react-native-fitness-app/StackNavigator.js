import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TrainingScreen from './screens/TrainingScreen';
import SettingsScreen from './screens/SettingsScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import FitScreen from './screens/FitScreen';
import RestScreen from './screens/RestScreen';
import AchievementsScreen from './screens/AchievementsScreen'; // Import AchievementsScreen
import AvatarScreen from './screens/AvatarScreen'; // Import AchievementsScreen
import RewardsScreen from './screens/RewardsScreen';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
        <Stack.Screen options={{headerShown: false}} name="Training" component={TrainingScreen} />
        <Stack.Screen options={{headerShown: false}} name="Settings" component={SettingsScreen} />
        <Stack.Screen options={{headerShown: false}} name="Workout" component={WorkoutScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Fit" component={FitScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Rest" component={RestScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Achievements" component={AchievementsScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Avatar" component={AvatarScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Rewards" component={RewardsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
