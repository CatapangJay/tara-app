import AsyncStorage from '@react-native-async-storage/async-storage';

// Type stubs for when @supabase/supabase-js is not installed
// These will be replaced by actual types once the package is installed
type SupabaseClient = any;

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase packages are installed
let createClient: any;
let isPackageInstalled = false;

try {
  // Dynamic import to handle missing package gracefully
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const supabaseModule = require('@supabase/supabase-js');
  createClient = supabaseModule.createClient;
  isPackageInstalled = true;
  
  // Load URL polyfill if available
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react-native-url-polyfill/auto');
  } catch {
    console.warn('react-native-url-polyfill not installed');
  }
} catch {
  console.warn(
    '📦 Supabase packages not installed.\n' +
    'To enable authentication, run:\n' +
    'npm install @supabase/supabase-js react-native-url-polyfill'
  );
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials not found in environment variables.\n' +
    'Authentication features will not work until you:\n' +
    '1. Create a Supabase project at https://supabase.com\n' +
    '2. Copy your project URL and anon key\n' +
    '3. Add them to your .env file'
  );
}

// Create Supabase client or mock client
export const supabase: SupabaseClient = isPackageInstalled && createClient
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : {
      // Mock client for when package is not installed
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOtp: async () => ({ error: new Error('Supabase not installed') }),
        verifyOtp: async () => ({ error: new Error('Supabase not installed') }),
        signInWithPassword: async () => ({ error: new Error('Supabase not installed') }),
        signUp: async () => ({ data: null, error: new Error('Supabase not installed') }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Supabase not installed') }),
          }),
        }),
        insert: async () => ({ error: new Error('Supabase not installed') }),
        update: () => ({
          eq: async () => ({ error: new Error('Supabase not installed') }),
        }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ error: new Error('Supabase not installed') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    };

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(
    isPackageInstalled &&
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== '' &&
    supabaseAnonKey !== ''
  );
};

export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_ANON_KEY = supabaseAnonKey;

// Database type definitions
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string | null;
          email: string | null;
          full_name: string;
          avatar_url: string | null;
          role: 'passenger' | 'driver' | 'both';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone?: string | null;
          email?: string | null;
          full_name: string;
          avatar_url?: string | null;
          role?: 'passenger' | 'driver' | 'both';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string | null;
          email?: string | null;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'passenger' | 'driver' | 'both';
          created_at?: string;
          updated_at?: string;
        };
      };
      drivers: {
        Row: {
          id: string;
          user_id: string;
          license_number: string;
          license_photo_url: string | null;
          verification_status: 'pending' | 'verified' | 'rejected';
          verification_notes: string | null;
          rating: number;
          total_rides: number;
          subscription_plan: 'basic' | 'pro' | 'premium';
          subscription_expires_at: string | null;
          is_online: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          license_number: string;
          license_photo_url?: string | null;
          verification_status?: 'pending' | 'verified' | 'rejected';
          verification_notes?: string | null;
          rating?: number;
          total_rides?: number;
          subscription_plan?: 'basic' | 'pro' | 'premium';
          subscription_expires_at?: string | null;
          is_online?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          license_number?: string;
          license_photo_url?: string | null;
          verification_status?: 'pending' | 'verified' | 'rejected';
          verification_notes?: string | null;
          rating?: number;
          total_rides?: number;
          subscription_plan?: 'basic' | 'pro' | 'premium';
          subscription_expires_at?: string | null;
          is_online?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      passengers: {
        Row: {
          id: string;
          user_id: string;
          rating: number;
          total_rides: number;
          favorite_locations: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          rating?: number;
          total_rides?: number;
          favorite_locations?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          rating?: number;
          total_rides?: number;
          favorite_locations?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          driver_id: string;
          vehicle_type: 'tricycle' | 'motorcycle' | 'sedan' | 'suv';
          make: string;
          model: string;
          year: number;
          color: string;
          plate_number: string;
          registration_photo_url: string | null;
          capacity: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          vehicle_type: 'tricycle' | 'motorcycle' | 'sedan' | 'suv';
          make: string;
          model: string;
          year: number;
          color: string;
          plate_number: string;
          registration_photo_url?: string | null;
          capacity: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          vehicle_type?: 'tricycle' | 'motorcycle' | 'sedan' | 'suv';
          make?: string;
          model?: string;
          year?: number;
          color?: string;
          plate_number?: string;
          registration_photo_url?: string | null;
          capacity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
