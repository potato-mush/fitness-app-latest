import React from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Predefine images for each workout and difficulty level
const imageMap = {
  chest: {
    Beginner: require("../assets/card-image/chest-1.jpg"),
    Intermediate: require("../assets/card-image/chest-2.jpg"),
    Advanced: require("../assets/card-image/chest-3.jpg"),
  },
  abs: {
    Beginner: require("../assets/card-image/abs-1.jpg"),
    Intermediate: require("../assets/card-image/abs-2.jpg"),
    Advanced: require("../assets/card-image/abs-3.jpg"),
  },
  arms: {
    Beginner: require("../assets/card-image/arms-1.jpg"),
    Intermediate: require("../assets/card-image/arms-2.jpg"),
    Advanced: require("../assets/card-image/arms-3.jpg"),
  },
  back: {
    Beginner: require("../assets/card-image/back-1.jpg"),
    Intermediate: require("../assets/card-image/back-2.jpg"),
    Advanced: require("../assets/card-image/back-3.jpg"),
  },
  legs: {
    Beginner: require("../assets/card-image/legs-1.jpg"),
    Intermediate: require("../assets/card-image/legs-2.jpg"),
    Advanced: require("../assets/card-image/legs-3.jpg"),
  },
};

// FitnessCards Component
const FitnessCards = ({ workout }) => {
  const navigation = useNavigation();

  // Check if the workout is "Full Body"
  const isFullBody = workout.name === "FULL BODY";

  const difficultyLevels = isFullBody
    ? []
    : ["Beginner", "Intermediate", "Advanced"]; // No difficulty for Full Body

  // Function to get the image based on workout name (muscle group) and difficulty level
  const getImage = (level) => {
    if (isFullBody) {
      return workout.image; // Use the Full Body workout image directly
    }
    return (
      imageMap[workout.name.toLowerCase()]?.[level] ||
      imageMap["chest"]["Beginner"]
    ); // Default for other workouts
  };

  // Function to get the number of icons based on the difficulty level
  const getIconCount = (level) => {
    if (isFullBody) return 1; // Only one icon for Full Body
    if (level === "Beginner") return 1;
    if (level === "Intermediate") return 2;
    if (level === "Advanced") return 3;
    return 0;
  };

  return (
    <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
      {difficultyLevels.length === 0 ? (
        // For Full Body, display only one option without difficulty
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Workout", {
              image: workout.image, // Only one image for Full Body
              exercises: workout.exercises,
              id: workout.id,
            })
          }
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Image
            style={{ width: "100%", height: 120, borderRadius: 12 }}
            source={workout.image} // Use the Full Body workout image directly
          />
          <Text
            style={{
              position: "absolute",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              left: 20,
              top: 20,
            }}
          >
            {workout.name}
          </Text>
        </TouchableOpacity>
      ) : (
        difficultyLevels.map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() =>
              navigation.navigate("Workout", {
                image: getImage(level), // Pass the image for the corresponding difficulty
                exercises: workout.exercises,
                id: workout.id,
                difficulty: level, // Pass the difficulty level
              })
            }
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <Image
              style={{ width: "100%", height: 120, borderRadius: 12 }}
              source={getImage(level)} // Use the corresponding image for the difficulty
            />
            <Text
              style={{
                position: "absolute",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                left: 20,
                top: 20,
              }}
            >
              {workout.name} {level}
            </Text>

            {/* Render the appropriate number of icons based on the difficulty */}
            {[...Array(getIconCount(level))].map((_, index) => (
              <MaterialCommunityIcons
                key={index}
                name="lightning-bolt"
                size={30}
                color="#dfbe04"
                style={{
                  position: "absolute",
                  bottom: 15,
                  left: 15 + index * 35,
                }}
              />
            ))}
          </TouchableOpacity>
        ))
      )}
    </View>
  );
};

export default FitnessCards;
