import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Payment = ({ route, navigation }) => {
  const { mentor, selectedDate, selectedSlot } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Mentor: {mentor.name}</Text>
        <Text style={styles.summaryText}>Date: {selectedDate}</Text>
        <Text style={styles.summaryText}>Time: {selectedSlot}</Text>
        <Text style={styles.summaryText}>Fee: $50</Text>
      </View>

      <TouchableOpacity
        style={styles.payButton}
        onPress={() => navigation.navigate('My Sessions')}
      >
        <Text style={styles.payButtonText}>Proceed to Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Payment;