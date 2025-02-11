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
    console.error("Error getting saved locations:", error);
    return [];
  }
}

export const saveLocation = async (
  userId: string,
  locationName: string,
  description: string,
  drinkType: string,
  rating: number,
  latitude: number,
  longitude: number,
  imageUrl?: string
) => {
  const { data, error } = await supabase.from("my_locations").insert([
    {
      user_id: userId,
      location_name: locationName,
      description,
      drink_type: drinkType,
      rating,
      location_latitude: latitude,
      location_longitude: longitude,
      image_url: imageUrl,
    },
  ]);

  if (error) throw error;
  return data;
};

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
