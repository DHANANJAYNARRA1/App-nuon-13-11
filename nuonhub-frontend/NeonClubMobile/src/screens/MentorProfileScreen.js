import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const MentorProfileScreen = ({ route, navigation }) => {
  const { mentor } = route.params || {};
  if (!mentor) {
    return (
      <View style={styles.center}> 
        <Text style={{ color: '#fff' }}>Mentor not found.</Text>
      </View>
    );
  }

  const mentorSessions = mentor.sessionCount || mentor.sessions || mentor.totalBookings || 340;
  const mentorPrice = mentor.price || mentor.hourlyRate || mentor.sessionFee || 1999;
  const mentorRewardPoints = mentor.rewardPoints || 300;
  const specialization = Array.isArray(mentor.specialization) ? mentor.specialization.join(', ') : mentor.specialization || mentor.role;
  const organization = mentor.organization || mentor.hospital || '';
  const location = mentor.location || `${mentor.city || ''} ${mentor.state || ''}`.trim();
  const qualification = mentor.qualification || '';
  const department = mentor.department || '';

  return (
    <View style={{ flex:1, backgroundColor: '#0A0A0A' }}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Mentor Image */}
        <View style={styles.imageContainer}>
          {mentor.avatarUrl ? (
            <Image source={{ uri: mentor.avatarUrl }} style={styles.mentorImage} />
          ) : (
            <View style={styles.mentorImagePlaceholder} />
          )}
        </View>
        {/* Rating */}
        <View style={styles.ratingRow}>
          <Text style={{ fontSize: 18 }}>⭐</Text>
          <Text style={styles.ratingText}>{mentor.rating || 4.9} <Text style={{ color:'#64748b', fontWeight:'400' }}>(enrolled)</Text></Text>
        </View>
        {/* Mentor Badge */}
        <View style={styles.mentorBadge}>
          <Text style={styles.mentorBadgeText}>Mentor</Text>
        </View>
        {/* About */}
        <View style={styles.card}>
          <Text style={styles.name}>{mentor.name}</Text>
          <Text style={styles.role}>{specialization}</Text>
          {organization ? <Text style={styles.organization}>{organization}</Text> : null}
          {location ? <Text style={styles.location}>{location}</Text> : null}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{mentor.yearsOfExperience || 15}+ years experience</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{mentorSessions} sessions conducted</Text>
          </View>
          {qualification ? (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Qualification</Text>
              <Text style={styles.sectionText}>{qualification}</Text>
              {department ? <Text style={styles.sectionText}>{department} Department</Text> : null}
            </View>
          ) : null}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.sectionText}>{mentor.bio || 'Experienced healthcare professional dedicated to mentoring and supporting the next generation of nurses.'}</Text>
          </View>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>What You’ll Learn</Text>
            <View style={{ marginTop: 6 }}>
              <Text style={styles.learnItem}>• Comprehensive knowledge from industry experts</Text>
              <Text style={styles.learnItem}>• Practical skills and techniques</Text>
              <Text style={styles.learnItem}>• Networking opportunities with peers</Text>
              <Text style={styles.learnItem}>• Certificate of completion</Text>
              <Text style={styles.learnItem}>• Access to exclusive resources</Text>
            </View>
          </View>
        </View>
        {/* Price and Points */}
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>₹ {mentorPrice}</Text>
          <View style={styles.pointsBox}>
            <Text style={{ fontSize: 18 }}>🎁</Text>
            <Text style={styles.pointsText}>+{mentorRewardPoints} points</Text>
          </View>
        </View>
      </ScrollView>
      {/* Book Now Button */}
      <View style={styles.bookNowBar}>
        <TouchableOpacity style={styles.bookNowBtn} onPress={() => mentor._id && navigation.navigate('MentorAvailability', { mentorId: mentor._id, mentorName: mentor.name })}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  center: { flex:1, alignItems:'center', justifyContent:'center', backgroundColor: '#0A0A0A' },
  topBar: { flexDirection:'row', alignItems:'center', paddingTop: 18, paddingBottom: 10, paddingHorizontal: 10, backgroundColor: '#1A1A1A', borderBottomWidth: 1, borderBottomColor: '#333' },
  backBtn: { padding: 4, marginRight: 8 },
  imageContainer: { width: width, height: 180, backgroundColor: '#E0D7F8', justifyContent: 'center', alignItems: 'center' },
  mentorImage: { width: 120, height: 120, borderRadius: 16, marginTop: 30, borderWidth: 4, borderColor: '#fff', backgroundColor: '#fff' },
  mentorImagePlaceholder: { width: 120, height: 120, borderRadius: 16, marginTop: 30, backgroundColor: '#E5E7EB' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  ratingText: { fontSize: 16, color: '#F59E0B', fontWeight: 'bold', marginLeft: 6 },
  card: { backgroundColor: '#1A1A1A', borderRadius: 16, marginHorizontal: 16, marginTop: -40, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 2 },
  name: { fontSize: 20, fontWeight:'700', color: '#FFFFFF' },
  role: { color: '#A855F7', marginTop: 4, fontWeight: '600', fontSize: 15 },
  organization: { color: '#CCCCCC', marginTop: 2, fontSize: 14 },
  location: { color: '#AAAAAA', marginTop: 2, fontSize: 13 },
  metaRow: { flexDirection:'row', alignItems:'center', marginTop: 8 },
  metaText: { color: '#64748b', fontSize: 13 },
  metaDot: { color:'#CBD5E1', marginHorizontal: 8 },
  sectionCard: { backgroundColor: '#2A2A2A', borderRadius: 12, padding: 12, marginTop: 16 },
  sectionTitle: { fontWeight: 'bold', color: '#FFFFFF', fontSize: 15, marginBottom: 4 },
  sectionText: { color: '#CCCCCC', fontSize: 14, lineHeight: 20 },
  learnItem: { color: '#AAAAAA', fontSize: 14, marginBottom: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 18, backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 1 },
  priceText: { fontSize: 18, fontWeight: 'bold', color: '#A855F7' },
  pointsBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2A2A2A', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  pointsText: { color: '#A855F7', fontWeight: 'bold', marginLeft: 4 },
  mentorBadge: { backgroundColor: '#A855F7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, alignSelf: 'center', marginTop: 8 },
  mentorBadgeText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  bookNowBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#1A1A1A', padding: 16, borderTopWidth: 1, borderTopColor: '#333' },
  bookNowBtn: { backgroundColor: '#A855F7', borderRadius: 16, alignItems: 'center', paddingVertical: 16 },
  bookNowText: { color: '#000000', fontWeight: 'bold', fontSize: 16 },
});

export default MentorProfileScreen;
