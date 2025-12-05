import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

const useCountdown = (targetIso) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const targetMs = targetIso ? new Date(targetIso).getTime() : now;
  const diff = Math.max(targetMs - now, 0);
  const mm = Math.floor(diff / 60000);
  const ss = Math.floor((diff % 60000) / 1000);
  return { mm, ss, ready: diff <= 120000 };
};

const MentorJoinScreen = ({ route, navigation }) => {
  const { booking } = route.params || {};
  const title = booking?.title || 'Mentorship Session';
  const mentorName = booking?.mentorId?.name || 'Mentor';
  const dateTime = booking?.dateTime;
  const zoomLink = booking?.zoomLink;
  const { mm, ss, ready } = useCountdown(dateTime);

  const onJoin = async () => {
    if (zoomLink) {
      try { await Linking.openURL(zoomLink); } catch {}
    }
    navigation.navigate('MentorFeedback', { booking });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#9333EA', '#EC4899', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#9333EA', '#EC4899']}
            style={styles.heroIcon}
          >
            <Icon name="video" size={32} color="white" />
          </LinearGradient>
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroSub}>with {mentorName}</Text>
          <View style={styles.heroMeta}>
            <Icon name="calendar" size={12} color="white" />
            <Text style={styles.heroMetaText}>{new Date(dateTime).toLocaleDateString()}</Text>
            <Text style={styles.dot}>•</Text>
            <Icon name="clock" size={12} color="white" />
            <Text style={styles.heroMetaText}>{new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Countdown Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Session starts in</Text>
          <Text style={styles.countdown}>{pad(mm)}:{pad(ss)}</Text>
          {ready && (
            <View style={styles.readyBadge}>
              <Icon name="check-circle" size={16} color="#059669" />
              <Text style={styles.readyBadgeText}>Ready to Join</Text>
            </View>
          )}
        </View>

        {/* System Checks */}
        <View style={styles.checksCard}>
          <Text style={styles.checksTitle}>System Check</Text>
          {[
            { label: 'Microphone', status: 'Working' },
            { label: 'Camera', status: 'Working' },
            { label: 'Internet', status: 'Strong connection' },
          ].map((item, idx) => (
            <View key={idx} style={styles.checkRow}>
              <Icon name="check-circle" size={16} color="#10B981" />
              <Text style={styles.checkLabel}>{item.label}</Text>
              <Text style={styles.checkStatus}>{item.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Join Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          disabled={!ready}
          onPress={onJoin}
          style={[styles.joinBtn, !ready && styles.joinBtnDisabled]}
        >
          <LinearGradient
            colors={ready ? ['#9333EA', '#EC4899'] : ['#D1D5DB', '#D1D5DB']}
            style={styles.joinBtnGradient}
          >
            <Icon name="video" size={20} color="white" />
            <Text style={styles.joinText}>Join Session Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  hero: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backBtn: {
    marginBottom: 12,
  },
  heroCard: { alignItems: 'center' },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center', marginBottom: 12 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  heroMetaText: { color: 'white', fontSize: 12 },
  dot: { color: 'rgba(255,255,255,0.5)' },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardLabel: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  countdown: { fontSize: 36, fontWeight: '700', color: '#10B981', marginBottom: 8 },
  readyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ECFDF5', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  readyBadgeText: { fontSize: 12, fontWeight: '600', color: '#059669' },
  checksCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  checksTitle: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 8 },
  checkLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#374151' },
  checkStatus: { fontSize: 12, color: '#6B7280' },
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
  joinBtn: { borderRadius: 25, overflow: 'hidden' },
  joinBtnDisabled: { opacity: 0.5 },
  joinBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 20, gap: 8 },
  joinText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default MentorJoinScreen;
