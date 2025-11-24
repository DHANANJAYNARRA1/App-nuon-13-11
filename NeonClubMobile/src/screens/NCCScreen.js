import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NCC_HERO } from '../assets/heroImages';
import { nccAPI } from '../services/api';

const NCCScreen = ({ navigation }) => {
  const [uiNumber, setUiNumber] = useState(null);

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
    <ScrollView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#6D28D9", "#EC4899", "#F97316"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => (navigation.canGoBack()? navigation.goBack() : navigation.navigate('Main'))} style={styles.backBtn}>
            <Text style={{ color:'#fff', fontSize:24 }}>‹</Text>
          </TouchableOpacity>
          <View style={{ flexDirection:'row', alignItems:'center', gap:6, flex:1 }}>
            <Text style={{ fontSize:20 }}>🪔</Text>
            <Text style={styles.headerTitle}>Nightingale Programme</Text>
          </View>
          {uiNumber ? (
            <View style={styles.uiPill}><Text style={styles.uiPillText}>UI No: {String(uiNumber)}</Text></View>
          ) : null}
        </View>
        <Text style={styles.headerSub}>Champion Mentor Certification</Text>
      </LinearGradient>

      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 }}>
        {/* Hero Card with Coming Soon */}
        <ImageBackground source={{ uri: NCC_HERO }} style={styles.heroCard} imageStyle={{ borderRadius:24 }}>
          <LinearGradient 
            colors={['rgba(109,40,217,0.8)', 'rgba(236,72,153,0.8)', 'rgba(249,115,22,0.8)']} 
            start={{x:0,y:0}} 
            end={{x:1,y:1}} 
            style={styles.heroOverlay}
          >
            <View style={styles.heroIcon}>
              <Text style={{ fontSize:48 }}>🪔</Text>
            </View>
            <Text style={styles.heroTitle}>The Nightingale Programme</Text>
            <Text style={styles.heroDesc}>
              Follow in the footsteps of Florence Nightingale. Become a certified Champion Mentor and light the way for the next generation of nurses.
            </Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>Coming Soon in Phase 2</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Thank You Message */}
        <LinearGradient 
          colors={['#FAF5FF', '#FCE7F3', '#FFF7ED']} 
          start={{x:0,y:0}} 
          end={{x:1,y:1}} 
          style={[styles.cardSoft, { borderWidth:2, borderColor:'#E9D5FF' }]}
        >
          <View style={[styles.sparkleIcon, { alignSelf:'center', marginBottom:12 }]}>
            <Text style={{ fontSize:40 }}>✨</Text>
          </View>
          <Text style={[styles.cardTitle, { textAlign:'center', marginBottom:12 }]}>Thank You for Your Interest!</Text>
          <Text style={[styles.cardDesc, { textAlign:'center', marginBottom:8 }]}>
            We're excited about your enthusiasm to become a Champion Mentor. The Nightingale Programme will be launched soon as part of Phase 2 of NUON.
          </Text>
          <Text style={[styles.cardDescSmall, { textAlign:'center' }]}>
            We'll notify you as soon as enrollments open. Stay tuned! 🎉
          </Text>
        </LinearGradient>

        {/* Nightingale Values */}
        <LinearGradient 
          colors={['#FAF5FF', '#FCE7F3']} 
          start={{x:0,y:0}} 
          end={{x:1,y:1}} 
          style={[styles.cardSoft, { borderWidth:2, borderColor:'#F3E8FF' }]}
        >
          <View style={{ flexDirection:'row', alignItems:'center', gap:8, marginBottom:12 }}>
            <Text style={{ fontSize:20 }}>❤️</Text>
            <Text style={styles.cardTitle}>The Nightingale Values</Text>
          </View>
          {[
            { title: 'Compassionate Leadership', desc: 'Lead with empathy and understanding', color:'#9333EA' },
            { title: 'Knowledge Sharing', desc: 'Illuminate others with your wisdom', color:'#EC4899' },
            { title: 'Professional Excellence', desc: 'Maintain the highest standards', color:'#F97316' },
            { title: 'Continuous Growth', desc: 'Never stop learning and improving', color:'#F59E0B' },
          ].map((item, idx) => (
            <View key={idx} style={styles.valueRow}>
              <View style={[styles.valueDot, { backgroundColor:item.color }]} />
              <View style={{ flex:1 }}>
                <Text style={styles.valueTitle}>{item.title}</Text>
                <Text style={styles.valueDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </LinearGradient>

        {/* Champion Mentor Benefits */}
        <LinearGradient 
          colors={['#FFFBEB', '#FEF3C7']} 
          start={{x:0,y:0}} 
          end={{x:1,y:1}} 
          style={[styles.cardSoft, { borderWidth:2, borderColor:'#FDE68A' }]}
        >
          <Text style={[styles.cardTitle, { marginBottom:12 }]}>Champion Mentor Benefits</Text>
          {[
            { title: 'Official Certification', desc: 'Recognized Nightingale Champion Mentor status', icon:'💡' },
            { title: 'Guide Future Nurses', desc: 'Mentor and inspire the next generation', icon:'👥' },
            { title: 'Earn While You Mentor', desc: 'Get paid for sessions + 2x reward points', icon:'🏆' },
            { title: 'Elite Network Access', desc: 'Join the community of healthcare leaders', icon:'✨' },
          ].map((item, idx) => (
            <View key={idx} style={styles.benefitRow}>
              <Text style={{ fontSize:20 }}>{item.icon}</Text>
              <View style={{ flex:1 }}>
                <Text style={styles.benefitTitle}>{item.title}</Text>
                <Text style={styles.benefitDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </LinearGradient>

        {/* The Nightingale Journey - 3 Steps */}
        <View style={styles.cardSoft}>
          <Text style={[styles.cardTitle, { marginBottom:4 }]}>The Nightingale Journey</Text>
          <Text style={[styles.cardDesc, { marginBottom:16 }]}>3 transformative steps to mentorship</Text>
          
          {/* Step 1 */}
          <View style={styles.stepRow}>
            <LinearGradient 
              colors={['#9333EA', '#A855F7']} 
              start={{x:0,y:0}} 
              end={{x:1,y:1}} 
              style={styles.stepIcon}
            >
              <Text style={{ fontSize:24 }}>📄</Text>
            </LinearGradient>
            <View style={{ flex:1 }}>
              <View style={[styles.stepBadge, { backgroundColor:'#F3F4F6' }]}>
                <Text style={[styles.stepBadgeText, { color:'#6B7280' }]}>Step 1</Text>
              </View>
              <Text style={styles.stepTitle}>Assessment Questionnaire</Text>
              <Text style={styles.stepDesc}>Evaluate your expertise and readiness</Text>
            </View>
          </View>
          
          <View style={styles.stepConnector} />
          
          {/* Step 2 */}
          <View style={styles.stepRow}>
            <LinearGradient 
              colors={['#EC4899', '#F472B6']} 
              start={{x:0,y:0}} 
              end={{x:1,y:1}} 
              style={styles.stepIcon}
            >
              <Text style={{ fontSize:24 }}>👥</Text>
            </LinearGradient>
            <View style={{ flex:1 }}>
              <View style={[styles.stepBadge, { backgroundColor:'#F3F4F6' }]}>
                <Text style={[styles.stepBadgeText, { color:'#6B7280' }]}>Step 2</Text>
              </View>
              <Text style={styles.stepTitle}>Workshop & Interview</Text>
              <Text style={styles.stepDesc}>Live evaluation with expert panel</Text>
            </View>
          </View>
          
          <View style={styles.stepConnector} />
          
          {/* Step 3 */}
          <View style={styles.stepRow}>
            <LinearGradient 
              colors={['#F97316', '#FB923C']} 
              start={{x:0,y:0}} 
              end={{x:1,y:1}} 
              style={styles.stepIcon}
            >
              <Text style={{ fontSize:24 }}>🎓</Text>
            </LinearGradient>
            <View style={{ flex:1 }}>
              <View style={[styles.stepBadge, { backgroundColor:'#F3F4F6' }]}>
                <Text style={[styles.stepBadgeText, { color:'#6B7280' }]}>Step 3</Text>
              </View>
              <Text style={styles.stepTitle}>Leadership Programme</Text>
              <Text style={styles.stepDesc}>4-week intensive mentoring training</Text>
            </View>
          </View>
          
          <View style={styles.stepConnector} />
          
          {/* Final */}
          <View style={styles.stepRow}>
            <LinearGradient 
              colors={['#F59E0B', '#FBBF24']} 
              start={{x:0,y:0}} 
              end={{x:1,y:1}} 
              style={styles.stepIcon}
            >
              <Text style={{ fontSize:24 }}>🪔</Text>
            </LinearGradient>
            <View style={{ flex:1 }}>
              <View style={[styles.stepBadge, { backgroundColor:'#FEF3C7' }]}>
                <Text style={[styles.stepBadgeText, { color:'#92400E' }]}>Final</Text>
              </View>
              <Text style={styles.stepTitle}>Nightingale Certification</Text>
              <Text style={styles.stepDesc}>Receive your Champion Mentor certificate</Text>
            </View>
          </View>
        </View>

        {/* Return to Dashboard Button */}
        <LinearGradient 
          colors={['#6D28D9', '#EC4899', '#F97316']} 
          start={{x:0,y:0}} 
          end={{x:1,y:0}} 
          style={styles.ctaButton}
        >
          <TouchableOpacity 
            style={{ paddingVertical:18, width:'100%', alignItems:'center' }}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.ctaText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.footerNote}>
          Want to be notified when we launch? Make sure your notification preferences are enabled in your profile.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: { 
    paddingTop: 48, 
    paddingBottom: 24, 
    paddingHorizontal: 24, 
    borderBottomLeftRadius: 32, 
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8,
  },
  backBtn: { 
    marginRight: 8,
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '800',
  },
  uiPill: { 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 999,
    marginLeft: 8,
  },
  uiPillText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 12,
  },
  headerSub: { 
    color: 'rgba(255,255,255,0.90)', 
    marginLeft: 50,
    fontSize: 14,
  },
  
  // Hero Card
  heroCard: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  heroOverlay: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  comingSoonBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 0,
  },
  comingSoonText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 14,
  },
  
  // Cards
  cardSoft: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  cardDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  cardDescSmall: {
    fontSize: 13,
    color: '#64748B',
  },
  
  sparkleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(147,51,234,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Values Section
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 12,
  },
  valueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  valueDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  
  // Benefits Section
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 12,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  
  // Journey Steps
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 6,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  stepConnector: {
    width: 2,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginLeft: 23,
    marginVertical: 8,
  },
  
  // CTA Button
  ctaButton: {
    borderRadius: 999,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  
  footerNote: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
});

export default NCCScreen;