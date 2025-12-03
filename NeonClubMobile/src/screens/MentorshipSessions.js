import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { mentorAPI } from '../api/mentorAPI';

const { width } = Dimensions.get('window');

const MentorshipSessions = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comprehensive mentor data with complete profiles
  const sampleMentors = [
    {
      _id: '1',
      id: 1,
      name: 'Dr. Sunita Verma',
      specialization: 'Critical Care',
      experience: '15+ years',
      rating: 4.9,
      sessions: 340,
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
      price: 1999,
      responseTime: '2 hours',
      languages: ['English', 'Hindi', 'Marathi'],
      qualifications: [
        'MSc Nursing - Critical Care',
        'BSc Nursing - Delhi University',
        'ICU Certification - AIIMS',
      ],
      expertise: [
        'Critical Care Management',
        'Emergency Response',
        'Ventilator Management',
        'Patient Safety Protocols',
        'Clinical Leadership',
      ],
      bio: 'With over 15 years of experience in critical care nursing, I have worked in top hospitals across India including AIIMS and Apollo. I specialize in helping nurses advance their careers in emergency and critical care settings.',
      reviews: [
        {
          id: 1,
          name: 'Neha Sharma',
          rating: 5,
          date: 'Oct 2024',
          comment: 'Dr. Verma provided excellent guidance on my ICU rotation. Her practical tips helped me gain confidence.',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        },
        {
          id: 2,
          name: 'Amit Patel',
          rating: 5,
          date: 'Sep 2024',
          comment: 'Very knowledgeable and patient. She answered all my questions about critical care protocols thoroughly.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        },
      ],
      achievements: [
        { icon: 'award', label: 'Top Rated Mentor' },
        { icon: 'users', label: '340+ Sessions' },
        { icon: 'star', label: '4.9 Rating' },
        { icon: 'clock', label: 'Quick Response' },
      ],
      availability: [
        'Monday - Friday: 3:00 PM - 8:00 PM',
        'Saturday: 10:00 AM - 6:00 PM',
        'Sunday: By appointment',
      ],
    },
    {
      _id: '2',
      id: 2,
      name: 'Dr. Rajesh Kumar',
      specialization: 'Emergency Medicine',
      experience: '12+ years',
      rating: 4.8,
      sessions: 280,
      image: 'https://images.unsplash.com/photo-1747833305853-d43937d88971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3JzaGlwJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MDM0NTM0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
      price: 1799,
      responseTime: '3 hours',
      languages: ['English', 'Hindi', 'Tamil'],
      qualifications: [
        'MSc Emergency Medicine',
        'Trauma Care Certification',
        'Advanced Cardiac Life Support',
      ],
      expertise: [
        'Emergency Triage',
        'Trauma Management',
        'Critical Decision Making',
        'Disaster Response',
      ],
      bio: 'Emergency medicine specialist with 12+ years of experience in high-pressure healthcare environments. I focus on helping nurses build confidence and expertise in emergency situations.',
      reviews: [
        {
          id: 1,
          name: 'Amit Patel',
          rating: 5,
          date: 'Sep 2024',
          comment: 'Very knowledgeable and patient. Answered all my questions thoroughly.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        },
      ],
      achievements: [
        { icon: 'award', label: 'Expert Mentor' },
        { icon: 'users', label: '280+ Sessions' },
        { icon: 'star', label: '4.8 Rating' },
        { icon: 'clock', label: 'Responsive' },
      ],
      availability: [
        'Tuesday - Saturday: 4:00 PM - 9:00 PM',
        'Sunday: 11:00 AM - 5:00 PM',
      ],
    },
    {
      _id: '3',
      id: 3,
      name: 'Nurse Kavita Sharma',
      specialization: 'Pediatric Care',
      experience: '10+ years',
      rating: 4.9,
      sessions: 420,
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      available: false,
      price: 1899,
      responseTime: '1 hour',
      languages: ['English', 'Hindi', 'Punjabi'],
      qualifications: [
        'MSc Pediatric Nursing',
        'NICU Specialization',
        'Child Psychology Certification',
      ],
      expertise: [
        'Pediatric Assessment',
        'Neonatal Care',
        'Family-Centered Care',
        'Child Development',
      ],
      bio: 'Passionate about pediatric nursing with extensive NICU and pediatric ward experience. I mentor nurses who want to specialize in caring for children and families.',
      reviews: [
        {
          id: 1,
          name: 'Priya Reddy',
          rating: 5,
          date: 'Sep 2024',
          comment: 'Amazing mentor! Her pediatric insights were invaluable.',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        },
      ],
      achievements: [
        { icon: 'award', label: 'Top Mentor' },
        { icon: 'users', label: '420+ Sessions' },
        { icon: 'star', label: '4.9 Rating' },
        { icon: 'clock', label: 'Very Fast' },
      ],
      availability: [
        'Monday - Friday: 2:00 PM - 7:00 PM',
        'Saturday: 9:00 AM - 1:00 PM',
      ],
    },
  ];

  const sampleSessions = [
    {
      id: 1,
      mentor: 'Dr. Anjali Reddy',
      topic: 'Advanced Wound Care',
      date: 'Tomorrow',
      time: '3:00 PM',
      duration: '45 mins',
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'Video Call',
    },
    {
      id: 2,
      mentor: 'Nurse Priya Singh',
      topic: 'Career Development Q&A',
      date: 'Oct 15',
      time: '5:00 PM',
      duration: '30 mins',
      image: 'https://images.unsplash.com/photo-1747833305853-d43937d88971?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50b3JzaGlwJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MDM0NTM0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'Video Call',
    },
  ];

  useEffect(() => {
    loadMentors();
    loadMySessions();
  }, []);

  const loadMentors = async () => {
    try {
      setLoading(true);
      // Try to fetch from API, fallback to sample data
      try {
        const response = await mentorAPI.fetchMentors();
        if (response && response.length > 0) {
          setMentors(response);
        } else {
          setMentors(sampleMentors);
        }
      } catch (apiError) {
        console.log('Using sample mentor data:', apiError.message);
        setMentors(sampleMentors);
      }
    } catch (error) {
      console.error('Error loading mentors:', error);
      setMentors(sampleMentors);
    } finally {
      setLoading(false);
    }
  };

  const loadMySessions = () => {
    // For now, use sample data
    setUpcomingSessions(sampleSessions);
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookSession = (mentor) => {
    if (!mentor.available) {
      Alert.alert('Unavailable', 'This mentor is currently unavailable for booking.');
      return;
    }
    navigation.navigate('MentorAvailability', { mentor });
  };

  const handleViewProfile = (mentor) => {
    navigation.navigate('MentorProfile', { mentor });
  };

  const handleJoinSession = (session) => {
    navigation.navigate('MentorJoinScreen', { session });
  };

  const handleRescheduleSession = (session) => {
    navigation.navigate('MentorAvailabilityScreen', {
      mentor: { name: session.mentor },
      reschedule: true,
      sessionId: session.id
    });
  };

  const renderMentorCard = (mentor) => (
    <View key={mentor._id} style={styles.mentorCard}>
      <View style={styles.mentorInfo}>
        <View style={styles.mentorImageContainer}>
          <Image source={{ uri: mentor.image }} style={styles.mentorImage} />
        </View>
        <View style={styles.mentorDetails}>
          <View style={styles.mentorHeader}>
            <Text style={styles.mentorName}>{mentor.name}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={14} color="#F59E0B" />
              <Text style={styles.rating}>{mentor.rating}</Text>
            </View>
          </View>
          <Text style={styles.specialization}>{mentor.specialization}</Text>
          <View style={styles.mentorStats}>
            <Text style={styles.experience}>{mentor.experience}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.sessions}>{mentor.sessions} sessions</Text>
          </View>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => handleViewProfile(mentor)}
        >
          <Text style={styles.profileButtonText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.bookButton,
            !mentor.available && styles.unavailableButton
          ]}
          onPress={() => handleBookSession(mentor)}
          disabled={!mentor.available}
        >
          <LinearGradient
            colors={mentor.available ? ['#9333EA', '#EC4899'] : ['#9CA3AF', '#9CA3AF']}
            style={styles.bookButtonGradient}
          >
            <Text style={styles.bookButtonText}>
              {mentor.available ? 'Book Session' : 'Unavailable'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSessionCard = (session) => (
    <View key={session.id} style={styles.sessionCard}>
      <View style={styles.sessionInfo}>
        <View style={styles.sessionImageContainer}>
          <Image source={{ uri: session.image }} style={styles.sessionImage} />
        </View>
        <View style={styles.sessionDetails}>
          <Text style={styles.sessionMentorName}>{session.mentor}</Text>
          <Text style={styles.sessionTopic}>{session.topic}</Text>
          <View style={styles.sessionTimeInfo}>
            <View style={styles.timeItem}>
              <Icon name="calendar" size={14} color="#6B7280" />
              <Text style={styles.timeText}>{session.date}</Text>
            </View>
            <View style={styles.timeItem}>
              <Icon name="clock" size={14} color="#6B7280" />
              <Text style={styles.timeText}>{session.time}</Text>
            </View>
          </View>
          <View style={styles.sessionBadges}>
            <View style={styles.videoBadge}>
              <Icon name="video" size={12} color="#6366F1" />
              <Text style={styles.videoBadgeText}>{session.type}</Text>
            </View>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{session.duration}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.sessionActions}>
        <TouchableOpacity
          style={styles.rescheduleButton}
          onPress={() => handleRescheduleSession(session)}
        >
          <Text style={styles.rescheduleButtonText}>Reschedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => handleJoinSession(session)}
        >
          <LinearGradient
            colors={['#059669', '#10B981']}
            style={styles.joinButtonGradient}
          >
            <Text style={styles.joinButtonText}>Join Session</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Icon name="calendar" size={40} color="#9CA3AF" />
      </View>
      <Text style={styles.emptyTitle}>No Upcoming Sessions</Text>
      <Text style={styles.emptyDescription}>Book a session with a mentor to get started</Text>
      <TouchableOpacity
        style={styles.browseMentorsButton}
        onPress={() => setActiveTab('browse')}
      >
        <Text style={styles.browseMentorsButtonText}>Browse Mentors</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#0891B2', '#0D9488', '#2563EB']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Find Mentors</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search mentors..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="filter" size={20} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
            onPress={() => setActiveTab('browse')}
          >
            <Text style={[styles.tabText, activeTab === 'browse' && styles.activeTabText]}>
              Browse Mentors
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              My Sessions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0891B2" />
              <Text style={styles.loadingText}>Loading mentors...</Text>
            </View>
          ) : activeTab === 'browse' ? (
            <View style={styles.mentorsContainer}>
              {filteredMentors.map(renderMentorCard)}
            </View>
          ) : (
            <View style={styles.sessionsContainer}>
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map(renderSessionCard)
              ) : (
                renderEmptyState()
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  searchContainer: {
    position: 'relative',
    marginTop: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    height: 48,
    paddingLeft: 44,
    paddingRight: 50,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  filterButton: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#1E293B',
  },
  scrollContent: {
    flex: 1,
  },
  mentorsContainer: {
    paddingBottom: 100,
  },
  sessionsContainer: {
    paddingBottom: 100,
  },

  // Mentor Card Styles
  mentorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  mentorInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mentorImageContainer: {
    marginRight: 16,
  },
  mentorImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  mentorDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mentorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  mentorStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experience: {
    fontSize: 14,
    color: '#64748B',
  },
  separator: {
    fontSize: 14,
    color: '#64748B',
    marginHorizontal: 8,
  },
  sessions: {
    fontSize: 14,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  profileButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  profileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  bookButton: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  unavailableButton: {
    opacity: 0.6,
  },
  bookButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Session Card Styles
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sessionInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sessionImageContainer: {
    marginRight: 16,
  },
  sessionImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  sessionDetails: {
    flex: 1,
  },
  sessionMentorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  sessionTopic: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  sessionTimeInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  sessionBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  videoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoBadgeText: {
    fontSize: 12,
    color: '#6366F1',
    marginLeft: 4,
    fontWeight: '500',
  },
  durationBadge: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  durationText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  rescheduleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  rescheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  joinButton: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseMentorsButton: {
    backgroundColor: '#6366F1',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  browseMentorsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 16,
  },
});

export default MentorshipSessions;