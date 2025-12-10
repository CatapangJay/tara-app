# Tara App - Testing Guide

## Overview
This guide provides step-by-step testing instructions for the Tara ride-sharing app MVP.

---

## Pre-Testing Setup

### Environment Setup
1. Ensure you have Expo Go installed on your test device
2. Start the development server: `npm start`
3. Clear AsyncStorage before testing: Use "Reset" option in app settings
4. Enable location services on your device
5. Grant location permissions when prompted

### Test Devices
- **iOS:** iPhone with iOS 13+ running Expo Go
- **Android:** Android device with Android 5.0+ running Expo Go

---

## Test Suite 1: Passenger Booking Flow (Task 8.1.1)

### Test 1.1: Initial App Launch
**Steps:**
1. Open the app for the first time
2. Observe the role selection screen

**Expected Results:**
- ✅ App displays "Welcome to Tara" with logo
- ✅ Subtitle shows "Tara na! Let's go around San Pablo City"
- ✅ Two buttons visible: "I'm a Passenger (Pasahero)" and "I'm a Driver"
- ✅ Footer text: "Pumili ng iyong role para magsimula"

### Test 1.2: Select Passenger Role
**Steps:**
1. Tap "I'm a Passenger (Pasahero)" button
2. Grant location permissions when prompted

**Expected Results:**
- ✅ Permission modal appears requesting location access
- ✅ After granting, app transitions to passenger home screen
- ✅ Map loads centered on San Pablo City (or current location if permitted)
- ✅ "Where to?" button visible at bottom

### Test 1.3: Location Selection - Pickup
**Steps:**
1. Tap "Where to?" button
2. Observe the pickup location field (should show current location)
3. Tap on pickup location field
4. Test the location picker modal

**Expected Results:**
- ✅ Booking sheet slides up from bottom
- ✅ Pickup location shows current address or "Current Location"
- ✅ Tapping pickup opens LocationPickerModal
- ✅ Modal shows map + search input
- ✅ Can search for "SM City San Pablo" and select it
- ✅ Can tap on map to select a location
- ✅ "Current Location" button works
- ✅ Confirm button sets the pickup location
- ✅ Returns to booking sheet with updated pickup

### Test 1.4: Location Selection - Destination
**Steps:**
1. From booking sheet, tap "Destination" field
2. Search for "Sampaloc Lake"
3. Select it from suggestions
4. Tap "Next" button

**Expected Results:**
- ✅ LocationPickerModal opens for destination
- ✅ Search shows San Pablo landmarks (SM City, City Hall, Sampaloc Lake, etc.)
- ✅ Can select "Sampaloc Lake" from suggestions
- ✅ Modal closes and destination is set
- ✅ "Next" button becomes enabled
- ✅ Tapping "Next" proceeds to vehicle selection

### Test 1.5: Vehicle Selection & Fare Calculation
**Steps:**
1. Review the ride options screen
2. Verify all vehicle types are shown
3. Check fare calculations
4. Select "Tricycle"
5. Tap "Book Ride" button

**Expected Results:**
- ✅ Map preview shows route between pickup and destination
- ✅ Blue polyline connects pickup and destination markers
- ✅ Four vehicle options displayed:
  - Tricycle (bicycle-outline icon, 1-3 passengers, ₱20 base)
  - Motorcycle (bicycle icon, 1 passenger, ₱30 base)
  - Sedan (car-sport icon, 1-4 passengers, ₱50 base)
  - SUV (car icon, 1-6 passengers, ₱70 base)
- ✅ Each shows estimated fare (base + distance fare)
- ✅ Distance shown in km
- ✅ Estimated time shown in minutes
- ✅ Selecting a vehicle highlights it
- ✅ "Book Ride" button enabled after selection
- ✅ Tapping "Book Ride" proceeds to finding driver

### Test 1.6: Driver Matching
**Steps:**
1. Observe the "Finding driver..." screen
2. Wait for simulated driver match (5-10 seconds)

