import { supabase } from "@/lib/supabase";

// Function to search users by email
export const searchUsers = async (email: string) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error("Not authenticated");

    // Get users matching the search
    const { data: searchResults, error: searchError } = await supabase
      .from("profiles")
      .select("id, email")
      .ilike("email", `%${email}%`)
      .neq("id", user.id);

    if (searchError) throw searchError;
    if (!searchResults) return [];

    // Get friend requests status
    const { data: friendRequests, error: friendError } = await supabase
      .from("friend_requests")
      .select("*")
      .or(
        `and(from_user_id.eq.${user.id},to_user_id.in.(${searchResults.map((r) => r.id).join(",")})),` +
          `and(to_user_id.eq.${user.id},from_user_id.in.(${searchResults.map((r) => r.id).join(",")}))`
      );

    if (friendError) throw friendError;

    // Add status to search results
    const resultsWithStatus = searchResults.map((result) => {
      const request = friendRequests?.find(
        (req) =>
          (req.from_user_id === result.id && req.to_user_id === user.id) ||
          (req.to_user_id === result.id && req.from_user_id === user.id)
      );
      return {
        ...result,
        status: request?.status || null,
        requestType: request?.from_user_id === user.id ? "sent" : "received",
      };
    });

    return resultsWithStatus;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};

export const fetchFriendsFavourites = async (friends: any) => {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error("Not authenticated");

    let allLocations: Array<any> = [];

    for (const eachFriend of friends) {
      console.log(eachFriend);

      if (eachFriend.from_user_id === user.id) {
      
        const {data : eachFriendLocation } = await supabase
          .from("my_locations")
          .select("*")
          .eq("user_id", eachFriend.to_user_id);

        allLocations = allLocations.concat(eachFriendLocation)

      } else {
        console.log(eachFriend);
        console.log(1);

        const {data : eachFriendLocation } = await supabase
          .from("my_locations")
          .select("*")
          .eq("user_id", eachFriend.from_user_id);    

        allLocations = allLocations.concat(eachFriendLocation)

      }

    }
    return allLocations;

  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }

}

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

export const deleteFriendRequest = async (requestId: string) => {
  const { error } = await supabase
    .from("friend_requests")
    .delete()
    .eq("id", requestId);

  if (error) throw error;
};

export const deleteFriendship = async (friendId: string) => {
  const { error } = await supabase
    .from("friend_requests")
    .delete()
    .eq("id", friendId);

  if (error) throw error;
};
