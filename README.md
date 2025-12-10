# Tara 🚗

**Filipino Ride-Hailing App - 100% to Drivers, Zero Commission**

A revolutionary ride-hailing platform for San Pablo City, Laguna, Philippines, where drivers keep 100% of their fares through a subscription model.

## 🎯 Vision

Tara (Filipino for "Let's go") empowers drivers by eliminating commission fees. Instead of taking a cut from every ride, drivers pay a flat monthly subscription and keep all their earnings.

### Key Differentiator
- **Traditional Apps**: Take 20-25% commission per ride
- **Tara**: ₱999-₱2,999/month subscription, **100% of fares to drivers**

## 🚀 Current Status

**Phase**: Core Features & Polish Nearly Complete 🎉  
**Version**: 1.0.0 (MVP - Ready for Testing)  
**Target Location**: San Pablo City, Laguna, Philippines

### ✅ Completed Features
- **Foundation & Navigation**: Role selection, tab navigation, state persistence
- **Maps & Location**: Interactive maps, location picker, San Pablo landmarks
- **Passenger Flow**: Complete booking flow with vehicle selection and fare calculation
- **Driver Features**: Ride requests, earnings dashboard with history, online/offline toggle
- **Error Handling**: ErrorBoundary, Toast notifications, error messages, EmptyState
- **UI Components**: Card, Button, Rating, LoadingOverlay, LocationSearchInput
- **Filipino Localization**: Key labels in Tagalog ("Tanggapin", "Tanggihan", "Ingat!", "Tara na!")
- **Data Persistence**: AsyncStorage for ride history and earnings
- **Route Visualization**: Polyline support for showing routes on maps

### 🧪 Ready for Testing
- End-to-end passenger flow (book → ride → complete → rate)
- End-to-end driver flow (online → accept → navigate → complete → earnings)
- Role switching with data isolation
- Complete testing guide available in `docs/TESTING_GUIDE.md`

### 🏗️ Next Steps
- Physical device testing (iOS & Android)
- Build generation with EAS
- Stakeholder feedback collection
- Backend migration to Supabase (post-MVP)

## 📱 Quick Start

```bash
# Install dependencies
npm install

# Start the app
npm start

# Open on device
# Scan QR code with Expo Go app
# or press 'a' for Android, 'i' for iOS
```

For detailed instructions, see [QUICK_START.md](./QUICK_START.md)

## 🏙️ San Pablo City Focus

Initial launch area centered at:
- **Coordinates**: 14.0693°N, 121.3265°E
- **Landmarks**: SM City San Pablo, City Hall, Sampaloc Lake, 7 Lakes, and more
- **Service**: All 45 barangays covered

## 💰 Pricing Model

### Passenger Fares
- **Tricycle**: ₱20 base + ₱10/km
- **Motorcycle**: ₱30 base + ₱12/km  
- **Sedan**: ₱50 base + ₱15/km
- **SUV**: ₱70 base + ₱18/km

### Driver Subscriptions
- **Basic**: ₱999/month (up to 50 rides)
- **Pro**: ₱1,999/month (unlimited rides)
- **Premium**: ₱2,999/month (all features + marketing)

## 🛠️ Tech Stack

- **Framework**: Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Maps**: React Native Maps
- **Location**: expo-location
- **Storage**: AsyncStorage
- **State**: React Context
- **UI**: Custom components + React Native Paper

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
├── screens/         # App screens (passenger & driver)
├── navigation/      # Navigation configuration
├── context/         # Global state management
├── services/        # Business logic & APIs
├── utils/           # Helper functions & mock data
├── types/           # TypeScript definitions
└── constants/       # Philippine-specific data
```

## 📚 Documentation

- **[TESTING_GUIDE.md](./docs/TESTING_GUIDE.md)** - Comprehensive testing instructions for all flows
- **[BUILD_GUIDE.md](./docs/BUILD_GUIDE.md)** - Build and deployment preparation
- **[tasks.md](./docs/tasks.md)** - Complete task list and roadmap with progress tracking
- **[QUICK_START.md](./QUICK_START.md)** - Get the app running locally (if exists)

## 🎯 MVP Roadmap

### Phase 1: Foundation ✅ COMPLETE
- Project setup
- Type definitions
- Mock data
- Constants

### Phase 2: Navigation ✅ COMPLETE  
- Role selection
- Tab navigation
- Screen placeholders
- State management

### Phase 3: Maps & Location ✅ COMPLETE
- Location permissions
- Map integration
- Location search
- San Pablo landmarks

### Phase 4: Passenger Flow ✅ COMPLETE
- Ride booking with location picker
- Driver matching simulation
- Ride tracking with route visualization
- Completion & rating

### Phase 5: Driver Flow ✅ COMPLETE
- Ride requests with accept/decline
- Navigation to pickup
- Ride completion
- Earnings tracking with history

### Phase 6: Ride Tracking ✅ COMPLETE
- Real-time location updates
- Map markers and routes
- Status updates

### Phase 7: Polish & Components ✅ COMPLETE
- Reusable components (Card, Button, Rating, etc.)
- Animations and transitions
- Error handling (ErrorBoundary, Toast)
- EmptyState displays

### Phase 8: Testing 🔄 IN PROGRESS
- End-to-end flow testing
- Device testing (iOS & Android)
- Bug fixes and polish

### Phase 9: Filipino Localization ✅ COMPLETE
- Key labels in Tagalog
- Vehicle types and pricing
- San Pablo landmarks

### Phase 10: Build & Deployment 📝 READY
- App icon and splash screen (guides created)
- EAS build configuration
- Preview builds for testing

### Future Phases (Post-MVP)
- Authentication (phone verification)
- Payment integration (GCash, PayMaya)
- Supabase backend migration
- Push notifications
- Admin dashboard

## 🇵🇭 Filipino Touch

- **App Name**: "Tara" (Let's go)
- **Key Phrase**: "Walang komisyon. 100% sa driver."
- **Currency**: PHP (₱)
- **Location**: San Pablo City coordinates & landmarks
- **Vehicle Types**: Includes tricycle and motorcycle

## 👥 Mock Users (Development)

**Passenger**: Maria Santos  
**Driver**: Juan dela Cruz (2020 Toyota Vios, Pro Plan)

## 🧪 Testing

Try these flows:
1. Select role (passenger or driver)
2. Navigate between tabs
3. Toggle online/offline (driver)
4. View earnings dashboard
5. Switch roles
6. Close/reopen app (persistence test)

## 📊 Progress

- ✅ Foundation: 100%
- ✅ Navigation: 100%
- ✅ Maps & Location: 100%
- ✅ Passenger Flow: 100%
- ✅ Driver Flow: 100%
- ✅ UI Components: 100%
- ✅ Error Handling: 100%
- ✅ Filipino Localization: 100%
- 🔄 Testing: 60% (guides created, device testing pending)
- 📝 Build & Deployment: 80% (configuration ready, builds pending)

**Overall MVP Progress: ~95%** 🎉

### What's Left
- Run comprehensive testing on physical iOS and Android devices
- Create app icon and splash screen assets
- Generate EAS builds for distribution
- Collect stakeholder feedback
- Minor bug fixes and polish as needed

**MVP is code-complete and ready for testing phase!**

## 🤝 Contributing

This is a development project. See `docs/tasks.md` for the complete task list and priorities.

## 📄 License

Private - All rights reserved

## 🎉 Acknowledgments

Built for the Filipino driver community in San Pablo City, Laguna.

**Walang komisyon. 100% sa driver. Tara na!** 🚗