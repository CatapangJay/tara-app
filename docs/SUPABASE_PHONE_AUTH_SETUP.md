# Tara App - Supabase Phone Authentication Setup

## Overview
This guide walks you through enabling phone authentication with SMS OTP in your Supabase project.

---

## Step 1: Enable Phone Authentication

1. **Go to Supabase Dashboard**
   - Open your project at https://supabase.com/dashboard
   - Navigate to **Authentication** → **Providers**

2. **Enable Phone Auth**
   - Find "Phone" in the providers list
   - Toggle the switch to **Enable**

---

## Step 2: Configure SMS Provider

Supabase supports multiple SMS providers. For development and production:

### Option A: Twilio (Recommended for Production)

1. **Create Twilio Account**
   - Sign up at https://www.twilio.com
   - Get your **Account SID** and **Auth Token**
   - Purchase a phone number with SMS capabilities

2. **Configure in Supabase**
   - In Phone provider settings, select **Twilio**
   - Enter:
     - **Twilio Account SID**: Your Account SID
     - **Twilio Auth Token**: Your Auth Token
     - **Twilio Message Service SID** (or phone number)

3. **Customize SMS Template** (Optional)
   ```
   Your Tara verification code is: {{ .Token }}
   
   This code expires in 60 seconds.
   ```

### Option B: MessageBird

1. **Create MessageBird Account**
   - Sign up at https://www.messagebird.com
   - Get your **API Key**

2. **Configure in Supabase**
   - Select **MessageBird**
   - Enter your **MessageBird API Key**
   - Set **Originator** (sender name, e.g., "Tara")

### Option C: Supabase Test Provider (Development Only)

⚠️ **For development/testing only - DO NOT use in production!**

1. **Enable Test Provider**
   - In Phone provider settings, select **Supabase Test Provider**
   - No additional configuration needed

2. **How It Works**
   - OTPs are logged in Supabase Dashboard logs
   - Go to **Authentication** → **Logs** to see OTP codes
   - Use these codes to test your app

---

## Step 3: Configure Phone Auth Settings

1. **Go to Phone Settings**
   - **Authentication** → **Providers** → **Phone** → **Settings**

2. **Set OTP Expiry**
   - Default: 60 seconds
   - Recommended: 60-120 seconds

3. **Set OTP Length**
   - Default: 6 digits
   - Recommended: 6 digits (industry standard)

4. **Rate Limiting** (Important for production!)
   - Enable rate limiting to prevent abuse
   - Recommended: 5 SMS per hour per phone number

5. **Phone Number Format**
   - **Require E.164 format**: Enable
   - Philippine format: `+639xxxxxxxxx` (13 characters)
   - Example: `+639171234567`

---

## Step 4: Test Phone Authentication

### Test Flow in Development

1. **Start Your App**
   ```bash
   npm start
   ```

2. **Navigate to Phone Auth Screen**
   - Enter a valid Philippine phone number: `+639171234567`
   - Click "Send OTP"

3. **Get OTP Code**
   
   **If using Test Provider:**
   - Go to Supabase Dashboard → **Authentication** → **Logs**
   - Find the latest log entry with "OTP sent"
   - Copy the 6-digit code
   
   **If using Twilio/MessageBird:**
   - Check your phone for SMS
   - Copy the 6-digit code

4. **Enter OTP**
   - Paste the code in your app
   - Click "Verify"
   - Should navigate to profile setup

---

## Step 5: Philippine Phone Number Validation

Our app includes Philippine-specific validation:

```typescript
// Valid formats accepted:
+639171234567  ✓ (E.164 format - sent to Supabase)
09171234567    ✓ (Converted to +63)
9171234567     ✓ (Converted to +639)

// Invalid formats:
+63 917 123 4567  ✗ (has spaces)
639171234567      ✗ (missing +)
+6391234567       ✗ (too short)
```

---

## Step 6: Production Checklist

Before going live with phone authentication:

