import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ride } from '../../types/ride.types';
import { formatFare } from '../../utils/fareCalculator';

const RIDES_STORAGE_KEY = '@tara_rides';

interface RideItemProps {
  ride: Ride;
  onPress: () => void;
}

function RideItem({ ride, onPress }: RideItemProps) {
  const getRideDate = () => {
    const date = new Date(ride.requestedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const getTime = () => {
    const date = new Date(ride.requestedAt);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = () => {
    switch (ride.status) {
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusLabel = () => {
    switch (ride.status) {
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'in_progress':
        return 'In Progress';
      default:
        return ride.status.replace('_', ' ');
    }
  };

  return (
    <TouchableOpacity style={styles.rideItem} onPress={onPress}>
      <View style={styles.rideHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{getRideDate()}</Text>
          <Text style={styles.timeText}>{getTime()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusLabel()}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.routeLine}>
          <View style={styles.originDot} />
          <View style={styles.routeDash} />
          <View style={styles.destinationDot} />
        </View>
        <View style={styles.routeAddresses}>
          <Text style={styles.addressText} numberOfLines={1}>
            {ride.route.origin.address}
          </Text>
          <View style={styles.addressSpacer} />
          <Text style={styles.addressText} numberOfLines={1}>
            {ride.route.destination.address}
          </Text>
        </View>
      </View>

      <View style={styles.rideFooter}>
        <View style={styles.driverInfo}>
          <Ionicons name="person-circle" size={24} color="#666" />
          <Text style={styles.driverName}>{ride.driver.name}</Text>
          {ride.ratings?.passengerRating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{ride.ratings.passengerRating}</Text>
            </View>
          )}
        </View>
        <Text style={styles.fareText}>{formatFare(ride.fare.total)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ActivityScreen({ navigation }: any) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRides = async () => {
    try {
      const ridesJson = await AsyncStorage.getItem(RIDES_STORAGE_KEY);
      if (ridesJson) {
        const allRides: Ride[] = JSON.parse(ridesJson);
        // Filter only completed or cancelled rides
        const pastRides = allRides.filter(
          ride => ride.status === 'completed' || ride.status === 'cancelled'
        );
        // Sort by date (newest first)
        pastRides.sort((a, b) => 
          new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
        );
        setRides(pastRides);
      }
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRides();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadRides();
  };

  const handleRidePress = (ride: Ride) => {
    navigation.navigate('RideDetails', { ride });
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No ride history yet</Text>
      <Text style={styles.emptySubtitle}>
        Your completed rides will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Rides</Text>
      </View>

      <FlatList
        data={rides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RideItem ride={item} onPress={() => handleRidePress(item)} />
        )}
        contentContainerStyle={[
          styles.listContent,
          rides.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={!loading ? renderEmpty : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  listContent: {
    padding: 16,
  },
  listContentEmpty: {
    flex: 1,
  },
  rideItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  routeLine: {
    width: 20,
    alignItems: 'center',
    marginRight: 12,
  },
  originDot: {
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
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  addressSpacer: {
    height: 16,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  driverName: {
    fontSize: 14,
    color: '#666',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  fareText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
