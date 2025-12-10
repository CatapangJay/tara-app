import React, { useState } from 'react';
import { View } from 'react-native';
import { GoingToPickupScreen } from '../../screens/driver/GoingToPickupScreen';
import { DriverRideCompleteScreen } from '../../screens/driver/RideCompleteScreen';
import { DriverRideInProgressScreen } from '../../screens/driver/RideInProgressScreen';
import { Coordinates } from '../../types/location.types';
import { Ride, RideRequest } from '../../types/ride.types';

type DriverFlowStep = 'going_to_pickup' | 'ride_in_progress' | 'ride_complete';

interface DriverFlowContainerProps {
  rideRequest: RideRequest;
  driverLocation: Coordinates;
  onComplete: () => void;
  onCancel: () => void;
}

export function DriverFlowContainer({
  rideRequest,
  driverLocation,
  onComplete,
  onCancel,
}: DriverFlowContainerProps) {
  const [currentStep, setCurrentStep] = useState<DriverFlowStep>('going_to_pickup');
  const [activeRide, setActiveRide] = useState<Ride | null>(null);

  // Create initial Ride object from RideRequest
  const createRideFromRequest = (status: 'driver_arriving' | 'in_progress' = 'driver_arriving'): Ride => {
    return {
      id: rideRequest.id,
      passenger: {
        id: rideRequest.passengerId,
        name: 'Juan Dela Cruz',
        email: 'juan@example.com',
        phone: '+63 912 345 6789',
        role: 'passenger',
        rating: 4.8,
        totalTrips: 45,
        memberSince: '2024-01-01T00:00:00.000Z',
      },
      driver: {
        id: 'driver-1',
        name: 'Pedro Santos',
        email: 'pedro@example.com',
        phone: '+63 912 345 6789',
        role: 'driver',
        rating: 4.9,
        totalTrips: 234,
        memberSince: '2023-01-01T00:00:00.000Z',
        vehicle: {
          type: rideRequest.vehicleType,
          make: 'Toyota',
          model: 'Vios',
          color: 'White',
          plateNumber: 'ABC 1234',
          year: 2020,
          capacity: 4,
        },
        isOnline: true,
        currentLocation: driverLocation,
        subscription: {
          plan: 'pro',
          price: 1999,
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2025-01-01T00:00:00.000Z',
          isActive: true,
        },
        earnings: {
          today: 0,
          week: 0,
          month: 0,
          total: 0,
        },
      },
      route: {
        origin: rideRequest.pickup,
        destination: rideRequest.destination,
        distance: 5.2, // km
        duration: 15, // minutes
        polyline: '',
      },
      vehicleType: rideRequest.vehicleType,
      fare: rideRequest.estimatedFare,
      payment: {
        id: `payment-${rideRequest.id}`,
        method: 'cash',
        status: 'pending',
        amount: rideRequest.estimatedFare.total,
        timestamp: new Date().toISOString(),
      },
      status,
      requestedAt: rideRequest.requestedAt,
      acceptedAt: new Date().toISOString(),
      startedAt: status === 'in_progress' ? new Date().toISOString() : undefined,
    };
  };

  // Convert RideRequest to Ride when driver arrives at pickup
  const handleArrivedAtPickup = () => {
    const ride = createRideFromRequest('in_progress');
    setActiveRide(ride);
    setCurrentStep('ride_in_progress');
  };

  const handleCompleteRide = () => {
    if (activeRide) {
      const completedRide: Ride = {
        ...activeRide,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };
      setActiveRide(completedRide);
      setCurrentStep('ride_complete');
    }
  };

  const handleFinish = () => {
    console.log('Driver flow complete');
    onComplete();
  };

  // Render current step
  if (currentStep === 'going_to_pickup') {
    const initialRide = createRideFromRequest('driver_arriving');
    return (
      <GoingToPickupScreen
        ride={initialRide}
        driverLocation={driverLocation}
        onArrived={handleArrivedAtPickup}
        onCancel={onCancel}
      />
    );
  }

  if (currentStep === 'ride_in_progress' && activeRide) {
    return (
      <DriverRideInProgressScreen
        ride={activeRide}
        onComplete={handleCompleteRide}
      />
    );
  }

  if (currentStep === 'ride_complete' && activeRide) {
    return (
      <DriverRideCompleteScreen
        ride={activeRide}
        onDone={handleFinish}
      />
    );
  }

  return <View />;
}
