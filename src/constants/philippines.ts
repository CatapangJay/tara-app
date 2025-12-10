import { VehicleType } from '../types/driver.types';
import { Coordinates, Location } from '../types/location.types';

// San Pablo City, Laguna, Philippines
export const SAN_PABLO_CENTER: Coordinates = {
  latitude: 14.0693,
  longitude: 121.3265,
};

// Popular landmarks in San Pablo City
export const SAN_PABLO_LANDMARKS: Location[] = [
  {
    coordinates: { latitude: 14.0693, longitude: 121.3265 },
    address: 'SM City San Pablo, San Pablo, Laguna',
    landmark: 'SM City San Pablo',
  },
  {
    coordinates: { latitude: 14.0662, longitude: 121.3242 },
    address: 'San Pablo City Hall, San Pablo, Laguna',
    landmark: 'City Hall',
  },
  {
    coordinates: { latitude: 14.0756, longitude: 121.3287 },
    address: 'Sampaloc Lake, San Pablo, Laguna',
    landmark: 'Sampaloc Lake',
  },
  {
    coordinates: { latitude: 14.0645, longitude: 121.3215 },
    address: 'Plaza Rizal, San Pablo, Laguna',
    landmark: 'Plaza Rizal',
  },
  {
    coordinates: { latitude: 14.0678, longitude: 121.3298 },
    address: 'San Pablo Cathedral, San Pablo, Laguna',
    landmark: 'San Pablo Cathedral',
  },
  {
    coordinates: { latitude: 14.0712, longitude: 121.3302 },
    address: 'Robinsons San Pablo, San Pablo, Laguna',
    landmark: 'Robinsons Mall',
  },
  {
    coordinates: { latitude: 14.0621, longitude: 121.3189 },
    address: 'Public Market, San Pablo, Laguna',
    landmark: 'Public Market',
  },
  {
    coordinates: { latitude: 14.0798, longitude: 121.3356 },
    address: 'Palakpakin Lake, San Pablo, Laguna',
    landmark: 'Palakpakin Lake',
  },
];

// Base fares by vehicle type (in PHP)
export const BASE_FARES: Record<VehicleType, number> = {
  tricycle: 20,
  motorcycle: 30,
  sedan: 50,
  suv: 70,
};

// Fare per kilometer (in PHP)
export const FARE_PER_KM: Record<VehicleType, number> = {
  tricycle: 10,
  motorcycle: 12,
  sedan: 15,
  suv: 18,
};

// Vehicle capacity
export const VEHICLE_CAPACITY: Record<VehicleType, number> = {
  tricycle: 3,
  motorcycle: 1,
  sedan: 4,
  suv: 6,
};

// Subscription plans (in PHP per month)
export const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic Plan',
    price: 999,
    features: ['100% of fares', 'Up to 50 rides/month', 'Basic support'],
  },
  pro: {
    name: 'Pro Plan',
    price: 1999,
    features: ['100% of fares', 'Unlimited rides', 'Priority support', 'Heat maps'],
  },
  premium: {
    name: 'Premium Plan',
    price: 2999,
    features: ['100% of fares', 'Unlimited rides', 'VIP support', 'All features', 'Marketing boost'],
  },
};

// Filipino text labels
export const FILIPINO_LABELS = {
  letsGo: 'Tara na!',
  accept: 'Tanggapin',
  decline: 'Tanggihan',
  noCommission: 'Walang komisyon!',
  fullEarnings: '100% sa driver',
  beSafe: 'Ingat!',
  thankYou: 'Salamat!',
  arrived: 'Dumating na!',
};

export const BARANGAYS = [
  'Bagong Pook',
  'Del Remedio',
  'Dolores',
  'San Antonio 1',
  'San Antonio 2',
  'San Bartolome',
  'San Buenaventura',
  'San Crispin',
  'San Cristobal',
  'San Diego',
  'San Francisco',
  'San Gabriel',
  'San Gregorio',
  'San Ignacio',
  'San Isidro',
  'San Joaquin',
  'San Jose',
  'San Juan',
  'San Lorenzo',
  'San Lucas 1',
  'San Lucas 2',
  'San Marcos',
  'San Mateo',
  'San Miguel',
  'San Nicolas',
  'San Pedro',
  'San Rafael',
  'San Roque',
  'San Vicente',
  'Santa Ana',
  'Santa Catalina',
  'Santa Cruz',
  'Santa Elena',
  'Santa Felomina',
  'Santa Isabel',
  'Santa Maria',
  'Santa Maria Magdalena',
  'Santa Monica',
  'Santa Veronica',
  'Santiago I',
  'Santiago II',
  'Santisimo Rosario',
  'Santo Angel',
  'Santo Cristo',
  'Santo Niño',
];
