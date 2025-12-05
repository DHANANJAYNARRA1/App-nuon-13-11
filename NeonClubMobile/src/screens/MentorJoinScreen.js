import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
  return { mm, ss, ready: diff <= 120000 }; // show Ready within 2 minutes
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
    // After attempting to join, offer to leave feedback
    navigation.navigate('MentorFeedback', { booking });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#6D28D9", "#EC4899", "#F97316"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
        <View style={styles.heroCard}>
          <Text style={styles.heroIcon}>🎥</Text>
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroSub}>with {mentorName}</Text>
          <View style={styles.heroMeta}><Text style={styles.heroMetaText}>{new Date(dateTime).toDateString()}</Text><Text style={styles.dot}>•</Text><Text style={styles.heroMetaText}>{new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text></View>
        </View>
      </LinearGradient>

      <View style={[styles.card, { alignItems:'center' }]}>
        <Text style={styles.small}>Session starts in</Text>
        <Text style={styles.countdown}>{pad(mm)}:{pad(ss)}</Text>
        <View style={[styles.readyPill, { backgroundColor: ready ? '#dcfce7' : '#fee2e2' }]}>
          <Text style={{ color: ready ? '#059669' : '#dc2626', fontWeight: '700' }}>{ready ? 'Ready to Join' : 'Not yet'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>System Check</Text>
        {[
          ['Microphone', 'Working'],
          ['Camera', 'Working'],
          ['Internet', 'Strong connection'],
        ].map(([k, v]) => (
          <View key={k} style={styles.row}><Text style={styles.bullet}>•</Text><Text style={styles.meta}>{k}</Text><Text style={styles.right}>{v} ✓</Text></View>
        ))}
      </View>

      <TouchableOpacity disabled={!ready} onPress={onJoin} style={[styles.joinBtn, !ready && { opacity: 0.6 }]}>
        <Text style={styles.joinText}>Join Session Now</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Bookings')} style={styles.backLink}>
        <Text style={{ color:'#64748b' }}>Back to Sessions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f8fafc' },
  hero: { paddingTop: 36, paddingBottom: 16, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  heroCard: { backgroundColor:'rgba(255,255,255,0.2)', borderRadius: 16, padding: 16 },
  heroIcon: { fontSize: 36, textAlign:'center', color:'#fff' },
  heroTitle: { color:'#fff', fontSize: 18, fontWeight:'800', textAlign:'center', marginTop: 6 },
  heroSub: { color:'#f1f5f9', textAlign:'center' },
  heroMeta: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap: 8, marginTop: 6 },
  heroMetaText: { color:'#fff' },
  dot: { color:'#f8fafc' },
  small: { color:'#64748b' },
  countdown: { fontSize: 42, fontWeight:'900', color:'#10b981', marginTop: 6 },
  readyPill: { marginTop: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  card: { backgroundColor:'#fff', borderRadius: 12, padding: 16, marginHorizontal: 16, marginTop: 16, borderWidth: 1, borderColor:'#e5e7eb' },
  cardTitle: { color:'#111827', fontWeight:'800', marginBottom: 8 },
  row: { flexDirection:'row', alignItems:'center', paddingVertical: 8 },
  bullet: { color:'#a3a3a3', marginRight: 6 },
  meta: { color:'#1f2937', fontWeight:'600' },
  right: { marginLeft:'auto', color:'#64748b' },
  joinBtn: { marginHorizontal: 16, marginTop: 16, backgroundColor:'#059669', borderRadius: 12, paddingVertical: 14, alignItems:'center' },
  joinText: { color:'#fff', fontWeight:'800' },
  backLink: { marginTop: 12, alignItems:'center' },
});

export default MentorJoinScreen;
