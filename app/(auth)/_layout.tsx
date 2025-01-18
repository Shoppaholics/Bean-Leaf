import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="newProfile"
        options={{
          headerShown: false,
          // Prevent going back to signup
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
