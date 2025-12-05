import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const sessions = [
  {
    id: '1',
    mentor: 'Dr. Sunita Verma',
    topic: 'Advanced Wound Care',
    date: 'Nov 16, 2025',
    time: '2:00 PM - 2:45 PM',
    duration: '45 mins',
  },
  {
    id: '2',
    mentor: 'Dr. Rajesh Kumar',
    topic: 'Career Development Q&A',
    date: 'Nov 17, 2025',
    time: '3:00 PM - 3:45 PM',
    duration: '45 mins',
  },
];

const MySessions = ({ navigation }) => {
  const renderSession = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.mentor}>{item.mentor}</Text>
      <Text style={styles.topic}>{item.topic}</Text>
      <Text style={styles.details}>{item.date} | {item.time}</Text>
      <Text style={styles.details}>{item.duration}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RescheduleSession', { session: item })}
        >
          <Text style={styles.buttonText}>Reschedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.joinButton]}
          onPress={() => navigation.navigate('JoinSession', { session: item })}
        >
          <Text style={styles.buttonText}>Join Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
  },
  mentor: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  topic: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MySessions;