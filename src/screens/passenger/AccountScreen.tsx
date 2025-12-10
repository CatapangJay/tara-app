import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function PassengerAccountScreen() {
  const { setUserRole, currentUser } = useApp();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            setUserRole(null); // Clear user role to go back to role selection
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser?.name.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>{currentUser?.name || 'User'}</Text>
          <Text style={styles.email}>{currentUser?.email || ''}</Text>
          <Text style={styles.phone}>{currentUser?.phone || ''}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{currentUser?.rating.toFixed(1) || '5.0'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{currentUser?.totalTrips || 0}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Switch to Driver"
            onPress={() => setUserRole('driver')}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Change Role"
            onPress={() => setUserRole(null)}
            variant="outline"
            style={styles.button}
          />
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="danger"
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Tara v1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: '#666666',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  actions: {
    gap: 12,
    marginBottom: 32,
  },
  button: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  version: {
    fontSize: 14,
    color: '#999999',
  },
});
