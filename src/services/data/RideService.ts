import AsyncStorage from '@react-native-async-storage/async-storage';
import { Driver, VehicleType } from '../../types/driver.types';
import { Coordinates } from '../../types/location.types';
import { Ride, RideRequest, RideStatus } from '../../types/ride.types';
import { calculateDistance, calculateFare } from '../../utils/fareCalculator';
import { generateMockDrivers, MOCK_PASSENGER } from '../../utils/mockData';

const RIDE_REQUESTS_STORAGE_KEY = '@tara_ride_requests';
const RIDES_STORAGE_KEY = '@tara_rides';
const ACTIVE_RIDE_KEY = '@tara_active_ride';

export class RideService {
  /**
   * Create a new ride request
   */
  static async createRideRequest(
    passengerId: string,
    pickup: { location: Coordinates; address: string },
    destination: { location: Coordinates; address: string },
    vehicleType: VehicleType,
    notes?: string
  ): Promise<RideRequest> {
    const distance = calculateDistance(pickup.location, destination.location);

    const fare = calculateFare(distance, vehicleType);

    const rideRequest: RideRequest = {
      id: `ride_${Date.now()}`,
      passengerId,
      pickup: {
        coordinates: pickup.location,
        address: pickup.address,
      },
      destination: {
        coordinates: destination.location,
        address: destination.address,
      },
      vehicleType,
      estimatedFare: fare,
      status: 'requesting',
      requestedAt: new Date().toISOString(),
    };

    // Save to storage
    await this.saveRideRequest(rideRequest);
    await AsyncStorage.setItem(ACTIVE_RIDE_KEY, JSON.stringify(rideRequest));

    return rideRequest;
  }

  /**
   * Find a nearby driver (mock implementation)
   * In a real app, this would be done by the backend
   */
  static async findNearbyDriver(
    pickupLocation: Coordinates,
    vehicleType: VehicleType
  ): Promise<Driver | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get mock drivers
    const drivers = generateMockDrivers(10);

    // Filter by vehicle type and availability
    const availableDrivers = drivers.filter(
      driver =>
        driver.vehicle.type === vehicleType &&
        driver.isOnline
    );

    if (availableDrivers.length === 0) {
      return null;
    }

    // Find closest driver
    let closestDriver = availableDrivers[0];
    let minDistance = calculateDistance(
      pickupLocation,
      closestDriver.currentLocation!
    );

    for (let i = 1; i < availableDrivers.length; i++) {
      const driver = availableDrivers[i];
      const distance = calculateDistance(
        pickupLocation,
        driver.currentLocation!
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestDriver = driver;
      }
    }

