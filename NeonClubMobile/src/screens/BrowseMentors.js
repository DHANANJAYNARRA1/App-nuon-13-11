import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import MentorProfile from './MentorProfile';

const mentors = [
  {
    id: '1',
    name: 'Dr. Jane Doe',
    specialization: 'Psychologist',
    experience: '15+ years',
    rating: 4.9,
    sessionsCompleted: 120,
    availability: 'Available',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'John Smith',
    specialization: 'Career Coach',
    experience: '10+ years',
    rating: 4.8,
    sessionsCompleted: 95,
    availability: 'Busy',
    image: 'https://via.placeholder.com/150',
  },
];

const Stack = createStackNavigator();

const MentorList = ({ navigation }) => {
  const renderMentor = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Mentor Profile', { mentor: item })}
    >
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.specialization}>{item.specialization}</Text>
          <Text style={styles.details}>{item.experience}</Text>
          <Text style={styles.details}>⭐ {item.rating} | {item.sessionsCompleted} sessions</Text>
          <Text
            style={[styles.availability, item.availability === 'Available' ? styles.available : styles.busy]}
          >
            {item.availability}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={mentors}
      keyExtractor={(item) => item.id}
      renderItem={renderMentor}
      contentContainerStyle={styles.container}
    />
  );
};

const BrowseMentors = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Mentor List" component={MentorList} />
      <Stack.Screen name="Mentor Profile" component={MentorProfile} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialization: {
    fontSize: 14,
    color: '#666',
  },
  details: {
    fontSize: 12,
    color: '#888',
  },
  availability: {
    fontSize: 12,
    marginTop: 5,
  },
  available: {
    color: 'green',
  },
  busy: {
    color: 'red',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#6200ee',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default BrowseMentors;