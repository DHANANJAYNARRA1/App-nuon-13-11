import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const availableDates = [
  { date: '2025-11-16', day: 'Sun', dateNum: '16', month: 'Nov' },
  { date: '2025-11-17', day: 'Mon', dateNum: '17', month: 'Nov' },
  { date: '2025-11-18', day: 'Tue', dateNum: '18', month: 'Nov' },
];

const timeSlots = {
  '2025-11-16': [
    { time: '2:00 PM - 2:45 PM', available: true },
    { time: '3:00 PM - 3:45 PM', available: false },
    { time: '5:00 PM - 5:45 PM', available: true },
  ],
  '2025-11-17': [
    { time: '10:00 AM - 10:45 AM', available: true },
    { time: '2:00 PM - 2:45 PM', available: true },
    { time: '4:00 PM - 4:45 PM', available: true },
  ],
  '2025-11-18': [
    { time: '11:00 AM - 11:45 AM', available: true },
    { time: '3:00 PM - 3:45 PM', available: true },
    { time: '6:00 PM - 6:45 PM', available: true },
  ],
};

const RescheduleSessionScreen = ({ navigation, route }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const session = route?.params?.session || {
    mentor: 'Dr. Sunita Verma',
    topic: 'Advanced Wound Care',
    currentDate: 'Nov 16, 2025',
    currentTime: '2:00 PM - 2:45 PM',
  };

  const handleReschedule = () => {
    if (selectedDate && selectedSlot) {
      navigation.navigate('MySessions');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reschedule Session</Text>
      <View style={styles.sessionCard}>
        <Text style={styles.mentor}>{session.mentor}</Text>
        <Text style={styles.topic}>{session.topic}</Text>
        <Text style={styles.current}>Current: {session.currentDate}, {session.currentTime}</Text>
      </View>
      <Text style={styles.label}>Select New Date</Text>
      <FlatList
        data={availableDates}
        horizontal
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.dateBtn, selectedDate === item.date && styles.selectedDateBtn]}
            onPress={() => setSelectedDate(item.date)}
          >
            <Text style={styles.dateDay}>{item.day}</Text>
            <Text style={styles.dateNum}>{item.dateNum}</Text>
            <Text style={styles.dateMonth}>{item.month}</Text>
          </TouchableOpacity>
        )}
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.label}>Select Time Slot</Text>
      <FlatList
        data={selectedDate ? timeSlots[selectedDate] : []}
        keyExtractor={(item) => item.time}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.slotBtn, selectedSlot === item.time && styles.selectedSlotBtn, !item.available && styles.disabledSlotBtn]}
            onPress={() => item.available && setSelectedSlot(item.time)}
            disabled={!item.available}
          >
            <Text style={[styles.slotText, !item.available && styles.disabledSlotText]}>{item.time}</Text>
          </TouchableOpacity>
        )}
        style={{ marginBottom: 24 }}
      />
      <TouchableOpacity
        style={[styles.confirmBtn, !(selectedDate && selectedSlot) && { opacity: 0.5 }]}
        onPress={handleReschedule}
        disabled={!(selectedDate && selectedSlot)}
      >
        <Text style={styles.confirmText}>Confirm Reschedule</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#007bff', marginBottom: 16 },
  sessionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  mentor: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  topic: { fontSize: 15, color: '#555', marginBottom: 4 },
  current: { fontSize: 13, color: '#777', marginBottom: 8 },
  label: { fontSize: 15, fontWeight: 'bold', color: '#007bff', marginBottom: 8 },
  dateBtn: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, marginRight: 8, alignItems: 'center' },
  selectedDateBtn: { backgroundColor: '#c7d2fe' },
  dateDay: { fontSize: 13, color: '#555' },
  dateNum: { fontSize: 18, fontWeight: 'bold', color: '#007bff' },
  dateMonth: { fontSize: 13, color: '#555' },
  slotBtn: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, marginBottom: 8 },
  selectedSlotBtn: { backgroundColor: '#a7f3d0' },
  disabledSlotBtn: { backgroundColor: '#e5e7eb' },
  slotText: { fontSize: 15, color: '#333' },
  disabledSlotText: { color: '#9ca3af' },
  confirmBtn: { backgroundColor: '#007bff', borderRadius: 8, padding: 16, alignItems: 'center' },
  confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default RescheduleSessionScreen;
