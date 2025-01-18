import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSavedLocations(
  userId: string
): Promise<SavedLocation[]> {
  try {
    const { data, error } = await supabase
      .from("my_locations")
      .select("*")
      .eq("user_id", userId);

    console.log("Saved locations", data);

    return data || [];
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
}

export async function saveLocation(
  userId: string,
  locationName: string,
  description: string,
  drinkType: string,
  rating: number,
  latitude: number,
  longitude: number
) {
  try {
    const { data, error } = await supabase.from("my_locations").insert([
      {
        user_id: userId,
        location_name: locationName,
        description: description,
        drink_type: drinkType,
        rating: rating,
        location_latitude: latitude,
        location_longitude: longitude,
      },
    ]);

    return { success: true, data };
  } catch (error) {
    console.error("Error saving location to database:", error);
    return { success: false, error: "Error saving location" };
  }
}

export async function deleteSavedLocation(locationId: number, userId: string) {
  try {
    const { data, error } = await supabase
      .from("my_locations")
      .delete()
      .eq("id", locationId)
      .eq("user_id", userId);

    return { success: true, data };
  } catch (error) {
    console.error("Error deleting saved location:", error);
    return { success: false, error: "Error deleting saved location" };
  }
}
