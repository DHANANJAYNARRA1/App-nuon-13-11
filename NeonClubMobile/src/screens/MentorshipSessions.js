import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const mentors = [
  {
    id: '1',
    name: 'Dr. Sunita Verma',
    specialization: 'Critical Care',
    experience: '15+ years',
    rating: 4.9,
    sessionsCompleted: 340,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Emergency Medicine',
    experience: '12+ years',
    rating: 4.8,
    sessionsCompleted: 280,
    image: 'https://via.placeholder.com/150',
  },
];

const MentorshipSessions = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {mentors.map((mentor) => (
        <View key={mentor.id} style={styles.card}>
          <Image source={{ uri: mentor.image }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{mentor.name}</Text>
            <Text style={styles.specialization}>{mentor.specialization}</Text>
            <Text style={styles.details}>{mentor.experience}</Text>
            <Text style={styles.details}>⭐ {mentor.rating} | {mentor.sessionsCompleted} sessions</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('BookingScreen', { mentorId: mentor.id })}
          >
            <Text style={styles.buttonText}>Book Session</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 5,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 10,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4C1D95',
  },
  specialization: {
    fontSize: 16,
    color: '#64748B',
    marginVertical: 5,
  },
  details: {
    fontSize: 14,
    color: '#64748B',
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MentorshipSessions;