import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NewProfileScreen() {
  const { id, email } = useLocalSearchParams<{ id: string; email: string }>();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProfile = async () => {
    if (!fullName.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", id);

      if (profileError) throw profileError;

      // const { error: signInError } = await supabase.auth.signInWithPassword({
      //   email,
      //   password: "",
      // });

      // if (signInError) throw signInError;

      router.replace("/(tabs)");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Complete Your Profile
      </ThemedText>

      {error && <ThemedText style={styles.error}>{error}</ThemedText>}

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateProfile}
        disabled={loading}
      >
        <ThemedText style={styles.buttonText}>
          {loading ? "Creating Profile..." : "Continue"}
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
});
