# Tara App - Supabase Authentication Guide

## Overview
This guide covers implementing Supabase authentication for the Tara ride-hailing app, including phone OTP, email/password, social login, and driver verification.

---

## Phase 1: Supabase Project Setup

### 1.1 Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com
   - Sign in or create account
   - Click "New Project"

2. **Project Configuration**
   ```
   Project Name: tara-ride-hailing
   Database Password: [Generate strong password]
   Region: Southeast Asia (Singapore) - closest to Philippines
   Pricing Plan: Free (for development)
   ```

3. **Get Project Credentials**
   - Go to Project Settings → API
   - Copy `Project URL` (e.g., https://xxxxx.supabase.co)
   - Copy `anon` `public` key
   - **NEVER commit these to git!**

### 1.2 Install Dependencies

```bash
npm install @supabase/supabase-js
npm install expo-secure-store  # For secure token storage
```

### 1.3 Environment Variables

Create `.env` file in project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Update `.env.example`:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Add to `.gitignore`:

```
.env
.env.local
```

### 1.4 Supabase Client Setup

Create `src/services/supabase/supabaseClient.ts`:

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## Phase 2: Database Schema

### 2.1 Database Tables

Run these SQL commands in Supabase SQL Editor:

#### Users Table (extends auth.users)
```sql
-- Create users profile table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(20) CHECK (role IN ('passenger', 'driver', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Create policy: Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create policy: Users can insert their own data
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Drivers Table
```sql
-- Create drivers table
CREATE TABLE public.drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  license_photo_url TEXT,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_notes TEXT,
  rating DECIMAL(2,1) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  subscription_plan VARCHAR(20) DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'pro', 'premium')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  is_online BOOLEAN DEFAULT false,
  current_location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Policies for drivers table
CREATE POLICY "Drivers can view own data" ON public.drivers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Drivers can update own data" ON public.drivers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Drivers can insert own data" ON public.drivers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Passengers can view driver data for active rides
CREATE POLICY "Passengers can view driver data" ON public.drivers
  FOR SELECT USING (verification_status = 'verified');

-- Trigger for updated_at
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Vehicles Table
```sql
-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
  vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('tricycle', 'motorcycle', 'sedan', 'suv')),
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR(50) NOT NULL,
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  registration_photo_url TEXT,
  capacity INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Drivers can view own vehicles" ON public.vehicles
  FOR SELECT USING (
    driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid())
  );

CREATE POLICY "Drivers can manage own vehicles" ON public.vehicles
  FOR ALL USING (
    driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid())
  );

-- Trigger
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Passengers Table
```sql
-- Create passengers table
CREATE TABLE public.passengers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating DECIMAL(2,1) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  favorite_locations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Passengers can view own data" ON public.passengers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Passengers can update own data" ON public.passengers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Passengers can insert own data" ON public.passengers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger
CREATE TRIGGER update_passengers_updated_at BEFORE UPDATE ON public.passengers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.2 Storage Buckets

Create storage buckets in Supabase Dashboard → Storage:

1. **Profile Photos** (`avatars`)
   - Public bucket
   - Max file size: 2MB
   - Allowed types: image/jpeg, image/png

2. **Driver Documents** (`driver-documents`)
   - Private bucket
   - Max file size: 5MB
   - Allowed types: image/jpeg, image/png, application/pdf

3. **Vehicle Photos** (`vehicle-photos`)
   - Public bucket
   - Max file size: 3MB
   - Allowed types: image/jpeg, image/png

**Storage Policies:**

```sql
-- Avatars bucket - anyone can view, users can upload their own
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Driver documents - only owner can access
CREATE POLICY "Users can view own driver documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'driver-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own driver documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'driver-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## Phase 3: Authentication Context

### 3.1 Auth Context Implementation

Create `src/context/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase/supabaseClient';

interface UserProfile {
  id: string;
  phone?: string;
  email?: string;
  full_name: string;
  avatar_url?: string;
  role: 'passenger' | 'driver' | 'both';
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithPhone = async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });
    if (error) throw error;
  };

  const verifyOTP = async (phone: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    // Create user profile
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: 'passenger', // default
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setUserProfile(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;
    await refreshProfile();
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  const value = {
    user,
    userProfile,
    session,
    isLoading,
    isAuthenticated: !!user,
    signInWithPhone,
    verifyOTP,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
    refreshProfile,
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
```

### 3.2 Wrap App with AuthProvider

Update `App.tsx` or `_layout.tsx`:

```typescript
import { AuthProvider } from '@/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* Your existing app structure */}
      <AppNavigator />
    </AuthProvider>
  );
}
```

---

## Phase 4: Authentication Screens

### 4.1 Welcome Screen

Create `src/screens/auth/WelcomeScreen.tsx`:

```typescript
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '@/components/common/Button';

export function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/tara-logo.png')} style={styles.logo} />
      
      <Text style={styles.title}>Tara!</Text>
      <Text style={styles.subtitle}>
        Walang komisyon. 100% sa driver.
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button
          label="Sign Up"
          onPress={() => navigation.navigate('PhoneNumber', { mode: 'signup' })}
          variant="primary"
        />
        <Button
          label="Log In"
          onPress={() => navigation.navigate('PhoneNumber', { mode: 'login' })}
          variant="outline"
        />
        <Button
          label="Continue as Guest"
          onPress={() => navigation.navigate('RoleSelection')}
          variant="secondary"
        />
      </View>
      
      <Text style={styles.footer}>
        By continuing, you agree to our Terms & Privacy Policy
      </Text>
    </View>
  );
}
```

### 4.2 Phone Number Screen

Create `src/screens/auth/PhoneNumberScreen.tsx`:

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { Toast } from '@/components/common/Toast';

export function PhoneNumberScreen({ navigation, route }) {
  const { mode } = route.params; // 'signup' or 'login'
  const { signInWithPhone } = useAuth();
  const [phone, setPhone] = useState('+63');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (phone.length < 12) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await signInWithPhone(phone);
      navigation.navigate('OTPVerification', { phone, mode });
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your phone number</Text>
      <Text style={styles.subtitle}>
        We'll send you a code to verify your number
      </Text>
      
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="+63 XXX XXX XXXX"
        maxLength={13}
      />
      
      <Button
        label="Send OTP"
        onPress={handleSendOTP}
        loading={isLoading}
        disabled={phone.length < 12}
      />
      
      <Toast
        visible={!!error}
        type="error"
        message={error}
        onHide={() => setError('')}
      />
    </View>
  );
}
```

