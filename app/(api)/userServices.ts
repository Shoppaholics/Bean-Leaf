import { supabase } from '@/lib/supabase'; 

// Function to search users by email
export const searchUsers = async (email: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email')
    .ilike('email', `%${email}%`); // Case-insensitive email search

  if (error) throw error;
  return data;
};

export const fetchFriends = async () => {
  const { data, error } = await supabase
    .from('friend_requests') // Replace 'friends' with the correct table name
    .select('id, email'); // Select the required fields

  if (error) throw error;
  return data;
};

// Function to send a friend request
export const sendFriendRequest = async (toUserId: string) => {
  let fromUserId;
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw new Error('Unable to fetch authenticated user.');
    if (!user) throw new Error('No authenticated user found.');

    fromUserId = user.id;

    // Check if the friend request already exists
    const { data: existingRequest, error: fetchError } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('from_user_id', fromUserId)
      .eq('to_user_id', toUserId)
      .eq('status', 'PENDING');

    
    if (fetchError) throw fetchError;

    if (existingRequest) {
      alert('You have already sent a friend request to this user.');
      return; // Don't send a new request
    }

    const { data, error } = await supabase
    .from('friend_requests')
    .insert([
      { to_user_id: toUserId, 
        from_user_id: fromUserId,
        status: 'PENDING' }
    ]);

    if (error) throw error;
    alert('Success, Friend request sent!');
    return data;

  } catch (error: any) {
    alert(`Error: ${error.message}`);
  }

};