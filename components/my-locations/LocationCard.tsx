import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import star from "../../assets/images/star.png";
import locationIcon from "../../assets/icons/location.png";
import deleteIcon from "../../assets/icons/delete.png";

import { deleteSavedLocation } from "@/utils/locations";

const LocationCard = ({
  id,
  userId,
  createdAt,
  name,
  latitude,
  longitude,
  rating,
  description,
  drinkType,
  onPress,
  setSavedLocations,
}: {
  id: number;
  userId: string;
  createdAt: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  description: string;
  drinkType: string;
  onPress: (latitude: number, longitude: number) => void;
  setSavedLocations: React.Dispatch<React.SetStateAction<SavedLocation[]>>;
}) => {
  const handleDelete = () => {
    deleteSavedLocation(id, userId);
    setSavedLocations((prev) => prev.filter((location) => location.id != id));
  };

  return (
    <View style={styles.cardContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.locationText}>{name}</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Image source={deleteIcon} style={{ width: 18, height: 18 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPress(latitude, longitude)}
          style={{ marginLeft: 5 }}
        >
          <Image source={locationIcon} style={{ width: 18, height: 18 }} />
        </TouchableOpacity>
      </View>
      <Text style={styles.descriptionText}>{description}</Text>
      <View style={styles.ratingContainer}>
        <Text style={{ color: "gray", marginRight: 10 }}>{drinkType}</Text>
        <View style={{ flexDirection: "row" }}>
          <Image source={star} style={{ width: 16, height: 16 }} />
          <Text style={{ marginLeft: 5 }}>{rating}</Text>
        </View>
      </View>
    </View>
  );
};

export default LocationCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: "#d1d5db",
    padding: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 500,
  },
  descriptionText: {
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
});
