import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SessionPreparation = ({ route, navigation }) => {
  const { mentor, sessionDetails } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Preparation</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Mentor: {mentor.name}</Text>
        <Text style={styles.infoText}>Topic: {sessionDetails.topic}</Text>
        <Text style={styles.infoText}>Date: {sessionDetails.date}</Text>
        <Text style={styles.infoText}>Time: {sessionDetails.time}</Text>
      </View>

      <View style={styles.checksCard}>
        <Text style={styles.checkTitle}>System Checks</Text>
        <Text style={styles.checkText}>✅ Microphone: Working</Text>
        <Text style={styles.checkText}>✅ Camera: Working</Text>
        <Text style={styles.checkText}>✅ Internet: Connected</Text>
      </View>

      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => navigation.navigate('Video Session', { mentor, sessionDetails })}
      >
        <Text style={styles.joinButtonText}>Join Session Now</Text>
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
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  checksCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  checkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkText: {
    fontSize: 14,
    marginBottom: 5,
  },
  joinButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SessionPreparation;