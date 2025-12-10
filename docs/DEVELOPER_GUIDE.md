# Tara App - Developer Quick Reference

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run ios      # iOS simulator
npm run android  # Android emulator
```

## 📁 Key Directories

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── passenger/       # Passenger-specific components
│   └── driver/          # Driver-specific components
├── screens/
│   ├── passenger/       # Passenger screens
│   └── driver/          # Driver screens
├── navigation/          # Navigation configuration
├── context/             # React Context (state management)
├── services/            # Business logic & utilities
├── utils/               # Helper functions & mock data
├── types/               # TypeScript type definitions
└── constants/           # App-wide constants
```

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `src/types/*.types.ts` | TypeScript interfaces |
| `src/constants/philippines.ts` | San Pablo data, fares, landmarks |
| `src/utils/mockData.ts` | Mock users and rides |
| `src/context/RideContext.tsx` | Ride state management |
| `src/navigation/AppNavigator.tsx` | Navigation structure |
| `app.json` | Expo configuration |
| `eas.json` | Build configuration |

## 🎨 UI Components

### Common Components
```typescript
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Rating } from '@/components/common/Rating';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { Toast } from '@/components/common/Toast';
import { EmptyState } from '@/components/common/EmptyState';
import { MapViewComponent } from '@/components/common/MapView';
import { LocationSearchInput } from '@/components/common/LocationSearchInput';
```

### Usage Examples

#### Button
```tsx
<Button 
  label="Book Ride" 
  onPress={handleBook}
  variant="primary"  // primary | secondary | outline | danger
  loading={isLoading}
  disabled={!isValid}
/>
```

#### Card
```tsx
<Card 
  elevation={3}
  onPress={handlePress}
  outlined={false}
  disabled={false}
>
  <Text>Card content</Text>
</Card>
```

#### Toast
```tsx
<Toast
  visible={showToast}
  type="success"  // success | error | warning | info
  title="Success"
  message="Ride booked successfully!"
  duration={3000}
  onHide={() => setShowToast(false)}
/>
```

#### EmptyState
```tsx
<EmptyState
  icon="car-outline"
  title="No rides yet"
  message="Book your first ride to get started"
  actionLabel="Book Ride"
  onAction={handleBookRide}
/>
```

## 🗺️ Working with Maps

### MapView Component
```tsx
<MapViewComponent
  center={{ latitude: 14.0693, longitude: 121.3265 }}
  markers={[
    {
      coordinate: pickup,
      title: "Pickup",
      description: "Your location"
    }
  ]}
  polyline={{
    coordinates: routeCoordinates,
    strokeColor: "#007AFF",
    strokeWidth: 3
  }}
  onMapPress={handleMapPress}
  followUserLocation={true}
/>
```

### Location Search
```tsx
<LocationSearchInput
  placeholder="Search San Pablo..."
  onLocationSelect={(location) => {
    console.log(location.coordinates);
    console.log(location.address);
  }}
  initialValue="SM City San Pablo"
/>
```

## 💰 Fare Calculation

```typescript
import { calculateDistance, calculateFare } from '@/utils/fareCalculator';

const distance = calculateDistance(pickup, destination);
const fare = calculateFare(distance, 'tricycle');

console.log(fare.baseFare);      // ₱20
console.log(fare.distanceFare);  // ₱30 (for 3km)
console.log(fare.total);         // ₱50
console.log(fare.currency);      // 'PHP'
```

## 🚗 Vehicle Types

```typescript
type VehicleType = 'tricycle' | 'motorcycle' | 'sedan' | 'suv';

// Base fares
BASE_FARES = {
  tricycle: 20,   // ₱20
  motorcycle: 30, // ₱30
  sedan: 50,      // ₱50
  suv: 70         // ₱70
}

// Per km rates
FARE_PER_KM = {
  tricycle: 10,   // ₱10/km
  motorcycle: 12, // ₱12/km
  sedan: 15,      // ₱15/km
  suv: 18         // ₱18/km
}
```

## 📍 San Pablo Landmarks

```typescript
import { SAN_PABLO_LANDMARKS, SAN_PABLO_CENTER } from '@/constants/philippines';

// Available landmarks:
// - SM City San Pablo
// - San Pablo City Hall
// - Sampaloc Lake
// - Plaza Rizal
// - San Pablo Cathedral
// - Robinsons Mall
// - Public Market
// - Palakpakin Lake

const center = SAN_PABLO_CENTER;  // { latitude: 14.0693, longitude: 121.3265 }
```

