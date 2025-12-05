import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';
import { mentorAPI } from '../api/mentorAPI';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const fallbackSessions = [
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

const MySessions = ({ navigation, route }) => {
  const { token } = useContext(AuthContext);
  const [sessions, setSessions] = useState(fallbackSessions);
  const [loading, setLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      // If there's a newly created booking passed from PaymentScreen, prepend it
      const newBooking = route?.params?.newBooking;
      
      // Try to fetch from API with token
      let apiBookings = [];
      if (token) {
        try {
          const data = await mentorAPI.fetchUserBookings(token);
          if (Array.isArray(data) && data.length > 0) {
            apiBookings = data;
          }
        } catch (err) {
          console.warn('Could not fetch from API', err);
        }
      }

      // Combine newly created booking + API bookings + fallback
      let allSessions = [...fallbackSessions];
      if (apiBookings.length > 0) {
        allSessions = apiBookings;
      }
      if (newBooking) {
        allSessions = [newBooking, ...allSessions];
      }
      
      setSessions(allSessions);
    } catch (err) {
      console.warn('Could not load sessions', err);
      setSessions(fallbackSessions);
    }
    setLoading(false);
  }, [token, route?.params?.newBooking]);

  useFocusEffect(
    React.useCallback(() => {
      loadSessions();
    }, [loadSessions])
  );

  const renderSession = ({ item }) => (
    <View style={styles.cardRow}>
      <View style={styles.leftCol}>
        <View style={styles.avatarWrap}>
          {item.avatar || item.image ? (
            <Image source={{ uri: item.avatar || item.image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}><Text style={styles.avatarInitial}>{(item.mentor||'').split(' ').map(n=>n[0]).slice(0,2).join('')}</Text></View>
          )}
        </View>
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.mentor}>{item.mentor}</Text>
        <Text style={styles.topic}>{item.topic || item.subtitle}</Text>

        <View style={styles.rowMeta}>
          <Text style={styles.metaText}>📅 {item.date || ''}</Text>
          <Text style={[styles.metaText, { marginLeft: 12 }]}>⏰ {item.time || ''}</Text>
        </View>

        <View style={styles.tagsRow}>
          <View style={styles.tagPill}><Text style={styles.tagText}>📹 Video Call</Text></View>
          <View style={[styles.tagPill, { marginLeft: 8 }]}><Text style={styles.tagText}>{item.duration || '45 mins'}</Text></View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.rescheduleAction}
            onPress={() => navigation.navigate('RescheduleSession', { session: item })}
          >
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.joinAction}
            onPress={() => navigation.navigate('MentorJoin', { booking: item })}
          >
            <LinearGradient colors={['#10B981', '#059669']} style={styles.joinActionGradient}>
              <Text style={styles.joinButtonText}>Join Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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

      {loading ? (
        <ActivityIndicator size="large" color="#6366F1" style={{ marginTop: 28 }} />
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item) => item._id || item.id || String(item.mentor + item.date + item.time)}
          contentContainerStyle={styles.listContainer}
          nestedScrollEnabled
        />
      )}
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
  // New styles for card layout matching new UI
  cardRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8E5F9',
    alignItems: 'center',
  },
  leftCol: { width: 84, alignItems: 'center', justifyContent: 'center' },
  rightCol: { flex: 1, paddingLeft: 8 },
  avatarWrap: { width: 60, height: 60, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F3F4F6' },
  avatar: { width: '100%', height: '100%', resizeMode: 'cover' },
  avatarPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E6E9F7' },
  avatarInitial: { fontSize: 18, fontWeight: '800', color: '#6366F1' },
  rowMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  metaText: { color: '#6B7280', fontSize: 13 },
  tagsRow: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },
  tagPill: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  tagText: { color: '#6366F1', fontWeight: '600', fontSize: 12 },
  actionsRow: { flexDirection: 'row', marginTop: 12, alignItems: 'center' },
  rescheduleAction: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6E9F7', alignItems: 'center', marginRight: 10 },
  joinAction: { width: 140, borderRadius: 12, overflow: 'hidden' },
  joinActionGradient: { paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
});

export default MySessions;