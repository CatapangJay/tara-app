import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import DriverAccountScreen from '../screens/driver/AccountScreen';
import EarningsScreen from '../screens/driver/EarningsScreen';
import DriverHomeScreen from '../screens/driver/HomeScreen';
import { DriverTabParamList } from '../types/navigation.types';

const Tab = createBottomTabNavigator<DriverTabParamList>();

function OnlineToggle() {
  const { isOnline, toggleOnline } = useApp();

  return (
    <TouchableOpacity
      onPress={toggleOnline}
      style={[styles.toggleButton, isOnline && styles.toggleButtonActive]}
    >
      <Text style={[styles.toggleText, isOnline && styles.toggleTextActive]}>
        {isOnline ? 'Go Offline' : 'Go Online'}
      </Text>
    </TouchableOpacity>
  );
}

export default function DriverNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5856D6',
        tabBarInactiveTintColor: '#999999',
        headerShown: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={DriverHomeScreen}
        options={{
          title: 'Ride Requests',
          headerRight: () => <OnlineToggle />,
        }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen}
        options={{ title: 'Earnings' }}
      />
      <Tab.Screen 
        name="Account" 
        component={DriverAccountScreen}
        options={{ title: 'Account' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    marginRight: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
});
