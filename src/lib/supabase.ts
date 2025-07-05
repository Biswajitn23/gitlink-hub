import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const isSupabaseConfigured = supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseKey !== 'your-anon-key' &&
  supabaseUrl.trim() !== '' &&
  supabaseKey.trim() !== '';

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase is not configured. User authentication and bookmarks will be disabled.');
  console.warn('To enable these features:');
  console.warn('1. Create a Supabase project at https://supabase.com');
  console.warn('2. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the .env file');
}

// Create a mock client for when Supabase is not configured
const createMockClient = () => ({
  auth: {
    signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  },
  from: () => ({
    select: () => ({ eq: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }) }),
    insert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
    delete: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase not configured') }) }),
  }),
});

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : createMockClient();

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> ec7016ec4307d6b0c02009c6f3b64a524d835b06
// Expose supabase client for browser console debugging
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}

<<<<<<< HEAD
>>>>>>> 89f5a0d (Initial commit)
=======
>>>>>>> ec7016ec4307d6b0c02009c6f3b64a524d835b06
export const isSupabaseEnabled = isSupabaseConfigured;