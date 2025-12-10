import { LocationSubscription } from 'expo-location';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { SAN_PABLO_CENTER } from '../constants/philippines';
import { LocationService } from '../services/location/LocationService';
import { Coordinates } from '../types/location.types';

interface LocationContextType {
  currentLocation: Coordinates | null;
  currentAddress: string | null;
  isLoading: boolean;
  hasPermission: boolean;
  refreshLocation: () => Promise<void>;
  updateLocation: (location: Coordinates) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(SAN_PABLO_CENTER);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState<LocationSubscription | null>(null);

  useEffect(() => {
    initializeLocation();

    return () => {
      // Clean up location subscription on unmount
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeLocation = async () => {
    setIsLoading(true);
    try {
      // Request permissions
      const permitted = await LocationService.requestPermissions();
      setHasPermission(permitted);

      // Get initial location
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        // Get address for the location
        const address = await LocationService.getAddressFromCoordinates(location);
        setCurrentAddress(address);
      }

      // Start watching location if permission granted
      if (permitted) {
        const subscription = await LocationService.watchLocation((coords) => {
          setCurrentLocation(coords);
          // Optionally update address (but less frequently to avoid API calls)
        });
        setLocationSubscription(subscription);
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      // Fallback to San Pablo center
      setCurrentLocation(SAN_PABLO_CENTER);
      setCurrentAddress('San Pablo City, Laguna, Philippines');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLocation = async () => {
    setIsLoading(true);
    try {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
        const address = await LocationService.getAddressFromCoordinates(location);
        setCurrentAddress(address);
      }
    } catch (error) {
      console.error('Error refreshing location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocation = (location: Coordinates) => {
    setCurrentLocation(location);
  };

  const value: LocationContextType = {
    currentLocation,
    currentAddress,
    isLoading,
    hasPermission,
    refreshLocation,
    updateLocation,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
