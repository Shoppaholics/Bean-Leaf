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
import {
  fetchFriends,
  deleteFriendRequest,
  deleteFriendship,
} from "../../(api)/userServices"; // Replace with the correct path
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

  const handleDeleteRequest = async (requestId: string) => {
    Alert.alert(
      "Delete Request",
      "Are you sure you want to delete this friend request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFriendRequest(requestId);
              loadFriends();
            } catch (error) {
              Alert.alert("Error", "Failed to delete request");
            }
          },
        },
      ]
    );
  };

  const handleDeleteFriend = async (friendId: string) => {
    Alert.alert(
      "Remove Friend",
      "Are you sure you want to remove this friend?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFriendship(friendId);
              loadFriends();
            } catch (error) {
              Alert.alert("Error", "Failed to remove friend");
            }
          },
        },
      ]
    );
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
                <View style={styles.userInfo}>
                  <Text style={styles.emailText}>{item.sender.email}</Text>
                  <Text style={styles.requestText}>
                    wants to be your friend
                  </Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAcceptRequest(item.id)}
                  >
                    <Text style={styles.buttonText}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteRequest(item.id)}
                  >
                    <Text style={styles.buttonText}>×</Text>
                  </TouchableOpacity>
                </View>
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
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleDeleteFriend(item.id)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  requestText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
  },
  removeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 20,
  },
});

export default FriendsScreen;