- [ ] Switch from Test Provider to Twilio/MessageBird
- [ ] Enable rate limiting (5 SMS/hour per number)
- [ ] Set up SMS budget alerts in Twilio/MessageBird
- [ ] Test with multiple Philippine carriers:
  - [ ] Globe
  - [ ] Smart
  - [ ] Sun/TNT
  - [ ] DITO
- [ ] Customize SMS template with your branding
- [ ] Set OTP expiry to 60 seconds
- [ ] Enable phone number verification logs
- [ ] Set up monitoring for failed SMS deliveries
- [ ] Test OTP resend functionality
- [ ] Verify rate limiting works correctly
- [ ] Add terms acceptance before sending OTP
- [ ] Implement anti-spam measures (CAPTCHA if needed)

---

## Troubleshooting

### OTP Not Received

1. **Check Supabase Logs**
   - Go to **Authentication** → **Logs**
   - Look for errors or failed sends

2. **Verify Phone Number Format**
   - Must be E.164: `+639xxxxxxxxx`
   - Philippine numbers should start with `+639`

3. **Check SMS Provider Balance**
   - Twilio: Check account balance
   - MessageBird: Check credits

4. **Rate Limiting**
   - Too many requests may be blocked
   - Wait 1 hour and try again

### OTP Invalid/Expired

1. **Check Expiry Time**
   - Default: 60 seconds
   - User must enter code quickly

2. **Verify Code Entry**
   - Must be exact 6-digit code
   - No spaces or special characters

3. **Check for Multiple Requests**
   - Latest OTP invalidates previous ones
   - Don't spam "Resend OTP"

### SMS Costs Too High

1. **Enable Rate Limiting**
   - Limit SMS per user per hour

2. **Add CAPTCHA**
   - Prevents bot abuse

3. **Use Alternative Auth**
   - Offer email auth as backup
   - Consider social login (Google, Facebook)

---

## SMS Templates

### Default Template
```
Your Tara verification code is: {{ .Token }}

This code expires in 60 seconds.
```

### Branded Template
```
Welcome to Tara! 🚗

Your verification code: {{ .Token }}

Expires in 60s. Don't share this code.
```

### Minimal Template (saves SMS costs)
```
Tara code: {{ .Token }}
```

---

## Security Best Practices

1. **Never Log OTP Codes**
   - Don't log OTPs in production
   - Remove console.logs before deploying

2. **Implement Rate Limiting**
   - Server-side rate limiting
   - Client-side cooldown timers

3. **Validate Phone Numbers**
   - Only accept Philippine numbers
   - Use E.164 format

4. **Monitor for Abuse**
   - Track failed verification attempts
   - Block suspicious phone numbers

5. **Secure OTP Transmission**
   - Always use HTTPS
   - Never send OTP via insecure channels

---

## Cost Estimation (Philippines)

### Twilio Pricing (as of 2024)
- **SMS to Philippines**: ~$0.07 USD per message
- **100 users signing up**: ~$7 USD
- **1,000 users**: ~$70 USD

### MessageBird Pricing
- **SMS to Philippines**: ~$0.05 USD per message
- **100 users**: ~$5 USD
- **1,000 users**: ~$50 USD

### Cost Optimization
- Use email auth for returning users
- Implement "Remember me" to reduce re-authentications
- Consider social login as primary method
- Use SMS only for critical verifications

---

## Next Steps

After phone auth is working:

1. ✅ Test phone OTP flow end-to-end
2. ✅ Implement email/password as backup
3. ✅ Add social login (Google, Facebook)
4. ✅ Test on real Philippine phone numbers
5. ✅ Set up monitoring and alerts
6. ✅ Optimize SMS costs

---

## Support

- **Supabase Docs**: https://supabase.com/docs/guides/auth/phone-login
- **Twilio Docs**: https://www.twilio.com/docs
- **MessageBird Docs**: https://developers.messagebird.com

For Tara app-specific questions, check:
- `docs/SUPABASE_AUTH_GUIDE.md`
- `docs/SUPABASE_SETUP.md`
