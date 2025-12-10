import * as Location from 'expo-location';
import { SAN_PABLO_CENTER } from '../../constants/philippines';
import { Coordinates } from '../../types/location.types';

export class LocationService {
  /**
   * Request location permissions from the user
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Get the current location of the user
   */
  static async getCurrentLocation(): Promise<Coordinates | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Location permission denied, using San Pablo center');
        return SAN_PABLO_CENTER;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      // Fallback to San Pablo City center if location fails
      return SAN_PABLO_CENTER;
    }
  }

  /**
   * Watch the user's location continuously
   */
  static async watchLocation(
    callback: (coordinates: Coordinates) => void
  ): Promise<Location.LocationSubscription | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Location permission denied');
        return null;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );

      return subscription;
    } catch (error) {
      console.error('Error watching location:', error);
      return null;
    }
  }

  /**
   * Format address for Philippine locations
   */
  static async getAddressFromCoordinates(
    coordinates: Coordinates
  ): Promise<string> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return 'San Pablo City, Laguna, Philippines';
      }

      const addresses = await Location.reverseGeocodeAsync({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        const parts = [
          address.street,
          address.city || 'San Pablo City',
          address.region || 'Laguna',
          'Philippines',
        ].filter(Boolean);
        return parts.join(', ');
      }

      return 'San Pablo City, Laguna, Philippines';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'San Pablo City, Laguna, Philippines';
    }
  }

  /**
   * Check if location services are enabled
   */
  static async isLocationEnabled(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }
}
