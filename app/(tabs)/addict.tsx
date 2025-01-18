import AddLocationMenu from "@/components/my-locations/AddLocationMenu";
import { getUserId } from "@/utils/authentication";
import { getSavedLocations } from "@/utils/locations";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Tab to view user's past reviewed locations
const Addict = () => {
  const [userId, setUserId] = useState("");
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userId = await getUserId();

    if (!userId) {
      return;
    }

    setUserId(userId);

    const savedLocations = await getSavedLocations(userId);
    setSavedLocations(savedLocations);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <AddLocationMenu />
    </SafeAreaView>
  );
};

export default Addict;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "white",
  },
});
