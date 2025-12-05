import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const MentorProfile = ({ route, navigation }) => {
  const { mentor } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: mentor.image }} style={styles.image} />
      <Text style={styles.name}>{mentor.name}</Text>
      <Text style={styles.specialization}>{mentor.specialization}</Text>
      <Text style={styles.details}>{mentor.experience}</Text>
      <Text style={styles.details}>⭐ {mentor.rating} | {mentor.sessionsCompleted} sessions</Text>
      <Text style={[styles.availability, mentor.availability === 'Available' ? styles.available : styles.busy]}>
        {mentor.availability}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Booking Slots', { mentor })}
      >
        <Text style={styles.buttonText}>Book a Session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  specialization: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  details: {
    fontSize: 14,
    color: '#888',
  },
  availability: {
    fontSize: 14,
    marginTop: 10,
  },
  available: {
    color: 'green',
  },
  busy: {
    color: 'red',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MentorProfile;