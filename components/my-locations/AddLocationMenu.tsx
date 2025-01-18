import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import React, { useState } from "react";

const AddLocationMenu = () => {
  const [rating, setRating] = useState("");
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");

  const handleSaveLocation = () => {};

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Rating"
        keyboardType="numeric"
        value={rating}
        onChangeText={(text) => setRating(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Location name"
        value={locationName}
        onChangeText={(text) => setLocationName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        secureTextEntry
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Button title="Submit" onPress={handleSaveLocation} />
    </View>
  );
};

export default AddLocationMenu;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
