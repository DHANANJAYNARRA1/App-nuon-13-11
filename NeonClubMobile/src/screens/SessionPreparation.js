import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

const SessionPreparation = ({ route, navigation }) => {
  const { booking } = route.params || {};
  const title = booking?.title || 'Mentorship Session';
  const mentorName = booking?.mentorId?.name || 'Mentor';
  const dateTime = booking?.dateTime;
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [micStatus, setMicStatus] = useState('checking');
  const [cameraStatus, setCameraStatus] = useState('checking');
  const [internetStatus, setInternetStatus] = useState('checking');

  useEffect(() => {
    // Simulate permission checks
    const timer1 = setTimeout(() => setMicStatus('ready'), 500);
    const timer2 = setTimeout(() => setCameraStatus('ready'), 1000);
    const timer3 = setTimeout(() => setInternetStatus('ready'), 800);

    // Countdown timer
    const countdown = setInterval(() => {
      setTimeRemaining(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(countdown);
    };
  }, []);

  const formatCountdown = () => {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    return `${pad(mins)}:${pad(secs)}`;
  };

  const allReady = micStatus === 'ready' && cameraStatus === 'ready' && internetStatus === 'ready';

  const renderCheckItem = (label, status) => (
    <View style={styles.checkRow}>
      <View style={[styles.statusCircle, status === 'ready' && styles.statusReady]}>
        {status === 'ready' ? (
          <Icon name="check" size={14} color="white" />
        ) : (
          <View style={styles.dots}>
            <Text style={styles.dotsText}>⋯</Text>
          </View>
        )}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
      <Text style={[styles.checkStatus, status === 'ready' && styles.statusText]}>
        {status === 'ready' ? 'Ready' : 'Checking...'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#9333EA', '#EC4899', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Session</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Session Info Card */}
        <View style={styles.sessionCard}>
          <LinearGradient
            colors={['#9333EA', '#EC4899']}
            style={styles.iconCircle}
          >
            <Icon name="video" size={32} color="white" />
          </LinearGradient>
          <Text style={styles.sessionTitle}>{title}</Text>
          <Text style={styles.mentorName}>with {mentorName}</Text>
          <View style={styles.metaRow}>
            <Icon name="calendar" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{dateTime ? new Date(dateTime).toLocaleDateString() : 'TBA'}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Icon name="clock" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{dateTime ? new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'}</Text>
          </View>
        </View>

        {/* Countdown Card */}
        {allReady && (
          <LinearGradient
            colors={['#DCFCE7', '#F0FDF4']}
            style={styles.countdownCard}
          >
            <Text style={styles.countdownLabel}>Session starts in</Text>
            <Text style={styles.countdownTime}>{formatCountdown()}</Text>
            <View style={styles.readyBadge}>
              <Icon name="check-circle" size={16} color="#059669" />
              <Text style={styles.readyBadgeText}>Ready to Join</Text>
            </View>
          </LinearGradient>
        )}

        {/* System Check Card */}
        <View style={styles.systemCard}>
          <Text style={styles.systemTitle}>System Check</Text>
          <View style={styles.checksContainer}>
            {renderCheckItem('Microphone', micStatus)}
            {renderCheckItem('Camera', cameraStatus)}
            {renderCheckItem('Internet', internetStatus)}
          </View>
        </View>
      </ScrollView>

      {/* Join Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          disabled={!allReady}
          onPress={() => navigation.navigate('VideoSession', { booking })}
          style={[styles.joinButton, !allReady && styles.joinButtonDisabled]}
        >
          <LinearGradient
            colors={allReady ? ['#9333EA', '#EC4899'] : ['#D1D5DB', '#D1D5DB']}
            style={styles.joinButtonGradient}
          >
            <Icon name="video" size={20} color="white" />
            <Text style={styles.joinButtonText}>Join Session Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
  },
  sessionCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
    textAlign: 'center',
  },
  mentorName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaDot: {
    color: '#D1D5DB',
    marginHorizontal: 4,
  },
  countdownCard: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownLabel: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 6,
  },
  countdownTime: {
    fontSize: 36,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  readyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  systemCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  systemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  checksContainer: {
    gap: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusReady: {
    backgroundColor: '#10B981',
  },
  dots: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  checkLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  checkStatus: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statusText: {
    color: '#10B981',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  joinButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  joinButtonDisabled: {
    opacity: 0.5,
  },
  joinButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SessionPreparation;