# Tara App - Complete Supabase Setup Guide

## 🚀 Quick Start Checklist

This is your complete setup guide. Follow each step in order:

- [ ] **Step 1**: Create Supabase project (5 minutes)
- [ ] **Step 2**: Run database schema (2 minutes)
- [ ] **Step 3**: Create storage buckets (3 minutes)
- [ ] **Step 4**: Enable phone authentication (5 minutes)
- [ ] **Step 5**: Test authentication flow (10 minutes)

**Total Time**: ~25 minutes

---

## Step 1: Create Supabase Project (5 minutes)

### 1.1 Sign Up and Create Project

1. **Go to Supabase**
   - Visit https://supabase.com
   - Click "Start your project"
   - Sign in with GitHub (recommended) or email

2. **Create New Project**
   - Click "New Project"
   - Fill in details:
     ```
     Organization: Your organization or personal
     Project Name: tara-ride-hailing
     Database Password: [Click "Generate password" - SAVE THIS!]
     Region: Southeast Asia (Singapore)
     Pricing Plan: Free
     ```
   - Click "Create new project"
   - ⏳ Wait 2-3 minutes for project to initialize

### 1.2 Get API Credentials

1. **Navigate to Settings**
   - Click **Settings** (gear icon in sidebar)
   - Click **API**

2. **Copy Credentials**
   - Find **Project URL**: `https://xxxxx.supabase.co`
   - Find **Project API keys** → **anon** **public**: `eyJhbG...`
   
