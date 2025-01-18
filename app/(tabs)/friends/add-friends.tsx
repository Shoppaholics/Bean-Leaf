import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { searchUsers, sendFriendRequest } from "../../(api)/userServices";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";

const AddFriendsScreen = () => {
  const [searchString, setSearchString] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setResults([]);
        setSearchString("");
        setLoading(false);
        setSearchClicked(false);
        setError(null);
      };
    }, [])
  );

  const handleSearch = async () => {
    setSearchClicked(true);
    setLoading(true);
    setError(null);

    if (!searchString.trim()) {
      setLoading(false);
      setError("Please enter an email to search");
      return;
    }

    try {
      const data = await searchUsers(searchString);
      setResults(data);
    } catch (error) {
      const err = error as Error;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Find Friends
      </ThemedText>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by email"
          value={searchString}
          onChangeText={setSearchString}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          <ThemedText style={styles.searchButtonText}>
            {loading ? <ActivityIndicator color="white" /> : "Search"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

      {searchClicked && results.length === 0 && !loading && (
        <View style={styles.messageContainer}>
          <ThemedText style={styles.messageText}>
            {searchString.trim() === ""
              ? "Please enter an email to search"
              : "No available users found with that email. They might be already your friend or have a pending request."}
          </ThemedText>
        </View>
      )}

      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          {results.map((item) => (
            <View key={item.id} style={styles.resultCard}>
              <View style={styles.userInfo}>
                <ThemedText style={styles.emailText}>{item.email}</ThemedText>
              </View>
              {item.status === "PENDING" ? (
                <View style={styles.pendingBadge}>
                  <ThemedText style={styles.pendingText}>Pending</ThemedText>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => sendFriendRequest(item.id)}
                >
                  <ThemedText style={styles.addButtonText}>Add</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#0284c7",
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsContainer: {
    gap: 12,
  },
  resultCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  addButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  errorText: {
    color: "#ef4444",
    marginBottom: 12,
    textAlign: "center",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  pendingBadge: {
    backgroundColor: "#9ca3af",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "center",
  },
  pendingText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default AddFriendsScreen;
