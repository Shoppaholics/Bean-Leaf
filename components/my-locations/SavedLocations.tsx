import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import LocationCard from "./LocationCard";
import { SafeAreaView } from "react-native-safe-area-context";
import ReactNativeModal from "react-native-modal";
import closeIcon from "../../assets/icons/close.png";
import { deleteSavedLocation } from "@/utils/locations";

type SavedLocationWithEmail = SavedLocation & {
  user_email?: string;
};

interface SavedLocationsProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  savedLocations: SavedLocationWithEmail[];
  onPress: (latitude: number, longitude: number) => void;
  setSavedLocations: React.Dispatch<
    React.SetStateAction<SavedLocationWithEmail[]>
  >;
}

const SavedLocations = ({
  isVisible,
  setIsVisible,
  savedLocations,
  onPress,
  setSavedLocations,
}: SavedLocationsProps) => {
  console.log(savedLocations);

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      backdropOpacity={0.15}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Beans & Leaf</Text>
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <Image source={closeIcon} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>
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
              drinkType={item.drink_type}
              onPress={onPress}
              setSavedLocations={setSavedLocations}
              userEmail={item.user_email}
            />
          )}
          keyExtractor={(item, index) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ marginVertical: 8 }} />}
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
    paddingVertical: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    height: "90%",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 500,
    flex: 1,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
  },
  cardContent: {
    flex: 1,
  },
  userEmail: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
    marginTop: 4,
    fontStyle: "italic",
  },
});
