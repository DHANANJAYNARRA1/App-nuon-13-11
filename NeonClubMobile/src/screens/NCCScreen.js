import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NCC_HERO } from '../assets/heroImages';
import { nccAPI, activitiesAPI } from '../services/api';

// Stages of the Nightingale programme
const STAGES = {
  OVERVIEW: 'overview',
  QUESTIONNAIRE: 'questionnaire',
  WORKSHOP: 'workshop',
  LEADERSHIP: 'leadership',
  COMPLETED: 'completed',
};

const NCCScreen = ({ navigation }) => {
  // Local UI machine for multi-stage flow
  const [stage, setStage] = useState(STAGES.OVERVIEW);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [uiNumber, setUiNumber] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const questions = useMemo(() => ([
    { id: 1, question: 'What is your primary area of nursing expertise?', options: ['Critical Care', 'Emergency', 'Pediatrics', 'General Ward'] },
    { id: 2, question: 'How many years of clinical experience do you have?', options: ['0-2 years', '2-5 years', '5-10 years', '10+ years'] },
    { id: 3, question: 'Have you completed any specialized certifications?', options: ['Yes, multiple', 'Yes, one', 'Currently pursuing', 'No'] },
    { id: 4, question: 'How comfortable are you with teaching and mentoring?', options: ['Very comfortable', 'Somewhat comfortable', 'Need more experience', 'Not comfortable yet'] },
    { id: 5, question: 'What motivates you to become a Champion Mentor?', options: ['Give back to profession', 'Share knowledge', 'Professional growth', 'All of the above'] },
  ]), []);

  // Optional: load and sync status with backend, not blocking UI
  useEffect(() => {
    (async () => {
      try {
        await nccAPI.getNCCStatus().catch(() => {});
        // Fetch latest UI number (admin-configured)
        try {
          const res = await nccAPI.getUiNumber();
          const n = res?.data?.uiNumber;
          if (n) setUiNumber(n);
        } catch {}
      } catch {}
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#6D28D9", "#EC4899", "#F97316"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => (navigation.canGoBack()? navigation.goBack() : navigation.navigate('Main'))} style={styles.backBtn}><Text style={{ color:'#fff', fontSize:18 }}>‹</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Nightingale Programme</Text>
          {uiNumber ? (
            <View style={styles.uiPill}><Text style={styles.uiPillText}>UI No: {String(uiNumber)}</Text></View>
          ) : null}
        </View>
        <Text style={styles.headerSub}>Champion Mentor Certification</Text>
      </LinearGradient>

      {/* CONTENT by stage */}
      {stage === STAGES.OVERVIEW && (
        <View>
          {/* Hero */}
          <View style={styles.sectionPad}>
            <ImageBackground source={{ uri: NCC_HERO }} style={styles.heroCard} imageStyle={{ borderRadius: 16 }}>
              <View style={styles.heroOverlay} />
              <View style={styles.heroCenter}>
                <View style={styles.heroIcon}><Text style={{ color:'#fff' }}>🪔</Text></View>
                <Text style={styles.heroTitle}>The Nightingale Programme</Text>
                <Text style={styles.heroDesc}>Follow in the footsteps of Florence Nightingale. Become a certified Champion Mentor and light the way for the next generation of nurses.</Text>
                <View style={styles.heroChip}><Text style={styles.heroChipText}>Champion Mentor Certification</Text></View>
              </View>
            </ImageBackground>
          </View>

          {/* Values */}
          <View style={[styles.cardSoft, { marginHorizontal: 16 }]}> 
            <Text style={styles.cardTitle}>The Nightingale Values</Text>
            {[
              ['Compassionate Leadership', 'Lead with empathy and understanding', '#8B5CF6'],
              ['Knowledge Sharing', 'Illuminate others with your wisdom', '#EC4899'],
              ['Professional Excellence', 'Maintain the highest standards', '#F97316'],
              ['Continuous Growth', 'Never stop learning and improving', '#F59E0B'],
            ].map(([t, d, dot], i) => (
              <View key={String(i)} style={styles.benefitRow}>
                <View style={{ width:6, height:6, borderRadius:3, backgroundColor: dot }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>{t}</Text>
                  <Text style={styles.benefitSub}>{d}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Benefits */}
          <View style={[styles.cardSoft, styles.benefitsCard, { marginHorizontal: 16 }]}>
            <Text style={styles.cardTitle}>Champion Mentor Benefits</Text>
            {[
              ['Official Certification', 'Recognized Nightingale Champion Mentor status', '💡'],
              ['Guide Future Nurses', 'Mentor and inspire the next generation', '👥'],
              ['Earn While You Mentor', 'Get paid for sessions + 2x reward points', '🏆'],
              ['Elite Network Access', 'Join the community of healthcare leaders', '✨'],
            ].map(([t, d, icon], i) => (
              <View key={String(i)} style={styles.benefitRow}>
                <Text style={styles.benefitIcon}>{icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>{t}</Text>
                  <Text style={styles.benefitSub}>{d}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Journey timeline */}
          <View style={[styles.cardSoft, { marginHorizontal: 16 }]}>
            <Text style={styles.cardTitle}>The Nightingale Journey</Text>
            <Text style={styles.cardSub}>3 transformative steps to mentorship</Text>
            {[
              ['Step 1', 'Assessment Questionnaire', 'Evaluate your expertise and readiness', '📄', '#8B5CF6'],
              ['Step 2', 'Workshop & Interview', 'Live evaluation with expert panel', '👥', '#EC4899'],
              ['Step 3', 'Leadership Programme', '4-week intensive mentoring training', '🎓', '#F97316'],
              ['Final', 'Nightingale Certification', 'Receive your Champion Mentor certificate', '🪔', '#F59E0B'],
            ].map(([pill, t, d, icon, color], i) => (
              <View key={String(i)}>
                <View style={styles.timelineRow}>
                  <View style={[styles.timelineDot, { backgroundColor: color }]} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.stepPill}><Text style={styles.stepPillText}>{pill}</Text></View>
                    <Text style={styles.timelineTitle}>{icon} {t}</Text>
                    <Text style={styles.timelineDesc}>{d}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <LinearGradient colors={["#7C3AED", "#DB2777", "#F97316"]} start={{x:0,y:0}} end={{x:1,y:0}} style={[styles.ctaGradient, { marginHorizontal: 16 }] }>
            <TouchableOpacity onPress={() => setStage(STAGES.QUESTIONNAIRE)}>
              <Text style={styles.ctaText}>Begin Your Nightingale Journey</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      {stage === STAGES.QUESTIONNAIRE && (() => {
        const q = questions[currentQuestion];
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        const selected = answers[q.id];
        return (
          <View style={{ padding: 16 }}>
            <View style={[styles.cardSoft, { padding: 16 }]}> 
              <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom: 8 }}>
                <Text style={{ color:'#64748B' }}>Question {currentQuestion + 1} of {questions.length}</Text>
                <Text style={{ color:'#7C3AED', fontWeight:'700' }}>{Math.round(progress)}%</Text>
              </View>
              <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: '#7C3AED' }]} /></View>
              <View style={{ flexDirection:'row', alignItems:'center', gap: 8, marginTop: 12, marginBottom: 12 }}>
                <View style={styles.heroIcon}><Text style={{ color:'#fff' }}>🪔</Text></View>
                <Text style={{ fontWeight:'800', color:'#111827' }}>{q.question}</Text>
              </View>
              {q.options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.9}
                  onPress={() => setAnswers({ ...answers, [q.id]: opt })}
                  style={[styles.optionRow, selected===opt ? styles.optionRowActive : null]}
                >
                  <Text style={[styles.optionRadio, selected===opt ? styles.optionRadioActive : null]} />
                  <Text style={[styles.optionLabel, selected===opt ? styles.optionLabelActive : null]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection:'row', gap: 12 }}>
              {currentQuestion > 0 && (
                <TouchableOpacity style={[styles.btnOutline, { flex: 1 }]} onPress={() => setCurrentQuestion(currentQuestion - 1)}>
                  <Text style={styles.btnOutlineText}>Previous</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.btnPrimary, { flex: 1, opacity: selected ? 1 : 0.6 }]} 
                disabled={!selected}
                onPress={() => {
                  if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
                  else setStage(STAGES.WORKSHOP);
                }}
              >
                <Text style={styles.btnPrimaryText}>{currentQuestion < questions.length - 1 ? 'Next' : 'Complete Assessment'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })()}

      {stage === STAGES.WORKSHOP && (
        <View style={{ padding: 16 }}>
          <View style={[styles.cardSoft, { alignItems:'center' }]}> 
            <View style={[styles.heroIcon, { width:72, height:72, borderRadius:36, backgroundColor:'rgba(16,185,129,0.15)' }]}><Text style={{ color:'#10B981', fontSize:28 }}>✅</Text></View>
            <Text style={{ fontWeight:'800', fontSize:18, color:'#111827', marginTop: 6 }}>Assessment Complete!</Text>
            <Text style={{ color:'#64748B', marginTop: 2 }}>Great work! Now let's schedule your evaluation workshop</Text>
          </View>

          <View style={styles.cardSoft}>
            <Text style={styles.cardTitle}>Step 2: Workshop & Interview</Text>
            <Text style={styles.cardSub}>Select a date for your live evaluation with the Nightingale panel</Text>
            {[
              { date: 'Oct 20, 2025', time: '2:00 PM - 4:00 PM', available: true },
              { date: 'Oct 22, 2025', time: '4:00 PM - 6:00 PM', available: true },
              { date: 'Oct 25, 2025', time: '10:00 AM - 12:00 PM', available: false },
            ].map((slot) => (
              <View key={slot.date} style={[styles.slotCard, !slot.available && { opacity: 0.6 }]}>
                <View style={{ flexDirection:'row', alignItems:'center', gap: 12 }}>
                  <View style={[styles.heroIcon, { backgroundColor:'#EEF2FF' }]}><Text>📅</Text></View>
                  <View>
                    <Text style={{ fontWeight:'700', color:'#111827' }}>{slot.date}</Text>
                    <Text style={{ color:'#64748B' }}>{slot.time}</Text>
                  </View>
                </View>
                {slot.available ? (
                  <TouchableOpacity style={styles.btnPrimarySm} onPress={() => setStage(STAGES.LEADERSHIP)}><Text style={styles.btnPrimaryText}>Select</Text></TouchableOpacity>
                ) : (
                  <View style={styles.badgeMuted}><Text style={styles.badgeMutedText}>Full</Text></View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {stage === STAGES.LEADERSHIP && (
        <View style={{ padding: 16 }}>
          <View style={[styles.cardSoft, { alignItems:'center' }]}> 
            <View style={[styles.heroIcon, { width:88, height:88, borderRadius:44, backgroundColor:'#7C3AED' }]}><Text style={{ color:'#fff', fontSize:30 }}>✅</Text></View>
            <Text style={{ fontWeight:'800', fontSize:18, color:'#111827', marginTop: 6 }}>Workshop Scheduled!</Text>
            <Text style={{ color:'#64748B' }}>Final step: Enroll in the Leadership Programme</Text>
            <View style={[styles.badgeMuted, { backgroundColor:'#EEF2FF', marginTop: 8 }]}><Text style={[styles.badgeMutedText, { color:'#4F46E5' }]}>Oct 20, 2:00 PM</Text></View>
          </View>

          <View style={styles.cardSoft}>
            <Text style={styles.cardTitle}>Step 3: Leadership Programme</Text>
            <Text style={styles.cardSub}>4-week intensive programme to master mentoring skills</Text>
            {[
              { week: 1, title: 'Leadership Fundamentals', desc: 'Building your leadership foundation' },
              { week: 2, title: 'Mentoring Excellence', desc: 'The art of effective mentoring' },
              { week: 3, title: 'Communication Mastery', desc: 'Connect with empathy and clarity' },
              { week: 4, title: 'Capstone & Certification', desc: 'Final project and ceremony' },
            ].map((m) => (
              <View key={m.week} style={styles.moduleRow}>
                <View style={[styles.weekAvatar]}><Text style={{ color:'#fff', fontWeight:'800' }}>{m.week}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight:'700', color:'#111827' }}>{m.title}</Text>
                  <Text style={{ color:'#64748B' }}>{m.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.cardSoft, { flexDirection:'row', alignItems:'center', gap: 12 }]}> 
            <Text>🪔</Text>
            <View>
              <Text style={{ fontWeight:'700', color:'#111827' }}>Programme Duration</Text>
              <Text style={{ color:'#64748B' }}>4 weeks • 12 hours total commitment</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btnPrimary, { marginHorizontal: 16 }]}
            onPress={() => {
              // Show popup immediately; fire API creation in background without blocking UI
              setShowEnrollModal(true);
              setTimeout(async () => {
                try { await activitiesAPI.create({ type:'ncc-enroll', title:'Enrolled Successfully', meta:{ points:500 } }); } catch {}
              }, 0);
            }}
          >
            <Text style={styles.btnPrimaryText}>Enroll in Leadership Programme</Text>
          </TouchableOpacity>
        </View>
      )}

      {stage === STAGES.COMPLETED && (
        <View style={{ padding: 16 }}>
          <LinearGradient colors={["#7C3AED", "#DB2777", "#F97316"]} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.cardSoft, { padding: 24 }]}> 
            <View style={[styles.heroIcon, { width:88, height:88, borderRadius:44, backgroundColor:'rgba(255,255,255,0.2)', alignSelf:'center' }]}><Text style={{ color:'#F59E0B', fontSize:32 }}>🪔</Text></View>
            <Text style={{ color:'#fff', fontSize:20, fontWeight:'800', textAlign:'center', marginTop: 8 }}>Welcome to the Nightingale Programme!</Text>
            <Text style={{ color:'#fff', opacity:0.95, textAlign:'center', marginTop: 6 }}>Your journey to becoming a Champion Mentor has officially begun</Text>
            <View style={[styles.badgeMuted, { alignSelf:'center', marginTop: 8, backgroundColor:'#fff' }]}><Text style={{ color:'#7C3AED', fontWeight:'700' }}>Programme Starts: Oct 20, 2025</Text></View>
          </LinearGradient>

          <View style={styles.cardSoft}>
            <Text style={styles.cardTitle}>Your Next Steps</Text>
            {[
              ['✅', 'Check Your Email', 'Programme schedule and access details sent'],
              ['📄', 'Pre-Programme Materials', 'Reading materials available in your dashboard'],
              ['👥', 'Join the Community', 'Connect with fellow Nightingale participants'],
              ['🪔', 'Certification Ceremony', 'Complete all modules to light your lamp'],
            ].map(([icon, t, d], idx) => (
              <View key={String(idx)} style={styles.benefitRow}>
                <Text>{icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.benefitTitle}>{t}</Text>
                  <Text style={styles.benefitSub}>{d}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[styles.btnPrimary, { marginHorizontal: 16 }]} onPress={() => navigation.navigate('Main')}>
            <Text style={styles.btnPrimaryText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
  </ScrollView>
    {/* Enrolled Successfully Modal */}
    <Modal visible={showEnrollModal} transparent animationType="fade" onRequestClose={() => setShowEnrollModal(false)}>
      <View style={styles.modalBackdrop}>
        {/* subtle confetti */}
        <View pointerEvents="none" style={styles.confettiLayer}>
          {Array.from({ length: 14 }).map((_, i) => (
            <View key={i} style={[styles.confettiSquare, { left: (i*7)%100 + '%', top: (i*13)%100 + '%', backgroundColor: i%3===0? '#F59E0B' : i%3===1? '#8B5CF6' : '#EC4899' }]} />
          ))}
        </View>
        <View style={styles.modalCard}>
          <View style={styles.modalIconWrap}>
            <LinearGradient colors={["#A78BFA","#F472B6"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.modalIconBg}>
              <Text style={{ fontSize: 28, color:'#fff' }}>🎖️</Text>
            </LinearGradient>
          </View>
          <Text style={styles.modalTitle}>Enrolled Successfully!</Text>
          <Text style={styles.modalDesc}>Your Nightingale journey has begun.</Text>
          <Text style={styles.modalDesc}>You're on your way to becoming a{''}
            <Text style={{ fontWeight:'700' }}> Champion Mentor!</Text>
          </Text>
          <LinearGradient colors={["#7C3AED","#DB2777"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.modalCta}>
            <TouchableOpacity onPress={() => { setShowEnrollModal(false); setStage(STAGES.COMPLETED); }}>
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
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerGradient: { paddingTop: 36, paddingBottom: 16, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerRow: { flexDirection:'row', alignItems:'center', gap: 8 },
  backBtn: { padding: 6 },
  headerTitle: { color:'#fff', fontSize:18, fontWeight:'800', flex: 1 },
  uiPill: { backgroundColor:'rgba(255,255,255,0.2)', paddingHorizontal:10, paddingVertical:6, borderRadius:999 },
  uiPillText: { color:'#fff', fontWeight:'700', fontSize:12 },
  headerSub: { color:'#F1F5F9', marginTop: 6 },
  sectionPad: { padding: 16 },
  heroCard: { borderRadius: 16, overflow:'hidden', height: 180, backgroundColor:'#E5E7EB' },
  heroImg: { position:'absolute', left:0, right:0, top:0, bottom:0 },
  heroOverlay: { position:'absolute', left:0, right:0, top:0, bottom:0, backgroundColor:'rgba(0,0,0,0.35)' },
  heroCenter: { position:'absolute', left:16, right:16, top:0, bottom:0, alignItems:'center', justifyContent:'center' },
  heroIcon: { width:56, height:56, borderRadius:28, backgroundColor:'rgba(255,255,255,0.25)', alignItems:'center', justifyContent:'center', marginBottom:10 },
  heroTitle: { color:'#fff', fontWeight:'800', fontSize:16, marginBottom:6, textAlign:'center' },
  heroDesc: { color:'#E5E7EB', textAlign:'center' },
  heroChip: { marginTop:10, backgroundColor:'#F3F4F6', alignSelf:'center', paddingHorizontal:12, paddingVertical:6, borderRadius:999 },
  heroChipText: { color:'#111827', fontWeight:'700', fontSize:12 },
  
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  stepsContainer: { padding: 16 },
  cardSoft: { backgroundColor:'#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, shadowOffset:{ width:0, height:2 }, elevation:2, borderWidth:1, borderColor:'#E5E7EB' },
  benefitsCard: { backgroundColor:'#FFFBEB', borderColor:'#FDE68A' },
  cardTitle: { color:'#111827', fontWeight:'800', fontSize:16 },
  cardSub: { color:'#64748B', marginTop:4 },
  benefitRow: { flexDirection:'row', gap:12, marginTop:12 },
  benefitIcon: { fontSize:16 },
  benefitTitle: { color:'#111827', fontWeight:'700' },
  benefitSub: { color:'#6B7280' },
  timelineRow: { flexDirection:'row', gap:12, marginTop:16 },
  timelineDot: { width:6, height:48, borderRadius:3 },
  stepPill: { alignSelf:'flex-start', backgroundColor:'#EEF2FF', paddingHorizontal:8, paddingVertical:4, borderRadius:999 },
  stepPillText: { color:'#4F46E5', fontWeight:'700', fontSize:12 },
  timelineTitle: { color:'#111827', fontWeight:'700', marginTop:6 },
  timelineDesc: { color:'#6B7280' },
  ctaGradient: { borderRadius: 999, paddingVertical: 14, alignItems:'center', marginTop: 16 },
  ctaText: { color:'#fff', fontWeight:'800' },
  optionRow: { flexDirection:'row', alignItems:'center', gap: 12, padding: 14, borderWidth: 2, borderColor:'#E5E7EB', borderRadius: 14, marginBottom: 10, backgroundColor:'#fff' },
  optionRowActive: { borderColor:'#7C3AED', backgroundColor:'#F5F3FF' },
  optionRadio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor:'#CBD5E1', backgroundColor:'#fff' },
  optionRadioActive: { borderColor:'#7C3AED', backgroundColor:'#7C3AED' },
  optionLabel: { color:'#111827', fontWeight:'600' },
  optionLabelActive: { color:'#4F46E5' },
  slotCard: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1, borderColor:'#E5E7EB', borderRadius:12, padding:12, marginTop:12, backgroundColor:'#fff' },
  btnOutline: { borderWidth: 2, borderColor:'#E5E7EB', borderRadius: 12, paddingVertical: 12, alignItems:'center' },
  btnOutlineText: { color:'#111827', fontWeight:'700' },
  btnPrimary: { backgroundColor:'#7C3AED', borderRadius: 12, paddingVertical: 12, alignItems:'center', marginTop: 12 },
  btnPrimarySm: { backgroundColor:'#7C3AED', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 16, alignItems:'center' },
  btnPrimaryText: { color:'#fff', fontWeight:'800' },
  badgeMuted: { backgroundColor:'#E5E7EB', paddingHorizontal:10, paddingVertical:6, borderRadius:999 },
  badgeMutedText: { color:'#111827', fontWeight:'700', fontSize:12 },
  moduleRow: { flexDirection:'row', gap: 12, alignItems:'center', borderWidth:1, borderColor:'#E5E7EB', borderRadius:12, padding:12, marginTop:12 },
  weekAvatar: { width: 36, height:36, borderRadius:18, backgroundColor:'#F43F5E', alignItems:'center', justifyContent:'center' },
  // Modal styles
  modalBackdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.35)', alignItems:'center', justifyContent:'center' },
  modalCard: { width: '82%', backgroundColor:'#fff', borderRadius: 16, padding: 18, alignItems:'center', shadowColor:'#000', shadowOpacity:0.2, shadowRadius:12, elevation:6 },
  modalIconWrap: { marginTop: -40, marginBottom: 8 },
  modalIconBg: { width: 64, height: 64, borderRadius: 32, alignItems:'center', justifyContent:'center' },
  modalTitle: { fontSize:18, fontWeight:'800', color:'#7C3AED', marginTop: 4, marginBottom: 8 },
  modalDesc: { color:'#475569', textAlign:'center' },
  modalCta: { marginTop: 14, width: '86%', borderRadius: 999, paddingVertical: 12, alignItems:'center' },
  modalCtaText: { color:'#fff', fontWeight:'800', textAlign:'center' },
  confettiLayer: { ...StyleSheet.absoluteFillObject },
  confettiSquare: { position:'absolute', width: 6, height: 6, opacity: 0.8, transform: [{ rotate: '15deg' }] },
});

export default NCCScreen;