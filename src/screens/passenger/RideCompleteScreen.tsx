import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ride } from '../../types/ride.types';
import { formatFare } from '../../utils/fareCalculator';

const RIDES_STORAGE_KEY = '@tara_rides';

interface RideCompleteScreenProps {
  ride: Ride;
  onDone: () => void;
}

export function RideCompleteScreen({
  ride,
  onDone,
}: RideCompleteScreenProps) {
  const [rating, setRating] = useState(0);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      // Update ride with rating and tip
      const updatedRide: Ride = {
        ...ride,
        ratings: {
          passengerRating: rating,
        },
        completedAt: new Date().toISOString(),
      };

      // Add tip to fare if selected
      if (selectedTip) {
        updatedRide.fare = {
          ...updatedRide.fare,
          total: updatedRide.fare.total + selectedTip,
        };
      }

      // Save to ride history
      const existingRidesJson = await AsyncStorage.getItem(RIDES_STORAGE_KEY);
      const existingRides: Ride[] = existingRidesJson ? JSON.parse(existingRidesJson) : [];
      
      // Check if ride already exists (update) or add new
      const rideIndex = existingRides.findIndex(r => r.id === updatedRide.id);
      if (rideIndex >= 0) {
        existingRides[rideIndex] = updatedRide;
      } else {
        existingRides.push(updatedRide);
      }

      await AsyncStorage.setItem(RIDES_STORAGE_KEY, JSON.stringify(existingRides));
      
      console.log('Ride saved to history:', updatedRide.id, 'Rating:', rating, 'Tip:', selectedTip);
      
      onDone();
    } catch (error) {
      console.error('Error saving ride to history:', error);
      // Still call onDone even if save fails
      onDone();
    } finally {
      setIsSaving(false);
    }
  };

  const tipOptions = [20, 50, 100];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Header */}
      <View style={styles.header}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        </View>
        <Text style={styles.title}>You&apos;ve arrived!</Text>
        <Text style={styles.subtitle}>
          We hope you had a great ride with {ride.driver.name}. Ingat!
        </Text>
      </View>

      {/* Trip Summary Card */}
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
              <Text style={styles.addressLabel}>From</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {ride.route.origin.address}
              </Text>
            </View>
            <View style={[styles.addressRow, { marginTop: 20 }]}>
              <Text style={styles.addressLabel}>To</Text>
              <Text style={styles.addressText} numberOfLines={1}>
                {ride.route.destination.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Trip Details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailBox}>
            <Ionicons name="navigate" size={24} color="#007AFF" />
            <Text style={styles.detailValue}>{ride.route.distance.toFixed(1)} km</Text>
            <Text style={styles.detailLabel}>Distance</Text>
          </View>
          <View style={styles.detailBox}>
            <Ionicons name="time" size={24} color="#007AFF" />
            <Text style={styles.detailValue}>{ride.route.duration} min</Text>
            <Text style={styles.detailLabel}>Duration</Text>
          </View>
          <View style={styles.detailBox}>
            <Ionicons name="cash" size={24} color="#007AFF" />
            <Text style={styles.detailValue}>{formatFare(ride.fare.total)}</Text>
            <Text style={styles.detailLabel}>Total Fare</Text>
          </View>
        </View>

        {/* Fare Breakdown */}
        <View style={styles.fareBreakdown}>
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

      {/* Rating Section */}
      <View style={styles.ratingCard}>
        <Text style={styles.cardTitle}>Rate Your Driver</Text>
        <Text style={styles.ratingSubtitle}>How was your ride with {ride.driver.name}?</Text>
        
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

      {/* Tip Section */}
      <View style={styles.tipCard}>
        <Text style={styles.cardTitle}>Add a Tip (Optional)</Text>
        <Text style={styles.tipSubtitle}>Show your appreciation</Text>
        
        <View style={styles.tipOptions}>
          {tipOptions.map((amount) => (
            <TouchableOpacity
              key={amount}
              onPress={() => setSelectedTip(selectedTip === amount ? null : amount)}
              style={[
                styles.tipButton,
                selectedTip === amount && styles.tipButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.tipAmount,
                  selectedTip === amount && styles.tipAmountSelected,
                ]}
              >
                {formatFare(amount)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.paymentCard}>
        <View style={styles.paymentRow}>
          <Ionicons name="card" size={24} color="#666" />
          <Text style={styles.paymentText}>Payment Method</Text>
        </View>
        <Text style={styles.paymentMethod}>{ride.payment.method}</Text>
      </View>

      {/* Done Button */}
      <TouchableOpacity
        style={[
          styles.doneButton,
          (rating === 0 || isSaving) && styles.doneButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={rating === 0 || isSaving}
      >
        <Text style={styles.doneButtonText}>
          {isSaving ? 'Saving...' : rating === 0 ? 'Please rate your driver' : 'Done'}
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
    textAlign: 'center',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  routeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  routeLine: {
    width: 30,
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
    marginBottom: 2,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  detailBox: {
    alignItems: 'center',
    flex: 1,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  fareBreakdown: {
    gap: 8,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
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
    marginTop: 8,
    paddingTop: 12,
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
  tipCard: {
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
  tipSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  tipOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  tipButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
    borderColor: '#f8f8f8',
    alignItems: 'center',
  },
  tipButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  tipAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  tipAmountSelected: {
    color: '#007AFF',
  },
  paymentCard: {
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
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 14,
    color: '#666',
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 36,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
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
