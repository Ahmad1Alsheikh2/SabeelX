import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create regular Supabase client for auth operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Create admin client for profile operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper function to get user session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// Helper function to get user
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error getting user profile:', error.message);
    return null;
  }
  return data;
};

// Real-time subscription for mentor availability
export const subscribeToMentorAvailability = (mentorId: string, callback: (payload: any) => void) => {
  return supabase
    .from('mentor_availability')
    .on('*', (payload) => {
      if (payload.new.mentor_id === mentorId) {
        callback(payload);
      }
    })
    .subscribe();
};

// Real-time subscription for bookings
export const subscribeToBookings = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .from('bookings')
    .on('*', (payload) => {
      if (payload.new.mentor_id === userId || payload.new.mentee_id === userId) {
        callback(payload);
      }
    })
    .subscribe();
}; 