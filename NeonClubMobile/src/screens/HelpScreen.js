import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HelpScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Help & Support</Text>
      <Text style={styles.text}>• For account or login issues, contact support@neonclub.com</Text>
      <Text style={styles.text}>• For course access problems, check your internet and try again.</Text>
      <Text style={styles.text}>• You can also reach us from the admin website's contact form.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  text: { color: '#374151', marginBottom: 8 },
});

export default HelpScreen;
