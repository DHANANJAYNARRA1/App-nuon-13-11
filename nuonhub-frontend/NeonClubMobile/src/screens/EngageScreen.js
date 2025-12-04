import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { eventAPI } from '../services/api';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';
import { useSafePress } from '../hooks/useSafePress';
import { IP_ADDRESS } from '../../config/ipConfig';

// SVG Icons
const searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
const activitySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

const BASE_URL = `http://${IP_ADDRESS}:5000`;
const getFullUrl = (path) => path && path.startsWith('/uploads') ? `${BASE_URL}${path}` : path;

const EngageScreen = ({ navigation }) => {
  const [tab, setTab] = useState('wellness');
  const [query, setQuery] = useState('');
  
  // Wellness activities (mental health, stress management, meditation)
  const [wellness, setWellness] = useState([
    { title: 'Stress Management Workshop', date: 'TBA', time: 'TBA', location: 'Online', price: 0, category: 'wellness', _id: 'prefill_w1' },
  ]);
  
  // Fitness activities (physical health, yoga, exercise)
  const [fitness, setFitness] = useState([
    { title: 'Yoga for Healthcare Workers', date: 'TBA', time: 'TBA', location: 'Online', price: 0, category: 'fitness', _id: 'prefill_f1' },
  ]);
  
  // Community events (networking, social activities)
  const [events, setEvents] = useState([
    { title: 'Nursing Community Meetup', date: 'TBA', time: 'TBA', location: 'City Hall', price: 0, category: 'event', _id: 'prefill_e1' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes] = await Promise.all([
          eventAPI.getEvents().catch(() => ({ data: [] })),
        ]);
        
        let eList = eventsRes?.data?.events || eventsRes?.data || [];
        if (!Array.isArray(eList)) eList = [];
        
        // Separate events by category
        const wellnessList = eList.filter(e => e.category === 'wellness' || e.type === 'wellness');
        const fitnessList = eList.filter(e => e.category === 'fitness' || e.type === 'fitness');
        const eventsList = eList.filter(e => !e.category || e.category === 'event' || e.type === 'event');
        
        // Demo data if empty
        if (wellnessList.length === 0) {
          setWellness([
            { title: 'Stress Management Workshop', date: '2025-11-28', time: '3:00 PM', location: 'Online', price: 0, points: 30, category: 'wellness', _id: 'demo_w1' },
            { title: 'Mindfulness Meditation Session', date: '2025-12-05', time: '6:00 PM', location: 'Online', price: 0, points: 25, category: 'wellness', _id: 'demo_w2' },
          ]);
        } else {
          setWellness(wellnessList);
        }
        
        if (fitnessList.length === 0) {
          setFitness([
            { title: 'Yoga for Healthcare Workers', date: '2025-11-30', time: '7:00 AM', location: 'Wellness Center', price: 0, points: 35, category: 'fitness', _id: 'demo_f1' },
            { title: 'Ergonomics & Back Care', date: '2025-12-08', time: '4:00 PM', location: 'Online', price: 0, points: 40, category: 'fitness', _id: 'demo_f2' },
          ]);
        } else {
          setFitness(fitnessList);
        }
        
        if (eventsList.length === 0) {
          setEvents([
            { title: 'Nursing Community Meetup', date: '2025-12-01', time: '5:00 PM', location: 'City Hall', price: 0, points: 50, category: 'event', _id: 'demo_e1' },
            { title: 'Healthcare Professionals Networking', date: '2025-12-10', time: '6:30 PM', location: 'Grand Hotel', price: 0, points: 60, category: 'event', _id: 'demo_e2' },
          ]);
        } else {
          setEvents(eventsList);
        }
      } catch (err) {
        console.log('Engage fetch error:', err);
      }
    };
    
    fetchData();
    
    const sock = connectSocket();
    const unsubs = [
      onSocket('eventUpdate', (data) => {
        if (data.category === 'wellness') setWellness((prev) => [...prev.filter((e) => e._id !== data._id), data]);
        else if (data.category === 'fitness') setFitness((prev) => [...prev.filter((e) => e._id !== data._id), data]);
        else setEvents((prev) => [...prev.filter((e) => e._id !== data._id), data]);
      }),
    ];
    
    return () => { unsubs.forEach((fn) => fn && fn()); disconnectSocket(); };
  }, []);

  const filtered = useMemo(() => {
    const lq = query.toLowerCase().trim();
    if (!lq) return { wellness, fitness, events };
    const filterFn = (arr) => arr.filter((x) => x.title.toLowerCase().includes(lq));
    return {
      wellness: filterFn(wellness),
      fitness: filterFn(fitness),
      events: filterFn(events),
    };
  }, [query, wellness, fitness, events]);

  const renderItem = ({ item }) => {
    const handlePress = () => {
      navigation.navigate('EventViewer', { event: item });
    };

    const img = item.thumbnail && item.thumbnail.startsWith('/uploads') ? `http://${IP_ADDRESS}:5000${item.thumbnail}` : item.thumbnail;
    const seats = item.capacity && item.registeredCount != null ? item.capacity - item.registeredCount : null;

    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.card}>
        {/* Hero Image */}
        <View style={styles.hero}>
          {img ? <Image source={{ uri: img }} style={styles.heroImg} /> : <View style={styles.heroImg} />}
          <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.heroOverlay} />
          
          {/* FREE Badge */}
          {item.price === 0 && (
            <View style={styles.badgeLeft}>
              <Text style={styles.badgeLeftText}>FREE</Text>
            </View>
          )}
          
          {/* Seats Left Badge */}
          {seats != null && seats > 0 && (
            <View style={styles.badgeRight}>
              <Text style={styles.badgeRightText}>{seats} seats left</Text>
            </View>
          )}
        </View>
        
        {/* Card Body */}
        <View style={styles.cardBody}>
          {/* Category Badge */}
          <View style={[
            styles.categoryBadge,
            tab === 'wellness' && { backgroundColor: '#FCE7F3' },
            tab === 'fitness' && { backgroundColor: '#FFEDD5' },
            tab === 'events' && { backgroundColor: '#D1FAE5' },
          ]}>
            {tab === 'wellness' && <SvgXml xml={heartSvg} width={12} height={12} color="#EC4899" />}
            {tab === 'fitness' && <SvgXml xml={activitySvg} width={12} height={12} color="#F97316" />}
            {tab === 'events' && <SvgXml xml={calendarSvg} width={12} height={12} color="#10B981" />}
            <Text style={[
              styles.categoryText,
              tab === 'wellness' && { color: '#EC4899' },
              tab === 'fitness' && { color: '#F97316' },
              tab === 'events' && { color: '#10B981' },
            ]}>
              {tab === 'wellness' && 'Mental Health'}
              {tab === 'fitness' && 'Physical Health'}
              {tab === 'events' && 'Community Event'}
            </Text>
          </View>
          
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          
          {/* Meta Information */}
          <View style={styles.meta}>
            {item.date && (
              <View style={styles.metaItem}>
                <SvgXml xml={calendarSvg} width={16} height={16} color="#6B7280" />
                <Text style={styles.metaText}>{item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}</Text>
              </View>
            )}
            {item.time && (
              <View style={styles.metaItem}>
                <SvgXml xml={clockSvg} width={16} height={16} color="#6B7280" />
                <Text style={styles.metaText}>{item.time}</Text>
              </View>
            )}
            {item.location && (
              <View style={styles.metaItem}>
                <SvgXml xml={mapPinSvg} width={16} height={16} color="#6B7280" />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
            )}
          </View>
          
          {/* Price Row */}
          <View style={styles.priceRow}>
            {item.price === 0 ? (
              <Text style={styles.freeText}>Free</Text>
            ) : (
              <View style={styles.priceContainer}>
                <Text style={styles.rupeeSymbol}>₹</Text>
                <Text style={styles.priceText}>{item.price}</Text>
              </View>
            )}
            {item.points && <Text style={styles.pointsText}>+{item.points} pts</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const currentData = tab === 'wellness' ? filtered.wellness : tab === 'fitness' ? filtered.fitness : filtered.events;

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        {/* Header with gradient - Purple → Pink → Orange for Engage */}
        <LinearGradient
          colors={['#9333EA', '#EC4899', '#F97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Engage</Text>
          
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <SvgXml xml={searchSvg} width={20} height={20} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search wellness, fitness, events..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Tabs with Icons */}
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tabBtn, tab === 'wellness' && styles.tabBtnActive]}
              onPress={() => setTab('wellness')}
            >
              <SvgXml xml={heartSvg} width={16} height={16} color={tab === 'wellness' ? '#111827' : '#6B7280'} />
              <Text style={[styles.tabText, tab === 'wellness' && styles.tabTextActive]}>Wellness</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabBtn, tab === 'fitness' && styles.tabBtnActive]}
              onPress={() => setTab('fitness')}
            >
              <SvgXml xml={activitySvg} width={16} height={16} color={tab === 'fitness' ? '#111827' : '#6B7280'} />
              <Text style={[styles.tabText, tab === 'fitness' && styles.tabTextActive]}>Fitness</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabBtn, tab === 'events' && styles.tabBtnActive]}
              onPress={() => setTab('events')}
            >
              <SvgXml xml={calendarSvg} width={16} height={16} color={tab === 'events' ? '#111827' : '#6B7280'} />
              <Text style={[styles.tabText, tab === 'events' && styles.tabTextActive]}>Events</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            {tab === 'wellness' && 'Prioritize your mental health and well-being with our wellness programs'}
            {tab === 'fitness' && 'Stay active and healthy with our fitness programs'}
            {tab === 'events' && 'Join community events and networking opportunities'}
          </Text>

          {/* List */}
          <FlatList
            data={currentData}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  {tab === 'wellness' && 'No wellness activities available'}
                  {tab === 'fitness' && 'No fitness activities available'}
                  {tab === 'events' && 'No community events available'}
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#F3F4F6',
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
  },
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 48 : 48,
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
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
    gap: 0,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  tabBtnActive: { 
    backgroundColor: '#FFFFFF',
  },
  tabText: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: '#111827' },
  description: { color: '#6B7280', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  list: { paddingBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  hero: { height: 180, position: 'relative' },
  heroImg: { width: '100%', height: '100%', resizeMode: 'cover', backgroundColor: '#E5E7EB' },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  badgeRight: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeRightText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  badgeLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeLeftText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cardBody: { padding: 16 },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  categoryText: { fontSize: 12, fontWeight: '600' },
  cardTitle: { color: '#111827', fontSize: 17, fontWeight: '700', marginBottom: 4, lineHeight: 24 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: '#6B7280', fontSize: 13 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  rupeeSymbol: { color: '#111827', fontSize: 16, fontWeight: '700' },
  priceText: { color: '#111827', fontSize: 20, fontWeight: '800' },
  freeText: { color: '#10B981', fontSize: 17, fontWeight: '700' },
  pointsText: { color: '#EAB308', fontSize: 15, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: '#9CA3AF', fontSize: 15 },
});

export default EngageScreen;
