import React, { useState } from 'react';
import { Modal } from 'react-native';
import { useRide } from '../../context/RideContext';
import { DriverFoundScreen } from '../../screens/passenger/DriverFoundScreen';
import { RideCompleteScreen } from '../../screens/passenger/RideCompleteScreen';
import { RideInProgressScreen } from '../../screens/passenger/RideInProgressScreen';
import { RideOptionsScreen } from '../../screens/passenger/RideOptionsScreen';
import { SearchingDriverScreen } from '../../screens/passenger/SearchingDriverScreen';
import { Coordinates } from '../../types/location.types';
import { LocationPickerModal } from './LocationPickerModal';
import { RideBookingSheet } from './RideBookingSheet';

interface BookingFlowContainerProps {
  visible: boolean;
  onClose: () => void;
}

type BookingStep = 'locations' | 'pickup-picker' | 'destination-picker' | 'vehicle' | 'searching' | 'found' | 'in-progress' | 'complete';

export function BookingFlowContainer({ visible, onClose }: BookingFlowContainerProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('locations');
  const {
    pickupLocation,
    destinationLocation,
    setPickupLocation,
    setDestinationLocation,
    startDriverSearch,
    resetBooking,
    foundDriver,
    activeRide,
  } = useRide();

  const handleClose = () => {
    setCurrentStep('locations');
    resetBooking();
    onClose();
  };

  const handleSelectPickup = () => {
    setCurrentStep('pickup-picker');
  };

  const handleSelectDestination = () => {
    setCurrentStep('destination-picker');
  };

  const handlePickupSelected = (location: { location: Coordinates; address: string }) => {
    setPickupLocation(location);
    setCurrentStep('locations');
  };

  const handleDestinationSelected = (location: { location: Coordinates; address: string }) => {
    setDestinationLocation(location);
    setCurrentStep('locations');
  };

  const handleContinueToVehicleSelection = () => {
    if (pickupLocation && destinationLocation) {
      setCurrentStep('vehicle');
    }
  };

  const handleSelectVehicle = async (vehicleType: any, fare: any) => {
    try {
      setCurrentStep('searching');

      // Pass vehicle and fare directly to search to avoid race condition
      await startDriverSearch(vehicleType, fare);
      setCurrentStep('found');
    } catch (error) {
      console.error('Driver search failed:', error);
      setCurrentStep('vehicle');
    }
  };

  const handleStartRide = () => {
    setCurrentStep('in-progress');
  };

  const handleRideComplete = () => {
    setCurrentStep('complete');
  };

  const handleDone = () => {
    handleClose();
  };

  const handleBackToLocations = () => {
    setCurrentStep('locations');
  };

  const handleCancelSearch = () => {
    setCurrentStep('vehicle');
  };

  if (currentStep === 'locations') {
    return (
      <RideBookingSheet
        visible={visible}
        onClose={handleClose}
        onSelectPickup={handleSelectPickup}
        onSelectDestination={handleSelectDestination}
        onContinue={handleContinueToVehicleSelection}
        pickupLocation={pickupLocation || undefined}
        destinationLocation={destinationLocation || undefined}
      />
    );
  }

  if (currentStep === 'pickup-picker') {
    return (
      <LocationPickerModal
        visible={visible}
        onClose={() => setCurrentStep('locations')}
        onSelect={handlePickupSelected}
        title="Select Pickup Location"
        type="pickup"
      />
    );
  }

  if (currentStep === 'destination-picker') {
    return (
      <LocationPickerModal
        visible={visible}
        onClose={() => setCurrentStep('locations')}
        onSelect={handleDestinationSelected}
        title="Select Destination"
        type="destination"
      />
    );
  }

  if (currentStep === 'vehicle') {
    if (!pickupLocation || !destinationLocation) {
      setCurrentStep('locations');
      return null;
    }

    return (
      <Modal visible={visible} animationType="slide">
        <RideOptionsScreen
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          onSelectVehicle={handleSelectVehicle}
          onBack={handleBackToLocations}
        />
      </Modal>
    );
  }

  if (currentStep === 'searching') {
    if (!pickupLocation || !destinationLocation) {
      setCurrentStep('locations');
      return null;
    }

    return (
      <Modal visible={visible} animationType="slide">
        <SearchingDriverScreen
          vehicleType={pickupLocation ? 'sedan' : 'sedan'} // TODO: Use actual selected vehicle
          pickupLocation={pickupLocation.location}
          onDriverFound={() => setCurrentStep('found')}
          onCancel={handleCancelSearch}
        />
      </Modal>
    );
  }

  if (currentStep === 'found') {
    if (!foundDriver || !pickupLocation) {
      setCurrentStep('searching');
      return null;
    }

    return (
      <Modal visible={visible} animationType="slide">
        <DriverFoundScreen
          driver={foundDriver}
          pickupLocation={pickupLocation.location}
          onStartRide={handleStartRide}
          onCancelRide={handleCancelSearch}
        />
      </Modal>
    );
  }

  if (currentStep === 'in-progress') {
    // Type guard to ensure activeRide is a full Ride object
    if (!activeRide || !('driver' in activeRide)) {
      setCurrentStep('locations');
      return null;
    }

    return (
      <Modal visible={visible} animationType="slide">
        <RideInProgressScreen
          ride={activeRide}
          onRideComplete={handleRideComplete}
        />
      </Modal>
    );
  }

  if (currentStep === 'complete') {
    // Type guard to ensure activeRide is a full Ride object
    if (!activeRide || !('driver' in activeRide)) {
      handleClose();
      return null;
    }

    return (
      <Modal visible={visible} animationType="slide">
        <RideCompleteScreen
          ride={activeRide}
          onDone={handleDone}
        />
      </Modal>
    );
  }

  return null;
}
