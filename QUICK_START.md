# Tara App - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Expo Go app on your mobile device (or Android emulator/iOS simulator)

### Running the App

1. **Start the development server**:
   ```bash
   npm start
   # or if you have network issues:
   npm start -- --offline
   ```

2. **Open on your device**:
   - **Mobile**: Scan the QR code with Expo Go (Android) or Camera (iOS)
   - **Android Emulator**: Press `a` in the terminal
   - **iOS Simulator**: Press `i` in the terminal (macOS only)
   - **Web**: Press `w` or visit http://localhost:8081

## 🎮 Testing the App

### As a Passenger
1. Launch the app
2. Tap **"I'm a Passenger"**
3. You'll see three tabs:
   - **Home**: Map view (placeholder for now)
   - **Activity**: Ride history (placeholder)
   - **Account**: Your profile (Maria Santos)
4. In Account, you can:
   - View your stats (rating, trips)
   - Switch to Driver mode
   - Return to role selection

### As a Driver
1. From role selection, tap **"I'm a Driver"**
2. You'll see three tabs:
   - **Home**: Ride requests (placeholder)
     - Use the **Online/Offline** toggle in the header
   - **Earnings**: View your earnings
     - See "100% ng bayad - Walang komisyon!" banner
     - Today, week, month earnings
     - Trip count and subscription info
   - **Account**: Your profile (Juan dela Cruz)
     - View stats and vehicle info
     - Switch to Passenger mode
3. Toggle between Online/Offline to see status change

### Switching Roles
- Use the **"Switch to Driver"** button in Passenger Account
- Use the **"Switch to Passenger"** button in Driver Account
- Use **"Change Role"** to return to role selection
- Your selection persists - close and reopen the app to verify!

## 📱 What's Working

✅ Role selection with persistence  
✅ Tab navigation for both roles  
✅ Online/Offline toggle for drivers  
✅ Earnings dashboard  
✅ Profile screens  
✅ Role switching  
✅ Mock user data  
✅ Clean, branded UI  

## 🏗️ What's Next

The following features are planned (see tasks.md):
- 🗺️ Maps integration with San Pablo City
- 📍 Location services and permissions
- 🚗 Passenger booking flow
- 🚕 Driver ride acceptance
- 📊 Ride tracking and simulation
- ⭐ Rating system
- 📜 Ride history
- 💰 Fare calculation in action

## 🐛 Troubleshooting

### App won't start
- Try running with `--offline` flag: `npm start -- --offline`
- Clear cache: `npx expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### TypeScript errors
- Run `npx tsc --noEmit` to check for type errors
- The app should still work even with some TS warnings

### Metro bundler issues
- Press `r` to reload
- Press `shift+m` for more tools
- Close terminal and restart

## 📂 Key Files to Know

- **App.tsx**: Main app entry point
- **src/navigation/RootNavigator.tsx**: Root navigation logic
- **src/context/AppContext.tsx**: Global state (role, online status)
- **src/utils/mockData.ts**: Sample users and data
- **src/constants/philippines.ts**: San Pablo City data
- **tasks.md**: Complete task list and progress

## 🎯 Testing Checklist

Try these flows:
- [ ] Select Passenger role → see passenger tabs
- [ ] Switch to Driver → see driver tabs
- [ ] Toggle Online/Offline → see status change
- [ ] View Earnings → see dashboard with "100%" banner
- [ ] Change Role → return to role selection
- [ ] Close app, reopen → verify role persists
- [ ] Check Account screens for both roles

## 💡 Development Tips

1. **Hot reload**: Edit any file and save - changes appear instantly
2. **Console logs**: Check the terminal for console.log output
3. **React DevTools**: Press `j` to open debugger
4. **Component testing**: Edit mock data in `src/utils/mockData.ts`
5. **Styling**: All styles are inline - easy to tweak

## 🔧 Common Commands

```bash
# Start development server
npm start

# Start with cache clear
npm start -- --clear

# Start offline (no network check)
npm start -- --offline

# Run linter
npm run lint

# Check TypeScript
npx tsc --noEmit
```

## 📞 Need Help?

1. Check **IMPLEMENTATION_SUMMARY.md** for detailed status
2. Review **tasks.md** for the complete task list
3. Check terminal output for error messages
4. Verify all dependencies installed: `npm install`

## 🎉 Success!

If you can:
1. ✅ Start the app
2. ✅ Select a role
3. ✅ See the tab navigation
4. ✅ Switch between roles
5. ✅ View earnings (driver) or account info (passenger)

Then everything is working perfectly! The foundation is complete and ready for the next phase of development.

---

**Happy Coding! 🚗 Tara na!**
