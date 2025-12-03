
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const RescheduleSessionScreen = ({ navigation, route }) => {
  const session = route?.params?.session || {
    mentor: 'Dr. Sunita Verma',
    topic: 'Advanced Wound Care',
    currentDate: 'Nov 16, 2025',
    currentTime: '2:00 PM - 2:45 PM',
    image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableDates = [
    { date: '2025-11-16', day: 'Sun', dateNum: '16', month: 'Nov' },
    { date: '2025-11-17', day: 'Mon', dateNum: '17', month: 'Nov' },
    { date: '2025-11-18', day: 'Tue', dateNum: '18', month: 'Nov' },
    { date: '2025-11-19', day: 'Wed', dateNum: '19', month: 'Nov' },
    { date: '2025-11-20', day: 'Thu', dateNum: '20', month: 'Nov' },
  ];

  const timeSlots = {
    '2025-11-16': [
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '3:00 PM - 3:45 PM', available: false },
      { time: '5:00 PM - 5:45 PM', available: true },
    ],
    '2025-11-17': [
      { time: '10:00 AM - 10:45 AM', available: true },
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '4:00 PM - 4:45 PM', available: true },
    ],
    '2025-11-18': [
      { time: '11:00 AM - 11:45 AM', available: true },
      { time: '3:00 PM - 3:45 PM', available: true },
      { time: '6:00 PM - 6:45 PM', available: true },
    ],
    '2025-11-19': [
      { time: '10:00 AM - 10:45 AM', available: true },
      { time: '2:00 PM - 2:45 PM', available: true },
    ],
    '2025-11-20': [
      { time: '4:00 PM - 4:45 PM', available: true },
      { time: '5:00 PM - 5:45 PM', available: true },
    ],
  };

  useEffect(() => {
    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0].date);
    }
  }, []);

  const handleReschedule = () => {
    if (!selectedDate || !selectedSlot) return;
    const selectedDateObj = availableDates.find(d => d.date === selectedDate);
    setLoading(true);
    (async () => {
      try {
        const { mentorAPI } = require('../api/mentorAPI');
        const sessionId = sessionData?._id || sessionData?.id || null;
        if (sessionId && mentorAPI && typeof mentorAPI.rescheduleSession === 'function') {
          await mentorAPI.rescheduleSession(sessionId, selectedSlot);
        } else {
          await new Promise((r) => setTimeout(r, 600));
        }

        if (onCelebrate) {
          onCelebrate({
            title: 'Session Rescheduled! ✅',
            message: `Your session has been moved to ${selectedDateObj?.day}, ${selectedDateObj?.dateNum} ${selectedDateObj?.month} at ${selectedSlot}`,
            icon: 'star',
          });
        }

        onNavigate('mentorship');
      } catch (err) {
        console.error('Reschedule failed', err);
        if (onCelebrate) {
          onCelebrate({
            title: 'Reschedule Pending',
            message: 'We could not confirm the reschedule with the server. Please check your bookings.',
            icon: 'alert',
          });
        }
        onNavigate('mentorship');
      } finally {
        setLoading(false);
      }
    })();
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
        onPress={() => {
          setSelectedDate(dateObj.date);
          setSelectedSlot(null);
        }}
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
    const isSelected = selectedSlot === slot.time;
    return (
      <TouchableOpacity
        key={slot.time}
        style={[
          styles.timeSlot,
          !slot.available && styles.unavailableSlot,
          isSelected && styles.selectedSlot
        ]}
        onPress={() => slot.available && setSelectedSlot(slot.time)}
        disabled={!slot.available}
      >
        {isSelected && (
          <View style={styles.checkIcon}>
            <Icon name="check" size={12} color="#FFFFFF" />
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#8B5CF6', '#EC4899', '#F59E0B']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reschedule Session</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Current Session Info */}
          <View style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={styles.sessionIcon}>
                <Icon name="calendar" size={24} color="#8B5CF6" />
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionLabel}>Current Session</Text>
                <Text style={styles.sessionTopic}>{session.topic}</Text>
                <Text style={styles.sessionMentor}>with {session.mentor}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.currentDateTime}>
              <Icon name="clock" size={16} color="#6B7280" />
              <Text style={styles.dateTimeText}>
                {session.currentDate} • {session.currentTime}
              </Text>
            </View>
          </View>

          {/* Select New Date */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="calendar" size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Select New Date</Text>
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

          {/* Select New Time */}
          {selectedDate && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="clock" size={20} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Select New Time</Text>
              </View>
              <View style={styles.timeSlotsGrid}>
                {(timeSlots[selectedDate] || []).map(renderTimeSlot)}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedDate || !selectedSlot) && styles.disabledButton
          ]}
          onPress={handleReschedule}
          disabled={!selectedDate || !selectedSlot}
        >
          <LinearGradient
            colors={selectedDate && selectedSlot ? ['#8B5CF6', '#EC4899', '#F59E0B'] : ['#9CA3AF', '#9CA3AF']}
            style={styles.confirmButtonGradient}
          >
            <Icon name="refresh-cw" size={20} color="white" />
            <Text style={styles.confirmButtonText}>Confirm Reschedule</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  sessionTopic: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  sessionMentor: {
    fontSize: 14,
    color: '#8B5CF6',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  currentDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  dateScrollContainer: {
    marginHorizontal: -20,
  },
  dateScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dateCard: {
    width: 70,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedDateCard: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  dayText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  selectedDayText: {
    color: 'white',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  selectedDateNumber: {
    color: 'white',
  },
  monthText: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedMonthText: {
    color: 'white',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    width: (width - 40 - 12) / 2,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  selectedSlot: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3E8FF',
  },
  unavailableSlot: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  checkIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  selectedSlotText: {
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  unavailableSlotText: {
    color: '#9CA3AF',
  },
  bookedText: {
    fontSize: 10,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.6,
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default RescheduleSessionScreen;
