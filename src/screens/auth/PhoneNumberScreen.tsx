import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const Colors = {
  primary: '#007AFF',
};

export default function PhoneNumberScreen() {
  const router = useRouter();
  const { signInWithPhone } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Format phone number as user types
  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 10 digits (Philippine mobile numbers)
    const limited = cleaned.slice(0, 10);
    
    // Format as XXX XXX XXXX
    let formatted = '';
    if (limited.length > 0) {
      formatted = limited.slice(0, 3);
      if (limited.length > 3) {
        formatted += ' ' + limited.slice(3, 6);
      }
      if (limited.length > 6) {
        formatted += ' ' + limited.slice(6, 10);
      }
    }
    
    return formatted;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const getFullPhoneNumber = () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return `+63${cleaned}`;
  };

  const isValidPhoneNumber = () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    // Philippine mobile numbers: 9XX XXX XXXX (starts with 9, 10 digits total)
    return cleaned.length === 10 && cleaned.startsWith('9');
  };

  const handleContinue = async () => {
    if (!isValidPhoneNumber()) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid Philippine mobile number starting with 9.'
      );
      return;
    }

    setIsLoading(true);
    const fullPhone = getFullPhoneNumber();

    try {
      const { error } = await signInWithPhone(fullPhone);

      if (error) {
        Alert.alert('Error', error.message || 'Failed to send OTP');
      } else {
        // Navigate to OTP verification screen
        router.push({
          pathname: '/auth/verify-otp' as any,
          params: { phone: fullPhone },
        });
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Enter your phone number</Text>
          <Text style={styles.subtitle}>
            We&apos;ll send you a verification code
          </Text>
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <View style={styles.phoneInputWrapper}>
            <View style={styles.prefixContainer}>
              <Text style={styles.prefixText}>🇵🇭 +63</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="9XX XXX XXXX"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              maxLength={12} // "XXX XXX XXXX" with spaces
              autoFocus
            />
          </View>
          <Text style={styles.hint}>
            Enter your 10-digit mobile number without the +63
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isValidPhoneNumber() && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isValidPhoneNumber() || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        {/* Help Text */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you will receive an SMS verification code.{'\n'}
            Message and data rates may apply.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
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
  inputContainer: {
    marginBottom: 32,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  prefixContainer: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  prefixText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    paddingLeft: 12,
    fontWeight: '500',
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    color: '#999',
    paddingLeft: 4,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
