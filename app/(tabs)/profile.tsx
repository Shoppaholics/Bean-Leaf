import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

type ProfileStats = {
  totalLocations: number;
  email: string;
};

export default function Profile() {
  const router = useRouter();
  const [stats, setStats] = useState<ProfileStats>({
    totalLocations: 0,
    email: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchProfileStats = async () => {
    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      // Get user's profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Count user's locations
      const { count, error: countError } = await supabase
        .from("my_locations")
        .select("*", { count: "exact" })
        .eq("user_id", user.id);

      if (countError) throw countError;

      setStats({
        totalLocations: count || 0,
        email: profile.email,
      });
    } catch (error) {
      console.error("Error fetching profile stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileStats();
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Profile
        </ThemedText>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <ThemedText style={styles.avatarText}>
            {stats.email.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <ThemedText style={styles.email}>{stats.email}</ThemedText>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>
            {stats.totalLocations}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Places Rated</ThemedText>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <ThemedText style={styles.logoutText}>Logout</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
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
  profileCard: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0284c7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  email: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1f2937",
  },
  statsCard: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0284c7",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
