import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ride } from '../types/ride.types';

const DRIVER_RIDES_STORAGE_KEY = '@tara_driver_rides';
const DRIVER_EARNINGS_STORAGE_KEY = '@tara_driver_earnings';

export interface DriverEarnings {
  today: number;
  week: number;
  month: number;
  total: number;
  lastUpdated: string; // ISO date string
}

export interface DriverRideHistory {
  rides: Ride[];
  earnings: DriverEarnings;
}

/**
 * Get the start of today (midnight)
 */
function getStartOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Get the start of this week (Monday)
 */
function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(now.getFullYear(), now.getMonth(), diff);
}

/**
 * Get the start of this month
 */
function getStartOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Calculate earnings from rides within a date range
 */
function calculateEarningsInRange(rides: Ride[], startDate: Date): number {
  return rides
    .filter((ride) => {
      const rideDate = new Date(ride.completedAt || ride.requestedAt);
      return rideDate >= startDate;
    })
    .reduce((total, ride) => total + ride.fare.total, 0);
}

/**
 * Calculate all earnings periods
 */
function calculateEarnings(rides: Ride[]): DriverEarnings {
  const completedRides = rides.filter((ride) => ride.status === 'completed');
  
  const today = calculateEarningsInRange(completedRides, getStartOfToday());
  const week = calculateEarningsInRange(completedRides, getStartOfWeek());
  const month = calculateEarningsInRange(completedRides, getStartOfMonth());
  const total = completedRides.reduce((sum, ride) => sum + ride.fare.total, 0);

  return {
    today,
    week,
    month,
    total,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Save a completed ride to driver's history
 */
export async function saveDriverRide(ride: Ride): Promise<void> {
  try {
    if (ride.status !== 'completed') {
      console.warn('Attempted to save incomplete ride');
      return;
    }

    // Get existing rides
    const existingData = await AsyncStorage.getItem(DRIVER_RIDES_STORAGE_KEY);
    const rides: Ride[] = existingData ? JSON.parse(existingData) : [];

    // Check if ride already exists
    const existingIndex = rides.findIndex((r) => r.id === ride.id);
    if (existingIndex >= 0) {
      // Update existing ride
      rides[existingIndex] = ride;
    } else {
      // Add new ride
      rides.unshift(ride); // Add to beginning of array
    }

    // Save updated rides
    await AsyncStorage.setItem(DRIVER_RIDES_STORAGE_KEY, JSON.stringify(rides));

    // Calculate and save earnings
    const earnings = calculateEarnings(rides);
    await AsyncStorage.setItem(DRIVER_EARNINGS_STORAGE_KEY, JSON.stringify(earnings));

    console.log('Driver ride saved successfully:', ride.id);
    console.log('Updated earnings:', earnings);
  } catch (error) {
    console.error('Error saving driver ride:', error);
    throw error;
  }
}

/**
 * Get driver's ride history
 */
export async function getDriverRideHistory(): Promise<DriverRideHistory> {
  try {
    const ridesData = await AsyncStorage.getItem(DRIVER_RIDES_STORAGE_KEY);
    const earningsData = await AsyncStorage.getItem(DRIVER_EARNINGS_STORAGE_KEY);

    const rides: Ride[] = ridesData ? JSON.parse(ridesData) : [];
    let earnings: DriverEarnings;

    if (earningsData) {
      earnings = JSON.parse(earningsData);
      // Recalculate if data is stale (from a different day)
      const lastUpdate = new Date(earnings.lastUpdated);
      const today = getStartOfToday();
      if (lastUpdate < today) {
        earnings = calculateEarnings(rides);
        await AsyncStorage.setItem(DRIVER_EARNINGS_STORAGE_KEY, JSON.stringify(earnings));
      }
    } else {
      earnings = calculateEarnings(rides);
    }

    return { rides, earnings };
  } catch (error) {
    console.error('Error getting driver ride history:', error);
    return {
      rides: [],
      earnings: {
        today: 0,
        week: 0,
        month: 0,
        total: 0,
        lastUpdated: new Date().toISOString(),
      },
    };
  }
}

/**
 * Get driver earnings only
 */
export async function getDriverEarnings(): Promise<DriverEarnings> {
  const history = await getDriverRideHistory();
  return history.earnings;
}

/**
 * Clear all driver data (for testing/demo)
 */
export async function clearDriverData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DRIVER_RIDES_STORAGE_KEY);
    await AsyncStorage.removeItem(DRIVER_EARNINGS_STORAGE_KEY);
    console.log('Driver data cleared');
  } catch (error) {
    console.error('Error clearing driver data:', error);
    throw error;
  }
}
