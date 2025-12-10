import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MapViewComponent } from '../../components/common/MapView';
import { Ride } from '../../types/ride.types';
import { formatFare } from '../../utils/fareCalculator';

export default function RideDetailsScreen({ route, navigation }: any) {
  const { ride }: { ride: Ride } = route.params;

  const getDateTime = () => {
    const date = new Date(ride.requestedAt);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const { date, time } = getDateTime();

  const handleRideAgain = () => {
    navigation.navigate('Home', {
      prefillRoute: {
        pickup: ride.route.origin,
        destination: ride.route.destination,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map */}
        <View style={styles.mapContainer}>
          <MapViewComponent
            center={ride.route.origin.coordinates}
            markers={[
              {
                id: 'origin',
                coordinate: ride.route.origin.coordinates,
                title: 'Pickup',
                description: ride.route.origin.address,
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
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <View style={styles.dateTimeRow}>
            <Ionicons name="calendar" size={20} color="#666" />
            <Text style={styles.dateTimeText}>{date}</Text>
          </View>
          <View style={styles.dateTimeRow}>
            <Ionicons name="time" size={20} color="#666" />
            <Text style={styles.dateTimeText}>{time}</Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route</Text>
          <View style={styles.routeContainer}>
            <View style={styles.routeLine}>
              <View style={styles.originDot} />
              <View style={styles.routeDash} />
              <View style={styles.destinationDot} />
            </View>
            <View style={styles.routeAddresses}>
              <View style={styles.addressRow}>
                <Text style={styles.addressLabel}>Pickup</Text>
                <Text style={styles.addressText}>{ride.route.origin.address}</Text>
              </View>
              <View style={[styles.addressRow, { marginTop: 20 }]}>
                <Text style={styles.addressLabel}>Destination</Text>
                <Text style={styles.addressText}>{ride.route.destination.address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trip Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Information</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="navigate" size={24} color="#007AFF" />
              <Text style={styles.statValue}>{ride.route.distance.toFixed(1)} km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="time" size={24} color="#007AFF" />
              <Text style={styles.statValue}>{ride.route.duration} min</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="car" size={24} color="#007AFF" />
              <Text style={styles.statValue}>
                {ride.vehicleType.charAt(0).toUpperCase() + ride.vehicleType.slice(1)}
              </Text>
              <Text style={styles.statLabel}>Vehicle</Text>
            </View>
          </View>
        </View>

        {/* Driver Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver</Text>
          <View style={styles.driverCard}>
            <Ionicons name="person-circle" size={60} color="#007AFF" />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{ride.driver.name}</Text>
              <View style={styles.driverDetails}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{ride.driver.rating.toFixed(1)}</Text>
                  <Text style={styles.tripsText}>
                    ({ride.driver.totalTrips} trips)
                  </Text>
                </View>
              </View>
              <View style={styles.vehicleRow}>
                <Text style={styles.vehicleText}>
                  {ride.driver.vehicle.color} {ride.driver.vehicle.make}
                </Text>
                <Text style={styles.plateText}>{ride.driver.vehicle.plateNumber}</Text>
              </View>
            </View>
          </View>
          
          {ride.ratings?.passengerRating && (
            <View style={styles.yourRating}>
              <Text style={styles.yourRatingLabel}>Your Rating</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= (ride.ratings?.passengerRating || 0) ? 'star' : 'star-outline'}
                    size={24}
                    color="#FFD700"
                  />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Fare Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fare Breakdown</Text>
          <View style={styles.fareCard}>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Base Fare</Text>
              <Text style={styles.fareValue}>{formatFare(ride.fare.baseFare)}</Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Distance Fare</Text>
              <Text style={styles.fareValue}>{formatFare(ride.fare.distanceFare)}</Text>
            </View>
            <View style={[styles.fareRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatFare(ride.fare.total)}</Text>
            </View>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentCard}>
            <Ionicons name="card" size={24} color="#666" />
            <Text style={styles.paymentMethod}>{ride.payment.method}</Text>
          </View>
        </View>

        {/* Ride Again Button */}
        {ride.status === 'completed' && (
          <TouchableOpacity style={styles.rideAgainButton} onPress={handleRideAgain}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.rideAgainText}>Ride Again</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 250,
    backgroundColor: '#e0e0e0',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#666',
  },
  routeContainer: {
    flexDirection: 'row',
  },
  routeLine: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  routeDash: {
    flex: 1,
    width: 2,
    backgroundColor: '#ccc',
    marginVertical: 6,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F44336',
  },
  routeAddresses: {
    flex: 1,
  },
  addressRow: {
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 15,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  driverDetails: {
    marginBottom: 6,
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
  tripsText: {
    fontSize: 13,
    color: '#666',
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
  yourRating: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    alignItems: 'center',
  },
  yourRatingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fareCard: {
    gap: 12,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fareLabel: {
    fontSize: 14,
    color: '#666',
  },
  fareValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  paymentMethod: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  rideAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  rideAgainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacer: {
    height: 40,
  },
});
