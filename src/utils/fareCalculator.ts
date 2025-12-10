import { BASE_FARES, FARE_PER_KM } from '../constants/philippines';
import { VehicleType } from '../types/driver.types';
import { Coordinates } from '../types/location.types';
import { Fare } from '../types/payment.types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param from Starting coordinates
 * @param to Ending coordinates
 * @returns Distance in kilometers
 */
export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate fare for a ride based on distance and vehicle type
 * @param distance Distance in kilometers
 * @param vehicleType Type of vehicle
 * @returns Fare breakdown
 */
export function calculateFare(distance: number, vehicleType: VehicleType): Fare {
  const baseFare = BASE_FARES[vehicleType];
  const distanceFare = Math.round(distance * FARE_PER_KM[vehicleType]);
  const total = baseFare + distanceFare;
  
  return {
    baseFare,
    distanceFare,
    total,
    currency: 'PHP',
  };
}

/**
 * Format fare in Philippine Peso
 * @param amount Amount in PHP
 * @returns Formatted string
 */
export function formatFare(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}

/**
 * Estimate trip duration based on distance
 * @param distance Distance in kilometers
 * @returns Estimated duration in minutes
 */
export function estimateDuration(distance: number): number {
  // Assume average speed of 30 km/h in San Pablo City
  const hours = distance / 30;
  const minutes = Math.ceil(hours * 60);
  return Math.max(5, minutes); // Minimum 5 minutes
}
