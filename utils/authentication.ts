import { supabase } from "@/lib/supabase";

export async function getUserId() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error retrieving user:", error.message);
      return null;
    }

    return user?.id || null; // Returns the user_id or null if not authenticated
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}
