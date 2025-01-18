import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Button } from 'react-native';
import { fetchFriends } from '../../(api)/userServices'; // Replace with the correct path
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const FriendsScreen = ({ navigation }: { navigation: any }) => {

  const router = useRouter();
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadFriends = async () => {
        try {
          setLoading(true);
          const friendsList = await fetchFriends();
          setFriends(friendsList);
        } catch (error) {
          alert(`Error ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      loadFriends();

      return () => setFriends([]);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>

      {loading ? (
        <Text>Loading friends...</Text>
      ) : friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <Text style={styles.friendText}>{item.email}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noResultsText}>No friends added yet.</Text>
      )}

      <TouchableOpacity
        style={styles.addFriendButton}
      >
        <Text style={styles.addFriendButtonText}>Add Friends</Text>
        <Button title="Add Friends" onPress={() => router.push('/friends/add-friends')} />
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  friendItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  friendText: {
    fontSize: 16,
    color: '#333',
  },
  noResultsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  addFriendButton: {
    backgroundColor: '#40E0D0',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  addFriendButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FriendsScreen;