import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, ScrollView, TouchableOpacity, View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext, useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { FitnessItems } from "../Context";
import { DIFFICULTY_STAMINA_COST } from '../constants/gameConstants';
import OutOfStaminaModal from '../components/OutOfStaminaModal';
import { auth } from '../firebase/config';
import { getUserStats } from '../services/userProgressService';

const WorkoutScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { completed, setCompleted } = useContext(FitnessItems);
  const [showStaminaModal, setShowStaminaModal] = useState(false);
  const [userStats, setUserStats] = useState({ stamina: 100 });

  const { exercises = [], difficulty = "Beginner", image } = route.params || {};

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    if (auth.currentUser) {
      const stats = await getUserStats(auth.currentUser.uid);
      if (stats) {
        setUserStats(stats);
      }
    }
  };

  const handleStartWorkout = () => {
    const requiredStamina = DIFFICULTY_STAMINA_COST[difficulty];
    
    if (userStats.stamina < requiredStamina) {
      setShowStaminaModal(true);
      return;
    }

    navigation.navigate("Fit", {
      exercises: route.params.exercises,
      difficulty,
      userStats: userStats, // Make sure to pass userStats
    });
    setCompleted([]);
  };

  // Format duration in MM:SS format
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "white", marginTop: 20 }}
      >
        <Image
          style={{
            width: "100%",
            height: 200,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            marginBottom: 20,
          }}
          source={image} // Use the image passed as a prop
        />

        <Ionicons
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            top: 30,
            left: 20,
            backgroundColor: "white",
            borderRadius: 8,
            padding: 3,
          }}
          name="arrow-back-outline"
          size={24}
          color="black"
        />

        {/* Loop through the exercises and display based on selected difficulty */}
        {exercises.map((item, index) => (
          <TouchableOpacity
            style={{
              marginVertical: 12,
              marginHorizontal: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            key={index}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                style={{ width: 90, height: 90 }}
                source={item.image} // Display the exercise image
              />

              <View style={{ marginLeft: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {item.name}
                </Text>

                {/* Display duration for the exercises like Jumping Jacks, Cobra Stretch, and Chest Stretch */}
                {item.duration && item.duration[difficulty] ? (
                  <Text style={{ marginTop: 4, fontSize: 16, color: "gray" }}>
                    {formatDuration(item.duration[difficulty])}
                  </Text>
                ) : (
                  <Text style={{ marginTop: 4, fontSize: 16, color: "gray" }}>
                    x{item.sets[difficulty]}
                  </Text>
                )}
              </View>
            </View>

            {/* Show checkmark if exercise is completed */}
            {completed.includes(item.name) ? (
              <AntDesign name="checkcircle" size={24} color="#198f51" />
            ) : null}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={handleStartWorkout}
        style={{
          backgroundColor: "#198f51",
          padding: 12,
          marginHorizontal: 15,
          marginVertical: 20,
          borderRadius: 50,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          <MaterialCommunityIcons name="whistle" size={24} color="white" />{" "}
          START ({DIFFICULTY_STAMINA_COST[difficulty]} Stamina)
        </Text>
      </TouchableOpacity>

      <OutOfStaminaModal
        visible={showStaminaModal}
        onClose={() => setShowStaminaModal(false)}
        navigation={navigation}
      />
    </>
  );
};

export default WorkoutScreen;
