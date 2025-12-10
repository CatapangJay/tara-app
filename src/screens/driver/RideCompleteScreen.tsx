import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ride } from '../../types/ride.types';
import { saveDriverRide } from '../../utils/driverEarnings';
import { formatFare } from '../../utils/fareCalculator';

interface DriverRideCompleteScreenProps {
  ride: Ride;
  onDone: () => void;
}

export function DriverRideCompleteScreen({
  ride,
  onDone,
}: DriverRideCompleteScreenProps) {
  const [rating, setRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      return; // Require rating before proceeding
    }

    setIsSaving(true);
    
    try {
      // Save ride with passenger rating
      const completedRide: Ride = {
        ...ride,
        ratings: {
          ...ride.ratings,
          driverRating: rating,
        },
      };

      // Save to driver's history and update earnings
      await saveDriverRide(completedRide);
      
      console.log('Passenger rating:', rating);
      onDone();
    } catch (error) {
      console.error('Error saving driver ride:', error);
      // Still proceed even if save fails
      onDone();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Header */}
      <View style={styles.header}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        <Text style={styles.title}>Trip Complete!</Text>
        <Text style={styles.subtitle}>Great job! Payment received</Text>
      </View>

      {/* Earnings Card */}
      <View style={styles.earningsCard}>
        <Text style={styles.earningsLabel}>You Earned</Text>
        <Text style={styles.earningsAmount}>{formatFare(ride.fare.total)}</Text>
        
        <View style={styles.commissionBanner}>
          <Ionicons name="heart" size={20} color="#4CAF50" />
          <Text style={styles.commissionText}>
            100% napupunta sa&apos;yo - Walang komisyon!
          </Text>
        </View>

        {/* Today's Total */}
        <View style={styles.todayTotal}>
          <Text style={styles.todayLabel}>Today&apos;s Total</Text>
          <Text style={styles.todayAmount}>{formatFare(ride.fare.total)}</Text>
        </View>
      </View>

      {/* Trip Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Trip Summary</Text>

        {/* Route */}
        <View style={styles.routeContainer}>
          <View style={styles.routeLine}>
            <View style={styles.originDot} />
            <View style={styles.routeDash} />
            <View style={styles.destinationDot} />
          </View>
          <View style={styles.routeAddresses}>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>Pickup</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {ride.route.origin.address}
              </Text>
            </View>
            <View style={[styles.addressRow, { marginTop: 16 }]}>
              <Text style={styles.addressLabel}>Drop-off</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {ride.route.destination.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Trip Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="navigate" size={20} color="#666" />
            <Text style={styles.statValue}>{ride.route.distance.toFixed(1)} km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Ionicons name="time" size={20} color="#666" />
            <Text style={styles.statValue}>{ride.route.duration} min</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>
      </View>

      {/* Passenger Info */}
      <View style={styles.passengerCard}>
        <Text style={styles.cardTitle}>Passenger</Text>
        <View style={styles.passengerRow}>
          <Ionicons name="person-circle" size={50} color="#007AFF" />
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{ride.passenger.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingValue}>{ride.passenger.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Rate Passenger */}
      <View style={styles.ratingCard}>
        <Text style={styles.cardTitle}>Rate Your Passenger</Text>
        <Text style={styles.ratingSubtitle}>How was {ride.passenger.name}?</Text>
        
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={40}
                color={star <= rating ? '#FFD700' : '#ccc'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Back Online Button */}
      <TouchableOpacity
        style={[
          styles.doneButton,
          rating === 0 && styles.doneButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={rating === 0 || isSaving}
      >
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
        <Text style={styles.doneButtonText}>
          {isSaving ? 'Saving...' : (rating === 0 ? 'Please rate passenger' : 'Back Online')}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  earningsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  earningsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 16,
  },
  commissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    marginBottom: 16,
  },
  commissionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
  todayTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  todayLabel: {
    fontSize: 14,
    color: '#666',
  },
  todayAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  routeLine: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
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
    marginVertical: 4,
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
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  passengerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  ratingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  starButton: {
    padding: 4,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  doneButtonDisabled: {
    backgroundColor: '#ccc',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacer: {
    height: 20,
  },
});