**Expected Results:**
- ✅ Loading animation displays
- ✅ Message shows "Finding a driver nearby..."
- ✅ After delay, driver details appear
- ✅ Driver card shows: name, photo, vehicle type, rating
- ✅ Vehicle details: plate number, model
- ✅ Estimated arrival time displayed
- ✅ "Cancel Ride" button available
- ✅ Map shows driver marker approaching pickup

### Test 1.7: Ride in Progress
**Steps:**
1. Wait for driver to "arrive" at pickup (simulated)
2. Ride automatically starts
3. Observe the active ride screen

**Expected Results:**
- ✅ Status changes from "Driver arriving" to "Ride started"
- ✅ Map shows route to destination
- ✅ Driver marker moves along route (in simulation)
- ✅ Estimated arrival time updates
- ✅ Distance to destination shown
- ✅ Current fare updates if applicable
- ✅ Driver info visible at top or bottom
- ✅ "Contact Driver" and "Cancel Ride" buttons available

### Test 1.8: Ride Completion
**Steps:**
1. Wait for driver to reach destination (simulated)
2. Observe the ride complete screen

**Expected Results:**
- ✅ Screen shows "You've arrived!"
- ✅ Subtitle shows driver name with "Ingat!" message
- ✅ Trip summary displays:
  - Trip distance
  - Trip duration
  - Final fare amount
- ✅ "Continue to Rate & Tip" button visible

### Test 1.9: Rating & Tipping
**Steps:**
1. Tap "Continue to Rate & Tip"
2. Select 5 stars
3. Type "Great ride!"
4. Select ₱50 tip
5. Tap "Submit Rating"

**Expected Results:**
- ✅ Star rating component shows 5 stars (tappable)
- ✅ Optional comment field accepts text
- ✅ Tip options displayed: ₱20, ₱50, ₱100, Skip
- ✅ Selected tip highlights
- ✅ "Submit Rating" button enabled after selecting stars
- ✅ After submission, returns to passenger home
- ✅ Ride appears in history

### Test 1.10: View Ride History
**Steps:**
1. From passenger home, tap menu or navigate to Activity/History
2. Find the completed ride

**Expected Results:**
- ✅ Ride listed with date/time
- ✅ Shows pickup → destination route
- ✅ Displays fare amount
- ✅ Shows driver name and rating given
- ✅ Shows trip distance and duration
- ✅ All data persists after app restart (AsyncStorage)

### Test 1.11: Cancel Ride Scenarios
**Steps:**
1. Book a new ride
2. Cancel during "Finding driver" phase
3. Book another ride
4. Cancel after driver is matched

**Expected Results:**
- ✅ "Cancel Ride" button always visible before ride starts
- ✅ Cancellation shows confirmation dialog
- ✅ After confirming, returns to passenger home
- ✅ No charge applied (in MVP)
- ✅ Can immediately book another ride

---

## Test Suite 2: Driver Flow (Task 8.1.2)

### Test 2.1: Select Driver Role
**Steps:**
1. Reset app or switch role
2. Tap "I'm a Driver" button
3. Complete profile setup if prompted

**Expected Results:**
- ✅ Driver registration/profile screen appears (if first time)
- ✅ Can enter: name, vehicle type, plate number, vehicle model
- ✅ After setup, shows driver home screen
- ✅ "Go Online" button visible and enabled

### Test 2.2: Go Online
**Steps:**
1. Tap "Go Online" button
2. Observe the waiting for rides screen

**Expected Results:**
- ✅ Button changes to "Go Offline"
- ✅ Status shows "You're online and ready for rides"
- ✅ Map shows driver's current location
- ✅ Waiting indicator or animation displays
- ✅ "No ride requests yet" message shown

### Test 2.3: Receive Ride Request
**Steps:**
1. Trigger a ride request (use second device or simulator as passenger)
2. Observe the ride request notification

**Expected Results:**
- ✅ RideRequestCard appears with animation
- ✅ Shows passenger info: name, rating
- ✅ Shows pickup location with distance
- ✅ Shows destination location
- ✅ Shows estimated fare
- ✅ Shows estimated trip distance
- ✅ Two buttons: "Tanggihan" (Decline) and "Tanggapin" (Accept)
- ✅ Auto-decline timer shown (30 seconds)

