import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Driver } from '../types/driver.types';
import { Passenger } from '../types/passenger.types';
import { UserRole } from '../types/user.types';
import { MOCK_DRIVER, MOCK_PASSENGER } from '../utils/mockData';

interface AppContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => Promise<void>;
  isOnline: boolean;
  toggleOnline: () => void;
  currentUser: Passenger | Driver | null;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = '@tara_user_role';
const ONLINE_STORAGE_KEY = '@tara_driver_online';

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved role on mount
  useEffect(() => {
    loadSavedRole();
  }, []);

  const loadSavedRole = async () => {
    try {
      const savedRole = await AsyncStorage.getItem(ROLE_STORAGE_KEY);
      const savedOnline = await AsyncStorage.getItem(ONLINE_STORAGE_KEY);
      
      if (savedRole) {
        setUserRoleState(savedRole as UserRole);
      }
      if (savedOnline) {
        setIsOnline(savedOnline === 'true');
      }
    } catch (error) {
      console.error('Error loading saved role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserRole = async (role: UserRole | null) => {
    try {
      if (role) {
        await AsyncStorage.setItem(ROLE_STORAGE_KEY, role);
      } else {
        await AsyncStorage.removeItem(ROLE_STORAGE_KEY);
        await AsyncStorage.removeItem(ONLINE_STORAGE_KEY);
      }
      setUserRoleState(role);
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  const toggleOnline = async () => {
    const newOnlineStatus = !isOnline;
    try {
      await AsyncStorage.setItem(ONLINE_STORAGE_KEY, String(newOnlineStatus));
      setIsOnline(newOnlineStatus);
    } catch (error) {
      console.error('Error toggling online status:', error);
    }
  };

  // Get current user based on role
  const currentUser = userRole === 'passenger' ? MOCK_PASSENGER : userRole === 'driver' ? MOCK_DRIVER : null;

  const value: AppContextType = {
    userRole,
    setUserRole,
    isOnline,
    toggleOnline,
    currentUser,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
