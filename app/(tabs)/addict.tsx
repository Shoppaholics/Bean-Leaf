import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSavedLocations, saveLocation } from "@/utils/locations";
import { getUserId } from "@/utils/authentication";
import icon from "../../assets/images/star.png";
import SavedLocations from "@/components/my-locations/SavedLocations";

type Pin = {
  id: number;
  latitude: number;
  longitude: number;
  rating?: number;
  drinkType?: string;
};

const Addict = () => {
  const [userId, setUserId] = useState("");

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [showListView, setShowListView] = useState(true);
  const [mapRef, setMapRef] = useState<MapView | null>(null);

  // review input fields
  const [showRatingInputs, setShowRatingInputs] = useState<boolean>(false);
  const [ratingInput, setRatingInput] = useState<string>("");
  const [drinkType, setDrinkType] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  const fetchCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setCurrentLocation({ latitude, longitude });

    // Animate map to current location
    mapRef?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const fetchSavedLocations = async () => {
    const userId = await getUserId();
    if (!userId) {
      return;
    }
    setUserId(userId);
    const savedLocations = await getSavedLocations(userId);
    setSavedLocations(savedLocations);
  };

  const startRating = () => {
    if (!currentLocation) {
      Alert.alert("Error", "Location not available.");
      return;
    }
    setShowRatingInputs(!showRatingInputs);
  };

  const submitRating = async () => {
    if (!currentLocation) return;
    if (!ratingInput || !drinkType || !locationName) {
      Alert.alert("Error", "Please enter both drink type and rating.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    const finalDescription = description || "No description provided";

    const rating = parseFloat(ratingInput);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      Alert.alert("Error", "Rating must be between 1 and 5.");
      return;
    }

    const newPin: Pin = {
      id: Date.now(),
      latitude: currentLocation!.latitude,
      longitude: currentLocation!.longitude,
      rating,
      drinkType,
    };

    await saveLocation(
      userId,
      locationName,
      finalDescription,
      drinkType,
      parseInt(ratingInput),
      currentLocation.latitude,
      currentLocation.longitude
    );

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
    setDescription("");
    Alert.alert("Success", `You rated ${drinkType} with ${rating} stars!`);
  };

  const retrievePins = async () => {
    if (!userId) return;
    try {
      const savedLocations = await getSavedLocations(userId);
      const loadedPins = savedLocations.map((location) => ({
        id: location.id,
        latitude: location.location_latitude,
        longitude: location.location_longitude,
        rating: location.rating,
        drinkType: location.drinkType,
      }));
      console.log("Loaded pins:", loadedPins);
      setPins(loadedPins);
    } catch (error) {
      console.error("Error retrieving pins:", error);
    }
  };

  useEffect(() => {
    fetchSavedLocations();
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

  useEffect(() => {
    retrievePins(); 
  }, [userId]);

  const focusMapOnLocation = (latitude: number, longitude: number) => {
    setShowListView(false);
    setCurrentLocation({ latitude: latitude, longitude: longitude });
    // Animate map to current location

    // mapRef?.animateToRegion({
    //   latitude: 1.3084797418064136,
    //   longitude: 103.77293754515168,
    //   latitudeDelta: 0.01,
    //   longitudeDelta: 0.01,
    // });
  };

  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={styles.container}>
      <MapView
        ref={(ref) => {
          setMapRef(ref);
        }}
        style={styles.map}
        initialRegion={{
          latitude: 1.3521,
          longitude: 103.8198,
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
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={startRating}>
          <Image source={icon} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </View>
      {showRatingInputs && (
        <View style={styles.inputContainer}>
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
            <Text>Location:</Text>
            <TextInput
              placeholder="Enter location name"
              value={locationName}
              onChangeText={setLocationName}
              style={styles.input}
            />
            <Text>Description</Text>
            <TextInput
              placeholder="Enter description (Optional)"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />

            <Button title="Submit" onPress={submitRating} />
          </View>
        </View>
      )}
      <Button title="List view" onPress={() => setShowListView(true)} />
      {showListView && (
        <SavedLocations
          isVisible={showListView}
          setIsVisible={setShowListView}
          savedLocations={savedLocations}
          onPress={focusMapOnLocation}
          setSavedLocations={setSavedLocations}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#ff5733",
  },
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
    top: 130,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  logoContainer: {
    position: "absolute",
    top: 75,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
    width: 50,
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default Addict;
