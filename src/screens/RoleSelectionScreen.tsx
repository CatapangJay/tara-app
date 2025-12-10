import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/common/Button';
import { useApp } from '../context/AppContext';

export default function RoleSelectionScreen() {
  const { setUserRole } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>🚗 Tara</Text>
          <Text style={styles.tagline}>Walang komisyon. 100% sa driver.</Text>
          <Text style={styles.subtitle}>Tara na! Let&apos;s go around San Pablo City</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="I'm a Passenger (Pasahero)"
            onPress={() => setUserRole('passenger')}
            variant="primary"
            style={styles.button}
          />
          <Button
            title="I'm a Driver (Driver)"
            onPress={() => setUserRole('driver')}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Pumili ng iyong role para magsimula
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 40,
  },
  button: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
});
