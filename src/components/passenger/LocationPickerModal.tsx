import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLocation } from '../../context/LocationContext';
import { LocationService } from '../../services/location/LocationService';
import { Coordinates, Location } from '../../types/location.types';
import { Button } from '../common/Button';
import { LocationSearchInput } from '../common/LocationSearchInput';
import { MapViewComponent } from '../common/MapView';

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: { location: Coordinates; address: string }) => void;
  title: string;
  type?: 'pickup' | 'destination';
}

export function LocationPickerModal({
  visible,
  onClose,
  onSelect,
  title,
  type = 'pickup',
}: LocationPickerModalProps) {
  const { currentLocation } = useLocation();

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<Coordinates>(
    currentLocation || { latitude: 14.0693, longitude: 121.3265 }
  );

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setSelectedAddress(location.landmark || location.address);
    setMapCenter(location.coordinates);
  };

  const handleMapPress = async (coordinate: Coordinates) => {
    // Get address for the tapped location
    const address = await LocationService.getAddressFromCoordinates(coordinate);
    const location: Location = {
      coordinates: coordinate,
      address: address,
    };
    setSelectedLocation(location);
    setSelectedAddress(address);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelect({
        location: selectedLocation.coordinates,
        address: selectedLocation.landmark || selectedLocation.address,
      });
      onClose();
    }
  };

  const handleUseCurrentLocation = async () => {
    if (currentLocation) {
      const address = await LocationService.getAddressFromCoordinates(currentLocation);
      const location: Location = {
        coordinates: currentLocation,
        address: address,
      };
      setSelectedLocation(location);
      setSelectedAddress(address);
      setMapCenter(currentLocation);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.closeButton} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <LocationSearchInput
            placeholder={`Search for ${type}...`}
            onLocationSelect={handleLocationSelect}
            initialValue={selectedAddress}
          />
          <Button
            title="Use Current Location"
            onPress={handleUseCurrentLocation}
            variant="outline"
            style={styles.currentLocationButton}
          />
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapViewComponent
            center={mapCenter}
            markers={
              selectedLocation
                ? [
                    {
                      id: 'selected',
                      coordinate: selectedLocation.coordinates,
                      title: selectedLocation.landmark,
                      description: selectedLocation.address,
                    },
                  ]
                : []
            }
            onMapPress={handleMapPress}
            showUserLocation={true}
          />
        </View>

        {/* Bottom confirmation */}
        {selectedLocation && (
          <View style={styles.bottomSheet}>
            <View style={styles.locationInfo}>
              <View style={styles.locationDot}>
                <View
                  style={[
                    styles.dot,
                    type === 'pickup' ? styles.pickupDot : styles.destinationDot,
                  ]}
                />
              </View>
              <View style={styles.locationText}>
                <Text style={styles.locationTitle}>
                  {selectedLocation.landmark || 'Selected Location'}
                </Text>
                <Text style={styles.locationAddress} numberOfLines={2}>
                  {selectedLocation.address}
                </Text>
              </View>
            </View>
            <Button
              title="Confirm Location"
              onPress={handleConfirm}
              variant="primary"
              style={styles.confirmButton}
            />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  currentLocationButton: {
    marginTop: 8,
  },
  mapContainer: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locationInfo: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  locationDot: {
    paddingTop: 4,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pickupDot: {
    backgroundColor: '#4CAF50',
  },
  destinationDot: {
    backgroundColor: '#F44336',
  },
  locationText: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
  confirmButton: {
    width: '100%',
  },
});
