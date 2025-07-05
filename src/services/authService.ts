import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export class AuthService {
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

<<<<<<< HEAD
=======
  async signInWithGitHub() {
    try {
      // Only call if real Supabase client (not mock)
      if ((supabase.auth as any).signInWithOAuth) {
        const { error } = await (supabase.auth as any).signInWithOAuth({ provider: 'github' });
        if (error) throw error;
      } else {
        throw new Error('Supabase OAuth is not configured.');
      }
    } catch (error) {
      console.error('GitHub sign in error:', error);
      throw error;
    }
  }

>>>>>>> 89f5a0d (Initial commit)
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
<<<<<<< HEAD
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Get session error:', error);
        return null;
      }

      if (!session) {
        // Don't throw an error for missing session, just return null
        console.log('No active session found');
        return null;
      }

      return session.user;
=======
      // Use getUser for both real and mock clients
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Get user error:', error);
        return null;
      }
      const supaUser = data?.user;
      console.log('Supabase user:', supaUser);
      if (!supaUser) return null;
      // Extract GitHub info from user_metadata and identities
      const { user_metadata, identities } = supaUser;
      let avatar_url = user_metadata?.avatar_url || '';
      let name = user_metadata?.full_name || user_metadata?.name || supaUser.email || '';
      let login = user_metadata?.user_name || user_metadata?.login || '';
      // Fallback: try to get login from email if not present
      if (!login && supaUser.email && supaUser.email.includes('@')) {
        login = supaUser.email.split('@')[0];
      }
      // Fallback: try to get avatar_url and login from identities if not in user_metadata
      if (Array.isArray(identities) && identities.length > 0) {
        const identity = identities[0]?.identity_data || {};
        avatar_url = avatar_url || identity.avatar_url || '';
        name = name || identity.full_name || identity.name || '';
        login = login || identity.user_name || identity.login || '';
      }
      // If still missing, set login to empty string
      login = login || '';
      return {
        id: supaUser.id,
        login,
        name,
        avatar_url,
        email: supaUser.email || undefined,
      };
>>>>>>> 89f5a0d (Initial commit)
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

<<<<<<< HEAD
  async getSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Get session error:', error);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }
=======
  // Remove or comment out getSession (not supported by mock client)
  // async getSession(): Promise<Session | null> {
  //   try {
  //     const { data: { session }, error } = await supabase.auth.getSession();
  //     if (error) {
  //       console.error('Get session error:', error);
  //       return null;
  //     }
  //     return session;
  //   } catch (error) {
  //     console.error('Get session error:', error);
  //     return null;
  //   }
  // }
>>>>>>> 89f5a0d (Initial commit)

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();