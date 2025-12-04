import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const BookingSummaryScreen = ({ route, navigation }) => {
  const {
    mentorName,
    mentorAvatar,
    mentorSpecialty,
    mentorPrice = 1999,
    mentorDuration = '45 min session',
    date,
    time,
    sessionFee = 1999,
    mentorId,
    bookingId
  } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.mentorCard}>
        <Image source={{ uri: mentorAvatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.mentorName}>{mentorName}</Text>
          <Text style={styles.mentorSpecialty}>{mentorSpecialty}</Text>
          <Text style={styles.mentorDuration}>{mentorDuration}</Text>
        </View>
        <Text style={styles.sessionFee}>₹{mentorPrice}</Text>
      </View>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Mentor</Text>
          <Text style={styles.value}>{mentorName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{date}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{time}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Session Fee</Text>
          <Text style={styles.value}>₹{sessionFee}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.proceedBtn}
        onPress={() => navigation.navigate('PaymentScreen', {
          mentorId,
          mentorName,
          mentorAvatar,
          mentorSpecialty,
          mentorPrice,
          mentorDuration,
          date,
          time,
          bookingId
        })}
      >
        <Text style={styles.proceedBtnText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  mentorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
  mentorName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  mentorSpecialty: { fontSize: 14, color: '#6366F1', marginTop: 2 },
  mentorDuration: { fontSize: 13, color: '#64748B', marginTop: 2 },
  sessionFee: { fontSize: 18, fontWeight: 'bold', color: '#7C3AED' },
  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#7C3AED', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#64748B', fontSize: 15 },
  value: { color: '#222', fontWeight: 'bold', fontSize: 15 },
  proceedBtn: {
    backgroundColor: 'linear-gradient(90deg, #7C3AED 0%, #F472B6 100%)',
    backgroundColor: '#7C3AED',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  proceedBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
});

export default BookingSummaryScreen;
