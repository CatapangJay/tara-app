import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Driver } from '../../types/driver.types';
import { Ride } from '../../types/ride.types';
import { DriverEarnings, getDriverEarnings, getDriverRideHistory } from '../../utils/driverEarnings';
import { formatFare } from '../../utils/fareCalculator';

export default function EarningsScreen() {
  const { currentUser } = useApp();
  const driver = currentUser as Driver;
  const [earnings, setEarnings] = useState<DriverEarnings>({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [totalTrips, setTotalTrips] = useState(0);
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load earnings when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadEarnings();
      loadRideHistory();
    }, [])
  );

  const loadEarnings = async () => {
    try {
      const currentEarnings = await getDriverEarnings();
      setEarnings(currentEarnings);
      // Estimate trips (assuming average fare of ₱65)
      setTotalTrips(Math.floor(currentEarnings.total / 65));
    } catch (error) {
      console.error('Error loading driver earnings:', error);
    }
  };

  const loadRideHistory = async () => {
    try {
      const history = await getDriverRideHistory();
      setRideHistory(history.rides);
      setTotalTrips(history.rides.length);
    } catch (error) {
      console.error('Error loading ride history:', error);
    }
  };

  // Group rides by date
  const groupedRides = rideHistory.reduce((groups, ride) => {
    const date = new Date(ride.completedAt || ride.requestedAt).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(ride);
    return groups;
  }, {} as Record<string, Ride[]>);

  const renderRideItem = (ride: Ride) => (
    <View key={ride.id} style={styles.rideItem}>
      <View style={styles.rideIconContainer}>
        <Ionicons name="car" size={20} color="#007AFF" />
      </View>
      <View style={styles.rideInfo}>
        <Text style={styles.rideRoute} numberOfLines={1}>
          {ride.route.origin.address} → {ride.route.destination.address}
        </Text>
        <Text style={styles.rideTime}>
          {new Date(ride.completedAt || ride.requestedAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
      </View>
      <Text style={styles.rideFare}>{formatFare(ride.fare.total)}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>100% ng bayad - Walang komisyon!</Text>
        </View>

        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Today&apos;s Earnings</Text>
          <Text style={styles.earningsValue}>
            {formatFare(earnings.today)}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>This Week</Text>
            <Text style={styles.cardValue}>{formatFare(earnings.week)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>This Month</Text>
            <Text style={styles.cardValue}>{formatFare(earnings.month)}</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Total Trips</Text>
          <Text style={styles.statsValue}>{totalTrips}</Text>
        </View>

        {/* Earnings History */}
        {rideHistory.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
              <Text style={styles.historySectionTitle}>Earnings History</Text>
              <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
                <Ionicons 
                  name={showHistory ? 'chevron-up' : 'chevron-down'} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {showHistory && (
              <View style={styles.historyList}>
                {Object.entries(groupedRides).map(([date, rides]) => {
                  const dayTotal = rides.reduce((sum, ride) => sum + ride.fare.total, 0);
                  return (
                    <View key={date} style={styles.dayGroup}>
                      <View style={styles.dayHeader}>
                        <Text style={styles.dayDate}>{date}</Text>
                        <Text style={styles.dayTotal}>{formatFare(dayTotal)}</Text>
                      </View>
                      {rides.map(renderRideItem)}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        <View style={styles.subscriptionCard}>
          <Text style={styles.subscriptionLabel}>Your Subscription</Text>
          <Text style={styles.subscriptionPlan}>
            {driver?.subscription?.plan.toUpperCase()} Plan
          </Text>
          <Text style={styles.subscriptionPrice}>
            {formatFare(driver?.subscription?.price || 0)}/month
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 24,
  },
  banner: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  earningsCard: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  earningsLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  earningsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666666',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 14,
    color: '#666666',
  },
  statsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 4,
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  subscriptionLabel: {
    fontSize: 14,
    color: '#666666',
  },
  subscriptionPlan: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 4,
  },
  subscriptionPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 4,
  },
  historySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historySectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  historyList: {
    marginTop: 8,
  },
  dayGroup: {
    marginBottom: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  dayTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  rideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    marginBottom: 8,
  },
  rideIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rideInfo: {
    flex: 1,
  },
  rideRoute: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  rideTime: {
    fontSize: 12,
    color: '#999',
  },
  rideFare: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
});
