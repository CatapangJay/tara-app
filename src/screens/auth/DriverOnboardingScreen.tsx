import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const Colors = {
  primary: '#007AFF',
};

type VehicleType = 'tricycle' | 'motorcycle' | 'sedan' | 'suv';

export default function DriverOnboardingScreen() {
  const router = useRouter();

  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('tricycle');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const vehicleTypes: { type: VehicleType; label: string; icon: string; capacity: number }[] = [
    { type: 'tricycle', label: 'Tricycle', icon: '🛺', capacity: 3 },
    { type: 'motorcycle', label: 'Motorcycle', icon: '🏍️', capacity: 1 },
    { type: 'sedan', label: 'Sedan', icon: '🚗', capacity: 4 },
    { type: 'suv', label: 'SUV', icon: '🚙', capacity: 6 },
  ];

  const isFormValid = () => {
    return (
      licenseNumber.trim() !== '' &&
      vehicleMake.trim() !== '' &&
      vehicleModel.trim() !== '' &&
      vehicleYear.trim() !== '' &&
      plateNumber.trim() !== ''
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you would:
      // 1. Upload license photo to Supabase storage
      // 2. Upload vehicle registration to storage
      // 3. Create driver record in database
      // 4. Create vehicle record in database
      
      // For now, save to AsyncStorage
      await AsyncStorage.setItem('@tara:driverInfo', JSON.stringify({
        licenseNumber,
        vehicleType,
        vehicleMake,
        vehicleModel,
        vehicleYear: parseInt(vehicleYear),
        vehicleColor,
        plateNumber,
        verificationStatus: 'pending',
      }));

      Alert.alert(
        'Application Submitted!',
        'Your driver application has been submitted for verification. You can start using the app while we review your documents.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Driver Registration</Text>
          <Text style={styles.subtitle}>
            Complete the following to start driving
          </Text>
        </View>

        {/* License Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>License Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Driver&apos;s License Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="N01-12-345678"
              placeholderTextColor="#999"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity style={styles.uploadDocButton}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadDocText}>Upload License Photo</Text>
            <Text style={styles.uploadDocSubtext}>Front and back</Text>
          </TouchableOpacity>
        </View>

        {/* Vehicle Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Type *</Text>
            <View style={styles.vehicleTypeGrid}>
              {vehicleTypes.map((vType) => (
                <TouchableOpacity
                  key={vType.type}
                  style={[
                    styles.vehicleTypeButton,
                    vehicleType === vType.type && styles.vehicleTypeButtonActive,
                  ]}
                  onPress={() => setVehicleType(vType.type)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.vehicleTypeIcon}>{vType.icon}</Text>
                  <Text
                    style={[
                      styles.vehicleTypeText,
                      vehicleType === vType.type && styles.vehicleTypeTextActive,
                    ]}
                  >
                    {vType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>Make *</Text>
              <TextInput
                style={styles.input}
                placeholder="Honda"
                placeholderTextColor="#999"
                value={vehicleMake}
                onChangeText={setVehicleMake}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Model *</Text>
              <TextInput
                style={styles.input}
                placeholder="TMX 155"
                placeholderTextColor="#999"
                value={vehicleModel}
                onChangeText={setVehicleModel}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>Year *</Text>
              <TextInput
                style={styles.input}
                placeholder="2023"
                placeholderTextColor="#999"
                value={vehicleYear}
                onChangeText={setVehicleYear}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={styles.input}
                placeholder="Red"
                placeholderTextColor="#999"
                value={vehicleColor}
                onChangeText={setVehicleColor}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plate Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="ABC 1234"
              placeholderTextColor="#999"
              value={plateNumber}
              onChangeText={setPlateNumber}
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity style={styles.uploadDocButton}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadDocText}>Upload Registration (OR/CR)</Text>
            <Text style={styles.uploadDocSubtext}>Clear photo required</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid() && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid() || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Application</Text>
          )}
        </TouchableOpacity>

        {/* Info Note */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Your application will be reviewed within 24-48 hours. You&apos;ll receive
            a notification once verified.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  vehicleTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehicleTypeButton: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  vehicleTypeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: '#f8f9ff',
  },
  vehicleTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  vehicleTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  vehicleTypeTextActive: {
    color: Colors.primary,
  },
  uploadDocButton: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadDocText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  uploadDocSubtext: {
    fontSize: 12,
    color: '#999',
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});
