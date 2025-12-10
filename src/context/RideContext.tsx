import React, { createContext, useCallback, useContext, useState } from 'react';
import { RideService } from '../services/data/RideService';
import { Driver, VehicleType } from '../types/driver.types';
import { Coordinates } from '../types/location.types';
import { Fare } from '../types/payment.types';
import { Ride, RideRequest } from '../types/ride.types';

interface RideContextType {
  // Current ride state
  activeRide: Ride | RideRequest | null;
  isSearchingDriver: boolean;
  
  // Driver-specific state
  pendingRideRequest: RideRequest | null;
  setPendingRideRequest: (request: RideRequest | null) => void;
  
  // Booking flow state
  pickupLocation: { location: Coordinates; address: string } | null;
  destinationLocation: { location: Coordinates; address: string } | null;
  selectedVehicleType: VehicleType | null;
  selectedFare: Fare | null;
  foundDriver: Driver | null;
  
  // Actions
  setPickupLocation: (location: { location: Coordinates; address: string }) => void;
  setDestinationLocation: (location: { location: Coordinates; address: string }) => void;
  selectVehicleType: (vehicleType: VehicleType, fare: Fare) => void;
  startDriverSearch: (vehicleType?: VehicleType, fare?: Fare) => Promise<void>;
  cancelRide: () => Promise<void>;
  startRide: () => Promise<void>;
  completeRide: () => Promise<void>;
  resetBooking: () => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export function RideProvider({ children }: { children: React.ReactNode }) {
  const [activeRide, setActiveRide] = useState<Ride | RideRequest | null>(null);
  const [isSearchingDriver, setIsSearchingDriver] = useState(false);
  
  // Driver-specific state
  const [pendingRideRequest, setPendingRideRequest] = useState<RideRequest | null>(null);
  
  // Booking flow state
  const [pickupLocation, setPickupLocation] = useState<{ location: Coordinates; address: string } | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<{ location: Coordinates; address: string } | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null);
  const [selectedFare, setSelectedFare] = useState<Fare | null>(null);
  const [foundDriver, setFoundDriver] = useState<Driver | null>(null);

  const selectVehicleType = useCallback((vehicleType: VehicleType, fare: Fare) => {
    setSelectedVehicleType(vehicleType);
    setSelectedFare(fare);
  }, []);

  const startDriverSearch = useCallback(async (vehicleType?: VehicleType, fare?: Fare) => {
    // Use provided params or fall back to state
    const vType = vehicleType || selectedVehicleType;
    const vFare = fare || selectedFare;
    
    if (!pickupLocation || !destinationLocation || !vType || !vFare) {
      const missing = [];
      if (!pickupLocation) missing.push('pickup');
      if (!destinationLocation) missing.push('destination');
      if (!vType) missing.push('vehicle type');
      if (!vFare) missing.push('fare');
      console.error('Missing booking information:', missing.join(', '));
      throw new Error(`Missing booking information: ${missing.join(', ')}`);
    }

    // Update state if params were provided
    if (vehicleType && fare) {
      setSelectedVehicleType(vehicleType);
      setSelectedFare(fare);
    }

    try {
      setIsSearchingDriver(true);

      // Create ride request
      const rideRequest = await RideService.createRideRequest(
        'passenger-001', // TODO: Get from auth context
        pickupLocation,
        destinationLocation,
        vType
      );

      setActiveRide(rideRequest);

      // Notify drivers (simulate real-time notification with delay)
      setTimeout(() => {
        setPendingRideRequest(rideRequest);
      }, 2000);

      // Search for driver (simulate 2-3 second delay)
      const driver = await RideService.findNearbyDriver(
        pickupLocation.location,
        vType
      );

      if (driver) {
        setFoundDriver(driver);
        
        // Accept ride and create full ride object
        const ride = await RideService.acceptRideRequest(rideRequest, driver);
        setActiveRide(ride);
      } else {
        throw new Error('No drivers available');
      }
    } catch (error) {
      console.error('Error during driver search:', error);
      throw error;
    } finally {
      setIsSearchingDriver(false);
    }
  }, [pickupLocation, destinationLocation, selectedVehicleType, selectedFare]);

  const resetBooking = useCallback(() => {
    setActiveRide(null);
    setIsSearchingDriver(false);
    setPickupLocation(null);
    setDestinationLocation(null);
    setSelectedVehicleType(null);
    setSelectedFare(null);
    setFoundDriver(null);
  }, []);

  const cancelRide = useCallback(async () => {
    if (!activeRide) return;

    try {
      await RideService.cancelRide(activeRide.id);
      resetBooking();
    } catch (error) {
      console.error('Error canceling ride:', error);
      throw error;
    }
  }, [activeRide, resetBooking]);

  const startRide = useCallback(async () => {
    if (!activeRide) return;

    try {
      const updatedRide = await RideService.startRide(activeRide.id);
      setActiveRide(updatedRide);
    } catch (error) {
      console.error('Error starting ride:', error);
      throw error;
    }
  }, [activeRide]);

  const completeRide = useCallback(async () => {
    if (!activeRide) return;

    try {
      const updatedRide = await RideService.completeRide(activeRide.id);
      setActiveRide(updatedRide);
    } catch (error) {
      console.error('Error completing ride:', error);
      throw error;
    }
  }, [activeRide]);

  return (
    <RideContext.Provider
      value={{
        activeRide,
        isSearchingDriver,
        pendingRideRequest,
        setPendingRideRequest,
        pickupLocation,
        destinationLocation,
        selectedVehicleType,
        selectedFare,
        foundDriver,
        setPickupLocation,
        setDestinationLocation,
        selectVehicleType,
        startDriverSearch,
        cancelRide,
        startRide,
        completeRide,
        resetBooking,
      }}
    >
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
}
