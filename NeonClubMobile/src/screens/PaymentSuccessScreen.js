import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PaymentSuccessScreen = ({ navigation, route }) => {
  const { message = "Your payment was successful! You're enrolled in the session." } = route.params || {};
  return (
    <View style={styles.container}>
      <View style={styles.glowCircle}>
        <Icon name="checkmark-done" size={56} color="#fff" />
      </View>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('MySessions')}>
        <Text style={styles.primaryText}>Go to My Sessions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', padding: 24 },
  glowCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#7C3AED', marginBottom: 12 },
  message: { fontSize: 16, color: '#475569', textAlign: 'center', marginBottom: 32 },
  primary: { backgroundColor: '#6366F1', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
  primaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default PaymentSuccessScreen;
