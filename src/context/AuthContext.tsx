<<<<<<< HEAD
<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useState } from 'react';
=======
import { createContext, useContext, useEffect, useState } from 'react';
>>>>>>> 89f5a0d (Initial commit)
=======
import { createContext, useContext, useEffect, useState } from 'react';
>>>>>>> ec7016ec4307d6b0c02009c6f3b64a524d835b06
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current auth state
    authService.getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
<<<<<<< HEAD
<<<<<<< HEAD
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
=======
=======
>>>>>>> ec7016ec4307d6b0c02009c6f3b64a524d835b06
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userObj = await authService.getCurrentUser();
        setUser(userObj);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
<<<<<<< HEAD
>>>>>>> 89f5a0d (Initial commit)
=======
>>>>>>> ec7016ec4307d6b0c02009c6f3b64a524d835b06
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await authService.signInWithGitHub();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}