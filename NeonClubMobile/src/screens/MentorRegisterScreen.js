import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, Modal, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ImageBackground } from 'react-native';
import { MENTOR_HERO } from '../assets/heroImages';
import { mentorAPI } from '../services/api';
import SuccessModal from '../components/SuccessModal';
import { NEON_COLORS } from '../utils/colors';
import { launchImageLibrary } from 'react-native-image-picker';

const Field = ({ label, value, onChangeText, placeholder, keyboardType }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType={keyboardType}
      style={styles.input}
    />
  </View>
);

const MentorRegisterScreen = ({ navigation }) => {
  // Personal Information
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Professional Details
  const [currentHospital, setCurrentHospital] = useState('');
  const [experience, setExperience] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  // Additional
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [expPickerOpen, setExpPickerOpen] = useState(false);
  const [specPickerOpen, setSpecPickerOpen] = useState(false);

  const experienceOptions = ['5–7 years', '7–10 years', '10–15 years', '15+ years'];
  const specializationOptions = ['Critical Care', 'Emergency', 'Pediatric', 'Oncology', 'Cardiac', 'Other'];

  const onSubmit = async () => {
    // Client-side validation
    const errs = [];
    const phoneNorm = (phone || '').replace(/\s|-/g, '');
    const emailNorm = (email || '').trim();
    if (!name.trim()) errs.push('Full Name is required');
    if (!phoneNorm || !/^\+?\d{10,15}$/.test(phoneNorm)) errs.push('Valid Phone Number is required');
    if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) errs.push('Valid Email is required');
    if (!currentHospital.trim()) errs.push('Current Hospital/Clinic is required');
    if (!experience) errs.push('Years of Experience is required');
    if (!specialization) errs.push('Specialization is required');
    if (!registrationNumber.trim()) errs.push('Registration Number is required');
    if (!bio.trim() || bio.trim().length < 20) errs.push('Tell us more in the “Additional Information” (min 20 characters)');
    if (errs.length) { Alert.alert('Please fix the following', errs.join('\n')); return; }
    setSubmitting(true);
    try {
      // Build FormData if photo selected
      const hasPhoto = !!photo;
      if (hasPhoto) {
        const fd = new FormData();
        fd.append('name', name);
        fd.append('phone', phone);
        fd.append('email', email);
        fd.append('specialization', specialization);
        fd.append('experience', experience);
        fd.append('currentHospital', currentHospital);
        fd.append('registrationNumber', registrationNumber);
        fd.append('bio', bio);
        // RN requires file object with uri, type, name
        fd.append('photo', { uri: photo.uri, type: photo.type || 'image/jpeg', name: photo.fileName || 'mentor.jpg' });
        await mentorAPI.apply(fd);
      } else {
        await mentorAPI.apply({
          name,
          phone: phoneNorm,
          email: emailNorm,
          specialization,
          experience,
          currentHospital,
          registrationNumber,
          bio,
        });
      }
      setSuccessVisible(true);
    } catch (e) {
      Alert.alert('Failed', 'Could not submit right now. Please try again shortly.');
    } finally {
      setSubmitting(false);
    }
  };

  const pickPhoto = async () => {
    try {
      const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.9, includeBase64: false });
      if (res?.assets && res.assets.length) {
        const asset = res.assets[0];
        setPhoto(asset);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SuccessModal
        visible={successVisible}
        title="Application submitted"
        message="Thanks! Our team will review your application and get back to you."
        buttonText="Explore Mentors"
        onClose={() => { setSuccessVisible(false); navigation.replace('Mentors'); }}
      />
      {/* Header */}
      <LinearGradient colors={['#06B6D4', '#14B8A6', '#10B981']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.header}>
        <TouchableOpacity onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main'))} style={{ padding: 6 }}>
          <Text style={{ color:'#fff', fontSize: 24 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply as a Mentor</Text>
        <Text style={styles.headerSub}>Share your expertise with fellow nurses</Text>
      </LinearGradient>

      {/* Visual hero (top) with face photo picker */}
      <ImageBackground source={{ uri: MENTOR_HERO }} style={styles.heroCard} imageStyle={{ borderRadius: 16 }}>
        <View style={styles.heroOverlay} />
        <View style={{ flexDirection:'row', alignItems:'center' }}>
          <TouchableOpacity onPress={pickPhoto} activeOpacity={0.8} style={styles.photoCircle}>
            {photo ? (
              <Image source={{ uri: photo.uri }} style={{ width: '100%', height: '100%', borderRadius: 999 }} />
            ) : (
              <Text style={{ fontSize: 28 }}>👩‍⚕️</Text>
            )}
          </TouchableOpacity>
          <View style={{ flex:1 }}>
            <Text style={[styles.heroTitle, { color:'#fff' }]}>Become a Champion Mentor</Text>
            <Text style={[styles.heroSub, { color:'#F8FAFC' }]}>Guide learners, host sessions, and shape careers.</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Form */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Section: Express Your Interest */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTitle}>Express Your Interest</Text>
          <Text style={styles.noticeSub}>Submit your details and our team will review your profile for direct enrollment in premium programmes and exclusive opportunities.</Text>
        </View>

        {/* Section: Personal Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <Field label="Full Name *" value={name} onChangeText={setName} placeholder="Enter your full name" />
          <View style={{ flexDirection:'row', gap: 12 }}>
            <View style={{ flex:1 }}>
              <Field label="Phone Number *" value={phone} onChangeText={setPhone} placeholder="+91 XXXXX XXXXX" keyboardType="phone-pad" />
            </View>
            <View style={{ flex:1 }}>
              <Field label="Email *" value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" />
            </View>
          </View>
        </View>

        {/* Section: Professional Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Professional Details</Text>
          <Field label="Current Hospital/Clinic *" value={currentHospital} onChangeText={setCurrentHospital} placeholder="Your workplace" />
          <View style={{ flexDirection:'row', gap: 12 }}>
            <View style={{ flex:1 }}>
              <Text style={styles.label}>Years of Experience *</Text>
              <TouchableOpacity style={styles.select} onPress={() => setExpPickerOpen(true)}>
                <Text style={{ color: experience ? '#111827' : '#9CA3AF' }}>{experience || 'Select'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.label}>Specialization *</Text>
              <TouchableOpacity style={styles.select} onPress={() => setSpecPickerOpen(true)}>
                <Text style={{ color: specialization ? '#111827' : '#9CA3AF' }}>{specialization || 'Select'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Field label="Nursing Registration Number *" value={registrationNumber} onChangeText={setRegistrationNumber} placeholder="Registration number" />
        </View>

        {/* Section: Additional Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Additional Information</Text>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>What interests you most about Neon Club? *</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about your professional goals and why you’d like direct access..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
            />
          </View>
        </View>

        {/* Availability removed per request */}

        <LinearGradient colors={[NEON_COLORS.neonPurple, NEON_COLORS.neonBlue]} start={{x:0,y:0}} end={{x:1,y:1}} style={[styles.submitBtn, submitting && { opacity: 0.6 }]}>
          <TouchableOpacity onPress={onSubmit} disabled={submitting}>
            <Text style={styles.submitText}>{submitting ? 'Submitting…' : 'Submit Application'}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>

      {/* Experience Picker Modal */}
      <Modal visible={expPickerOpen} transparent animationType="fade" onRequestClose={() => setExpPickerOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Experience</Text>
            {experienceOptions.map((opt) => (
              <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => { setExperience(opt); setExpPickerOpen(false); }}>
                <Text style={styles.modalOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setExpPickerOpen(false)} style={[styles.modalOption, { marginTop: 8 }]}>
              <Text style={[styles.modalOptionText, { color: '#475569' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Specialization Picker Modal */}
      <Modal visible={specPickerOpen} transparent animationType="fade" onRequestClose={() => setSpecPickerOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Specialization</Text>
            {specializationOptions.map((opt) => (
              <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => { setSpecialization(opt); setSpecPickerOpen(false); }}>
                <Text style={styles.modalOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setSpecPickerOpen(false)} style={[styles.modalOption, { marginTop: 8 }]}>
              <Text style={[styles.modalOptionText, { color: '#475569' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingTop: 36, paddingBottom: 16, paddingHorizontal: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  headerTitle: { color:'#fff', fontSize: 18, fontWeight: '800', marginTop: 4 },
  headerSub: { color:'#E5E7EB', marginTop: 6 },
  heroCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 14, overflow:'hidden', ...Platform.select({ android: { elevation: 2 }, ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } } }) },
  photoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor:'#fff', alignItems:'center', justifyContent:'center', marginRight: 12, overflow:'hidden' },
  heroTitle: { fontWeight:'800', color:'#111827' },
  heroSub: { color:'#374151', marginTop: 2 },
  heroOverlay: { position:'absolute', left:0, right:0, top:0, bottom:0, backgroundColor:'rgba(0,0,0,0.35)' },
  container: { padding: 16, paddingBottom: 24 },
  card: { backgroundColor:'#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  noticeCard: { backgroundColor:'#F1F5F9', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginHorizontal: 16, marginBottom: 12 },
  noticeTitle: { color:'#0F172A', fontWeight:'800', marginBottom: 6 },
  noticeSub: { color:'#475569' },
  cardTitle: { color:'#111827', fontWeight:'800', marginBottom: 8 },
  label: { color: '#111827', fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS==='ios'?14:10, color:'#111827' },
  select: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS==='ios'?14:12, justifyContent:'center' },
  submitBtn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#fff', fontWeight: '800', textAlign:'center' },
  modalBackdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center', padding: 24 },
  modalCard: { width: '100%', backgroundColor:'#fff', borderRadius: 16, padding: 16 },
  modalTitle: { fontWeight:'800', color:'#0F172A', marginBottom: 8 },
  modalOption: { paddingVertical: 12, borderBottomColor: '#E5E7EB', borderBottomWidth: 1 },
  modalOptionText: { color:'#111827' },
});

export default MentorRegisterScreen;
