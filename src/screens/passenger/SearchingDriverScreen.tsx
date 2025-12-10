import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RideService } from '../../services/data/RideService';
import { Driver, VehicleType } from '../../types/driver.types';
import { Coordinates } from '../../types/location.types';

interface SearchingDriverScreenProps {
  vehicleType: VehicleType;
  pickupLocation: Coordinates;
  onDriverFound: (driver: Driver) => void;
  onCancel: () => void;
}

export function SearchingDriverScreen({
  vehicleType,
  pickupLocation,
  onDriverFound,
  onCancel,
}: SearchingDriverScreenProps) {
  const [searchStatus, setSearchStatus] = useState<'searching' | 'found' | 'error'>('searching');
  const [pulseAnimation] = useState(new Animated.Value(0));
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    // Search for driver
    const searchDriver = async () => {
      try {
        const driver = await RideService.findNearbyDriver(pickupLocation, vehicleType);
        
        if (driver) {
          setSearchStatus('found');
          setTimeout(() => {
            onDriverFound(driver);
          }, 1000);
        } else {
          setSearchStatus('error');
        }
      } catch (error) {
        console.error('Error searching for driver:', error);
        setSearchStatus('error');
      }
    };

    searchDriver();

    return () => {
      clearInterval(dotsInterval);
    };
  }, [pickupLocation, vehicleType, onDriverFound, pulseAnimation]);

  const scale = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const opacity = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const vehicleNames = {
    tricycle: 'Tricycle',
    motorcycle: 'Motorcycle',
    sedan: 'Sedan',
    suv: 'SUV',
  };

  const vehicleIcons = {
    tricycle: 'bicycle',
    motorcycle: 'bicycle-sharp',
    sedan: 'car-sport',
    suv: 'car',
  };

  if (searchStatus === 'error') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.errorIconContainer}>
            <Ionicons name="alert-circle" size={80} color="#F44336" />
          </View>
          
          <Text style={styles.errorTitle}>No Drivers Available</Text>
          <Text style={styles.errorMessage}>
            Sorry, we couldn&apos;t find any available {vehicleNames[vehicleType].toLowerCase()}s nearby at the moment. Please try again or select a different vehicle type.
          </Text>

          <TouchableOpacity style={styles.retryButton} onPress={onCancel}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (searchStatus === 'found') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          </View>
          
          <Text style={styles.successTitle}>Driver Found!</Text>
          <Text style={styles.successMessage}>
            Connecting you with your driver...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Animated Icon */}
        <View style={styles.iconContainer}>
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale }],
                opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.pulseCircle,
              styles.pulseCircleOuter,
              {
                transform: [{ scale }],
                opacity: opacity.interpolate({
                  inputRange: [0.3, 0.8],
                  outputRange: [0.1, 0.3],
                }),
              },
            ]}
          />
          <View style={styles.vehicleIconContainer}>
            <Ionicons name={vehicleIcons[vehicleType] as any} size={50} color="#007AFF" />
          </View>
        </View>

        {/* Status Text */}
        <Text style={styles.statusTitle}>Finding Your {vehicleNames[vehicleType]}{dots}</Text>
        <Text style={styles.statusMessage}>
          Searching for nearby drivers in your area
        </Text>

        {/* Loading Indicator */}
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      </View>

      {/* Cancel Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  pulseCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
  },
  pulseCircleOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  vehicleIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    minHeight: 32,
  },
  statusMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  loader: {
    marginTop: 16,
  },
  errorIconContainer: {
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#F44336',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
});