    return closestDriver;
  }

  /**
   * Accept a ride request and create a ride
   */
  static async acceptRideRequest(
    rideRequest: RideRequest,
    driver: Driver
  ): Promise<Ride> {
    const distance = calculateDistance(
      rideRequest.pickup.coordinates,
      rideRequest.destination.coordinates
    );

    const ride: Ride = {
      id: rideRequest.id,
      passenger: MOCK_PASSENGER,
      driver,
      route: {
        origin: rideRequest.pickup,
        destination: rideRequest.destination,
        distance,
        duration: Math.round(distance * 2.5), // Rough estimate: 2.5 min per km
      },
      vehicleType: rideRequest.vehicleType,
      fare: rideRequest.estimatedFare,
      payment: {
        id: `payment_${Date.now()}`,
        amount: rideRequest.estimatedFare.total,
        method: 'cash',
        status: 'pending',
        timestamp: new Date().toISOString(),
      },
      status: 'driver_found',
      requestedAt: rideRequest.requestedAt,
      acceptedAt: new Date().toISOString(),
    };

    await this.saveRide(ride);
    await AsyncStorage.setItem(ACTIVE_RIDE_KEY, JSON.stringify(ride));
    return ride;
  }

  /**
   * Start a ride
   */
  static async startRide(rideId: string): Promise<Ride> {
    const ride = await this.getRide(rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }

    const updatedRide: Ride = {
      ...ride,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
    };

    await this.updateRide(updatedRide);
    return updatedRide;
  }

  /**
   * Complete a ride
   */
  static async completeRide(rideId: string): Promise<Ride> {
    const ride = await this.getRide(rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }

    const updatedRide: Ride = {
      ...ride,
      status: 'completed',
      completedAt: new Date().toISOString(),
      payment: {
        ...ride.payment,
        status: 'completed',
      },
    };

    await this.updateRide(updatedRide);
    await AsyncStorage.removeItem(ACTIVE_RIDE_KEY);
    return updatedRide;
  }

  /**
   * Cancel a ride
   */
  static async cancelRide(
    rideId: string,
    reason?: string
  ): Promise<Ride> {
    const ride = await this.getRide(rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }

    const updatedRide: Ride = {
      ...ride,
      status: 'cancelled',
    };

    await this.updateRide(updatedRide);
    await AsyncStorage.removeItem(ACTIVE_RIDE_KEY);
    return updatedRide;
  }

  /**
   * Update ride status
   */
  static async updateRideStatus(rideId: string, status: RideStatus): Promise<Ride> {
    const ride = await this.getRide(rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }

    const updatedRide: Ride = {
      ...ride,
      status,
    };

    await this.updateRide(updatedRide);
    return updatedRide;
  }

  /**
   * Get active ride or ride request
   */
  static async getActiveRide(): Promise<Ride | RideRequest | null> {
    try {
      const data = await AsyncStorage.getItem(ACTIVE_RIDE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting active ride:', error);
      return null;
    }
  }

  /**
   * Get a specific ride by ID
   */
  static async getRide(rideId: string): Promise<Ride | null> {
    try {
      const rides = await this.getAllRides();
      return rides.find(ride => ride.id === rideId) || null;
    } catch (error) {
      console.error('Error getting ride:', error);
      return null;
    }
  }

  /**
   * Get all rides
   */
  static async getAllRides(): Promise<Ride[]> {
    try {
      const data = await AsyncStorage.getItem(RIDES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all rides:', error);
      return [];
    }
  }

  /**
   * Get ride history for a user
   */
  static async getRideHistory(userId: string): Promise<Ride[]> {
    try {
      const rides = await this.getAllRides();
      return rides.filter(
        ride =>
          (ride.passenger.id === userId || ride.driver.id === userId) &&
          (ride.status === 'completed' || ride.status === 'cancelled')
      );
    } catch (error) {
      console.error('Error getting ride history:', error);
      return [];
    }
  }

  /**
   * Save a ride request
   */
  private static async saveRideRequest(rideRequest: RideRequest): Promise<void> {
    try {
      const requests = await this.getAllRideRequests();
      requests.push(rideRequest);
      await AsyncStorage.setItem(RIDE_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    } catch (error) {
      console.error('Error saving ride request:', error);
      throw error;
    }
  }

  /**
   * Get all ride requests
   */
  private static async getAllRideRequests(): Promise<RideRequest[]> {
    try {
      const data = await AsyncStorage.getItem(RIDE_REQUESTS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting ride requests:', error);
      return [];
    }
  }

  /**
   * Save a ride
   */
  private static async saveRide(ride: Ride): Promise<void> {
    try {
      const rides = await this.getAllRides();
      rides.push(ride);
      await AsyncStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(rides));
    } catch (error) {
      console.error('Error saving ride:', error);
      throw error;
    }
  }

  /**
   * Update a ride
   */
  private static async updateRide(updatedRide: Ride): Promise<void> {
    try {
      const rides = await this.getAllRides();
      const index = rides.findIndex(ride => ride.id === updatedRide.id);

      if (index === -1) {
        throw new Error('Ride not found');
      }

      rides[index] = updatedRide;
      await AsyncStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(rides));

      // Update active ride if it's the current one
      const activeRide = await this.getActiveRide();
      if (activeRide && activeRide.id === updatedRide.id) {
        await AsyncStorage.setItem(ACTIVE_RIDE_KEY, JSON.stringify(updatedRide));
      }
    } catch (error) {
      console.error('Error updating ride:', error);
      throw error;
    }
  }

  /**
   * Clear all rides (for development/testing)
   */
  static async clearAllRides(): Promise<void> {
    try {
      await AsyncStorage.removeItem(RIDES_STORAGE_KEY);
      await AsyncStorage.removeItem(RIDE_REQUESTS_STORAGE_KEY);
      await AsyncStorage.removeItem(ACTIVE_RIDE_KEY);
    } catch (error) {
      console.error('Error clearing rides:', error);
      throw error;
    }
  }
}
