import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { UrlTile } from "react-native-maps";

const MapTilerMap: React.FC = () => {
  const mapTilerApiKey = "lFxBJb0ft0QTZN3SElDu";
  const mapStyle = "satellite"; // Change this to "basic", "satellite", "hybrid", etc.

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 1.3521, // Singapore latitude
          longitude: 103.8198, // Singapore longitude
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
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
