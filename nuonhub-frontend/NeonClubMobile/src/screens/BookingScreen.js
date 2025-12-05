import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

import { bookingAPI } from '../services/api';

const BookingScreen = ({ route, navigation }) => {
  const { mentorId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book a Session</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Mentor ID:</Text>
        <Text style={styles.value}>{mentorId}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SessionFeedback', { mentorId })}
      >
        <Text style={styles.buttonText}>Proceed to Feedback</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 10,
  },
  header: {
    padding: 20,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4C1D95',
  },
  value: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
