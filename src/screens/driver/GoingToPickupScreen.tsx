import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MapViewComponent } from '../../components/common/MapView';
import { Coordinates } from '../../types/location.types';
import { Ride } from '../../types/ride.types';

interface GoingToPickupScreenProps {
  ride: Ride;
  driverLocation: Coordinates;
  onArrived: () => void;
  onCancel: () => void;
}

export function GoingToPickupScreen({
  ride,
  driverLocation: initialDriverLocation,
  onArrived,
  onCancel,
}: GoingToPickupScreenProps) {
  const [driverLocation, setDriverLocation] = useState<Coordinates>(initialDriverLocation);
  const [eta, setEta] = useState(5); // minutes
  const [progress, setProgress] = useState(0);
  const [canArrive, setCanArrive] = useState(false);

  useEffect(() => {
    // Simulate driver movement to pickup
    const totalSteps = 30;
    const stepDuration = 1000; // 1 second per step

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / totalSteps);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setCanArrive(true);
          setEta(0);
          return 100;
        }

        // Interpolate driver position toward pickup
        const ratio = newProgress / 100;
        const newLat = initialDriverLocation.latitude +
          (ride.route.origin.coordinates.latitude - initialDriverLocation.latitude) * ratio;
        const newLng = initialDriverLocation.longitude +
          (ride.route.origin.coordinates.longitude - initialDriverLocation.longitude) * ratio;

        setDriverLocation({ latitude: newLat, longitude: newLng });
        
        // Update ETA
        setEta(Math.ceil(5 * (1 - ratio)));

        return newProgress;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [initialDriverLocation, ride]);

  const handleCancel = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: onCancel,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapViewComponent
        center={driverLocation}
        markers={[
          {
            id: 'driver',
            coordinate: driverLocation,
            title: 'You',
            description: 'Your location',
          },
          {
            id: 'pickup',
            coordinate: ride.route.origin.coordinates,
            title: 'Pickup Point',
            description: ride.passenger.name,
          },
        ]}
        showUserLocation={false}
      />

      {/* ETA Card */}
      <View style={styles.etaCard}>
        <View style={styles.etaContent}>
          <Ionicons name="time" size={32} color="#007AFF" />
          <View style={styles.etaInfo}>
            <Text style={styles.etaTime}>
              {eta > 0 ? `${eta} min` : 'Arrived'}
            </Text>
            <Text style={styles.etaLabel}>to pickup</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Passenger Info Card */}
      <View style={styles.passengerCard}>
        <View style={styles.passengerHeader}>
          <Ionicons name="person-circle" size={50} color="#007AFF" />
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{ride.passenger.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{ride.passenger.rating.toFixed(1)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.pickupLocation}>
          <View style={styles.locationIcon}>
            <Ionicons name="location" size={20} color="#4CAF50" />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Pickup Location</Text>
            <Text style={styles.locationAddress} numberOfLines={2}>
              {ride.route.origin.address}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelText}>Cancel Ride</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.arrivedButton,
              !canArrive && styles.arrivedButtonDisabled,
            ]}
            onPress={onArrived}
            disabled={!canArrive}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.arrivedText}>
              {canArrive ? 'Arrived at Pickup' : 'Driving to pickup...'}
            </Text>
          </TouchableOpacity>
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
  etaCard: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  etaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  etaInfo: {
    flex: 1,
  },
  etaTime: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
  },
  etaLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  passengerCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupLocation: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 12,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F44336',
    backgroundColor: '#fff',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F44336',
  },
  arrivedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    gap: 8,
  },
  arrivedButtonDisabled: {
    backgroundColor: '#ccc',
  },
  arrivedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
