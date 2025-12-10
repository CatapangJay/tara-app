# Tara App - Build & Deployment Guide

## Overview
This guide covers the steps needed to build and prepare the Tara app for deployment.

---

## Phase 1: App Assets (Icons & Splash Screen)

### Task 10.1.2: Create App Icon

#### Icon Requirements
- **iOS:** 1024x1024 PNG (App Store)
- **Android Adaptive Icon:**
  - Foreground: 1024x1024 PNG (transparent background)
  - Background: 1024x1024 PNG or solid color
  - Monochrome: 1024x1024 PNG (single color)

#### Icon Design Concept
```
Simple, recognizable icon for "Tara" ride-hailing:
- Central element: Car or tricycle silhouette
- Color scheme: Blue (#007AFF primary) with white
- Typography: "TARA" or stylized "T"
- Style: Flat, modern, high contrast
```

#### Icon Generation Steps
1. **Design in Figma/Canva/Photoshop:**
   - Create 1024x1024 canvas
   - Use Tara brand colors (Blue: #007AFF, Light Blue: #E6F4FE)
   - Add car/tricycle icon + "TARA" text
   - Export as PNG with transparent background

2. **Generate Platform-Specific Icons:**
   ```bash
   # Using expo-icon-tool or online generator
   npx @expo/icon-utils icon.png
   ```

3. **Place Icons:**
   - iOS: `./assets/images/icon.png` (1024x1024)
   - Android Foreground: `./assets/images/android-icon-foreground.png`
   - Android Background: `./assets/images/android-icon-background.png`
   - Android Monochrome: `./assets/images/android-icon-monochrome.png`

4. **Update app.json** (already configured):
   ```json
   "icon": "./assets/images/icon.png",
   "android": {
     "adaptiveIcon": {
       "backgroundColor": "#E6F4FE",
       "foregroundImage": "./assets/images/android-icon-foreground.png"
     }
   }
   ```

#### Quick Icon Placeholder
For MVP testing, you can use a simple placeholder:
- Blue circle background (#007AFF)
- White "T" or car icon
- Use Canva or similar tool for quick generation

---

### Task 10.1.3: Create Splash Screen

#### Splash Screen Requirements
- **Recommended Size:** 1284x2778 PNG (iPhone 14 Pro Max)
- **Safe Area:** Center 1200x1200 for main content
- **Background:** White or gradient

#### Splash Screen Design Concept
```
Clean, professional splash screen:
- Background: White or light blue gradient
- Center: Tara logo (car icon + "TARA" text)
- Tagline below: "Walang komisyon. 100% sa driver."
- Minimalist design for fast loading perception
```

#### Splash Screen Generation Steps
1. **Design Splash Screen:**
   - Create 1284x2778 canvas (or 1200x1200 for simplicity)
   - Center logo/icon
   - Add tagline below
   - Use brand colors

2. **Export:**
   - Save as `./assets/images/splash-icon.png`

3. **Configure in app.json** (already set up):
   ```json
   {
     "expo": {
       "plugins": [
         [
           "expo-splash-screen",
           {
             "image": "./assets/images/splash-icon.png",
             "imageWidth": 200,
             "resizeMode": "contain",
             "backgroundColor": "#ffffff"
           }
         ]
       ]
     }
   }
   ```

4. **Test Splash Screen:**
   ```bash
   npx expo prebuild --clean
   npx expo run:ios   # or run:android
   ```

---

## Phase 2: Environment Setup

### 2.1 Install EAS CLI
```bash
npm install -g eas-cli
```

### 2.2 Login to Expo
```bash
eas login
```
Or create account at https://expo.dev/signup

### 2.3 Configure EAS Build
Create `eas.json` in project root:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 2.4 Google Maps API Key (Android)

1. **Get API Key:**
   - Go to https://console.cloud.google.com/
   - Create new project: "Tara Ride Hailing"
   - Enable "Maps SDK for Android" and "Maps SDK for iOS"
   - Create credentials → API Key
   - Restrict key to your app (optional for MVP)

2. **Update app.json:**
   ```json
   "android": {
     "config": {
       "googleMaps": {
         "apiKey": "YOUR_ACTUAL_GOOGLE_MAPS_API_KEY"
       }
     }
   }
   ```

3. **iOS Maps:** Uses Apple Maps by default (no API key needed)

---

## Phase 3: Build Process

### Task 10.3.1: Create Development Build

#### Purpose
Development builds allow you to test the app on physical devices with Expo Dev Client, enabling faster iteration than production builds.

#### Steps
1. **Initialize EAS:**
   ```bash
   eas build:configure
   ```

2. **Build for iOS (Simulator):**
   ```bash
   eas build --profile development --platform ios
   ```
   - Select "Simulator" when prompted
   - Wait for build to complete (10-20 minutes)
   - Download and install on iOS Simulator

3. **Build for Android:**
   ```bash
   eas build --profile development --platform android
   ```
   - APK will be generated
   - Download to device and install

4. **Install and Run:**
   ```bash
   npx expo start --dev-client
   ```

#### Testing Checklist
- [ ] App launches successfully
- [ ] Location permissions work
- [ ] Map loads correctly (Google Maps on Android, Apple Maps on iOS)
- [ ] All navigation flows work
- [ ] AsyncStorage persists data
- [ ] No crashes or errors

---

### Task 10.3.2: Create Preview Build

#### Purpose
Preview builds are optimized, standalone apps for sharing with stakeholders for testing and feedback before production.

#### Steps
1. **Build for iOS (Internal Distribution):**
   ```bash
   eas build --profile preview --platform ios
   ```
   - Requires Apple Developer account (can skip for MVP)
   - Or use "adhoc" profile for specific devices

2. **Build for Android (APK):**
   ```bash
   eas build --profile preview --platform android
   ```
   - Generates APK for easy installation
   - Download and share via Google Drive, etc.

3. **Distribution:**
   - **Android:** Share APK link (from Expo dashboard)
   - **iOS:** Use TestFlight or AdHoc distribution
   - Share build URL with testers

#### Feedback Collection
- Create feedback form with testing guide
- Document bugs and issues
- Iterate and create new build if needed

---

### Task 10.3.3: Production Build (Future)

**Note:** For MVP, preview builds are sufficient. Production builds are for App Store/Play Store submission.

#### iOS Production Build
```bash
eas build --profile production --platform ios
```
- Requires Apple Developer account ($99/year)
- Generates IPA for App Store submission
- Submit via `eas submit --platform ios`

#### Android Production Build
```bash
eas build --profile production --platform android
```
- Generates AAB (Android App Bundle)
- Submit to Play Store via `eas submit --platform android`
- Play Store account: $25 one-time fee

---

## Phase 4: Device Testing

### Task 10.2.1: Test on iOS Device

#### Prerequisites
- Physical iPhone with iOS 13+
- Development or preview build installed

#### Testing Steps
Follow the comprehensive TESTING_GUIDE.md, focusing on:

1. **Location Services:**
   - Grant location permissions
   - Verify current location detected
   - Test "Current Location" button
   - Check accuracy on map

2. **Map Rendering:**
   - Verify Apple Maps loads correctly
   - Test map panning/zooming
   - Verify markers display
   - Test polyline route rendering

3. **Full Flows:**
   - Complete passenger flow (book → ride → complete → rate)
   - Complete driver flow (go online → accept → complete → earnings)
   - Test role switching

4. **Performance:**
   - Check app launch time
   - Monitor map smoothness
   - Test AsyncStorage persistence (close/reopen app)
   - Look for memory issues

#### Issues to Watch For
- Location not updating
- Map tiles not loading
- Keyboard covering inputs
- Navigation bar issues
- Animation performance

---

### Task 10.2.2: Test on Android Device

#### Prerequisites
- Physical Android phone (Android 5.0+)
- Development or preview build installed
- Google Maps API key configured

#### Testing Steps
Same as iOS, with Android-specific checks:

1. **Location Services:**
   - Grant location permissions (Fine & Coarse)
   - Test background location (if implemented)
   - Verify GPS accuracy

2. **Google Maps:**
   - Verify API key working (map loads)
   - Test map interactions
   - Check marker rendering
   - Verify polyline routes

3. **Platform-Specific:**
   - Test back button navigation
   - Check status bar/navigation bar
   - Verify adaptive icon displays
   - Test permissions UI

4. **Performance:**
   - Monitor map performance (Google Maps can be heavy)
   - Test on lower-end device if possible
   - Check battery usage during active ride

#### Common Android Issues
- Map blank (API key issue)
- Location permissions not granted properly
- Back button exits app unexpectedly
- Keyboard behavior differs from iOS

---

## Phase 5: Pre-Launch Checklist

### Code & Configuration
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] No console.log statements in production code
- [ ] API keys configured (Google Maps)
- [ ] App name and bundle IDs set correctly
- [ ] Icons and splash screen generated
- [ ] Permissions configured in app.json

### Testing
- [ ] Passenger flow tested end-to-end (iOS & Android)
- [ ] Driver flow tested end-to-end (iOS & Android)
- [ ] Role switching tested
- [ ] Error handling verified
- [ ] Data persistence confirmed
- [ ] Performance acceptable on mid-range devices

### Documentation
- [ ] README.md updated with build instructions
- [ ] TESTING_GUIDE.md completed
- [ ] Known issues documented
- [ ] Feedback collected from testers

### Legal & Compliance
- [ ] Privacy policy prepared (if collecting user data)
- [ ] Terms of service drafted
- [ ] Location permission usage clearly explained
- [ ] Data storage disclosure (AsyncStorage)

### Distribution
- [ ] EAS builds successful on both platforms
- [ ] Development build tested by dev team
- [ ] Preview build shared with stakeholders
- [ ] Feedback loop established

---

## Phase 6: Common Build Issues & Solutions

### Issue 1: Google Maps Not Loading (Android)
**Solution:**
- Verify API key in app.json
- Check Google Cloud Console for API key restrictions
- Enable "Maps SDK for Android" in GCP
- Rebuild app after changing API key

### Issue 2: Location Permissions Not Working
**Solution:**
- Check app.json permissions configuration
- Verify Info.plist descriptions (iOS)
- Test permission request flow manually
- Check device settings → app permissions

### Issue 3: Build Failing on EAS
**Solution:**
- Check package.json for missing dependencies
- Verify expo-sdk versions compatibility
- Review build logs on Expo dashboard
- Clear cache: `eas build --clear-cache`

### Issue 4: Splash Screen Not Showing
**Solution:**
- Verify splash-icon.png exists at correct path
- Check expo-splash-screen plugin configuration
- Rebuild with `npx expo prebuild --clean`
- Test on device (not in Expo Go)

### Issue 5: App Crashes on Launch
**Solution:**
- Check error logs (Logcat for Android, Console for iOS)
- Verify all native modules installed
- Test in development build first
- Check for missing permissions

---

## Build Commands Quick Reference

### Development
```bash
# Configure EAS
eas build:configure

# Development build (iOS Simulator)
eas build --profile development --platform ios

# Development build (Android)
eas build --profile development --platform android

# Run dev client
npx expo start --dev-client
```

### Preview/Testing
```bash
# Preview build (iOS)
eas build --profile preview --platform ios

# Preview build (Android APK)
eas build --profile preview --platform android

# Build both platforms
eas build --profile preview --platform all
```

### Production
```bash
# Production build (iOS)
eas build --profile production --platform ios

# Production build (Android)
eas build --profile production --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Utilities
```bash
# Check build status
eas build:list

# View build details
eas build:view [build-id]

# Cancel ongoing build
eas build:cancel

# Clear cache
eas build --clear-cache
```

---

## Next Steps After MVP Build

1. **Collect Feedback:**
   - Share preview build with 5-10 test users
   - Document bugs and feature requests
   - Prioritize fixes vs. future enhancements

2. **Iterate:**
   - Fix critical bugs
   - Polish UI based on feedback
   - Optimize performance if needed

3. **Plan Production Launch:**
   - Set up Apple Developer and Google Play accounts
   - Prepare store listings (screenshots, descriptions)
   - Create marketing materials
   - Plan soft launch strategy

4. **Backend Migration:**
   - Evaluate Supabase setup for real-time matching
   - Migrate from AsyncStorage to cloud database
   - Implement authentication system
   - Add payment integration (GCash, PayMaya)

---

## Resources

- **Expo Documentation:** https://docs.expo.dev/
- **EAS Build Guide:** https://docs.expo.dev/build/introduction/
- **Google Maps API:** https://console.cloud.google.com/
- **Apple Developer:** https://developer.apple.com/
- **Google Play Console:** https://play.google.com/console/
- **Expo Discord:** https://chat.expo.dev/

---

## Support

For build issues:
1. Check Expo documentation
2. Review build logs on expo.dev dashboard
3. Ask in Expo Discord #help channel
4. Check GitHub issues for expo/expo repo

**Remember:** The MVP goal is to demonstrate the core ride-hailing flow. Perfect is the enemy of done!
