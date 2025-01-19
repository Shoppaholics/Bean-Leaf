import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

type Location = {
  id: string;
  location_name: string;
  description: string;
  rating: number;
  drink_type: string;
  user_email: string;
  location_latitude: number;
  location_longitude: number;
};

export default function Explore() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocations = async () => {
    try {
      // First get locations with user_id
      const { data: locationsData, error: locationsError } = await supabase
        .from("my_locations")
        .select("*, user_id")
        .order("created_at", { ascending: false });

      if (locationsError) throw locationsError;

      // Then get emails for each user_id
      const userIds = locationsData?.map((loc) => loc.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const locationsWithEmail =
        locationsData?.map((location) => ({
          ...location,
          user_email:
            profilesData?.find((p) => p.id === location.user_id)?.email || "",
        })) || [];

      setLocations(locationsWithEmail);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchLocations().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleCardPress = (latitude: number, longitude: number) => {
    // Navigate to map tab with location data
    router.push({
      pathname: "/(tabs)/addict",
      params: {
        latitude,
        longitude,
        zoom: 15,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Bean & Leaf
        </ThemedText>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <IconSymbol name="person.circle" color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            onPress={() =>
              handleCardPress(
                location.location_latitude,
                location.location_longitude
              )
            }
          >
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.locationName}>
                  {location.location_name}
                </ThemedText>
                <View style={styles.ratingContainer}>
                  <ThemedText style={styles.rating}>
                    ★ {location.rating}
                  </ThemedText>
                  <ThemedText style={styles.drinkType}>
                    {location.drink_type}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={styles.description}>
                {location.description}
              </ThemedText>
              <ThemedText style={styles.userEmail}>
                by {location.user_email}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 60,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileButton: {
    backgroundColor: "#0284c7",
    padding: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  ratingContainer: {
    alignItems: "flex-end",
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f59e0b",
  },
  drinkType: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
});
