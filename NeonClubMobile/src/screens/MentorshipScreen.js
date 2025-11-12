import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { mentorAPI } from '../services/api';
import { loadMentors as fetchMentors } from '../utils/apiIntegration';


const MentorshipScreen = ({ navigation }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('browse');

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const data = await fetchMentors(forceRefresh);
      setMentors(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load mentors');
      console.error('Mentors error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookMentor = (mentor) => {
    navigation.navigate('MentorAvailability', {
      mentorId: mentor._id,
      mentorName: mentor.name,
    });
  };

  const renderMentorItem = ({ item }) => (
    <View style={styles.mentorCard}>
      <View style={styles.mentorImageContainer}>
        {item.profilePicture ? (
          <Image source={{ uri: item.profilePicture }} style={styles.mentorImage} />
        ) : (
          <View style={styles.mentorImagePlaceholder}>
            <Text style={styles.mentorImageText}>{item.name?.charAt(0)?.toUpperCase() || 'M'}</Text>
          </View>
        )}
      </View>
      <View style={styles.mentorInfoContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.mentorName}>{item.name}</Text>
          <View style={styles.ratingBadge}><Text style={styles.ratingText}>{item.rating ? item.rating.toFixed(1) : '4.9'}</Text></View>
        </View>
        <Text style={styles.mentorSpecialty}>{item.specialty || 'Specialty'}</Text>
        <View style={{ flexDirection: 'row', marginVertical: 4 }}>
          <Text style={styles.mentorMeta}>{item.experience || '10+'} years</Text>
          <Text style={styles.mentorMeta}> • </Text>
          <Text style={styles.mentorMeta}>{item.sessions || '340'} sessions</Text>
        </View>
        <View style={styles.mentorActionsRow}>
          <TouchableOpacity style={styles.viewProfileBtn} onPress={() => navigation.navigate('MentorProfile', { mentor: item })}>
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
          {item.available !== false ? (
            <TouchableOpacity style={styles.bookSessionBtn} onPress={() => handleBookMentor(item)}>
              <Text style={styles.bookSessionText}>Book Session</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.unavailableBtn}>
              <Text style={styles.unavailableText}>Unavailable</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading mentors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Mentorship</Text>
      </View>

      {/* Search and Tabs */}
      <View style={styles.searchTabsContainer}>
        <View style={styles.searchBarRow}>
          <View style={styles.searchBarBox}>
            <Text style={{ marginRight: 6 }}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search mentors..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Text>⚙️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'browse' && styles.tabBtnActive]}
            onPress={() => setTab('browse')}
          >
            <Text style={[styles.tabText, tab === 'browse' && styles.tabTextActive]}>Browse Mentors</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'sessions' && styles.tabBtnActive]}
            onPress={() => setTab('sessions')}
          >
            <Text style={[styles.tabText, tab === 'sessions' && styles.tabTextActive]}>My Sessions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mentor List or Sessions */}
      {tab === 'browse' ? (
        <FlatList
          data={mentors.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))}
          renderItem={renderMentorItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => loadMentors(true)}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No mentors available at the moment</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={() => loadMentors(true)}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No sessions found</Text>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Text>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Activities')}>
          <Text>📅</Text>
          <Text style={styles.navText}>Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Text>👥</Text>
          <Text style={[styles.navText, styles.navTextActive]}>Mentors</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Text>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#64748b' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', paddingTop: 18, paddingBottom: 10, paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F1F1',
  },
  backBtn: { padding: 4, marginRight: 8 },
  topBarTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  searchTabsContainer: { backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 0 },
  searchBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  searchBarBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, fontSize: 16, color: '#222' },
  filterBtn: { marginLeft: 10, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 10 },
  tabsRow: { flexDirection: 'row', marginBottom: 8, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  tabBtnActive: { backgroundColor: '#fff', elevation: 2 },
  tabText: { fontSize: 15, color: '#7C3AED', fontWeight: '600' },
  tabTextActive: { color: '#fff', backgroundColor: '#7C3AED', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  listContainer: { padding: 12, paddingBottom: 80 },
  mentorCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  mentorImageContainer: { marginRight: 14, justifyContent: 'center', alignItems: 'center' },
  mentorImage: { width: 60, height: 60, borderRadius: 12, resizeMode: 'cover' },
  mentorImagePlaceholder: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  mentorImageText: { fontSize: 22, fontWeight: 'bold', color: '#6B7280' },
  mentorInfoContainer: { flex: 1, justifyContent: 'center' },
  mentorName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  mentorSpecialty: { fontSize: 13, color: '#7C3AED', fontWeight: '600', marginTop: 2 },
  mentorMeta: { fontSize: 12, color: '#6B7280' },
  mentorActionsRow: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },
  viewProfileBtn: { flex: 1, borderWidth: 1, borderColor: '#7C3AED', borderRadius: 20, paddingVertical: 7, alignItems: 'center', marginRight: 8 },
  viewProfileText: { color: '#7C3AED', fontWeight: 'bold', fontSize: 13 },
  bookSessionBtn: { flex: 1, backgroundColor: 'linear-gradient(90deg, #7C3AED 0%, #EC4899 100%)', borderRadius: 20, paddingVertical: 7, alignItems: 'center', marginLeft: 8, backgroundColor: '#7C3AED' },
  bookSessionText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  unavailableBtn: { flex: 1, backgroundColor: '#E5E7EB', borderRadius: 20, paddingVertical: 7, alignItems: 'center', marginLeft: 8 },
  unavailableText: { color: '#A1A1AA', fontWeight: 'bold', fontSize: 13 },
  ratingBadge: { backgroundColor: '#F59E0B', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  ratingText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#64748b', marginBottom: 16 },
  refreshButton: { backgroundColor: '#7C3AED', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  refreshButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F1F1', paddingVertical: 6, paddingHorizontal: 16, position: 'absolute', left: 0, right: 0, bottom: 0, height: 60 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navItemActive: {},
  navText: { fontSize: 12, color: '#A1A1AA', marginTop: 2 },
  navTextActive: { color: '#7C3AED', fontWeight: 'bold' },
});

export default MentorshipScreen;