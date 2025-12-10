import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MapViewComponent } from '../../components/common/MapView';
import { Coordinates } from '../../types/location.types';
import { Ride } from '../../types/ride.types';
import { formatFare } from '../../utils/fareCalculator';

interface DriverRideInProgressScreenProps {
  ride: Ride;
  onComplete: () => void;
}

export function DriverRideInProgressScreen({
  ride,
  onComplete,
}: DriverRideInProgressScreenProps) {
  const [driverLocation, setDriverLocation] = useState<Coordinates>(ride.route.origin.coordinates);
  const [eta, setEta] = useState(ride.route.duration);
  const [progress, setProgress] = useState(0);
  const [canComplete, setCanComplete] = useState(false);

  useEffect(() => {
    // Simulate driver movement from pickup to destination
    const totalSteps = 40;
    const stepDuration = (ride.route.duration * 60 * 1000) / totalSteps;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / totalSteps);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setCanComplete(true);
          setEta(0);
          return 100;
        }

        // Interpolate driver position
        const ratio = newProgress / 100;
        const newLat = ride.route.origin.coordinates.latitude +
          (ride.route.destination.coordinates.latitude - ride.route.origin.coordinates.latitude) * ratio;
        const newLng = ride.route.origin.coordinates.longitude +
          (ride.route.destination.coordinates.longitude - ride.route.origin.coordinates.longitude) * ratio;

        setDriverLocation({ latitude: newLat, longitude: newLng });
        
        // Update ETA
        setEta(Math.ceil(ride.route.duration * (1 - ratio)));

        return newProgress;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [ride]);

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
            id: 'destination',
            coordinate: ride.route.destination.coordinates,
            title: 'Destination',
            description: ride.route.destination.address,
          },
        ]}
        showUserLocation={false}
      />

      {/* Trip Progress Card */}
      <View style={styles.tripCard}>
        <View style={styles.etaSection}>
          <Ionicons name="navigate" size={32} color="#4CAF50" />
          <View style={styles.etaInfo}>
            <Text style={styles.etaTime}>
              {eta > 0 ? `${eta} min` : 'Arriving'}
            </Text>
            <Text style={styles.etaLabel}>to destination</Text>
          </View>
          <View style={styles.earningsBox}>
            <Text style={styles.earningsValue}>{formatFare(ride.fare.total)}</Text>
            <Text style={styles.earningsLabel}>Trip Earnings</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress)}% complete
        </Text>
      </View>

      {/* Passenger & Destination Card */}
      <View style={styles.bottomCard}>
        {/* Passenger Info */}
        <View style={styles.passengerSection}>
          <Ionicons name="person-circle" size={40} color="#007AFF" />
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{ride.passenger.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{ride.passenger.rating.toFixed(1)}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Destination */}
        <View style={styles.destinationSection}>
          <View style={styles.destinationIcon}>
            <Ionicons name="location" size={20} color="#F44336" />
          </View>
          <View style={styles.destinationInfo}>
            <Text style={styles.destinationLabel}>Destination</Text>
            <Text style={styles.destinationAddress} numberOfLines={2}>
              {ride.route.destination.address}
            </Text>
          </View>
        </View>

        {/* Trip Details */}
        <View style={styles.tripDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="navigate" size={16} color="#666" />
            <Text style={styles.detailText}>{ride.route.distance.toFixed(1)} km</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Ionicons name="car" size={16} color="#666" />
            <Text style={styles.detailText}>
              {ride.vehicleType.charAt(0).toUpperCase() + ride.vehicleType.slice(1)}
            </Text>
          </View>
        </View>

        {/* Complete Button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            !canComplete && styles.completeButtonDisabled,
          ]}
          onPress={onComplete}
          disabled={!canComplete}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.completeText}>
            {canComplete ? 'Complete Ride' : 'Driving to destination...'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  tripCard: {
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
  etaSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  etaInfo: {
    flex: 1,
  },
  etaTime: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  etaLabel: {
    fontSize: 12,
    color: '#666',
  },
  earningsBox: {
    alignItems: 'flex-end',
  },
  earningsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  earningsLabel: {
    fontSize: 11,
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  bottomCard: {
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
  passengerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationSection: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  destinationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationInfo: {
    flex: 1,
  },
  destinationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  destinationAddress: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#ddd',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  completeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  completeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
