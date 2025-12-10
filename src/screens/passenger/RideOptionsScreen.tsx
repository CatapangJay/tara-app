import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MapViewComponent } from '../../components/common/MapView';
import { VehicleType } from '../../types/driver.types';
import { Coordinates } from '../../types/location.types';
import { Fare } from '../../types/payment.types';
import { calculateDistance, calculateFare, estimateDuration, formatFare } from '../../utils/fareCalculator';

interface RideOptionsScreenProps {
  pickupLocation: { location: Coordinates; address: string };
  destinationLocation: { location: Coordinates; address: string };
  onSelectVehicle: (vehicleType: VehicleType, fare: Fare) => void;
  onBack: () => void;
}

interface VehicleOption {
  type: VehicleType;
  name: string;
  icon: string;
  capacity: string;
  description: string;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    type: 'tricycle',
    name: 'Tricycle',
    icon: 'bicycle-outline', // Tricycle-like icon
    capacity: '1-3 passengers',
    description: 'Local, affordable option',
  },
  {
    type: 'motorcycle',
    name: 'Motorcycle',
    icon: 'bicycle', // Motorcycle-like icon
    capacity: '1 passenger',
    description: 'Fastest for short trips',
  },
  {
    type: 'sedan',
    name: 'Sedan',
    icon: 'car-sport',
    capacity: '1-4 passengers',
    description: 'Comfortable ride',
  },
  {
    type: 'suv',
    name: 'SUV',
    icon: 'car',
    capacity: '1-6 passengers',
    description: 'Spacious for groups',
  },
];

export function RideOptionsScreen({
  pickupLocation,
  destinationLocation,
  onSelectVehicle,
  onBack,
}: RideOptionsScreenProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fares, setFares] = useState<Record<VehicleType, Fare>>({} as Record<VehicleType, Fare>);

  useEffect(() => {
    const dist = calculateDistance(pickupLocation.location, destinationLocation.location);
    const dur = estimateDuration(dist);
    
    setDistance(dist);
    setDuration(dur);

    // Calculate fares for all vehicle types
    const calculatedFares: Record<VehicleType, Fare> = {
      tricycle: calculateFare(dist, 'tricycle'),
      motorcycle: calculateFare(dist, 'motorcycle'),
      sedan: calculateFare(dist, 'sedan'),
      suv: calculateFare(dist, 'suv'),
    };

    setFares(calculatedFares);
  }, [pickupLocation, destinationLocation]);

  const handleSelectVehicle = () => {
    if (selectedVehicle) {
      onSelectVehicle(selectedVehicle, fares[selectedVehicle]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose a Ride</Text>
        <View style={styles.backButton} />
      </View>

      {/* Map Preview */}
      <View style={styles.mapPreview}>
        <MapViewComponent
          center={{
            latitude: (pickupLocation.location.latitude + destinationLocation.location.latitude) / 2,
            longitude: (pickupLocation.location.longitude + destinationLocation.location.longitude) / 2,
          }}
          markers={[
            {
              id: 'pickup',
              coordinate: pickupLocation.location,
              title: 'Pickup',
              description: pickupLocation.address,
            },
            {
              id: 'destination',
              coordinate: destinationLocation.location,
              title: 'Destination',
              description: destinationLocation.address,
            },
          ]}
          showUserLocation={false}
          polyline={{
            coordinates: [pickupLocation.location, destinationLocation.location],
            strokeColor: '#007AFF',
            strokeWidth: 3,
          }}
        />
      </View>

      {/* Trip Info */}
      <View style={styles.tripInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="navigate" size={16} color="#666" />
          <Text style={styles.infoText}>{distance.toFixed(1)} km</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.infoText}>{duration} min</Text>
        </View>
      </View>

      {/* Route Summary */}
      <View style={styles.routeSummary}>
        <View style={styles.locationRow}>
          <View style={styles.pickupDot} />
          <Text style={styles.locationText} numberOfLines={1}>
            {pickupLocation.address}
          </Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.locationRow}>
          <View style={styles.destinationDot} />
          <Text style={styles.locationText} numberOfLines={1}>
            {destinationLocation.address}
          </Text>
        </View>
      </View>

      {/* Vehicle Options */}
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {Object.keys(fares).length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Calculating fares...</Text>
          </View>
        ) : (
          VEHICLE_OPTIONS.map((option) => {
            const fare = fares[option.type];
            const isSelected = selectedVehicle === option.type;

            return (
              <TouchableOpacity
                key={option.type}
                style={[styles.vehicleOption, isSelected && styles.vehicleOptionSelected]}
                onPress={() => setSelectedVehicle(option.type)}
              >
                <View style={styles.vehicleIconContainer}>
                  <Ionicons
                    name={option.icon as any}
                    size={32}
                    color={isSelected ? '#007AFF' : '#333'}
                  />
                </View>
                
                <View style={styles.vehicleInfo}>
                  <Text style={[styles.vehicleName, isSelected && styles.vehicleNameSelected]}>
                    {option.name}
                  </Text>
                  <Text style={styles.vehicleCapacity}>{option.capacity}</Text>
                  <Text style={styles.vehicleDescription}>{option.description}</Text>
                </View>

                <View style={styles.fareContainer}>
                  <Text style={[styles.fareAmount, isSelected && styles.fareAmountSelected]}>
                    {formatFare(fare.total)}
                  </Text>
                  <Text style={styles.fareLabel}>Estimated</Text>
                </View>

                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, !selectedVehicle && styles.confirmButtonDisabled]}
          onPress={handleSelectVehicle}
          disabled={!selectedVehicle}
        >
          <Text style={[styles.confirmButtonText, !selectedVehicle && styles.confirmButtonTextDisabled]}>
            {selectedVehicle
              ? `Book ${VEHICLE_OPTIONS.find(v => v.type === selectedVehicle)?.name} • ${formatFare(fares[selectedVehicle]?.total || 0)}`
              : 'Select a vehicle'}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mapPreview: {
    height: 200,
    backgroundColor: '#e0e0e0',
  },
  backButton: {
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
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#fff',
    gap: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  routeSummary: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#ddd',
    marginLeft: 5,
    marginVertical: 4,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  optionsContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vehicleOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  vehicleIconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  vehicleNameSelected: {
    color: '#007AFF',
  },
  vehicleCapacity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  vehicleDescription: {
    fontSize: 12,
    color: '#999',
  },
  fareContainer: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  fareAmountSelected: {
    color: '#007AFF',
  },
  fareLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  confirmButtonTextDisabled: {
    color: '#999',
  },
});
