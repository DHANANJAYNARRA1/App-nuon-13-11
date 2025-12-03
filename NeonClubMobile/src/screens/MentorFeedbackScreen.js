import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { activitiesAPI } from '../services/api';

const Tag = ({ label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.tag, active && styles.tagActive]}>
    <Text style={[styles.tagText, active && styles.tagTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const Star = ({ filled, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={{ fontSize: 28 }}>{filled ? '⭐' : '☆'}</Text>
  </TouchableOpacity>
);

const MentorFeedbackScreen = ({ route, navigation }) => {
  const { booking } = route.params || {};
  const [rating, setRating] = useState(3);
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState('');
  const [showThanks, setShowThanks] = useState(false);

  const toggle = (t) => setTags((prev) => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const submit = async () => {
    try {
      await activitiesAPI.create({ type: 'session_feedback', title: 'Mentorship feedback', meta: { rating, tags, comments, bookingId: booking?._id } });
      setShowThanks(true);
    } catch {
      setShowThanks(true);
    }
  };

  return (
    <View style={{ flex:1, backgroundColor:'#f8fafc' }}>
      <LinearGradient colors={["#6D28D9", "#EC4899", "#F97316"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ paddingTop: 36, paddingBottom: 16, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <Text style={{ color:'#fff', fontWeight:'800', fontSize: 18 }}>Session Complete!</Text>
        <Text style={{ color:'#e2e8f0', marginTop: 4 }}>How was your experience?</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Rate Your Session</Text>
        <View style={{ flexDirection:'row', gap: 8, marginTop: 6 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} filled={i < rating} onPress={() => setRating(i+1)} />
          ))}
        </View>
        <Text style={{ color:'#64748b', marginTop: 6 }}>{['Poor','Fair','Good','Very Good','Excellent'][rating-1]}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What did you like? (Optional)</Text>
        <View style={{ flexDirection:'row', flexWrap:'wrap', gap: 8, marginTop: 8 }}>
          {['Knowledgeable','Patient','Clear Communication','Engaging','Well Prepared','Supportive','Experienced','Helpful'].map((t) => (
            <Tag key={t} label={t} active={tags.includes(t)} onPress={() => toggle(t)} />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Additional Comments (Optional)</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          value={comments}
          onChangeText={setComments}
          placeholder="Your feedback helps improve the quality of mentorship sessions"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={styles.card}>
        <View style={{ backgroundColor:'#dcfce7', borderRadius: 12, padding: 12 }}>
          <Text style={{ color:'#065f46', fontWeight:'700' }}>Earn Bonus Points!</Text>
          <Text style={{ color:'#065f46' }}>Submit your feedback and get 50 bonus points</Text>
        </View>
      </View>

      <LinearGradient colors={["#7C3AED","#F97316"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.submitBtn}>
        <TouchableOpacity onPress={submit}>
          <Text style={styles.submitText}>Submit Feedback</Text>
        </TouchableOpacity>
      </LinearGradient>

      <TouchableOpacity onPress={() => navigation.navigate('Mentorship')} style={{ alignItems:'center', marginTop: 12 }}>
        <Text style={{ color:'#64748b' }}>Skip for Now</Text>
      </TouchableOpacity>

      <Modal transparent visible={showThanks} animationType="fade" onRequestClose={() => setShowThanks(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={{ marginTop: -36 }}>
              <LinearGradient colors={["#A78BFA", "#F472B6"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.modalIconBg}>
                <Text style={{ fontSize: 26, color: '#fff' }}>🎁</Text>
              </LinearGradient>
            </View>
            <Text style={styles.modalTitle}>Thank You!</Text>
            <Text style={styles.modalDesc}>Your feedback helps us improve. You earned 50 bonus points!</Text>
            <LinearGradient colors={["#7C3AED","#DB2777"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.modalCta}>
              <TouchableOpacity onPress={() => { setShowThanks(false); navigation.navigate('Mentorship'); }}>
                <Text style={styles.modalCtaText}>Awesome!</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor:'#fff', borderRadius: 12, padding: 16, marginHorizontal: 16, marginTop: 16, borderWidth: 1, borderColor:'#e5e7eb' },
  cardTitle: { color:'#111827', fontWeight:'800' },
  tag: { backgroundColor:'#eef2ff', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  tagActive: { backgroundColor:'#7C3AED' },
  tagText: { color:'#4F46E5', fontWeight:'700' },
  tagTextActive: { color:'#fff' },
  input: { backgroundColor:'#F3F4F6', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, minHeight: 100, textAlignVertical:'top', color:'#111827' },
  submitBtn: { marginHorizontal: 16, borderRadius: 12, paddingVertical: 14, alignItems:'center', marginTop: 8 },
  submitText: { color:'#fff', fontWeight:'800' },
  modalBackdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.35)', alignItems:'center', justifyContent:'center' },
  modalCard: { width: '82%', backgroundColor:'#fff', borderRadius: 16, padding: 18, alignItems:'center', shadowColor:'#000', shadowOpacity:0.2, shadowRadius:12, elevation:6 },
  modalIconBg: { width: 64, height: 64, borderRadius: 32, alignItems:'center', justifyContent:'center' },
  modalTitle: { fontSize:18, fontWeight:'800', color:'#7C3AED', marginTop: 6 },
  modalDesc: { color:'#475569', textAlign:'center', marginTop: 6 },
  modalCta: { marginTop: 14, width: '86%', borderRadius: 999, paddingVertical: 12, alignItems:'center' },
  modalCtaText: { color:'#fff', fontWeight:'800', textAlign:'center' },
});

export default MentorFeedbackScreen;
