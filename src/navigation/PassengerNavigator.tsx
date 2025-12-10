import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import PassengerAccountScreen from '../screens/passenger/AccountScreen';
import ActivityScreen from '../screens/passenger/ActivityScreen';
import PassengerHomeScreen from '../screens/passenger/HomeScreen';
import RideDetailsScreen from '../screens/passenger/RideDetailsScreen';
import { PassengerTabParamList } from '../types/navigation.types';

const Tab = createBottomTabNavigator<PassengerTabParamList>();
const ActivityStack = createNativeStackNavigator();

function ActivityStackNavigator() {
  return (
    <ActivityStack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerShown: false,
      }}
    >
      <ActivityStack.Screen
        name="ActivityList"
        component={ActivityScreen}
      />
      <ActivityStack.Screen
        name="RideDetails"
        component={RideDetailsScreen}
      />
    </ActivityStack.Navigator>
  );
}

export default function PassengerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Activity') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999999',
        headerShown: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={PassengerHomeScreen}
        options={{ title: 'Book a Ride' }}
      />
      <Tab.Screen 
        name="Activity" 
        component={ActivityStackNavigator}
        options={{ 
          title: 'My Rides',
          headerShown: false,
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={PassengerAccountScreen}
        options={{ title: 'Account' }}
      />
    </Tab.Navigator>
  );
}
