import { Coordinates } from './location.types';
import { User } from './user.types';

export type VehicleType = 'sedan' | 'suv' | 'tricycle' | 'motorcycle';

export interface Vehicle {
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  capacity: number;
}

export interface Subscription {
  plan: 'basic' | 'pro' | 'premium';
  price: number; // Monthly price in PHP
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
}

export interface Driver extends User {
  vehicle: Vehicle;
  isOnline: boolean;
  currentLocation?: Coordinates;
  subscription: Subscription;
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
}