### 4.3 OTP Verification Screen

Create `src/screens/auth/OTPVerificationScreen.tsx`:

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';

export function OTPVerificationScreen({ navigation, route }) {
  const { phone, mode } = route.params;
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when complete
    if (index === 5 && value) {
      verifyCode(newOtp.join(''));
    }
  };

  const verifyCode = async (code: string) => {
    setIsLoading(true);
    try {
      await verifyOTP(phone, code);
      
      // Check if profile exists
      if (mode === 'signup') {
        navigation.navigate('ProfileSetup');
      } else {
        // Existing user, navigate to app
        navigation.navigate('App');
      }
    } catch (error) {
      // Show error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter verification code</Text>
      <Text style={styles.subtitle}>
        Sent to {phone}
      </Text>
      
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => inputRefs.current[index] = ref!}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleOtpChange(index, value)}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>
      
      <Button
        label={canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
        disabled={!canResend}
        variant="outline"
      />
    </View>
  );
}
```

---

## Phase 5: Profile Setup

### 5.1 Profile Setup Screen

Create `src/screens/auth/ProfileSetupScreen.tsx`:

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/services/supabase/supabaseClient';

export function ProfileSetupScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [role, setRole] = useState<'passenger' | 'driver' | 'both'>('passenger');
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri: string): Promise<string> => {
    const ext = uri.split('.').pop();
    const fileName = `${user!.id}.${ext}`;
    const filePath = `${user!.id}/${fileName}`;

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: `image/${ext}`,
      name: fileName,
    } as any);

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, formData);

    if (error) throw error;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      let avatarUrl;
      if (avatarUri) {
        avatarUrl = await uploadAvatar(avatarUri);
      }

      await updateProfile({
        full_name: fullName,
        email: email || undefined,
        avatar_url: avatarUrl,
        role,
      });

      // Create role-specific records
      if (role === 'passenger' || role === 'both') {
        await supabase.from('passengers').insert({
          user_id: user!.id,
        });
      }

      if (role === 'driver' || role === 'both') {
        navigation.navigate('DriverOnboarding');
      } else {
        navigation.navigate('App');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Text>Complete Your Profile</Text>
      
      <TouchableOpacity onPress={pickImage}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={{ width: 100, height: 100 }} />
        ) : (
          <View style={{ width: 100, height: 100, backgroundColor: '#ccc' }} />
        )}
      </TouchableOpacity>
      
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      
      <TextInput
        placeholder="Email (optional)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <Text>I am a:</Text>
      {/* Role selection buttons */}
      
      <Button
        label="Continue"
        onPress={handleComplete}
        loading={isLoading}
        disabled={!fullName}
      />
    </View>
  );
}
```

---

## Phase 6: Driver Verification

### 6.1 Driver Onboarding

Create `src/screens/auth/DriverOnboardingScreen.tsx` for collecting:
- Driver's license number and photo
- Vehicle information
- Vehicle registration photo

Save to `drivers` and `vehicles` tables with `verification_status: 'pending'`.

### 6.2 Admin Verification (Future)

Create admin dashboard to review and approve drivers.

---

## Phase 7: Testing

### 7.1 Test Phone Auth

```bash
# In Supabase dashboard, enable phone auth
# Go to Authentication → Providers → Phone
# Enable "Phone" provider
# Note: Twilio integration required for production
```

### 7.2 Test Email Auth

```bash
# Enable Email provider in Supabase dashboard
# Test sign up, email verification, password reset
```

---

## Quick Start Checklist

- [ ] Create Supabase project
- [ ] Copy URL and anon key to `.env`
- [ ] Run database schema SQL
- [ ] Create storage buckets
- [ ] Install dependencies
- [ ] Implement AuthContext
- [ ] Create auth screens
- [ ] Test phone OTP flow
- [ ] Test profile creation
- [ ] Test driver onboarding

---

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Phone Auth Setup**: https://supabase.com/docs/guides/auth/phone-login
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security

---

**Note**: For production, you'll need to set up Twilio for SMS OTP. For development, use the test OTP provided in Supabase dashboard.
