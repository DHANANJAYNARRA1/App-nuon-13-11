import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const SessionFeedback = ({ route, navigation }) => {
  const { mentorId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Feedback</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Mentor ID:</Text>
        <Text style={styles.value}>{mentorId}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Write your feedback here..."
        placeholderTextColor="#9CA3AF"
        multiline
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C1D95',
    marginBottom: 20,
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
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    fontSize: 16,
    color: '#4C1D95',
    textAlignVertical: 'top',
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

export default SessionFeedback;