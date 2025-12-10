import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SAN_PABLO_LANDMARKS } from '../../constants/philippines';
import { Location } from '../../types/location.types';

interface LocationSearchInputProps {
  placeholder?: string;
  onLocationSelect: (location: Location) => void;
  initialValue?: string;
}

export function LocationSearchInput({
  placeholder = 'Search location...',
  onLocationSelect,
  initialValue = '',
}: LocationSearchInputProps) {
  const [searchText, setSearchText] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (searchText.length > 0) {
      const filtered = SAN_PABLO_LANDMARKS.filter(
        (location) =>
          location.landmark?.toLowerCase().includes(searchText.toLowerCase()) ||
          location.address.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredLocations(SAN_PABLO_LANDMARKS);
      setShowSuggestions(false);
    }
  }, [searchText]);

  const handleSelectLocation = (location: Location) => {
    setSearchText(location.landmark || location.address);
    setShowSuggestions(false);
    onLocationSelect(location);
  };

  const handleClear = () => {
    setSearchText('');
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#666666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={searchText}
          onChangeText={setSearchText}
          onFocus={() => setShowSuggestions(true)}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666666" />
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && (
        <Modal
          visible={showSuggestions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuggestions(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowSuggestions(false)}
          >
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={filteredLocations}
                keyExtractor={(item, index) => `${item.landmark}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelectLocation(item)}
                  >
                    <Ionicons name="location" size={20} color="#007AFF" style={styles.locationIcon} />
                    <View style={styles.suggestionText}>
                      {item.landmark && (
                        <Text style={styles.landmarkText}>{item.landmark}</Text>
                      )}
                      <Text style={styles.addressText}>{item.address}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  clearButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    maxHeight: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  locationIcon: {
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
  },
  landmarkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
});
