import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { searchUsers, sendFriendRequest } from "../../(api)/userServices"; // Replace with the correct path to your API functions
import { useFocusEffect } from "@react-navigation/native";

const AddFriendsScreen = () => {
  const [searchString, setSearchString] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchClicked, setSearchClicked] = useState(false); // Track if search button was clicked
  const [refreshKey, setRefreshKey] = useState(0); // This will force a re-render when updated
  const [error, setError] = useState<string | null>(null); // Error state for handling error messages

  // This effect runs every time the screen is focused (brought back into view)
  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey((prevKey) => prevKey + 1);

      // Cleanup (optional) when the screen is unfocused
      return () => {
        setResults([]);
        setSearchString("");
        setLoading(false);
        setSearchClicked(false);
        setError(null);

        console.log("Screen unfocused.");
      };
    }, [])
  );

  const handleSearch = async () => {
    setSearchClicked(true); // Set this to true when search is clicked
    setLoading(true);
    setError(null); // Reset error state

    // Check if search string is empty
    if (!searchString.trim()) {
      setLoading(false); // Stop loading indicator
      setError("Search string cannot be empty"); // Set error message
      return;
    }

    try {
      const data = await searchUsers(searchString);
      if (error) {
        throw error;
      }
      setResults(data);
    } catch (error) {
      const err = error as Error;
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId: string) => {
    try {
      await sendFriendRequest(userId);
    } catch (error) {
      const err = error as Error;
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={require('@/assets/images/coffee-and-tea.png')}
        style={styles.background}
        imageStyle={{ opacity: 0.5 }}
        > */}
      <Text style={styles.title}>Add Friends</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by email"
        value={searchString}
        onChangeText={setSearchString}
      />
      <Button title="Search" onPress={handleSearch} disabled={loading} />

      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {searchClicked && results.length === 0 && !loading && (
        <Text style={styles.noResultsText}>User not found</Text>
      )}

      {searchClicked && results.length > 0 && !loading && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.resultText}>{item.email}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddFriend(item.id)}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      {/* </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80, // Increased padding at the top
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#40E0D0", // Turquoise color for the button
    paddingHorizontal: 15, // Horizontal padding
    paddingVertical: 10, // Vertical padding
    borderRadius: 5, // Rounded corners for the button
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center", // Aligns items vertically centered
    justifyContent: "space-between",
    marginBottom: 15, // Space between each result
    marginTop: 15,
    padding: 15, // Padding inside each item
    backgroundColor: "#f9f9f9", // Light background for each item
    borderRadius: 10, // Rounded corners
    shadowColor: "#000", // Shadow color for elevation
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 5, // Shadow blur radius
    elevation: 3, // Elevation for Android shadow effect
  },
  resultText: {
    fontSize: 16, // A bit larger text for better readability
    fontWeight: "500", // Semi-bold text for emphasis
    color: "#333", // Dark text color for better contrast
  },
  noResultsText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
  errorText: { color: "red", marginTop: 10 },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default AddFriendsScreen;
