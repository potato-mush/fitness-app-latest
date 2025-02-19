import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "./BottomNavigation"; // Import BottomNavigation component
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const navigation = useNavigation();

  // Ensure activeTab is updated when the screen loads
  useEffect(() => {
    navigation.setOptions({ tabBarVisible: false }); // Optional, hide tab bar on this screen if necessary
  }, [navigation]);

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => openLink("https://example.com/rate-us")}
        >
          <Ionicons name="star" size={24} color="#15B392" />
          <Text style={styles.text}>Rate Us</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => openLink("https://example.com/feedback")}
        >
          <Ionicons name="chatbubbles" size={24} color="#15B392" />
          <Text style={styles.text}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => openLink("https://example.com/privacy-policy")}
        >
          <Ionicons name="document-text" size={24} color="#15B392" />
          <Text style={styles.text}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
      <BottomNavigation /> {/* Add BottomNavigation component here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  settingsContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  text: {
    fontSize: 18,
    marginLeft: 15,
  },
});

export default SettingsScreen;
