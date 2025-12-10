import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';
import { MapViewComponent } from '../../components/common/MapView';
import { BookingFlowContainer } from '../../components/passenger/BookingFlowContainer';
import { useLocation } from '../../context/LocationContext';

export default function PassengerHomeScreen() {
  const { currentLocation, currentAddress, isLoading } = useLocation();
  
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  if (isLoading) {
    return <LoadingOverlay visible={true} message="Getting your location..." />;
  }

  return (
    <View style={styles.container}>
      <MapViewComponent
        center={currentLocation || undefined}
        showUserLocation={true}
      />
      
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => setShowBookingFlow(true)}
      >
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <Text style={styles.searchButtonText}>Where to?</Text>
      </TouchableOpacity>

      {currentAddress && (
        <View style={styles.addressBadge}>
          <Ionicons name="location" size={16} color="#007AFF" />
          <Text style={styles.addressText} numberOfLines={1}>
            {currentAddress}
          </Text>
        </View>
      )}

      {/* Booking Flow */}
      <BookingFlowContainer
        visible={showBookingFlow}
        onClose={() => setShowBookingFlow(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchButtonText: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '500',
  },
  addressBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#333333',
  },
});
