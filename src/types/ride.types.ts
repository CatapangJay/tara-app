import { Driver, VehicleType } from './driver.types';
import { Location, Route } from './location.types';
import { Passenger } from './passenger.types';
import { Fare, Payment } from './payment.types';

export type RideStatus =
  | 'requesting'
  | 'searching'
  | 'driver_found'
  | 'driver_arriving'
  | 'driver_arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface RideRequest {
  id: string;
  passengerId: string;
  pickup: Location;
  destination: Location;
  vehicleType: VehicleType;
  estimatedFare: Fare;
  status: RideStatus;
  requestedAt: string; // ISO date string
}

export interface Ride {
  id: string;
  passenger: Passenger;
  driver: Driver;
  route: Route;
  vehicleType: VehicleType;
  fare: Fare;
  payment: Payment;
  status: RideStatus;
  requestedAt: string; // ISO date string
  acceptedAt?: string; // ISO date string
  startedAt?: string; // ISO date string
  completedAt?: string; // ISO date string
  ratings?: {
    passengerRating?: number; // Rating given by passenger to driver
    driverRating?: number; // Rating given by driver to passenger
  };
}
