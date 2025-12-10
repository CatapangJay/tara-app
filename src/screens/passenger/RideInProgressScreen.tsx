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
import { formatFare } from '../../utils/fareCalculator';

interface RideInProgressScreenProps {
  ride: Ride;
  onRideComplete: () => void;
}

export function RideInProgressScreen({
  ride,
  onRideComplete,
}: RideInProgressScreenProps) {
  const [driverLocation, setDriverLocation] = useState<Coordinates>(ride.route.origin.coordinates);
  const [estimatedTime, setEstimatedTime] = useState(ride.route.duration);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate driver movement from origin to destination
    const totalSteps = 30; // 30 steps for smooth animation
    const stepDuration = (ride.route.duration * 60 * 1000) / totalSteps; // Convert minutes to ms

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / totalSteps);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          // Complete ride when destination reached
          setTimeout(() => onRideComplete(), 1000);
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
        setEstimatedTime(Math.ceil(ride.route.duration * (1 - ratio)));

        return newProgress;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [ride, onRideComplete]);

  const handleSOS = () => {
    Alert.alert(
      'Emergency SOS',
      'This will notify emergency contacts and authorities.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send SOS',
          style: 'destructive',
          onPress: () => Alert.alert('SOS Sent', 'Emergency services have been notified'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Map with route and driver */}
      <MapViewComponent
        center={driverLocation}
        markers={[
          {
            id: 'driver',
            coordinate: driverLocation,
            title: `${ride.driver.name}`,
            description: 'Your driver',
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

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {progress < 100 ? `${Math.round(progress)}% to destination` : 'Arriving...'}
        </Text>
      </View>

      {/* Trip Info Card */}
      <View style={styles.tripCard}>
        {/* ETA Section */}
        <View style={styles.etaSection}>
          <View style={styles.etaMain}>
            <Ionicons name="time" size={24} color="#007AFF" />
            <Text style={styles.etaTime}>
              {estimatedTime > 0 ? `${estimatedTime} min` : 'Arriving'}
            </Text>
          </View>
          <Text style={styles.etaLabel}>Estimated arrival</Text>
        </View>

        {/* Destination */}
        <View style={styles.destinationSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="location" size={20} color="#F44336" />
          </View>
          <View style={styles.destinationInfo}>
            <Text style={styles.destinationLabel}>Destination</Text>
            <Text style={styles.destinationAddress} numberOfLines={1}>
              {ride.route.destination.address}
            </Text>
          </View>
        </View>

        {/* Trip Details */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="navigate" size={16} color="#666" />
            <Text style={styles.detailText}>{ride.route.distance.toFixed(1)} km</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Ionicons name="cash" size={16} color="#666" />
            <Text style={styles.detailText}>{formatFare(ride.fare.total)}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Ionicons name="card" size={16} color="#666" />
            <Text style={styles.detailText}>{ride.payment.method}</Text>
          </View>
        </View>

        {/* Driver Info */}
        <View style={styles.driverSection}>
          <View style={styles.driverInfo}>
            <Ionicons name="person-circle" size={32} color="#007AFF" />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{ride.driver.name}</Text>
              <View style={styles.vehicleRow}>
                <Text style={styles.vehicleText}>
                  {ride.driver.vehicle.color} {ride.driver.vehicle.make}
                </Text>
                <Text style={styles.plateText}>{ride.driver.vehicle.plateNumber}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
          <Ionicons name="alert-circle" size={20} color="#fff" />
          <Text style={styles.sosText}>Emergency SOS</Text>
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
  progressContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
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
  tripCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  etaSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  etaMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  etaTime: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
  },
  etaLabel: {
    fontSize: 14,
    color: '#666',
  },
  destinationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationInfo: {
    flex: 1,
  },
  destinationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  destinationAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
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
  driverSection: {
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vehicleText: {
    fontSize: 14,
    color: '#666',
  },
  plateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  sosText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
