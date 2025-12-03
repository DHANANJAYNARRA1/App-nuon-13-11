import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

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
          style={[styles.button, styles.rescheduleBtn]}
          onPress={() => navigation.navigate('RescheduleSession', { session: item })}
        >
          <Text style={styles.rescheduleText}>Reschedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.joinBtn}
          onPress={() => navigation.navigate('MentorJoin', { booking: item })}
        >
          <LinearGradient colors={['#9333EA', '#EC4899']} style={styles.joinButtonGradient}>
            <Text style={styles.joinButtonText}>Join Session</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#EC4899', '#F59E0B']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Sessions</Text>
      </LinearGradient>

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
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  // listContainer intentionally has padding above and below to match layout
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8E5F9',
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
    marginTop: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleBtn: {
    backgroundColor: '#F3F4F6',
  },
  joinBtn: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rescheduleText: {
    color: '#1E293B',
    fontWeight: '700',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MySessions;