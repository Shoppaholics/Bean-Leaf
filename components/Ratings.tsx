const RC4_LAT = 1.30842;
const RC4_LONG = 103.7735;

import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

type Pin = {
  id: number;
  latitude: number;
  longitude: number;
  rating?: number;
  drinkType?: string;
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
  const [mapRef, setMapRef] = useState<MapView | null>(null);

  const fetchCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const longitude = RC4_LONG;
    const latitude = RC4_LAT;
    setCurrentLocation({ latitude, longitude });

    // Animate map to current location
    mapRef?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const startRating = () => {
    if (!currentLocation) {
      Alert.alert("Error", "Location not available.");
      return;
    }
    setShowRatingInputs(true);
  };

  const submitRating = () => {
    if (!currentLocation) return;
    if (!ratingInput || !drinkType) {
      Alert.alert("Error", "Please enter both drink type and rating.");
      return;
    }

    const rating = parseFloat(ratingInput);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      Alert.alert("Error", "Rating must be between 1 and 5.");
      return;
    }

    const newPin: Pin = {
      id: Date.now(),
      latitude: RC4_LAT,
      longitude: RC4_LONG,
      rating,
      drinkType,
    };

    setPins((prevPins) => [...prevPins, newPin]);

    // Center map on new pin
    mapRef?.animateToRegion({
      latitude: newPin.latitude,
      longitude: newPin.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    console.log("New pin: ", newPin);
    setShowRatingInputs(false);
    setRatingInput("");
    setDrinkType("");
    Alert.alert("Success", `You rated ${drinkType} with ${rating} stars!`);
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  // Add a new useEffect for location changes
  useEffect(() => {
    if (currentLocation) {
      console.log("Updating map to location:", currentLocation);
      mapRef?.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [currentLocation]);

  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={styles.container}>
      <MapView
        ref={(ref) => setMapRef(ref)}
        style={styles.map}
        initialRegion={{
          latitude: RC4_LAT,
          longitude: RC4_LONG,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.latitude,
              longitude: pin.longitude,
            }}
            title={pin.drinkType}
            description={`Rating: ${pin.rating} stars`}
            pinColor="red"
          />
        ))}
      </MapView>

      <View style={styles.inputContainer}>
        <Button title="Rate Here" onPress={startRating} />
        {showRatingInputs && (
          <View>
            <Text>Drink Type:</Text>
            <TextInput
              placeholder="Coffee or Tea"
              value={drinkType}
              onChangeText={setDrinkType}
              style={styles.input}
            />
            <Text>Rating (1-5):</Text>
            <TextInput
              placeholder="Enter rating"
              value={ratingInput}
              onChangeText={setRatingInput}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button title="Submit" onPress={submitRating} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default Ratings;
