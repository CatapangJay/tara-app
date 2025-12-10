import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { RideRequest } from '../../types/ride.types';
import { formatFare } from '../../utils/fareCalculator';
import { MapViewComponent } from '../common/MapView';

const TIMER_SIZE = 60;

interface RideRequestCardProps {
  rideRequest: RideRequest;
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function RideRequestCard({
  rideRequest,
  visible,
  onAccept,
  onDecline,
}: RideRequestCardProps) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [fillPercentage, setFillPercentage] = useState(100);

  useEffect(() => {
    if (!visible) {
      setTimeLeft(15);
      setFillPercentage(100);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onDecline(); // Auto-decline when time runs out
          return 0;
        }
        const newTime = prev - 1;
        setFillPercentage((newTime / 15) * 100);
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [visible, onDecline]);

  const getTimerColor = () => {
    if (timeLeft > 10) return '#4CAF50';
    if (timeLeft > 5) return '#FF9800';
    return '#F44336';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onDecline}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Animated Timer */}
          <View style={styles.timerCircle}>
            <AnimatedCircularProgress
              size={TIMER_SIZE}
              width={5}
              fill={fillPercentage}
              tintColor={getTimerColor()}
              backgroundColor="#e0e0e0"
              rotation={0}
              lineCap="round"
              duration={1000}
            >
              {() => (
                <Text style={[styles.timerText, { color: getTimerColor() }]}>
                  {timeLeft}
                </Text>
              )}
            </AnimatedCircularProgress>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="notifications" size={32} color="#007AFF" />
            <Text style={styles.title}>New Ride Request!</Text>
          </View>

          {/* Map Preview */}
          <View style={styles.mapContainer}>
            <MapViewComponent
              center={rideRequest.pickup.coordinates}
              markers={[
                {
                  id: 'pickup',
                  coordinate: rideRequest.pickup.coordinates,
                  title: 'Pickup',
                  description: rideRequest.pickup.address,
                },
                {
                  id: 'destination',
                  coordinate: rideRequest.destination.coordinates,
                  title: 'Destination',
                  description: rideRequest.destination.address,
                },
              ]}
              showUserLocation={false}
            />
          </View>

          {/* Route Info */}
          <View style={styles.routeContainer}>
            <View style={styles.routeLine}>
              <View style={styles.pickupDot} />
              <View style={styles.routeDash} />
              <View style={styles.destinationDot} />
            </View>
            <View style={styles.routeAddresses}>
              <View style={styles.addressRow}>
                <Text style={styles.addressLabel}>Pickup</Text>
                <Text style={styles.addressText} numberOfLines={1}>
                  {rideRequest.pickup.address}
                </Text>
              </View>
              <View style={styles.addressRow}>
                <Text style={styles.addressLabel}>Destination</Text>
                <Text style={styles.addressText} numberOfLines={1}>
                  {rideRequest.destination.address}
                </Text>
              </View>
            </View>
          </View>

          {/* Ride Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailBox}>
              <Ionicons name="car" size={20} color="#666" />
              <Text style={styles.detailLabel}>Vehicle</Text>
              <Text style={styles.detailValue}>
                {rideRequest.vehicleType.charAt(0).toUpperCase() + 
                 rideRequest.vehicleType.slice(1)}
              </Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailBox}>
              <Ionicons name="cash" size={20} color="#666" />
              <Text style={styles.detailLabel}>Fare</Text>
              <Text style={styles.detailValue}>
                {formatFare(rideRequest.estimatedFare.total)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={onDecline}
            >
              <Ionicons name="close-circle" size={24} color="#F44336" />
              <Text style={styles.declineText}>Tanggihan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.acceptText}>Tanggapin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  timerCircle: {
    position: 'absolute',
    top: 10,
    right: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  mapContainer: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#e0e0e0',
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
  },
  routeLine: {
    width: 20,
    alignItems: 'center',
    marginRight: 12,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  routeDash: {
    flex: 1,
    width: 2,
    backgroundColor: '#ccc',
    marginVertical: 4,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F44336',
  },
  routeAddresses: {
    flex: 1,
    justifyContent: 'space-between',
  },
  addressRow: {
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  detailsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  detailDivider: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  declineButton: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  declineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  acceptText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
