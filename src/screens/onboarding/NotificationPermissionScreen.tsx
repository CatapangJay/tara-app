import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const Colors = {
  primary: '#007AFF',
};

export default function NotificationPermissionScreen() {
  const { completeOnboarding } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableNotifications = async () => {
    setIsLoading(true);

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        // Permission granted, finish onboarding
        await completeOnboarding();
      } else {
        Alert.alert(
          'Notifications Recommended',
          'Enable notifications to receive updates about your rides, driver arrivals, and special offers.',
          [
            { 
              text: 'Skip', 
              style: 'cancel', 
              onPress: async () => {
                await completeOnboarding();
              } 
            },
            { text: 'Try Again', onPress: handleEnableNotifications },
          ]
        );
      }
    } catch {
      Alert.alert('Error', 'Failed to request notification permission');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔔</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Stay Updated</Text>
        <Text style={styles.description}>
          Enable notifications to get important updates:
        </Text>

        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>Driver acceptance & arrival</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>Ride status updates</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>Special promotions & offers</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>Safety alerts</Text>
          </View>
        </View>

        <Text style={styles.privacyNote}>
          You can customize notification preferences anytime in settings.
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.enableButton}
          onPress={handleEnableNotifications}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.enableButtonText}>Enable Notifications</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={isLoading}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 40,
  },
  icon: {
    fontSize: 120,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  benefitsList: {
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  benefitIcon: {
    fontSize: 20,
    color: Colors.primary,
    marginRight: 12,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  privacyNote: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  bottomSection: {
    paddingBottom: 40,
  },
  enableButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  skipButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});
