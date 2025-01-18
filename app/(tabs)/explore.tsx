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

type Location = {
  id: string;
  location_name: string;
  description: string;
  rating: number;
  drink_type: string;
};

export default function Explore() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("my_locations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLocations(data || []);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Bean & Leaf
        </ThemedText>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {locations.map((location) => (
          <View key={location.id} style={styles.card}>
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
          </View>
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
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
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
});
