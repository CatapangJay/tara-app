import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MapViewComponent } from '../../components/common/MapView';
import { Driver } from '../../types/driver.types';
import { Coordinates } from '../../types/location.types';

interface DriverFoundScreenProps {
  driver: Driver;
  pickupLocation: Coordinates;
  onStartRide: () => void;
  onCancelRide: () => void;
}

export function DriverFoundScreen({
  driver,
  pickupLocation,
  onStartRide,
  onCancelRide,
}: DriverFoundScreenProps) {
  const [estimatedArrival, setEstimatedArrival] = useState(5);

  useEffect(() => {
    // Countdown timer for ETA
    const interval = setInterval(() => {
      setEstimatedArrival((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto-start ride when driver arrives
          setTimeout(() => onStartRide(), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 6000); // Decrease every 6 seconds for demo

    return () => clearInterval(interval);
  }, [onStartRide]);

  const handleContactDriver = () => {
    Alert.alert(
      'Contact Driver',
      `Call ${driver.name}?\n${driver.phone}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Calling...', 'This is a demo feature') },
      ]
    );
  };

  const handleCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: onCancelRide },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Map with driver location */}
      <MapViewComponent
        center={driver.currentLocation || pickupLocation}
        markers={[
          {
            id: 'driver',
            coordinate: driver.currentLocation || pickupLocation,
            title: `${driver.name} - ${driver.vehicle.type}`,
            description: `${driver.vehicle.color} ${driver.vehicle.make} ${driver.vehicle.model}`,
          },
          {
            id: 'pickup',
            coordinate: pickupLocation,
            title: 'Your location',
          },
        ]}
        showUserLocation
      />

      {/* Driver Info Card */}
      <View style={styles.driverCard}>
        {/* ETA Banner */}
        <View style={styles.etaBanner}>
          <Ionicons name="time-outline" size={20} color="#fff" />
          <Text style={styles.etaText}>
            {estimatedArrival > 0
              ? `Driver is ${estimatedArrival} min away`
              : 'Driver has arrived!'}
          </Text>
        </View>

        {/* Driver Details */}
        <View style={styles.driverDetails}>
          <Image
            source={{ uri: driver.profilePhoto }}
            style={styles.driverPhoto}
          />

          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driver.name}</Text>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{driver.rating.toFixed(1)}</Text>
              <Text style={styles.trips}>• {driver.totalTrips} trips</Text>
            </View>

            <View style={styles.vehicleInfo}>
              <Ionicons name="car" size={16} color="#666" />
              <Text style={styles.vehicleText}>
                {driver.vehicle.color} {driver.vehicle.make} {driver.vehicle.model}
              </Text>
            </View>

            <View style={styles.plateContainer}>
              <View style={styles.plateNumber}>
                <Text style={styles.plateText}>{driver.vehicle.plateNumber}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactDriver}
          >
            <Ionicons name="call" size={20} color="#007AFF" />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelRide}
          >
            <Ionicons name="close-circle" size={20} color="#F44336" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Vehicle Type Badge */}
        <View style={styles.vehicleTypeBadge}>
          <Ionicons
            name={
              driver.vehicle.type === 'sedan' ? 'car-sport' :
              driver.vehicle.type === 'suv' ? 'car' :
              driver.vehicle.type === 'motorcycle' ? 'bicycle-sharp' :
              'bicycle'
            }
            size={16}
            color="#007AFF"
          />
          <Text style={styles.vehicleTypeText}>
            {driver.vehicle.type.charAt(0).toUpperCase() + driver.vehicle.type.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  driverCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  etaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 8,
  },
  etaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  driverDetails: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  driverPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e0e0e0',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  trips: {
    fontSize: 14,
    color: '#666',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  vehicleText: {
    fontSize: 14,
    color: '#666',
  },
  plateContainer: {
    flexDirection: 'row',
  },
  plateNumber: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#333',
  },
  plateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  vehicleTypeBadge: {
    position: 'absolute',
    top: 60,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  vehicleTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
});
