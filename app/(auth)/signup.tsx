import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { supabase } from "@/lib/supabase";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignUp() {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Signup successful - you might want to show a verification message
      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Sign Up
      </ThemedText>

      {error && <ThemedText style={styles.error}>{error}</ThemedText>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
        disabled={loading}
      >
        <ThemedText style={styles.buttonText}>
          {loading ? "Loading..." : "Sign Up"}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("./login")}>
        <ThemedText style={styles.link}>
          Already have an account? Sign in
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0284c7",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "#ef4444",
    marginBottom: 10,
    textAlign: "center",
  },
  link: {
    color: "#0284c7",
    textAlign: "center",
    marginTop: 15,
  },
});
