import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const VideoSession = ({ route, navigation }) => {
  const { mentor, sessionDetails } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Session</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Mentor: {mentor.name}</Text>
        <Text style={styles.infoText}>Topic: {sessionDetails.topic}</Text>
        <Text style={styles.infoText}>Date: {sessionDetails.date}</Text>
        <Text style={styles.infoText}>Time: {sessionDetails.time}</Text>
      </View>

      <View style={styles.controlsCard}>
        <Text style={styles.controlsTitle}>Session Controls</Text>
        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlButtonText}>Toggle Microphone</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlButtonText}>Toggle Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => navigation.navigate('MySessions')}
        >
          <Text style={styles.controlButtonText}>End Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#007bff',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  controlsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007bff',
  },
  controlButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VideoSession;