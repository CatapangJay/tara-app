import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLocation } from '../../context/LocationContext';
import { Coordinates } from '../../types/location.types';

interface RideBookingSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectPickup: () => void;
  onSelectDestination: () => void;
  onContinue: () => void;
  pickupLocation?: { location: Coordinates; address: string };
  destinationLocation?: { location: Coordinates; address: string };
}

export function RideBookingSheet({
  visible,
  onClose,
  onSelectPickup,
  onSelectDestination,
  onContinue,
  pickupLocation,
  destinationLocation,
}: RideBookingSheetProps) {
  const { currentAddress } = useLocation();

  const showPickupAddress = pickupLocation?.address || currentAddress || 'Select pickup location';
  const showDestinationAddress = destinationLocation?.address || 'Where to?';

  const canContinue = pickupLocation && destinationLocation;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Book a Ride</Text>
            <View style={styles.closeButton} />
          </View>

          {/* Location Inputs */}
          <View style={styles.content}>
            {/* Pickup Location */}
            <TouchableOpacity
              style={styles.locationInput}
              onPress={onSelectPickup}
            >
              <View style={styles.iconContainer}>
                <View style={styles.pickupDot} />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Pickup</Text>
                <Text
                  style={[
                    styles.inputValue,
                    !pickupLocation && styles.inputPlaceholder,
                  ]}
                  numberOfLines={1}
                >
                  {showPickupAddress}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            {/* Connector Line */}
            <View style={styles.connector} />

            {/* Destination Location */}
            <TouchableOpacity
              style={styles.locationInput}
              onPress={onSelectDestination}
            >
              <View style={styles.iconContainer}>
                <View style={styles.destinationDot} />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Destination</Text>
                <Text
                  style={[
                    styles.inputValue,
                    !destinationLocation && styles.inputPlaceholder,
                  ]}
                  numberOfLines={1}
                >
                  {showDestinationAddress}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
              onPress={canContinue ? onContinue : undefined}
              disabled={!canContinue}
            >
              <Text
                style={[
                  styles.continueButtonText,
                  !canContinue && styles.continueButtonTextDisabled,
                ]}
              >
                Continue
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={canContinue ? '#fff' : '#999'}
              />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F44336',
  },
  connector: {
    width: 2,
    height: 16,
    backgroundColor: '#ddd',
    marginLeft: 31,
    marginBottom: 8,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 16,
    color: '#333',
  },
  inputPlaceholder: {
    color: '#999',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  continueButtonTextDisabled: {
    color: '#999',
  },
});
