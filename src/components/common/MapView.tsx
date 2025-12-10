import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SAN_PABLO_CENTER } from '../../constants/philippines';
import { Coordinates } from '../../types/location.types';
import { PulseMarker } from './PulseMarker';

// Dynamically import react-native-maps to avoid errors in Expo Go
let MapView: any;
let Marker: any;
let Polyline: any;
let PROVIDER_GOOGLE: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  Polyline = maps.Polyline;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
  // Maps not available in Expo Go
  console.log('react-native-maps not available - using fallback view');
}

interface MapMarker {
  id: string;
  coordinate: Coordinates;
  title?: string;
  description?: string;
}

interface MapViewComponentProps {
  center?: Coordinates;
  markers?: MapMarker[];
  showUserLocation?: boolean;
  onMapPress?: (coordinate: Coordinates) => void;
  onRegionChange?: (region: any) => void;
  polyline?: {
    coordinates: Coordinates[];
    strokeColor?: string;
    strokeWidth?: number;
  };
  style?: any;
}

export function MapViewComponent({
  center = SAN_PABLO_CENTER,
  markers = [],
  showUserLocation = true,
  onMapPress,
  onRegionChange,
  polyline,
  style,
}: MapViewComponentProps) {
  const [region, setRegion] = useState<any>({
    latitude: center.latitude,
    longitude: center.longitude,
    latitudeDelta: 0.05, // Zoom level (~5km view)
    longitudeDelta: 0.05,
  });

  const handleRegionChangeComplete = (newRegion: any) => {
    setRegion(newRegion);
    onRegionChange?.(newRegion);
  };

  const handleMapPress = (event: any) => {
    if (onMapPress) {
      const coordinate = event.nativeEvent.coordinate;
      onMapPress({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    }
  };

  // If MapView is not available (Expo Go), show fallback
  if (!MapView) {
    return (
      <View style={[styles.map, style, styles.fallbackContainer]}>
        <Ionicons name="map-outline" size={80} color="#ccc" />
        <Text style={styles.fallbackTitle}>Map Preview</Text>
        <Text style={styles.fallbackText}>
          Maps require a development build{'\n'}
          (not available in Expo Go)
        </Text>
        <Text style={styles.fallbackSubtext}>
          San Pablo City, Laguna{'\n'}
          {center.latitude.toFixed(4)}, {center.longitude.toFixed(4)}
        </Text>
        {showUserLocation && (
          <View style={styles.locationBadge}>
            <PulseMarker size={12} color="#007AFF" />
            <Text style={styles.locationBadgeText}>Your Location</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={[styles.map, style]}
      initialRegion={region}
      onRegionChangeComplete={handleRegionChangeComplete}
      onPress={handleMapPress}
      showsUserLocation={showUserLocation}
      showsMyLocationButton={true}
      showsCompass={true}
      showsScale={true}
      toolbarEnabled={true}
    >
      {polyline && Polyline && (
        <Polyline
          coordinates={polyline.coordinates}
          strokeColor={polyline.strokeColor || '#007AFF'}
          strokeWidth={polyline.strokeWidth || 3}
        />
      )}
      
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          title={marker.title}
          description={marker.description}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    backgroundColor: '#e8f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  fallbackSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  locationBadgeText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
});
