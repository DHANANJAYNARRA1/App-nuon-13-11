import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { navigation } from 'react-navigation';

const BookingSlots = ({ route }) => {
  const { mentor } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigation = navigation;

  const dates = ['Nov 15', 'Nov 16', 'Nov 17', 'Nov 18', 'Nov 19'];
  const slots = ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '5:00 PM'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Slots for {mentor.name}</Text>

      <Text style={styles.subtitle}>Select a Date</Text>
      <FlatList
        horizontal
        data={dates}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.dateButton, selectedDate === item && styles.selectedButton]}
            onPress={() => setSelectedDate(item)}
          >
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />

      {selectedDate && (
        <>
          <Text style={styles.subtitle}>Select a Time Slot</Text>
          <FlatList
            data={slots}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.slotButton, selectedSlot === item && styles.selectedButton]}
                onPress={() => setSelectedSlot(item)}
              >
                <Text style={styles.buttonText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </>
      )}

      {selectedDate && selectedSlot && (
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      )}
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
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
  },
  dateButton: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  slotButton: {
    backgroundColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#6200ee',
  },
  buttonText: {
    color: '#fff',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BookingSlots;