## 🔄 State Management

### Ride Context
```typescript
import { useRide } from '@/context/RideContext';

function MyComponent() {
  const {
    currentRide,
    isRideActive,
    bookRide,
    startRide,
    completeRide,
    cancelRide
  } = useRide();
  
  // Use ride state and actions
}
```

### Location Context
```typescript
import { useLocation } from '@/context/LocationContext';

function MyComponent() {
  const {
    currentLocation,
    currentAddress,
    refreshLocation,
    hasPermission
  } = useLocation();
}
```

## 💾 Data Persistence

### AsyncStorage Keys
```typescript
'@tara:user'              // Current user data
'@tara:currentRole'       // 'passenger' | 'driver'
'@tara:passengerRides'    // Passenger ride history
'@tara:driverRides'       // Driver ride history
'@tara:driverEarnings'    // Driver earnings data
'@tara:activeRide'        // Current active ride
```

### Usage
```typescript
import { saveRideToHistory } from '@/services/storage/rideStorage';
import { getDriverRideHistory } from '@/utils/driverEarnings';

// Save passenger ride
await saveRideToHistory(ride, 'passenger');

// Load driver history
const history = await getDriverRideHistory();
```

## 🇵🇭 Filipino Labels

```typescript
import { FILIPINO_LABELS } from '@/constants/philippines';

FILIPINO_LABELS = {
  letsGo: 'Tara na!',
  accept: 'Tanggapin',
  decline: 'Tanggihan',
  noCommission: 'Walang komisyon!',
  fullEarnings: '100% sa driver',
  beSafe: 'Ingat!',
  thankYou: 'Salamat!',
  arrived: 'Dumating na!'
}
```

## 🎨 Theme Colors

```typescript
// Primary Colors
const COLORS = {
  primary: '#007AFF',        // Tara Blue
  secondary: '#E6F4FE',      // Light Blue
  success: '#34C759',        // Green
  danger: '#FF3B30',         // Red
  warning: '#FF9500',        // Orange
  info: '#007AFF',           // Blue
  
  // Grays
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  background: '#F8F9FA',
  white: '#FFFFFF',
  black: '#000000'
};
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## 🔨 Building

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Preview build
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all
```

## 🐛 Debugging

### Common Issues

**Maps not loading:**
- Check Google Maps API key in `app.json`
- Verify permissions in app settings

**Location not working:**
- Grant location permissions
- Check `LocationContext` initialization
- Verify `expo-location` installed

**AsyncStorage not persisting:**
- Check storage keys match
- Verify JSON.stringify/parse usage
- Test on device (not just simulator)

**Build failing:**
- Run `npm install` to update dependencies
- Check `eas build:list` for error logs
- Clear cache: `eas build --clear-cache`

### Debug Commands
```bash
# View logs (iOS)
npx react-native log-ios

# View logs (Android)
npx react-native log-android

# Clear Metro cache
npx expo start --clear

# Reset project
npx expo start --clear --reset-cache
```

## 📚 Documentation

- **Testing Guide**: `docs/TESTING_GUIDE.md`
- **Build Guide**: `docs/BUILD_GUIDE.md`
- **Task List**: `docs/tasks.md`
- **Session Summary**: `docs/SESSION_SUMMARY.md`

## 🔗 Useful Links

- **Expo Docs**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/
- **React Native Maps**: https://github.com/react-native-maps/react-native-maps
- **EAS Build**: https://docs.expo.dev/build/introduction/

## 💡 Pro Tips

1. **Use TypeScript**: Always define types for better autocomplete and error catching
2. **Mock Data**: Use `mockData.ts` for development, easy to swap for real API later
3. **Component Reuse**: Check `components/common/` before creating new components
4. **Error Handling**: Use ErrorBoundary, Toast, and error messages for consistency
5. **Testing**: Follow `TESTING_GUIDE.md` for comprehensive testing
6. **Build Early**: Generate preview builds often to catch platform-specific issues

## 🎯 Development Workflow

1. **Feature Branch**: Create branch for new feature
2. **Implement**: Write code with TypeScript
3. **Test**: Test in Expo Go or dev build
4. **Type Check**: Run `npx tsc --noEmit`
5. **Lint**: Fix any ESLint warnings
6. **Test on Device**: Verify on physical iOS/Android
7. **Commit**: Push changes
8. **Build**: Generate preview build if needed

---

**Happy Coding!** 🚗 **Tara na!**
