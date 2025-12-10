import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured, supabase } from '../services/supabase/supabaseClient';

// Type stubs for when @supabase/supabase-js is not installed
type Session = any;
type User = any;
type AuthError = Error;

// User profile from our users table
export interface UserProfile {
  id: string;
  phone?: string | null;
  email?: string | null;
  full_name: string;
  avatar_url?: string | null;
  role: 'passenger' | 'driver' | 'both';
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  // Auth state
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSupabaseEnabled: boolean;
  hasCompletedOnboarding: boolean;
  
  // Auth methods
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  
  // Profile methods
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  
  // Onboarding
  completeOnboarding: () => Promise<void>;
  
  // Guest mode (no auth required)
  continueAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseEnabled] = useState(isSupabaseConfigured());
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeAuth = async () => {
    console.log('🔧 Auth init', {
      isSupabaseEnabled,
      supabaseUrl: SUPABASE_URL || 'undefined',
      supabaseKeyPreview: (SUPABASE_ANON_KEY ?? '').slice(0, 8),
    });
    // Check onboarding status
    const onboardingComplete = await AsyncStorage.getItem('@tara:onboardingComplete');
    setHasCompletedOnboarding(onboardingComplete === 'true');

    if (!isSupabaseEnabled) {
      console.log('📱 Supabase not configured - running in guest mode');
      // Check if user was in guest mode
      const guestMode = await AsyncStorage.getItem('@tara:guestMode');
      if (guestMode === 'true') {
        // Load mock profile for guest mode
        await loadGuestProfile();
      }
      setIsLoading(false);
      return;
    }

    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event: string, session: any) => {
          console.log('🔐 Auth state changed:', _event);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await loadUserProfile(session.user.id);
          } else {
            setUserProfile(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadGuestProfile = async () => {
    // Load mock profile from AsyncStorage for guest mode
    const currentRole = await AsyncStorage.getItem('@tara:currentRole');
    const guestProfile: UserProfile = {
      id: 'guest',
      full_name: currentRole === 'driver' ? 'Juan dela Cruz' : 'Maria Santos',
      role: (currentRole as 'passenger' | 'driver') || 'passenger',
      email: null,
      phone: null,
      avatar_url: null,
    };
    setUserProfile(guestProfile);
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseEnabled) {
      return { error: new Error('Supabase not configured') as AuthError };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseEnabled) {
      return { error: new Error('Supabase not configured') as AuthError };
    }

    try {
      console.log('🆕 signUpWithEmail invoked', { email, hasPassword: !!password, fullNameLength: fullName.length });

      if (SUPABASE_URL) {
        try {
          const healthResponse = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
            headers: SUPABASE_ANON_KEY
              ? {
                  apikey: SUPABASE_ANON_KEY,
                  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                }
              : undefined,
          });
          console.log('Supabase health check', {
            status: healthResponse.status,
            ok: healthResponse.ok,
          });

          if (!healthResponse.ok) {
            const healthBody = await healthResponse.text();
            console.warn('Supabase health response body', healthBody.slice(0, 200));
          }
        } catch (healthError) {
          console.error('Supabase health check failed', healthError);
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Supabase signUp error', error);
        return { error };
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role: 'passenger', // default role
        });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected signUpWithEmail failure', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    if (isSupabaseEnabled) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    }
    
    // Clear all local storage
    await AsyncStorage.multiRemove([
      '@tara:guestMode',
      '@tara:currentRole',
      '@tara:user',
      '@tara:onboardingComplete', // Clear onboarding status on sign out
    ]);
    
    setUser(null);
    setUserProfile(null);
    setSession(null);
    setHasCompletedOnboarding(false);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !isSupabaseEnabled) {
      throw new Error('Not authenticated or Supabase not configured');
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      throw error;
    }

    await refreshProfile();
  };

  const refreshProfile = async () => {
    if (user && isSupabaseEnabled) {
      await loadUserProfile(user.id);
    } else if (!isSupabaseEnabled) {
      await loadGuestProfile();
    }
  };

  const continueAsGuest = async () => {
    // Enable guest mode
    await AsyncStorage.setItem('@tara:guestMode', 'true');
    await AsyncStorage.setItem('@tara:onboardingComplete', 'true');
    setHasCompletedOnboarding(true);
    await loadGuestProfile();
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('@tara:onboardingComplete', 'true');
    setHasCompletedOnboarding(true);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    isLoading,
    isAuthenticated: !!user || (userProfile?.id === 'guest'),
    isSupabaseEnabled,
    hasCompletedOnboarding,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
    refreshProfile,
    completeOnboarding,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
