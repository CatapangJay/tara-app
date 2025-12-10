import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { MapViewComponent } from '../../components/common/MapView';
import { DriverFlowContainer } from '../../components/driver/DriverFlowContainer';
import { RideRequestCard } from '../../components/driver/RideRequestCard';
import { useApp } from '../../context/AppContext';
import { useLocation } from '../../context/LocationContext';
import { useRide } from '../../context/RideContext';
import { RideRequest } from '../../types/ride.types';
import { DriverEarnings, getDriverEarnings } from '../../utils/driverEarnings';

export default function DriverHomeScreen() {
  const { isOnline, toggleOnline } = useApp();
  const { currentLocation, currentAddress } = useLocation();
  const { pendingRideRequest, setPendingRideRequest } = useRide();
  const [showRideRequest, setShowRideRequest] = useState(false);
  const [activeRideRequest, setActiveRideRequest] = useState<RideRequest | null>(null);
  const [earnings, setEarnings] = useState<DriverEarnings>({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
    lastUpdated: new Date().toISOString(),
  });

  // Load earnings on mount and when ride completes
  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const currentEarnings = await getDriverEarnings();
      setEarnings(currentEarnings);
    } catch (error) {
      console.error('Error loading driver earnings:', error);
    }
  };

  // Listen for pending ride requests from passengers
  useEffect(() => {
    if (pendingRideRequest && isOnline && !activeRideRequest) {
      setShowRideRequest(true);
    }
  }, [pendingRideRequest, isOnline, activeRideRequest]);

  // Mock ride request data for demo
  const mockRideRequest: RideRequest = {
    id: 'demo-request-1',
    passengerId: 'passenger-1',
    pickup: {
      address: 'SM City San Pablo, Maharlika Highway',
      coordinates: {
        latitude: 14.0693,
        longitude: 121.3265,
      },
    },
    destination: {
      address: 'San Pablo City Hall, San Pablo City',
      coordinates: {
        latitude: 14.0685,
        longitude: 121.3255,
      },
    },
    vehicleType: 'sedan',
    estimatedFare: {
      baseFare: 50,
      distanceFare: 15,
      total: 65,
      currency: 'PHP',
    },
    status: 'searching',
    requestedAt: new Date().toISOString(),
  };

  const handleAcceptRide = () => {
    console.log('Driver accepted ride');
    const request = pendingRideRequest || mockRideRequest;
    setShowRideRequest(false);
    setActiveRideRequest(request);
    setPendingRideRequest(null); // Clear the pending request
  };

  const handleDeclineRide = () => {
    console.log('Driver declined ride');
    setShowRideRequest(false);
    setPendingRideRequest(null); // Clear the pending request
  };

  const handleRideComplete = () => {
    console.log('Ride complete, driver back online');
    setActiveRideRequest(null);
    loadEarnings(); // Reload earnings after completing ride
  };

  const handleCancelRide = () => {
    console.log('Ride cancelled');
    setActiveRideRequest(null);
  };

  // If there's an active ride, show the driver flow
  if (activeRideRequest && currentLocation) {
    return (
      <DriverFlowContainer
        rideRequest={activeRideRequest}
        driverLocation={currentLocation}
        onComplete={handleRideComplete}
        onCancel={handleCancelRide}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapViewComponent
        center={currentLocation || undefined}
        markers={currentLocation ? [{
          id: 'driver',
          coordinate: currentLocation,
          title: 'You',
          description: 'Your current location',
        }] : []}
        showUserLocation={true}
      />

      {/* Ride Request Modal */}
      <RideRequestCard
        rideRequest={pendingRideRequest || mockRideRequest}
        visible={showRideRequest}
        onAccept={handleAcceptRide}
        onDecline={handleDeclineRide}
      />

      {/* Online/Offline Toggle */}
      <View style={styles.topBar}>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>
                {isOnline ? 'You\'re Online' : 'You\'re Offline'}
              </Text>
              <Text style={styles.statusSubtext}>
                {isOnline ? 'Waiting for ride requests' : 'Go online to receive rides'}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={toggleOnline}
              trackColor={{ false: '#ccc', true: '#4CAF50' }}
              thumbColor={isOnline ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#ccc"
            />
          </View>
        </View>
      </View>

      {/* Status Message */}
      {!isOnline && (
        <View style={styles.offlineMessage}>
          <Ionicons name="moon" size={40} color="#666" />
          <Text style={styles.offlineTitle}>You&apos;re offline</Text>
          <Text style={styles.offlineSubtitle}>
            Turn on your status to start accepting rides
          </Text>
        </View>
      )}

      {isOnline && (
        <View style={styles.onlineMessage}>
          <View style={styles.pulseContainer}>
            <View style={styles.pulseOuter} />
            <View style={styles.pulseInner} />
            <Ionicons name="car" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.onlineTitle}>Ready to go!</Text>
          <Text style={styles.onlineSubtitle}>
            You&apos;ll be notified when you get a ride request
          </Text>
        </View>
      )}

      {/* Current Location Badge */}
      {currentAddress && (
        <View style={styles.locationBadge}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>
            {currentAddress}
          </Text>
        </View>
      )}

      {/* Earnings Today */}
      <View style={styles.earningsBadge}>
        <View style={styles.earningsRow}>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsValue}>₱{earnings.today.toFixed(0)}</Text>
            <Text style={styles.earningsLabel}>Today</Text>
          </View>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsItem}>
            <Text style={styles.earningsValue}>{Math.floor(earnings.total / (earnings.total > 0 ? (earnings.total / 65) : 1))}</Text>
            <Text style={styles.earningsLabel}>Trips</Text>
          </View>
        </View>
      </View>

      {/* TEMPORARY: Demo Button to Simulate Ride Request */}
      {isOnline && (
        <TouchableOpacity
          style={styles.demoButton}
          onPress={() => setShowRideRequest(true)}
        >
          <Ionicons name="flash" size={20} color="#fff" />
          <Text style={styles.demoButtonText}>Simulate Ride Request (Demo)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusInfo: {
    flex: 1,
    marginRight: 12,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#666',
  },
  offlineMessage: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  offlineTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  offlineSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  onlineMessage: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  pulseContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  pulseOuter: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    opacity: 0.2,
  },
  pulseInner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    opacity: 0.3,
  },
  onlineTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 16,
    marginBottom: 8,
  },
  onlineSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  locationBadge: {
    position: 'absolute',
    bottom: 140,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  earningsBadge: {
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  earningsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: 12,
    color: '#666',
  },
  demoButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
