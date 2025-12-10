import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { LocationSearchInput } from '../../components/common/LocationSearchInput';
import { MapViewComponent } from '../../components/common/MapView';
import { useLocation } from '../../context/LocationContext';
import { LocationService } from '../../services/location/LocationService';
import { Coordinates, Location } from '../../types/location.types';
import { PassengerStackParamList } from '../../types/navigation.types';

type LocationPickerRouteProp = RouteProp<PassengerStackParamList, 'LocationPicker'>;
type LocationPickerNavigationProp = StackNavigationProp<PassengerStackParamList, 'LocationPicker'>;

export default function LocationPickerScreen() {
  const navigation = useNavigation<LocationPickerNavigationProp>();
  const route = useRoute<LocationPickerRouteProp>();
  const { currentLocation } = useLocation();

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [mapCenter, setMapCenter] = useState<Coordinates>(currentLocation || { latitude: 14.0693, longitude: 121.3265 });

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
    if (selectedLocation && route.params?.onSelect) {
      route.params.onSelect(selectedLocation);
    }
    navigation.goBack();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <LocationSearchInput
          placeholder={`Search for ${route.params?.type || 'location'}...`}
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

      {selectedLocation && (
        <View style={styles.bottomSheet}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>
              {selectedLocation.landmark || 'Selected Location'}
            </Text>
            <Text style={styles.locationAddress}>{selectedLocation.address}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    marginBottom: 16,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666666',
  },
  confirmButton: {
    width: '100%',
  },
});
