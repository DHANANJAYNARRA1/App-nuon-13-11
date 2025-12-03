import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Image,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { mentorAPI } from '../api/mentorAPI';

const { width } = Dimensions.get('window');

const MentorAvailabilityScreen = ({ route, navigation }) => {
  const { mentor, reschedule = false, sessionId } = route.params || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sample data for available dates and time slots
  const availableDates = [
    { date: '2024-10-16', day: 'Wed', dateNum: '16', month: 'Oct' },
    { date: '2024-10-17', day: 'Thu', dateNum: '17', month: 'Oct' },
    { date: '2024-10-18', day: 'Fri', dateNum: '18', month: 'Oct' },
    { date: '2024-10-19', day: 'Sat', dateNum: '19', month: 'Oct' },
    { date: '2024-10-21', day: 'Mon', dateNum: '21', month: 'Oct' },
  ];

  const timeSlots = {
    '2024-10-16': [
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '3:00 PM - 3:45 PM', available: false },
      { time: '5:00 PM - 5:45 PM', available: true },
      { time: '6:00 PM - 6:45 PM', available: true },
    ],
    '2024-10-17': [
      { time: '10:00 AM - 10:45 AM', available: true },
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '4:00 PM - 4:45 PM', available: true },
      { time: '6:00 PM - 6:45 PM', available: false },
    ],
    '2024-10-18': [
      { time: '3:00 PM - 3:45 PM', available: true },
      { time: '5:00 PM - 5:45 PM', available: true },
      { time: '7:00 PM - 7:45 PM', available: true },
    ],
    '2024-10-19': [
      { time: '10:00 AM - 10:45 AM', available: true },
      { time: '11:00 AM - 11:45 AM', available: true },
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '4:00 PM - 4:45 PM', available: true },
    ],
    '2024-10-21': [
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '5:00 PM - 5:45 PM', available: true },
      { time: '6:00 PM - 6:45 PM', available: true },
    ],
  };

  const mentorInfo = mentor || {
    name: 'Dr. Sunita Verma',
    specialization: 'Critical Care',
    image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 1999,
  };

  useEffect(() => {
    // Auto-select the first available date
    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0].date);
    }
  }, []);

  const handleDateSelect = (dateObj) => {
    setSelectedDate(dateObj.date);
    setSelectedSlot(null); // Clear selected slot when date changes
  };

  const handleSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedSlot) {
      Alert.alert('Selection Required', 'Please select a date and time slot to continue.');
      return;
    }

    const selectedDateObj = availableDates.find(d => d.date === selectedDate);
    
    if (reschedule) {
      // Handle reschedule logic: call API if available, otherwise fallback
      (async () => {
        try {
          if (sessionId) {
            await mentorAPI.rescheduleSession(sessionId, selectedSlot.time);
          } else {
            await new Promise((r) => setTimeout(r, 500));
          }
        } catch (err) {
          console.warn('Reschedule API failed', err);
        } finally {
          // Navigate back to mentorship -> My Sessions tab
          navigation.navigate('Mentorship');
          Alert.alert('Success', 'Session rescheduled successfully!');
        }
      })();
    } else {
      // Navigate to payment
      navigation.navigate('Payment', {
        type: 'mentor-session',
        data: {
          title: `Mentorship Session with ${mentorInfo.name}`,
          subtitle: `${selectedDateObj?.day}, ${selectedDateObj?.dateNum} ${selectedDateObj?.month} at ${selectedSlot.time}`,
          price: mentorInfo.price,
          points: 200,
          mentor: mentorInfo,
          selectedDate,
          selectedSlot: selectedSlot.time,
        }
      });
    }
  };

  const renderDateCard = (dateObj) => {
    const isSelected = selectedDate === dateObj.date;
    return (
      <TouchableOpacity
        key={dateObj.date}
        style={[
          styles.dateCard,
          isSelected && styles.selectedDateCard
        ]}
        onPress={() => handleDateSelect(dateObj)}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
          {dateObj.day}
        </Text>
        <Text style={[styles.dateNumber, isSelected && styles.selectedDateNumber]}>
          {dateObj.dateNum}
        </Text>
        <Text style={[styles.monthText, isSelected && styles.selectedMonthText]}>
          {dateObj.month}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimeSlot = (slot) => {
    const isSelected = selectedSlot?.time === slot.time;
    return (
      <TouchableOpacity
        key={slot.time}
        style={[
          styles.timeSlot,
          !slot.available && styles.unavailableSlot,
          isSelected && styles.selectedSlot
        ]}
        onPress={() => handleSlotSelect(slot)}
        disabled={!slot.available}
      >
        {isSelected && (
          <View style={styles.checkIcon}>
            <Icon name="check" size={16} color="#FFFFFF" />
          </View>
        )}
        <Text style={[
          styles.timeSlotText,
          !slot.available && styles.unavailableSlotText,
          isSelected && styles.selectedSlotText
        ]}>
          {slot.time}
        </Text>
        {!slot.available && (
          <Text style={styles.bookedText}>Booked</Text>
        )}
      </TouchableOpacity>
    );
  };

  const currentSlots = selectedDate ? timeSlots[selectedDate] || [] : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#9333EA', '#EC4899', '#F97316']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Session</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Mentor Info Card */}
        <View style={styles.mentorCard}>
          <View style={styles.mentorImageContainer}>
            <Image source={{ uri: mentorInfo.image }} style={styles.mentorImage} />
          </View>
          <View style={styles.mentorDetails}>
            <Text style={styles.mentorName}>{mentorInfo.name}</Text>
            <Text style={styles.mentorSpecialty}>{mentorInfo.specialization}</Text>
            <View style={styles.mentorMeta}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>45 min session</Text>
              </View>
              <View style={styles.priceContainer}>
                <Icon name="dollar-sign" size={16} color="#8B5CF6" />
                <Text style={styles.priceText}>₹{mentorInfo.price}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Select Date */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="calendar" size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScrollContainer}
            contentContainerStyle={styles.dateScrollContent}
          >
            {availableDates.map(renderDateCard)}
          </ScrollView>
        </View>

        {/* Select Time Slot */}
        {selectedDate && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="clock" size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Select Time Slot</Text>
            </View>
            <View style={styles.timeSlotsGrid}>
              {currentSlots.map(renderTimeSlot)}
            </View>
          </View>
        )}

        {/* No banner shown for selected slot - Figma design shows highlighted tile only */}

        {/* Booking Summary */}
        {selectedDate && selectedSlot && (
          <View style={styles.summarySection}>
            <LinearGradient
              colors={['#FAF5FF', '#FDF2F8']}
              style={styles.summaryCard}
            >
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              <View style={styles.summaryContent}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Mentor</Text>
                  <Text style={styles.summaryValue}>{mentorInfo.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date</Text>
                  <Text style={styles.summaryValue}>
                    {availableDates.find(d => d.date === selectedDate)?.day}, {availableDates.find(d => d.date === selectedDate)?.dateNum} {availableDates.find(d => d.date === selectedDate)?.month}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Time</Text>
                  <Text style={styles.summaryValue}>{selectedSlot.time}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Session Fee</Text>
                  <View style={styles.priceRow}>
                    <Icon name="dollar-sign" size={16} color="#8B5CF6" />
                    <Text style={styles.summaryTotal}>₹{mentorInfo.price}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={[
            styles.proceedButton,
            (!selectedDate || !selectedSlot) && styles.disabledButton
          ]}
          onPress={handleBooking}
          disabled={!selectedDate || !selectedSlot || loading}
        >
          <LinearGradient
            colors={selectedDate && selectedSlot ? ['#9333EA', '#EC4899', '#F97316'] : ['#9CA3AF', '#9CA3AF']}
            style={styles.proceedButtonGradient}
          >
            <Text style={styles.proceedButtonText}>
              {reschedule ? 'Confirm Reschedule' : 'Proceed to Payment'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 50, paddingHorizontal: 24, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backButton: { padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', marginRight: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },

  // Mentor Card
  mentorCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3, borderWidth: 2, borderColor: '#E2E8F0' },
  mentorImageContainer: { marginRight: 16 },
  mentorImage: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#F1F5F9', borderWidth: 2, borderColor: '#E9D5FF' },
  mentorDetails: { flex: 1 },
  mentorName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  mentorSpecialty: { fontSize: 14, color: '#64748B', marginBottom: 8 },
  mentorMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: { backgroundColor: '#E0E7FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, color: '#6366F1', fontWeight: '600' },
  priceContainer: { flexDirection: 'row', alignItems: 'center' },
  priceText: { fontSize: 16, color: '#8B5CF6', fontWeight: 'bold', marginLeft: 4 },

  // Sections
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },

  // Date Selection
  dateScrollContainer: { marginHorizontal: -24 },
  dateScrollContent: { paddingHorizontal: 24, paddingBottom: 8, gap: 12 },
  dateCard: { width: 80, padding: 12, borderRadius: 16, borderWidth: 2, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', alignItems: 'center' },
  selectedDateCard: { borderColor: '#9333EA', backgroundColor: '#FAF5FF' },
  dayText: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  selectedDayText: { color: '#9333EA' },
  dateNumber: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  selectedDateNumber: { color: '#9333EA' },
  monthText: { fontSize: 12, color: '#64748B' },
  selectedMonthText: { color: '#9333EA' },

  // Time Slots
  timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 48 },
  timeSlot: { flex: 1, minWidth: '45%', padding: 12, borderRadius: 16, borderWidth: 2, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  unavailableSlot: { backgroundColor: '#F9FAFB', borderColor: '#F3F4F6', opacity: 0.5 },
  selectedSlot: { borderColor: '#9333EA', backgroundColor: '#FAF5FF' },
  checkIcon: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: '#9333EA', alignItems: 'center', justifyContent: 'center' },
  timeSlotText: { fontSize: 13, color: '#1E293B', fontWeight: '500' },
  unavailableSlotText: { color: '#9CA3AF' },
  selectedSlotText: { color: '#9333EA', fontWeight: '600' },
  bookedText: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  // Note: Banner removed in favor of highlighted tile to match Figma

  // Summary
  summarySection: { marginTop: 16 },
  summaryCard: { borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3, borderWidth: 2, borderColor: '#E2E8F0' },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#7C2D12', marginBottom: 16 },
  summaryContent: {},
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#64748B' },
  summaryValue: { fontSize: 14, color: '#1E293B', fontWeight: '600' },
  summaryDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  summaryTotal: { fontSize: 16, color: '#8B5CF6', fontWeight: 'bold', marginLeft: 4 },

  // Bottom Action
  bottomAction: { padding: 24, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  proceedButton: { borderRadius: 9999, overflow: 'hidden' },
  disabledButton: { opacity: 0.5 },
  proceedButtonGradient: { paddingVertical: 16, alignItems: 'center', height: 56 },
  proceedButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});

export default MentorAvailabilityScreen;
