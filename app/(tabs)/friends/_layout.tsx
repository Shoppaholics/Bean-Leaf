import React from 'react';
import { Stack } from 'expo-router';

export default function FriendsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="friends"
        options={{ title: 'Friends List' }} // Friends screen title
      />
      <Stack.Screen
        name="add-friends"
        options={{ title: 'Add Friends' }} // Add Friends screen title
      />
    </Stack>
  );
}
