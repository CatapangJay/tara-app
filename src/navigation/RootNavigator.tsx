import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import FeaturesScreen from '../screens/onboarding/FeaturesScreen';
import LocationPermissionScreen from '../screens/onboarding/LocationPermissionScreen';
import NotificationPermissionScreen from '../screens/onboarding/NotificationPermissionScreen';
import WelcomeOnboardingScreen from '../screens/onboarding/WelcomeOnboardingScreen';
import { RootStackParamList } from '../types/navigation.types';
import { UserRole } from '../types/user.types';
import DriverNavigator from './DriverNavigator';
import PassengerNavigator from './PassengerNavigator';

const AppStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator();
const OnboardingStack = createStackNavigator();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function OnboardingStackNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="OnboardingWelcome" component={WelcomeOnboardingScreen} />
      <OnboardingStack.Screen name="OnboardingFeatures" component={FeaturesScreen} />
      <OnboardingStack.Screen name="OnboardingLocation" component={LocationPermissionScreen} />
      <OnboardingStack.Screen name="OnboardingNotifications" component={NotificationPermissionScreen} />
    </OnboardingStack.Navigator>
  );
}

function MainAppNavigator({ userRole }: { userRole: UserRole | null }) {
  return (
    <AppStack.Navigator
      key={userRole ?? 'role-selection'}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: 300,
            },
          },
        },
      }}
    >
      {!userRole ? (
        <AppStack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      ) : userRole === 'passenger' ? (
        <AppStack.Screen name="PassengerApp" component={PassengerNavigator} />
      ) : (
        <AppStack.Screen name="DriverApp" component={DriverNavigator} />
      )}
    </AppStack.Navigator>
  );
}

export default function RootNavigator() {
  const { userRole, isLoading: appLoading } = useApp();
  const { isLoading: authLoading, isAuthenticated, hasCompletedOnboarding } = useAuth();

  if (appLoading || authLoading) {
    return <LoadingOverlay visible={true} message="Loading..." />;
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStackNavigator />
      ) : !hasCompletedOnboarding ? (
        <OnboardingStackNavigator />
      ) : (
        <MainAppNavigator userRole={userRole} />
      )}
    </NavigationContainer>
  );
}