3. **Add to .env File**
   - Open `c:\Projects\tara-app\.env`
   - Update with your values:
     ```env
     EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

4. **Verify Configuration**
   - Save `.env` file
   - Restart your app if it's running
   - Check console logs for "Supabase client initialized"

---

## Step 2: Run Database Schema (2 minutes)

### 2.1 Open SQL Editor

1. **In Supabase Dashboard**
   - Click **SQL Editor** in sidebar
   - Click **New query**

### 2.2 Run Database Schema

1. **Copy Schema SQL**
   - Open `c:\Projects\tara-app\docs\SUPABASE_DATABASE_SCHEMA.sql`
   - Copy ALL contents (Ctrl+A, Ctrl+C)

2. **Paste and Execute**
   - Paste into Supabase SQL Editor
   - Click **Run** button (or press Ctrl+Enter)
   - ✅ Should see: "Success. No rows returned"

3. **Verify Tables Created**
   - Click **Database** in sidebar
   - Click **Tables**
   - You should see:
     - ✅ users
     - ✅ drivers
     - ✅ passengers
     - ✅ vehicles
     - ✅ rides

### 2.3 Run Storage Policies

1. **Create New Query**
   - Click **SQL Editor** → **New query**

2. **Copy Storage SQL**
   - Open `c:\Projects\tara-app\docs\SUPABASE_STORAGE_SETUP.sql`
   - Copy ALL contents

3. **Paste and Execute**
   - Paste into SQL Editor
   - Click **Run**
   - ⚠️ Note: This will show errors if buckets don't exist yet
   - We'll create buckets in Step 3, then re-run this

---

## Step 3: Create Storage Buckets (3 minutes)

### 3.1 Create Avatars Bucket

1. **Navigate to Storage**
   - Click **Storage** in sidebar
   - Click **Create a new bucket**

2. **Configure Avatars Bucket**
   ```
   Name: avatars
   Public bucket: ✅ YES
   File size limit: 2 MB
   Allowed MIME types: image/jpeg, image/png, image/webp
   ```
   - Click **Create bucket**

### 3.2 Create Driver Documents Bucket

1. **Create New Bucket**
   - Click **Create a new bucket**

2. **Configure**
   ```
   Name: driver-documents
   Public bucket: ❌ NO (private)
   File size limit: 5 MB
   Allowed MIME types: image/jpeg, image/png, application/pdf
   ```
   - Click **Create bucket**

### 3.3 Create Vehicle Photos Bucket

1. **Create New Bucket**
   - Click **Create a new bucket**

2. **Configure**
   ```
   Name: vehicle-photos
   Public bucket: ✅ YES
   File size limit: 3 MB
   Allowed MIME types: image/jpeg, image/png, image/webp
   ```
   - Click **Create bucket**

### 3.4 Apply Storage Policies

1. **Go Back to SQL Editor**
   - Click **SQL Editor** → **New query**

2. **Re-run Storage Setup**
   - Copy `docs\SUPABASE_STORAGE_SETUP.sql` again
   - Paste and **Run**
   - ✅ Should succeed now that buckets exist

3. **Verify Policies**
   - Click **Storage** → Select any bucket
   - Click **Policies** tab
   - Should see policies listed

---

## Step 4: Enable Phone Authentication (5 minutes)

### 4.1 Enable Phone Provider

1. **Navigate to Authentication**
   - Click **Authentication** in sidebar
   - Click **Providers**

2. **Enable Phone**
   - Find **Phone** in the list
   - Toggle to **Enabled**

### 4.2 Configure SMS Provider

**Option A: Test Provider (Development)**

1. **Select Provider**
   - Click **Phone** provider settings
   - Under **SMS Provider**, select **Supabase Test Provider**
   - This sends OTPs to Dashboard logs (free, for testing only)

**Option B: Twilio (Production)**

1. **Create Twilio Account**
   - Go to https://www.twilio.com
   - Sign up and verify your account
   - Get **Account SID**, **Auth Token**, and a **Phone Number**

2. **Configure in Supabase**
   - Select **Twilio** as SMS provider
   - Enter:
     - Twilio Account SID
     - Twilio Auth Token
     - Twilio Phone Number (or Message Service SID)

3. **Customize SMS Template** (Optional)
   ```
   Your Tara verification code is: {{ .Token }}
   
   Expires in 60 seconds.
   ```

### 4.3 Configure Phone Settings

1. **Phone Settings**
   - In Phone provider settings:
     ```
     OTP expiration: 60 seconds
     OTP length: 6 digits
     Require E.164 format: ✅ YES
     ```

2. **Rate Limiting** (Important!)
   - Click **Rate Limits** tab
   - Enable rate limiting
   - Set: **5 SMS per hour per phone number**

---

## Step 5: Test Authentication Flow (10 minutes)

### 5.1 Start Your App

```bash
cd c:\Projects\tara-app
npm start
```

Press `a` for Android or `i` for iOS

### 5.2 Test Phone OTP Flow

1. **Navigate to Welcome Screen**
   - App should show WelcomeScreen if not authenticated
   - Click **"Sign Up"** or **"Log In"**

2. **Enter Phone Number**
   - Try: `+639171234567` (or your real Philippine number)
   - Click **"Send OTP"**
   - Should see success message

3. **Get OTP Code**

   **If using Test Provider:**
   - Go to Supabase Dashboard → **Authentication** → **Logs**
   - Find latest log with "OTP sent"
   - Copy the 6-digit code

   **If using Twilio:**
   - Check your phone for SMS
   - Copy the 6-digit code

4. **Verify OTP**
   - Enter the 6-digit code in app
   - Click **"Verify"**
   - Should navigate to Profile Setup screen

### 5.3 Complete Profile Setup

1. **Enter Profile Information**
   - Full Name: "Juan Dela Cruz"
   - Email: "juan@example.com"
   - Select Role: **Passenger** (for testing)

2. **Submit**
   - Click **"Complete Setup"**
   - Should navigate to main app

3. **Verify in Database**
   - Go to Supabase Dashboard → **Table Editor** → **users**
   - Should see new user with your phone number
   - Click **Authentication** → **Users**
   - Should see user listed

### 5.4 Test Guest Mode

1. **Sign Out**
   - In app, go to Settings/Account
   - Click **"Sign Out"**

2. **Continue as Guest**
   - On Welcome screen, click **"Continue as Guest"**
   - Should bypass auth and go to main app
   - Profile will show as "Guest"

---

## Verification Checklist

After completing setup, verify:

### Database
- [ ] `users` table exists with policies
- [ ] `drivers` table exists with policies
- [ ] `passengers` table exists with policies
- [ ] `vehicles` table exists with policies
- [ ] `rides` table exists with policies
- [ ] Indexes created
- [ ] Triggers working (updated_at auto-updates)

### Storage
- [ ] `avatars` bucket created (public)
- [ ] `driver-documents` bucket created (private)
- [ ] `vehicle-photos` bucket created (public)
- [ ] Storage policies applied

### Authentication
- [ ] Phone provider enabled
- [ ] SMS provider configured (Test or Twilio)
- [ ] Rate limiting enabled
- [ ] OTP expiry set to 60 seconds

### App Testing
- [ ] Phone OTP flow works
- [ ] Can receive OTP (via logs or SMS)
- [ ] Can verify OTP
- [ ] Profile setup works
- [ ] User created in database
- [ ] Guest mode works
- [ ] Sign out works

---

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"

**Solution:**
```bash
npm install @supabase/supabase-js react-native-url-polyfill
```

### "Supabase client not configured"

**Problem**: Missing or invalid .env credentials

**Solution:**
1. Check `.env` file exists in project root
2. Verify `EXPO_PUBLIC_SUPABASE_URL` is set
3. Verify `EXPO_PUBLIC_SUPABASE_ANON_KEY` is set
4. Restart app: `npm start`

### "OTP not received"

**If using Test Provider:**
1. Go to Dashboard → **Authentication** → **Logs**
2. Look for latest OTP in logs
3. Copy and paste into app

**If using Twilio:**
1. Check Twilio account balance
2. Verify phone number is correct E.164 format: `+639xxxxxxxxx`
3. Check Supabase logs for errors

### "Invalid OTP"

**Common causes:**
1. OTP expired (60 seconds)
2. Wrong code entered
3. Multiple OTPs sent (latest invalidates previous)

**Solution:**
- Request new OTP
- Enter code within 60 seconds
- Double-check digits

### "User not created in database"

**Check:**
1. Go to Supabase → **SQL Editor**
2. Run:
   ```sql
   SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;
   ```
3. If user exists in `auth.users` but not in `public.users`:
   - Check if trigger `on_auth_user_created` exists
   - Re-run database schema SQL

### Storage Upload Fails

**Check:**
1. Bucket exists
2. Storage policies applied
3. File size under limit
4. MIME type allowed

---

## Next Steps

Now that Supabase is set up:

### For Testing
- [ ] Test with multiple phone numbers
- [ ] Test driver onboarding flow
- [ ] Upload test avatar
- [ ] Create test ride

### For Development
- [ ] Replace mock data with Supabase queries
- [ ] Implement ride creation/management
- [ ] Add real-time ride updates
- [ ] Implement driver location tracking

### For Production
- [ ] Switch to Twilio for SMS
- [ ] Set up monitoring and alerts
- [ ] Enable RLS on all tables
- [ ] Set up backup strategy
- [ ] Configure custom domain (optional)
- [ ] Set up analytics

---

## Cost Considerations

### Free Tier Limits (Supabase)
- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth
- ✅ 50,000 monthly active users

### Paid Features
- **Phone Auth (Twilio)**: ~$0.07 per SMS (Philippines)
- **Database**: $25/month for 8 GB (if you exceed free tier)
- **Storage**: $0.125/GB/month

### Optimization Tips
- Use guest mode for testing
- Implement email auth as backup
- Add social login to reduce SMS costs
- Enable rate limiting to prevent abuse

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Tara App Docs**: 
  - `docs/SUPABASE_AUTH_GUIDE.md` - Detailed auth implementation
  - `docs/SUPABASE_PHONE_AUTH_SETUP.md` - Phone auth specifics
  - `docs/tasks.md` - All project tasks

---

## Summary

You've successfully set up:
- ✅ Supabase project with Philippine region
- ✅ Complete database schema with RLS
- ✅ Storage buckets for avatars, documents, photos
- ✅ Phone authentication with OTP
- ✅ Working authentication flow in app

**Ready to test?** Run `npm start` and try signing up with a phone number!

**Questions?** Check the troubleshooting section above or review the detailed guides in `docs/`.
