import { NavigatorScreenParams } from '@react-navigation/native';
import { VehicleType } from './driver.types';
import { Location } from './location.types';
import { Fare } from './payment.types';

// Root Stack Navigator
export type RootStackParamList = {
  RoleSelection: undefined;
  PassengerApp: NavigatorScreenParams<PassengerTabParamList>;
  DriverApp: NavigatorScreenParams<DriverTabParamList>;
};

// Passenger Tab Navigator
export type PassengerTabParamList = {
  Home: undefined;
  Activity: undefined;
  Account: undefined;
};

// Passenger Stack Navigator (for modals and details)
export type PassengerStackParamList = {
  HomeScreen: undefined;
  LocationPicker: {
    type: 'pickup' | 'destination';
    onSelect: (location: Location) => void;
  };
  RideOptions: {
    pickup: Location;
    destination: Location;
  };
  SearchingDriver: {
    pickup: Location;
    destination: Location;
    vehicleType: VehicleType;
    fare: Fare;
  };
  DriverFound: {
    rideId: string;
  };
  RideInProgress: {
    rideId: string;
  };
  RideComplete: {
    rideId: string;
  };
  RideDetails: {
    rideId: string;
  };
};

// Driver Tab Navigator
export type DriverTabParamList = {
  Home: undefined;
  Earnings: undefined;
  Account: undefined;
};

// Driver Stack Navigator
export type DriverStackParamList = {
  HomeScreen: undefined;
  GoingToPickup: {
    rideId: string;
  };
  RideInProgress: {
    rideId: string;
  };
  RideComplete: {
    rideId: string;
  };
};
