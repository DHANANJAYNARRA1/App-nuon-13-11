import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PaymentSuccessScreen = ({ navigation, route }) => {
  const { message = "You're enrolled in the session" } = route.params || {};
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#7C3AED", "#EC4899"]} style={styles.iconGradient}>
        <Text style={styles.iconText}>🎁</Text>
      </LinearGradient>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.message}>You're enrolled in Mentorship Session with {route?.params?.mentorName || 'the mentor'}</Text>
      <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('MyLearning')}>
        <LinearGradient colors={["#7C3AED", "#EC4899"]} style={styles.primaryGradient}>
          <Text style={styles.primaryText}>Awesome!</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', padding: 24 },
  iconGradient: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 18, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 10 },
  iconText: { fontSize: 36 },
  title: { fontSize: 20, fontWeight: '700', color: '#7C3AED', marginBottom: 8 },
  message: { fontSize: 15, color: '#475569', textAlign: 'center', marginBottom: 20 },
  primary: { width: '70%', borderRadius: 999, overflow: 'hidden' },
  primaryGradient: { paddingVertical: 14, alignItems: 'center', borderRadius: 999 },
  primaryText: { color: '#fff', fontWeight: '800' },
});

export default PaymentSuccessScreen;
