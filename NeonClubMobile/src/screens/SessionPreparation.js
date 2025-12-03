import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const SessionPreparation = ({ route, navigation }) => {
  const { mentor, sessionDetails } = route.params || {};
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [systemChecks, setSystemChecks] = useState({
    microphone: { status: 'checking', label: 'Microphone' },
    camera: { status: 'checking', label: 'Camera' },
    internet: { status: 'checking', label: 'Internet Connection' },
    speakers: { status: 'checking', label: 'Speakers' },
  });

  useEffect(() => {
    // Simulate system checks
    const checkSystems = async () => {
      // Microphone check
      setTimeout(() => {
        setSystemChecks(prev => ({
          ...prev,
          microphone: { ...prev.microphone, status: 'success' }
        }));
      }, 1000);

      // Camera check
      setTimeout(() => {
        setSystemChecks(prev => ({
          ...prev,
          camera: { ...prev.camera, status: 'success' }
        }));
      }, 2000);

      // Internet check
      setTimeout(() => {
        setSystemChecks(prev => ({
          ...prev,
          internet: { ...prev.internet, status: 'success' }
        }));
      }, 3000);

      // Speakers check
      setTimeout(() => {
        setSystemChecks(prev => ({
          ...prev,
          speakers: { ...prev.speakers, status: 'success' }
        }));
      }, 4000);
    };

    checkSystems();

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'x-circle';
      default:
        return 'loader';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      default:
        return '#F59E0B';
    }
  };

  const allChecksPassed = Object.values(systemChecks).every(check => check.status === 'success');

  const handleJoinSession = () => {
    if (!allChecksPassed) {
      Alert.alert(
        'System Check Failed',
        'Please ensure all system checks pass before joining the session.',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('VideoSession', { mentor, sessionDetails });
  };

  const sessionData = sessionDetails || {
    topic: 'Career Guidance Session',
    date: 'Nov 18, 2024',
    time: '2:00 PM - 2:45 PM',
    duration: '45 minutes',
  };

  const mentorData = mentor || {
    name: 'Dr. Sunita Verma',
    specialization: 'Critical Care',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#8B5CF6', '#EC4899', '#F59E0B']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Session Preparation</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Session Details Card */}
          <View style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={styles.sessionIcon}>
                <Icon name="video" size={24} color="#8B5CF6" />
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTitle}>{sessionData.topic}</Text>
                <Text style={styles.sessionMentor}>with {mentorData.name}</Text>
              </View>
            </View>

            <View style={styles.sessionDetails}>
              <View style={styles.detailRow}>
                <Icon name="calendar" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{sessionData.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="clock" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{sessionData.time}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="user" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{sessionData.duration}</Text>
              </View>
            </View>
          </View>

          {/* Countdown Timer */}
          <View style={styles.countdownCard}>
            <Text style={styles.countdownLabel}>Session starts in</Text>
            <Text style={styles.countdownTime}>{formatTime(countdown)}</Text>
            <Text style={styles.countdownSubtext}>Please be ready to join</Text>
          </View>

          {/* System Checks */}
          <View style={styles.checksCard}>
            <View style={styles.checksHeader}>
              <Icon name="settings" size={20} color="#8B5CF6" />
              <Text style={styles.checksTitle}>System Checks</Text>
            </View>

            <View style={styles.checksList}>
              {Object.entries(systemChecks).map(([key, check]) => (
                <View key={key} style={styles.checkItem}>
                  <View style={styles.checkLeft}>
                    <Icon
                      name={getStatusIcon(check.status)}
                      size={20}
                      color={getStatusColor(check.status)}
                    />
                    <Text style={styles.checkLabel}>{check.label}</Text>
                  </View>
                  <Text style={[styles.checkStatus, { color: getStatusColor(check.status) }]}>
                    {check.status === 'checking' ? 'Checking...' :
                     check.status === 'success' ? 'Ready' : 'Failed'}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Tips */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Icon name="lightbulb" size={20} color="#8B5CF6" />
              <Text style={styles.tipsTitle}>Quick Tips</Text>
            </View>
            <View style={styles.tipsList}>
              <Text style={styles.tipText}>• Find a quiet, well-lit space</Text>
              <Text style={styles.tipText}>• Test your audio and video before joining</Text>
              <Text style={styles.tipText}>• Have your questions ready</Text>
              <Text style={styles.tipText}>• Close unnecessary applications</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.joinButton, !allChecksPassed && styles.joinButtonDisabled]}
          onPress={handleJoinSession}
          disabled={!allChecksPassed}
        >
          <LinearGradient
            colors={allChecksPassed ? ['#8B5CF6', '#EC4899', '#F59E0B'] : ['#9CA3AF', '#9CA3AF']}
            style={styles.joinButtonGradient}
          >
            <Icon name="video" size={20} color="white" />
            <Text style={styles.joinButtonText}>
              {allChecksPassed ? 'Join Session Now' : 'Waiting for System Checks...'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  sessionMentor: {
    fontSize: 14,
    color: '#6B7280',
  },
  sessionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  countdownCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countdownLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  countdownTime: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  countdownSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  checksCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  checksList: {
    gap: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkLabel: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  checkStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 100, // Space for bottom bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  joinButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default SessionPreparation;