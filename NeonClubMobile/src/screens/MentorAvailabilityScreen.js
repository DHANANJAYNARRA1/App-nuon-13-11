import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Alert, Modal, Image, Dimensions, Animated, Switch } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { mentorAPI, bookingAPI } from '../services/api';
import socketService from '../services/socket';
const { width } = Dimensions.get('window');

function parseSlotToDate(dateStr, slotTime) {
  // slotTime example: "10:00 AM - 10:45 AM" => take first time as start
  try {
    const start = slotTime.split('-')[0].trim();
    const date = new Date(dateStr);
    // Parse simple h:mm AM/PM
    const match = start.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      date.setHours(h, m, 0, 0);
    }
    return date.toISOString();
  } catch {
    return new Date(dateStr).toISOString();
  }
}

const DayPill = ({ label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.dayPill, active && styles.dayPillActive]}>
    <Text style={[styles.dayPillText, active && styles.dayPillTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const SlotButton = ({ slot, onPress }) => (
  <TouchableOpacity
    disabled={!slot.available}
    onPress={onPress}
    style={[styles.slotBtn, !slot.available && styles.slotBtnDisabled]}
  >
    <Text style={[styles.slotBtnText, !slot.available && styles.slotBtnTextDisabled]}>
      {slot.time}
    </Text>
  </TouchableOpacity>
);


const MentorAvailabilityScreen = ({ route, navigation }) => {
  const { mentorId, mentorName, mentorAvatar, mentorSpecialty, mentorPrice, mentorDuration, bookingId } = route.params || {};
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const isReschedule = Boolean(bookingId);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newSchedule, setNewSchedule] = useState({ date: '', time: '' });
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Real-time features
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateAnimations, setUpdateAnimations] = useState(new Map());
  const [demoMode, setDemoMode] = useState(false);
  const demoIntervalRef = useRef(null);

  // Socket connection and real-time updates
  useEffect(() => {
    let socketCleanup;

    const setupSocket = async () => {
      if (isRealTimeEnabled) {
        try {
          const socket = await socketService.connect();
          if (socket) {
            setSocketConnected(true);
            socketService.emit('join_mentor_room', mentorId);

            // Listen for availability updates
            socketCleanup = socketService.on('mentor_availability_update', (data) => {
              console.log('Real-time availability update:', data);
              handleAvailabilityUpdate(data);
            });

            // Listen for new availability
            socketService.on('new_mentor_availability', (data) => {
              console.log('New mentor availability:', data);
              handleNewAvailability(data);
            });
          }
        } catch (error) {
          console.error('Socket connection failed:', error);
          setSocketConnected(false);
        }
      } else {
        setSocketConnected(false);
        if (socketCleanup) socketCleanup();
      }
    };

    setupSocket();

    return () => {
      if (socketCleanup) socketCleanup();
      socketService.emit('leave_mentor_room', mentorId);
    };
  }, [isRealTimeEnabled, mentorId]);

  // Demo mode simulation
  useEffect(() => {
    if (demoMode && isRealTimeEnabled) {
      demoIntervalRef.current = setInterval(() => {
        simulateAvailabilityUpdate();
      }, 5000); // Update every 5 seconds
    } else {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
        demoIntervalRef.current = null;
      }
    }

    return () => {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
    };
  }, [demoMode, isRealTimeEnabled]);

  const handleAvailabilityUpdate = (data) => {
    setAvailability(prev => {
      const updated = prev.map(day => {
        if (day.date === data.date) {
          return {
            ...day,
            slots: day.slots.map(slot => {
              if (slot.time === data.slotTime) {
                // Trigger animation
                const animKey = `${data.date}-${slot.time}`;
                setUpdateAnimations(prev => new Map(prev.set(animKey, new Animated.Value(1))));
                setTimeout(() => {
                  setUpdateAnimations(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(animKey);
                    return newMap;
                  });
                }, 2000);

                return { ...slot, available: data.available };
              }
              return slot;
            })
          };
        }
        return day;
      });
      return updated;
    });

    setLastUpdate(new Date());
    Alert.alert('Availability Updated', `${data.available ? 'Slot became available' : 'Slot was booked'} at ${data.slotTime}`);
  };

  const handleNewAvailability = (data) => {
    if (data.mentorId === mentorId) {
      setAvailability(prev => [...prev, data.availability]);
      setLastUpdate(new Date());
      Alert.alert('New Availability', 'New time slots have been added!');
    }
  };

  const simulateAvailabilityUpdate = () => {
    if (availability.length === 0) return;

    const randomDay = availability[Math.floor(Math.random() * availability.length)];
    if (!randomDay.slots || randomDay.slots.length === 0) return;

    const randomSlot = randomDay.slots[Math.floor(Math.random() * randomDay.slots.length)];
    const newAvailability = Math.random() > 0.5;

    handleAvailabilityUpdate({
      date: randomDay.date,
      slotTime: randomSlot.time,
      available: newAvailability
    });
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const from = new Date();
        const to = new Date(Date.now() + 6 * 86400000); // next 7 days total
        const res = await mentorAPI.getAvailability(mentorId, {
          date_from: from.toISOString().slice(0, 10),
          date_to: to.toISOString().slice(0, 10),
        });
        const list = Array.isArray(res?.data?.availability) ? res.data.availability : [];
        setAvailability(list);
      } catch (e) {
        Alert.alert('Error', 'Failed to load availability');
      } finally {
        setLoading(false);
      }
    })();
  }, [mentorId]);

  useEffect(() => {
    navigation.setOptions({
      title: isReschedule ? 'Reschedule Session' : 'Book Session',
    });
  }, [navigation, isReschedule]);

  const dayLabels = useMemo(() => {
    return availability.map(d => {
      const dt = new Date(d.date);
      const wk = dt.toLocaleDateString('en-US', { weekday: 'short' });
      const md = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${wk} ${md}`;
    });
  }, [availability]);


  const onSelectSlot = (dayObj, slot) => {
    setSelectedSlot({ dayObj, slot });
  };

  const onProceedToPayment = () => {
    if (!selectedSlot) return;
    const { dayObj, slot } = selectedSlot;
    navigation.navigate('BookingSummaryScreen', {
      mentorId,
      mentorName,
      mentorAvatar,
      mentorSpecialty,
      mentorPrice,
      mentorDuration,
      date: new Date(dayObj.date).toDateString(),
      time: slot.time,
      sessionFee: mentorPrice,
      bookingId
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading availability...</Text>
      </View>
    );
  }

  const activeDay = availability[activeIndex];

  return (
    <View style={styles.container}>
      {/* Real-time Demo Section */}
      <View style={styles.demoSection}>
        <View style={styles.demoHeader}>
          <Text style={styles.demoTitle}>Real-time Features Demo</Text>
          <View style={styles.connectionIndicator}>
            <View style={[styles.connectionDot, socketConnected && styles.connectionDotActive]} />
            <Text style={styles.connectionText}>
              {socketConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>

        <View style={styles.demoControls}>
          <View style={styles.controlRow}>
            <Text style={styles.controlLabel}>Enable Real-time Updates</Text>
            <Switch
              value={isRealTimeEnabled}
              onValueChange={setIsRealTimeEnabled}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isRealTimeEnabled ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          {isRealTimeEnabled && (
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Demo Mode (Auto Updates)</Text>
              <Switch
                value={demoMode}
                onValueChange={setDemoMode}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={demoMode ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
          )}

          {lastUpdate && (
            <Text style={styles.lastUpdateText}>
              Last update: {lastUpdate.toLocaleTimeString()}
            </Text>
          )}
        </View>
      </View>

      {/* Mentor Info Card */}
      <View style={styles.mentorCard}>
        <View style={styles.mentorImageBox}>
          {mentorAvatar ? (
            <Image source={{ uri: mentorAvatar }} style={styles.mentorImage} />
          ) : (
            <View style={styles.mentorImagePlaceholder} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.mentorName}>{mentorName}</Text>
          <Text style={styles.mentorSpecialty}>{mentorSpecialty || 'Specialty'}</Text>
          <View style={styles.sessionRow}>
            <Text style={styles.sessionDuration}>{mentorDuration || '45 min session'}</Text>
            <Text style={styles.sessionPrice}>₹ {mentorPrice || '1999'}</Text>
          </View>
        </View>
      </View>

      {/* Date Selection */}
      <FlatList
        data={dayLabels}
        keyExtractor={(it, idx) => `${it}-${idx}`}
        renderItem={({ item, index }) => (
          <DayPill label={item} active={index === activeIndex} onPress={() => { setActiveIndex(index); setSelectedSlot(null); }} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysList}
      />

      {/* Time Slot Selection */}
      <View style={styles.slotsContainer}>
        {activeDay && activeDay.slots && activeDay.slots.length > 0 ? (
          activeDay.slots.map((slot, idx) => {
            const animKey = `${activeDay.date}-${slot.time}`;
            const animatedValue = updateAnimations.get(animKey);

            return (
              <Animated.View
                key={idx}
                style={[
                  styles.slotBtn,
                  selectedSlot && selectedSlot.slot.time === slot.time ? styles.slotBtnActive : null,
                  !slot.available && styles.slotBtnDisabled,
                  animatedValue && {
                    transform: [{
                      scale: animatedValue.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 1.1, 1]
                      })
                    }],
                    shadowColor: '#7C3AED',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: animatedValue.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0.8, 0]
                    }),
                    shadowRadius: 10,
                    elevation: animatedValue.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [2, 8, 2]
                    })
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.slotBtnInner}
                  disabled={!slot.available}
                  onPress={() => onSelectSlot(activeDay, slot)}
                >
                  <Text style={[styles.slotBtnText, !slot.available && styles.slotBtnTextDisabled]}>
                    {slot.time}
                  </Text>
                  {animatedValue && (
                    <View style={styles.updateIndicator}>
                      <Icon name="flash" size={14} color="#7C3AED" />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>No slots available this day</Text>
        )}
      </View>

      {/* Booking Summary */}
      <View style={styles.bookingSummaryCard}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Mentor</Text><Text style={styles.summaryValue}>{mentorName}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Date</Text><Text style={styles.summaryValue}>{selectedSlot ? new Date(selectedSlot.dayObj.date).toDateString() : '--'}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Time</Text><Text style={styles.summaryValue}>{selectedSlot ? selectedSlot.slot.time : '--'}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Session Fee</Text><Text style={styles.summaryValue}>₹ {mentorPrice || '1999'}</Text></View>
      </View>

      {/* Book Session Button */}
      <View style={styles.proceedBar}>
        <TouchableOpacity
          style={[styles.proceedBtn, !selectedSlot && { opacity: 0.5 }]}
          disabled={!selectedSlot}
          onPress={onProceedToPayment}
        >
          <LinearGradient colors={["#F472B6", "#7C3AED"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.proceedGradient}>
            <Text style={styles.proceedText}>
              {isReschedule ? 'Reschedule Session' : 'Book Session'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Success Modal for Reschedule */}
      <Modal transparent visible={showSuccess} animationType="fade" onRequestClose={() => setShowSuccess(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={{ marginTop: -36 }}>
              <LinearGradient colors={["#A78BFA", "#F472B6"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.modalIconBg}>
                <Text style={{ fontSize: 26, color: '#fff' }}>⭐</Text>
              </LinearGradient>
            </View>
            <Text style={styles.modalTitle}>Session Rescheduled!</Text>
            <Text style={styles.modalDesc}>Your session has been moved to</Text>
            <Text style={[styles.modalDesc, { fontWeight:'700' }]}> 
              {newSchedule.date} at {newSchedule.time}
            </Text>
            <LinearGradient colors={["#7C3AED","#DB2777"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.modalCta}>
              <TouchableOpacity onPress={() => { setShowSuccess(false); navigation.navigate('Bookings'); }}>
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: '#64748b' },

  // Demo Section Styles
  demoSection: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },
  demoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  demoTitle: { fontSize: 16, fontWeight: 'bold', color: '#7C3AED' },
  connectionIndicator: { flexDirection: 'row', alignItems: 'center' },
  connectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', marginRight: 6 },
  connectionDotActive: { backgroundColor: '#22c55e' },
  connectionText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  demoControls: { gap: 12 },
  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  controlLabel: { fontSize: 14, color: '#374151', fontWeight: '600' },
  lastUpdateText: { fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 8 },

  mentorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, margin: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2 },
  mentorImageBox: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#E5E7EB', marginRight: 14, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  mentorImage: { width: 60, height: 60, borderRadius: 12 },
  mentorImagePlaceholder: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#E5E7EB' },
  mentorName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  mentorSpecialty: { fontSize: 13, color: '#7C3AED', fontWeight: '600', marginTop: 2 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  sessionDuration: { fontSize: 13, color: '#6366f1', fontWeight: '600', marginRight: 10 },
  sessionPrice: { fontSize: 15, color: '#EC4899', fontWeight: 'bold' },
  daysList: { paddingHorizontal: 12, paddingVertical: 12 },
  dayPill: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, backgroundColor: '#e2e8f0', marginRight: 8, minWidth: 80 },
  dayPillActive: { backgroundColor: '#7C3AED' },
  dayPillText: { color: '#334155', fontWeight: '600' },
  dayPillTextActive: { color: '#fff' },
  slotsContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  slotBtn: { borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12, minHeight: 50, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  slotBtnInner: { padding: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  slotBtnActive: { borderColor: '#7C3AED', backgroundColor: '#F3E8FF' },
  slotBtnDisabled: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  slotBtnText: { color: '#7C3AED', fontWeight: 'bold', fontSize: 15 },
  slotBtnTextDisabled: { color: '#A1A1AA' },
  updateIndicator: { position: 'absolute', right: 8, top: 8 },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 16 },
  bookingSummaryCard: { backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 16, marginTop: 8, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 1 },
  summaryTitle: { fontWeight: 'bold', color: '#7C3AED', fontSize: 15, marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  summaryLabel: { color: '#64748b', fontSize: 14 },
  summaryValue: { color: '#222', fontWeight: 'bold', fontSize: 14 },
  proceedBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F1F1' },
  proceedBtn: { borderRadius: 16, overflow: 'hidden' },
  proceedGradient: { paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  proceedText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalBackdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.35)', alignItems:'center', justifyContent:'center' },
  modalCard: { width: '82%', backgroundColor:'#fff', borderRadius: 16, padding: 18, alignItems:'center', shadowColor:'#000', shadowOpacity:0.2, shadowRadius:12, elevation:6 },
  modalIconBg: { width: 64, height: 64, borderRadius: 32, alignItems:'center', justifyContent:'center' },
  modalTitle: { fontSize:18, fontWeight:'800', color:'#7C3AED', marginTop: 6 },
  modalDesc: { color:'#475569', textAlign:'center', marginTop: 4 },
  modalCta: { marginTop: 14, width: '86%', borderRadius: 999, paddingVertical: 12, alignItems:'center' },
  modalCtaText: { color:'#fff', fontWeight:'800', textAlign:'center' },
});

export default MentorAvailabilityScreen;