### Test 2.4: Accept Ride Request
**Steps:**
1. Tap "Tanggapin" (Accept) button
2. Observe the navigation to pickup screen

**Expected Results:**
- ✅ Request card closes
- ✅ Screen shows "Navigate to Pickup"
- ✅ Map displays route to pickup location
- ✅ Distance and ETA to pickup shown
- ✅ Passenger info displayed
- ✅ "Start Navigation" button (or simulated directions)
- ✅ "Contact Passenger" button available
- ✅ "Cancel Ride" button available

### Test 2.5: Arrive at Pickup
**Steps:**
1. Simulate arrival at pickup location
2. Tap "Arrived at Pickup" button

**Expected Results:**
- ✅ Button becomes visible when near pickup
- ✅ Tapping it notifies passenger
- ✅ Button changes to "Start Ride"
- ✅ Waiting for passenger to be ready

### Test 2.6: Start Ride
**Steps:**
1. Tap "Start Ride" button
2. Observe the active ride screen

**Expected Results:**
- ✅ Ride status changes to "In Progress"
- ✅ Map shows route to destination
- ✅ Turn-by-turn directions displayed (or simulated)
- ✅ Current earnings visible
- ✅ Trip timer starts
- ✅ Distance to destination updates
- ✅ "Contact Passenger" button available

### Test 2.7: Complete Ride
**Steps:**
1. Simulate arrival at destination
2. Tap "Complete Ride" button

**Expected Results:**
- ✅ Button appears when near destination
- ✅ Tapping shows ride summary
- ✅ Summary displays:
  - Trip distance
  - Trip duration
  - Fare amount earned (100% to driver)
- ✅ "Finish" button to confirm
- ✅ After confirming, returns to online waiting screen

### Test 2.8: View Earnings
**Steps:**
1. Navigate to Earnings screen from driver home
2. Review earnings summary

**Expected Results:**
- ✅ Today's earnings shown prominently
- ✅ Total earnings breakdown:
  - Today
  - This week
  - Total
- ✅ Ride count displayed
- ✅ Average fare per ride shown
- ✅ "View Details" or collapsible history section

### Test 2.9: View Ride History
**Steps:**
1. Tap to expand ride history
2. Review completed rides

**Expected Results:**
- ✅ Rides grouped by date (e.g., "Today", "Yesterday", "Jan 15, 2025")
- ✅ Each day shows daily total earnings
- ✅ Each ride shows:
  - Pickup → Destination route
  - Trip time
  - Fare earned
- ✅ Collapsible sections work correctly
- ✅ Data persists after app restart

### Test 2.10: Decline Ride Request
**Steps:**
1. Receive a new ride request
2. Tap "Tanggihan" (Decline) button

**Expected Results:**
- ✅ Request card closes immediately
- ✅ Returns to waiting for rides screen
- ✅ Can receive another request
- ✅ No penalty (in MVP)

### Test 2.11: Go Offline
**Steps:**
1. From online waiting screen, tap "Go Offline"
2. Observe the offline state

**Expected Results:**
- ✅ Button changes to "Go Online"
- ✅ Status shows "You're offline"
- ✅ No ride requests received
- ✅ Can still view earnings and history
- ✅ Can go back online anytime

---

## Test Suite 3: Role Switching (Task 8.1.3)

### Test 3.1: Switch from Passenger to Driver
**Steps:**
1. Complete a ride as passenger
2. Navigate to settings or profile
3. Select "Switch to Driver" option
4. Observe the transition

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ App switches to driver home screen
- ✅ Driver status maintained (online/offline)
- ✅ Previous driver data persists (earnings, history)
- ✅ Passenger data remains saved (ride history)
- ✅ Can switch back to passenger anytime

### Test 3.2: Switch from Driver to Passenger
**Steps:**
1. From driver mode (offline), switch to passenger
2. Book a new ride

