import React, { useState } from "react";
import { View, Text, ImageBackground, Image, StyleSheet } from "react-native";

const LivingRoom = () => {
  // Assume avatar's level is stored in state
  const [avatarLevel, setAvatarLevel] = useState("skinny"); // Example level state: 'skinny', 'moderate', 'bulky'

  // Determine the sprite image based on avatar's level
  const getSpriteImage = () => {
    switch (avatarLevel) {
      case "moderate":
        return require("../assets/avatar/Moderate-Sprite.png");
      case "bulky":
        return require("../assets/avatar/Bulky-Sprite.png");
      case "skinny":
      default:
        return require("../assets/avatar/Skinny-Sprite.png");
    }
  };

  return (
    <View style={styles.container}>
      {/* Background image for the living room */}
      <ImageBackground
        source={require("../assets/avatar/LivingRoom.png")}
        style={styles.background}
        resizeMode="cover" // Ensure background image covers the screen
      >

        {/* Sprite Image */}
        <Image
          source={getSpriteImage()} // Dynamically choose the sprite
          style={styles.spriteImage}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes up the full screen height
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1, // Make the background image take up the whole space
    width: "100%", // Ensure the background spans the entire width
    height: "100%", // Ensure the background spans the entire height
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
  spriteImage: {
    position: "absolute",
    bottom: 40, // Distance from the bottom of the screen
    right: 10, // Distance from the right side of the screen
    maxWidth: "60%", // Ensure the sprite doesn't exceed 25% of the container's width
    maxHeight: "60%", // Ensure the sprite doesn't exceed 25% of the container's height
    resizeMode: "contain", // Make sure the sprite keeps its aspect ratio
  },
});

export default LivingRoom;
