import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Button,
} from "react-native";
import { fetchFriends } from "../../(api)/userServices"; // Replace with the correct path
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

const FriendsScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("friend_requests")
        .update({ status: "ACCEPTED" })
        .eq("id", requestId);

      if (error) throw error;
      // Refresh the lists
      loadFriends();
    } catch (error) {
      Alert.alert("Error", "Failed to accept request");
    }
  };

  const loadFriends = async () => {
    try {
      setLoading(true);
      const { pendingRequests, friends } = await fetchFriends();
      console.log("Loaded pending requests:", pendingRequests); // Debug log
      console.log("Loaded friends:", friends); // Debug log
      setPendingRequests(pendingRequests);
      setFriends(friends);
    } catch (error) {
      const err = error as Error;
      console.error("Error loading friends:", err); // Debug log
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFriends();
      return () => {
        setFriends([]);
        setPendingRequests([]);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>

      {pendingRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Requests</Text>
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.requestItem}>
                <Text style={styles.friendText}>{item.sender.email}</Text>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptRequest(item.id)}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Friends</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : friends.length > 0 ? (
          <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.friendItem}>
                <Text style={styles.friendText}>
                  {item.from_user_id === user.id
                    ? item.receiver.email
                    : item.sender.email}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noResultsText}>No friends added yet.</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.addFriendButton}
        onPress={() => router.push("/friends/add-friends")}
      >
        <Text style={styles.addFriendButtonText}>Add Friends</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  friendItem: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
  },
  friendText: {
    fontSize: 16,
    color: "#333",
  },
  noResultsText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
  addFriendButton: {
    backgroundColor: "#40E0D0",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  addFriendButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default FriendsScreen;