**Expected Results:**
- ✅ Switches to passenger home screen
- ✅ Previous passenger data loads (ride history)
- ✅ Can immediately book a ride
- ✅ Driver data persists in background
- ✅ No data loss during switch

### Test 3.3: Data Isolation Between Roles
**Steps:**
1. Check passenger ride history (should show only passenger rides)
2. Switch to driver mode
3. Check driver ride history (should show only driver rides)
4. Verify earnings are driver-specific

**Expected Results:**
- ✅ Passenger history separate from driver history
- ✅ Earnings only shown in driver mode
- ✅ No cross-contamination of ride data
- ✅ Each role maintains its own state
- ✅ AsyncStorage keys properly namespaced

### Test 3.4: Rapid Role Switching
**Steps:**
1. Switch from passenger to driver
2. Immediately switch back to passenger
3. Repeat 3-5 times
4. Book a ride as passenger

**Expected Results:**
- ✅ No crashes or errors
- ✅ UI updates correctly each time
- ✅ Data loads without corruption
- ✅ Performance remains smooth
- ✅ Can perform actions in either role

---

## Test Suite 4: Error Handling & Edge Cases

### Test 4.1: Location Permission Denied
**Steps:**
1. Fresh install, deny location permissions
2. Try to use the app

**Expected Results:**
- ✅ Error message displays: "Location permission required"
- ✅ "Open Settings" button shown
- ✅ App defaults to San Pablo City center on map
- ✅ Can still select locations manually via search
- ✅ Toast notification shows error

### Test 4.2: Network Disconnection
**Steps:**
1. Enable airplane mode
2. Try to book a ride

**Expected Results:**
- ✅ Error message: "Network connection required"
- ✅ Graceful fallback (no crash)
- ✅ Offline data still accessible (history)
- ✅ Toast shows network error
- ✅ Retry option available

### Test 4.3: App Restart During Active Ride
**Steps:**
1. Start a ride (as passenger or driver)
2. Force close the app
3. Reopen the app

**Expected Results:**
- ✅ App restores to active ride screen
- ✅ Ride state persisted correctly
- ✅ Can continue or cancel the ride
- ✅ No data loss

### Test 4.4: Empty States
**Steps:**
1. Fresh install, check ride history
2. As new driver, check earnings before any rides

**Expected Results:**
- ✅ EmptyState component displays
- ✅ Shows appropriate icon and message
- ✅ "No rides yet" for passenger history
- ✅ "Start earning!" for driver with no rides
- ✅ Optional CTA button shown

### Test 4.5: Invalid Input Handling
**Steps:**
1. Try to book ride with same pickup and destination
2. Try to proceed without selecting vehicle
3. Try to submit rating without selecting stars

**Expected Results:**
- ✅ Validation prevents invalid actions
- ✅ Error messages displayed via Toast
- ✅ Buttons disabled when conditions not met
- ✅ Clear user feedback for errors

---

## Test Suite 5: UI/UX Polish

### Test 5.1: Animations
**Steps:**
1. Observe all screen transitions
2. Check button press states
3. Verify loading animations

**Expected Results:**
- ✅ Smooth transitions between screens
- ✅ Bottom sheets slide up/down smoothly
- ✅ Button press feedback visible
- ✅ Loading overlays display correctly
- ✅ Toast notifications slide in from top
- ✅ No janky or choppy animations

### Test 5.2: Filipino Localization
**Steps:**
1. Review all screens for Filipino labels
2. Check button text and messages

**Expected Results:**
- ✅ "Tara na!" in role selection
- ✅ "Tanggapin" and "Tanggihan" in ride requests
- ✅ "Ingat!" in ride complete message
- ✅ "Walang komisyon!" in driver screens
- ✅ Mixed English/Filipino feels natural

### Test 5.3: Responsive Layout
**Steps:**
1. Test on different screen sizes (if available)
2. Rotate device to landscape
3. Check text truncation and overflow

**Expected Results:**
- ✅ UI adapts to screen size
- ✅ No overlapping elements
- ✅ Text doesn't overflow containers
- ✅ Maps resize correctly
- ✅ Buttons remain accessible

