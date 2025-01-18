import { supabase } from "@/lib/supabase";

// Function to search users by email
export const searchUsers = async (email: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email")
    .ilike("email", `%${email}%`); // Case-insensitive email search

  if (error) throw error;
  return data;
};

export const fetchFriends = async () => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error("No authenticated user found");

    // Fetch pending friend requests sent to current user
    const { data: pendingRequests, error: pendingError } = await supabase
      .from("friend_requests")
      .select(
        `
        id,
        from_user_id,
        status,
        sender:profiles!friend_requests_from_user_id_fkey(email)
      `
      )
      .eq("to_user_id", user.id)
      .eq("status", "PENDING");

    if (pendingError) throw pendingError;

    // Fetch accepted friends
    const { data: friends, error: friendsError } = await supabase
      .from("friend_requests")
      .select(
        `
        id,
        from_user_id,
        to_user_id,
        sender:profiles!friend_requests_from_user_id_fkey(email),
        receiver:profiles!friend_requests_to_user_id_fkey(email)
      `
      )
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .eq("status", "ACCEPTED");

    if (friendsError) throw friendsError;

    return {
      pendingRequests: pendingRequests || [],
      friends: friends || [],
    };
  } catch (error) {
    throw error;
  }
};

// Function to send a friend request
export const sendFriendRequest = async (toUserId: string) => {
  let fromUserId;
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw new Error("Unable to fetch authenticated user.");
    if (!user) throw new Error("No authenticated user found.");

    fromUserId = user.id;

    // Check if the friend request already exists
    const { data: existingRequest, error: fetchError } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("from_user_id", fromUserId)
      .eq("to_user_id", toUserId)
      .eq("status", "PENDING");

    if (fetchError) throw fetchError;

    if (existingRequest.length > 0) {
      alert("You have already sent a friend request to this user.");
      return; // Don't send a new request
    }

    const { data, error } = await supabase
      .from("friend_requests")
      .insert([
        { to_user_id: toUserId, from_user_id: fromUserId, status: "PENDING" },
      ]);

    if (error) throw error;
    alert("Success, Friend request sent!");
    return data;
  } catch (error: any) {
    alert(`Error: ${error.message}`);
  }
};
