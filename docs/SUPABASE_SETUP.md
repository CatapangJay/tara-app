# Supabase Authentication Setup Guide

## Step 1: Install Dependencies

Run the following command to install Supabase and required dependencies:

```bash
npm install @supabase/supabase-js react-native-url-polyfill
```

Or if you prefer yarn:

```bash
yarn add @supabase/supabase-js react-native-url-polyfill
```

## Step 2: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the details:
   - Name: tara-ride-hailing
   - Database Password: (generate a strong password)
   - Region: Southeast Asia (Singapore) - closest to Philippines
   - Click "Create new project"

## Step 3: Get Your Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - Project URL
   - `anon` `public` key

## Step 4: Configure Environment Variables

1. Create a `.env` file in your project root:

```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 5: Set Up Database Schema

1. Go to Supabase Dashboard → SQL Editor
2. Copy and run the SQL from `docs/SUPABASE_AUTH_GUIDE.md` (Section 2.1)
3. This will create:
   - `users` table
   - `drivers` table
   - `passengers` table
   - `vehicles` table
   - Row Level Security policies

## Step 6: Configure Storage Buckets

1. Go to Storage → Create bucket
2. Create the following buckets:
   - `avatars` (public)
   - `driver-documents` (private)
   - `vehicle-photos` (public)

## Step 7: Enable Phone Authentication

1. Go to Authentication → Providers
2. Enable "Phone" provider
3. For development, you can use test mode
4. For production, you'll need to set up Twilio

## Step 8: Test the Setup

Run your app:

```bash
npm start
```

The app will warn you if Supabase is not configured properly.

## Troubleshooting

**Error: Cannot find module '@supabase/supabase-js'**
- Run: `npm install @supabase/supabase-js react-native-url-polyfill`

**Error: Supabase credentials not found**
- Make sure your `.env` file exists and has the correct values
- Restart your development server after adding .env

**Database connection error**
- Check that your Supabase project is active
- Verify your URL and anon key are correct

## Next Steps

Once dependencies are installed and Supabase is configured:
1. The AuthContext will be created automatically
2. Authentication screens will be added
3. Navigation will be updated to handle auth state

## Current Status

✅ Supabase client created (`src/services/supabase/supabaseClient.ts`)
✅ Environment configuration ready (`.env.example`)
✅ Database types defined
⏳ Waiting for: `npm install @supabase/supabase-js react-native-url-polyfill`

After installing, the TypeScript errors will be resolved!