### Test 5.4: Accessibility
**Steps:**
1. Enable screen reader
2. Navigate through key flows
3. Check color contrast

**Expected Results:**
- ✅ Screen reader can read key labels
- ✅ Buttons have accessible labels
- ✅ Sufficient color contrast for text
- ✅ Touch targets are adequate size (44x44 min)

---

## Test Suite 6: Performance

### Test 6.1: App Launch Time
**Steps:**
1. Force close app
2. Time the launch to usable state

**Expected Results:**
- ✅ App launches in < 3 seconds
- ✅ Splash screen displays
- ✅ No white screen flash
- ✅ Smooth transition to first screen

### Test 6.2: Map Performance
**Steps:**
1. Pan and zoom the map extensively
2. Load ride with multiple markers and polyline

**Expected Results:**
- ✅ Map panning smooth (no lag)
- ✅ Markers render quickly
- ✅ Polyline draws without delay
- ✅ No frame drops during interaction

### Test 6.3: Memory Usage
**Steps:**
1. Complete 5-10 rides in succession
2. Switch roles multiple times
3. Monitor for crashes or slowdowns

**Expected Results:**
- ✅ No memory leaks
- ✅ App remains responsive
- ✅ No crashes after extended use
- ✅ AsyncStorage doesn't grow excessively

---

## Test Suite 7: Data Persistence

### Test 7.1: AsyncStorage - Passenger Data
**Steps:**
1. Complete 3 rides as passenger
2. Force close app
3. Reopen and check history

**Expected Results:**
- ✅ All 3 rides appear in history
- ✅ Ride details accurate (fare, route, rating)
- ✅ Data survives app restart
- ✅ No duplicates or missing rides

### Test 7.2: AsyncStorage - Driver Data
**Steps:**
1. Complete 5 rides as driver
2. Close and reopen app
3. Check earnings and history

**Expected Results:**
- ✅ Earnings totals correct
- ✅ All 5 rides in history
- ✅ Daily grouping preserved
- ✅ No data corruption

### Test 7.3: AsyncStorage - App State
**Steps:**
1. Set preferences (if any)
2. Switch roles
3. Restart app

**Expected Results:**
- ✅ Last role remembered
- ✅ User preferences persist
- ✅ Driver profile data saved
- ✅ No unexpected resets

---

## Bug Tracking Template

When you find a bug during testing, document it as follows:

**Bug ID:** BUG-001
**Severity:** Critical / High / Medium / Low
**Test Suite:** (e.g., Test 1.5 - Vehicle Selection)
**Description:** Brief description of the issue
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** What should happen
**Actual Result:** What actually happens
**Screenshots:** If applicable
**Device:** iOS/Android, device model, OS version
**Reproducibility:** Always / Sometimes / Once

---

## Testing Checklist Summary

### Phase 8.1.1: Passenger Flow
- [ ] Initial app launch
- [ ] Select passenger role
- [ ] Location selection (pickup & destination)
- [ ] Vehicle selection & fare calculation
- [ ] Driver matching
- [ ] Ride in progress
- [ ] Ride completion
- [ ] Rating & tipping
- [ ] View ride history
- [ ] Cancel ride scenarios

### Phase 8.1.2: Driver Flow
- [ ] Select driver role
- [ ] Go online
- [ ] Receive ride request
- [ ] Accept ride request
- [ ] Navigate to pickup
- [ ] Start ride
- [ ] Complete ride
- [ ] View earnings
- [ ] View ride history
- [ ] Decline ride request
- [ ] Go offline

### Phase 8.1.3: Role Switching
- [ ] Switch passenger to driver
- [ ] Switch driver to passenger
- [ ] Data isolation verification
- [ ] Rapid role switching

### Additional Testing
- [ ] Error handling scenarios
- [ ] UI/UX polish verification
- [ ] Performance testing
- [ ] Data persistence validation

---

## Sign-Off

**Tester Name:** ________________
**Date:** ________________
**Test Environment:** ________________
**Overall Status:** Pass / Fail / Pass with Issues

**Notes:**
