import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { UrlTile } from "react-native-maps";

const MapTilerMap: React.FC = () => {
  const mapTilerApiKey = "a3AAhXU8voZjQ4laVdFp";
  const mapStyle = "streets"; // Change this to "basic", "satellite", "hybrid", etc.

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 1.3521, // Singapore latitude
          longitude: 103.8198, // Singapore longitude
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <UrlTile
          urlTemplate={`https://api.maptiler.com/maps/${mapStyle}/{z}/{x}/{y}.png?key=${mapTilerApiKey}`}
          maximumZ={20}
          flipY={false}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default MapTilerMap;
