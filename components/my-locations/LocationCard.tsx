import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

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
}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => onPress(latitude, longitude)}>
        <Text>Location card</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationCard;
