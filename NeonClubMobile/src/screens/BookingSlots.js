import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const BookingSlots = ({ navigation, route }) => {
  const { mentorData } = route.params || {};
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);

  useEffect(() => {
    // Check if profile is incomplete (you can implement this logic)
    // For now, we'll skip this
  }, []);

  const mentor = mentorData || {
    name: 'Dr. Sunita Verma',
    specialization: 'Critical Care',
    image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBudXJzZSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzYwMzQ1MzQ1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 1999,
  };

  const availableDates = [
    { date: '2024-11-16', day: 'Sat', dateNum: '16', month: 'Nov' },
    { date: '2024-11-17', day: 'Sun', dateNum: '17', month: 'Nov' },
    { date: '2024-11-18', day: 'Mon', dateNum: '18', month: 'Nov' },
    { date: '2024-11-19', day: 'Tue', dateNum: '19', month: 'Nov' },
    { date: '2024-11-21', day: 'Thu', dateNum: '21', month: 'Nov' },
  ];

  const timeSlots = {
    '2024-11-16': [
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '3:00 PM - 3:45 PM', available: false },
      { time: '5:00 PM - 5:45 PM', available: true },
      { time: '6:00 PM - 6:45 PM', available: true },
    ],
    '2024-11-17': [
      { time: '10:00 AM - 10:45 AM', available: true },
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '4:00 PM - 4:45 PM', available: true },
      { time: '6:00 PM - 6:45 PM', available: false },
    ],
    '2024-11-18': [
      { time: '3:00 PM - 3:45 PM', available: true },
      { time: '5:00 PM - 5:45 PM', available: true },
      { time: '7:00 PM - 7:45 PM', available: true },
    ],
    '2024-11-19': [
      { time: '10:00 AM - 10:45 AM', available: true },
      { time: '11:00 AM - 11:45 AM', available: true },
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '4:00 PM - 4:45 PM', available: true },
    ],
    '2024-11-21': [
      { time: '2:00 PM - 2:45 PM', available: true },
      { time: '5:00 PM - 5:45 PM', available: true },
      { time: '6:00 PM - 6:45 PM', available: true },
    ],
  };

  const handleBooking = () => {
    if (selectedDate && selectedSlot) {
      const selectedDateObj = availableDates.find(d => d.date === selectedDate);
      navigation.navigate('Payment', {
        paymentData: {
          type: 'mentor-session',
          title: `Mentorship Session with ${mentor.name}`,
          subtitle: `${selectedDateObj?.day}, ${selectedDateObj?.dateNum} ${selectedDateObj?.month} at ${selectedSlot}`,
          price: mentor.price,
          points: 200,
          mentorData: mentor,
          sessionData: {
            date: selectedDate,
            time: selectedSlot,
            mentor: mentor,
          }
        }
      });
    }
  };

  const renderDateButton = (dateObj) => (
    <TouchableOpacity
      key={dateObj.date}
      style={[
        styles.dateButton,
        selectedDate === dateObj.date && styles.selectedDateButton
      ]}
      onPress={() => {
        setSelectedDate(dateObj.date);
        setSelectedSlot(null); // Reset slot when date changes
      }}
    >
      <Text style={[
        styles.dateDay,
        selectedDate === dateObj.date && styles.selectedDateText
      ]}>
        {dateObj.day}
      </Text>
      <Text style={[
        styles.dateNum,
        selectedDate === dateObj.date && styles.selectedDateText
      ]}>
        {dateObj.dateNum}
      </Text>
      <Text style={[
        styles.dateMonth,
        selectedDate === dateObj.date && styles.selectedDateText
      ]}>
        {dateObj.month}
      </Text>
    </TouchableOpacity>
  );

  const renderTimeSlot = (slot, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.timeSlot,
        selectedSlot === slot.time && styles.selectedTimeSlot,
        !slot.available && styles.unavailableTimeSlot
      ]}
      onPress={() => slot.available && setSelectedSlot(slot.time)}
      disabled={!slot.available}
    >
      {selectedSlot === slot.time && (
        <View style={styles.checkIcon}>
          <Icon name="check" size={12} color="white" />
        </View>
      )}
      <Text style={[
        styles.timeSlotText,
        selectedSlot === slot.time && styles.selectedTimeSlotText,
        !slot.available && styles.unavailableTimeSlotText
      ]}>
        {slot.time}
      </Text>
      {!slot.available && (
        <Text style={styles.bookedText}>Booked</Text>
      )}
    </TouchableOpacity>
  );

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
            <Text style={styles.headerTitle}>Book Session</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Mentor Info Card */}
          <View style={styles.mentorCard}>
            <View style={styles.mentorInfo}>
              <View style={styles.mentorImageContainer}>
                <View style={styles.mentorImagePlaceholder}>
                  <Text style={styles.mentorImageText}>
                    {mentor.name?.charAt(0) || 'M'}
                  </Text>
                </View>
              </View>
              <View style={styles.mentorDetails}>
                <Text style={styles.mentorName}>{mentor.name}</Text>
                <Text style={styles.mentorSpecialization}>{mentor.specialization}</Text>
                <View style={styles.mentorMeta}>
                  <View style={styles.sessionBadge}>
                    <Text style={styles.sessionBadgeText}>45 min session</Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.currency}>₹</Text>
                    <Text style={styles.price}>{mentor.price}</Text>
                  </View>
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
              style={styles.datesScroll}
              contentContainerStyle={styles.datesContainer}
            >
              {availableDates.map(renderDateButton)}
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
                {timeSlots[selectedDate]?.map(renderTimeSlot)}
              </View>
            </View>
          )}

          {/* Booking Summary */}
          {selectedDate && selectedSlot && (
            <>
            {/* Banner to show the selected slot in a larger full-width style */}
              {/* No banner shown for selected slot - Figma design shows highlighted tile only */}
            <View style={styles.bookingSummary}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              <View style={styles.summaryDetails}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Mentor:</Text>
                  <Text style={styles.summaryValue}>{mentor.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date & Time:</Text>
                  <Text style={styles.summaryValue}>
                    {availableDates.find(d => d.date === selectedDate)?.day}, {availableDates.find(d => d.date === selectedDate)?.dateNum} {availableDates.find(d => d.date === selectedDate)?.month} at {selectedSlot}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Duration:</Text>
                  <Text style={styles.summaryValue}>45 minutes</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Price:</Text>
                  <Text style={styles.summaryValue}>₹{mentor.price}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {selectedDate && selectedSlot && (
        <View style={styles.bottomBar}>
          <View style={styles.bottomPricing}>
            <Text style={styles.bottomPricingLabel}>Session Fee</Text>
            <View style={styles.bottomPricingAmount}>
              <Text style={styles.bottomCurrency}>₹</Text>
              <Text style={styles.bottomPrice}>{mentor.price}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bottomBookButton}
            onPress={handleBooking}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899', '#F59E0B']}
              style={styles.bottomBookButtonGradient}
            >
              <Icon name="calendar" size={16} color="white" />
              <Text style={styles.bottomBookButtonText}>Proceed to Payment</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
  },
  dateButton: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  slotButton: {
    backgroundColor: '#ddd',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#6200ee',
  },
  buttonText: {
    color: '#fff',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BookingSlots;

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
  },
  mentorCard: {
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
  mentorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentorImageContainer: {
    marginRight: 12,
  },
  mentorImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentorImageText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mentorDetails: {
    flex: 1,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  mentorSpecialization: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  mentorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionBadgeText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
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
  datesScroll: {
    marginBottom: 8,
  },
  datesContainer: {
    paddingRight: 20,
  },
  dateButton: {
    width: 70,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDateButton: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.3,
  },
  dateDay: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedDateText: {
    color: 'white',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeSlot: {
    width: (width - 40 - 16) / 2, // Two columns with padding
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  selectedTimeSlot: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.3,
  },
  unavailableTimeSlot: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10B981',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  selectedTimeSlotText: {
    color: 'white',
  },
  unavailableTimeSlotText: {
    color: '#9CA3AF',
  },
  bookedText: {
    fontSize: 10,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
  bookingSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 100, // Space for bottom bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryDetails: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomPricing: {
    flex: 1,
  },
  bottomPricingLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  bottomPricingAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bottomCurrency: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  bottomBookButton: {
    flex: 1,
    marginLeft: 16,
  },
  bottomBookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  bottomBookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // NOTE: No selected slot banner; use highlighted slot tile only as per Figma design.
});