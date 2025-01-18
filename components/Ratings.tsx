import React, { useState, useEffect } from "react";
import { View, Button, Alert, StyleSheet, Text, TextInput, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

// Define a type for location
type Location = {
  latitude: number;
  longitude: number;
} | null;

type Pin = {
  id: number;
  latitude: number;
  longitude: number;
  rating?: number; // Optional field
  drinkType?: string; // Optional field
};

const Ratings = () => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [showRatingInputs, setShowRatingInputs] = useState<boolean>(false);
  const [ratingInput, setRatingInput] = useState<string>("");
  const [drinkType, setDrinkType] = useState<string>("");

  // Fetch current location
  const fetchCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setCurrentLocation({ latitude, longitude });
  };

    // Toggle the rating input containers
    const startRating = () => {
      if (!currentLocation) {
        Alert.alert("Error", "Location not available.");
        return;
      }
      setShowRatingInputs(!showRatingInputs);
    };

      // Submit rating and drop a pin
  const submitRating = () => {
    if (!ratingInput || !drinkType) {
      Alert.alert("Error", "Please enter both drink type and rating.");
      return;
    }
  

    const newPin: Pin = {
      id: Date.now(),
      latitude: currentLocation!.latitude,
      longitude: currentLocation!.longitude,
      rating: parseFloat(ratingInput),
      drinkType,
    };

    setPins((prevPins) => [...prevPins, newPin]);
    setShowRatingInputs(false); // Hide inputs
    setRatingInput("");
    setDrinkType("");
    Alert.alert("Success", `You rated ${drinkType} with ${ratingInput} stars!`);
  };


  useEffect(() => {
    fetchCurrentLocation();
    console.log("Current location: ", currentLocation);
  }, []);

  return (
    <SafeAreaView edges={["right", "bottom", "left"]}style={styles.safeAreaView}>
      <View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 1.3521,
          longitude: 103.8198,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
        showsUserLocation
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            title={`${pin.drinkType}: ${pin.rating} stars`}
          />
        ))}
      </MapView>
      </View>

<View style={styles.inputContainer}>

        <Button title="Rate Here" onPress={startRating} />

      {showRatingInputs && (
        <View>
          <Text>Drink Type (Tea or Coffee):</Text>
          <TextInput
            placeholder="Enter drink type"
            value={drinkType}
            onChangeText={setDrinkType}
            style={styles.input}
          />
          <Text>Rating (1-5):</Text>
          <TextInput
            placeholder="Enter rating"
            value={ratingInput}
            onChangeText={setRatingInput}
            style={styles.input}
            keyboardType="numeric"
          />
          <Button title="Submit" onPress={submitRating} />
        </View>
      )}
</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: { 
    height: "92%",   
    backgroundColor: "black"
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  buttonContainer: {
    // position: "absolute",
    // bottom: 20,
    // left: 20,
    // right: 20,
    // flexDirection: "row",
    // justifyContent: "center",
    zIndex: 50
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 50
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
});
export default Ratings;
