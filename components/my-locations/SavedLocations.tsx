import { View, Text, FlatList, StyleSheet, Modal } from "react-native";
import React from "react";
import LocationCard from "./LocationCard";
import { SafeAreaView } from "react-native-safe-area-context";
import ReactNativeModal from "react-native-modal";

const SavedLocations = ({
  isVisible,
  setIsVisible,
  savedLocations,
  onPress,
}: {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  savedLocations: SavedLocation[];
  onPress: (latitude: number, longitude: number) => void;
}) => {
  console.log(savedLocations);
  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
    >
      <View style={styles.modalContainer}>
        <FlatList
          data={savedLocations}
          renderItem={({ item }) => (
            <LocationCard
              id={item.id}
              userId={item.user_id}
              createdAt={item.created_at}
              name={item.location_name}
              latitude={item.location_latitude}
              longitude={item.location_longitude}
              rating={item.rating}
              description={item.description}
              drinkType={item.drinkType}
              onPress={onPress}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ReactNativeModal>
  );
};

export default SavedLocations;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 15,
  },
  modalContainer: {
    backgroundColor: "white",
    height: "90%",
    width: "100%",
  },
});
