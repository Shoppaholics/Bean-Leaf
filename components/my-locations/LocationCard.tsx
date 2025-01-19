import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import star from "../../assets/images/star.png";
import locationIcon from "../../assets/icons/location.png";
import deleteIcon from "../../assets/icons/delete.png";

import { deleteSavedLocation } from "@/utils/locations";

interface LocationCardProps {
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
  userEmail?: string;
}

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
  userEmail,
}: LocationCardProps) => {
  const handleDelete = () => {
    deleteSavedLocation(id, userId);
    setSavedLocations((prev) => prev.filter((location) => location.id != id));
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.locationName}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {rating}</Text>
            <Text style={styles.drinkType}>{drinkType}</Text>
          </View>
          <Text style={styles.userEmail}>by {userEmail || "Me"}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
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
    </View>
  );
};

export default LocationCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: "#d1d5db",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  locationName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 500,
  },
  description: {
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  rating: {
    marginRight: 10,
  },
  drinkType: {
    color: "gray",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  userEmail: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    fontStyle: "italic",
  },
});
