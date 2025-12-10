import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { LocationProvider } from './src/context/LocationContext';
import { RideProvider } from './src/context/RideContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <LocationProvider>
            <RideProvider>
              <RootNavigator />
              <StatusBar style="auto" />
            </RideProvider>
          </LocationProvider>
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
