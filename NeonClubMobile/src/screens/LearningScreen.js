import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Platform, Image, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { conferenceAPI, workshopAPI, courseAPI } from '../services/api';
import { connectSocket, on as onSocket, disconnectSocket } from '../utils/socket';
import { COLOR_SCHEME } from '../utils/colors';
import { IP_ADDRESS } from '../../config/ipConfig';

// SVG Icons
const searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
const bookOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const graduationCapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`;
const calendarSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`;
const briefcaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
const clockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const awardSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`;

const LearningScreen = ({ navigation, route }) => {
  // Default to Courses
  const [tab, setTab] = useState('courses');
  const [query, setQuery] = useState('');
  
  const [conferences, setConferences] = useState([
    { title: 'Basic Life Support Webinar', date: 'TBA', time: 'TBA', location: 'Online', price: 0, _id: 'prefill_c1' },
  ]);
  const [workshops, setWorkshops] = useState([
    { title: 'Neonatal Care Workshop', date: 'TBA', duration: '2h', location: 'City Hospital', price: 499, seats: 12, _id: 'prefill_w1' },
  ]);
  const [courses, setCourses] = useState([
    { title: 'Advanced Wound Care — Essentials and Best Practices for Clinical Outcomes', duration: '6h', price: 999, _id: 'prefill_c1' },
  ]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [conf, w, c] = await Promise.all([
          conferenceAPI.getConferences().catch(() => ({ data: [] })),
          workshopAPI.getWorkshops().catch(() => ({ data: [] })),
          courseAPI.getCourses().catch(() => ({ data: [] })),
        ]);
        let confList = conf?.data?.conferences || conf?.data || [];
        let wList = w?.data?.workshops || w?.data || [];
        let cList = c?.data?.courses || c?.data || [];
        if (!Array.isArray(confList)) confList = [];
        if (!Array.isArray(wList)) wList = [];
        if (!Array.isArray(cList)) cList = [];
        if (confList.length === 0) {
          confList = [
            { title: 'Basic Life Support Webinar', date: '2025-11-05', time: '10:00 AM', location: 'Online', price: 0, points: 25, _id: 'demo_conf1' },
            { title: 'Infection Control Update', date: '2025-11-12', time: '4:00 PM', location: 'Online', price: 0, points: 30, _id: 'demo_conf2' },
          ];
        }
        if (wList.length === 0) {
          wList = [
            { title: 'Neonatal Care Workshop', date: '2025-11-10', duration: '2 hours', location: 'City Hospital', price: 499, seats: 12, _id: 'demo_w1' },
            { title: 'Advanced IV Therapy', date: '2025-11-15', duration: '3 hours', location: 'Regional Medical Center', price: 799, seats: 8, _id: 'demo_w2' },
          ];
        }
        if (cList.length === 0) {
          cList = [
            { title: 'Advanced Wound Care', description: 'Essentials and Best Practices for Clinical Outcomes', duration: '6 hours', price: 999, enrolled: 124, _id: 'demo_c1', image: null },
            { title: 'Critical Care Nursing', description: 'Comprehensive guide to ICU management', duration: '8 hours', price: 1299, enrolled: 89, _id: 'demo_c2', image: null },
          ];
        }
        setConferences(confList);
        setWorkshops(wList);
        setCourses(cList);
      } catch (err) {
        console.error('[Learning] fetch error:', err);
      }
    };
    fetchLists();
    connectSocket();
    const unsubs = [
      onSocket('conferenceUpdate', (data) => setConferences((prev) => [...prev.filter((c) => c._id !== data._id), data])),
      onSocket('workshopUpdate', (data) => setWorkshops((prev) => [...prev.filter((w) => w._id !== data._id), data])),
      onSocket('courseUpdate', (data) => setCourses((prev) => [...prev.filter((c) => c._id !== data._id), data])),
    ];
    return () => {
      unsubs.forEach((fn) => fn && fn());
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (route.params?.open) setTab(route.params.open);
  }, [route.params?.open]);

  const filtered = useMemo(() => {
    const lq = query.toLowerCase();
    const filterFn = (arr) => arr.filter((x) => x.title.toLowerCase().includes(lq));
    return {
      conferences: filterFn(conferences),
      workshops: filterFn(workshops),
      courses: filterFn(courses),
    };
  }, [query, conferences, workshops, courses]);

  const current = filtered[tab] || [];

  const renderItem = ({ item }) => {
    const handlePress = () => {
      if (tab === 'conferences') navigation.navigate('ConferenceDetail', { conference: item });
      if (tab === 'workshops') navigation.navigate('WorkshopDetail', { workshop: item });
      if (tab === 'courses') navigation.navigate('CourseDetail', { course: item });
    };

    const img = item.image && item.image.startsWith('/uploads') ? `http://${IP_ADDRESS}:5000${item.image}` : item.image;

    if (tab === 'courses') {
      return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.card}>
          {/* Hero Image */}
          <View style={styles.hero}>
            {img ? <Image source={{ uri: img }} style={styles.heroImg} /> : <View style={styles.heroImg} />}
            <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.heroOverlay} />
            {/* Level Badge */}
            {item.level && <View style={styles.badgeRight}><Text style={styles.badgeRightText}>{item.level}</Text></View>}
            {/* Free Badge */}
            {item.price === 0 && <View style={styles.badgeLeft}><Text style={styles.badgeLeftText}>FREE</Text></View>}
            {/* Certificate Badge */}
            {item.certificate && (
              <View style={styles.badgeBottom}>
                <SvgXml xml={awardSvg} width={14} height={14} color="#fff" />
                <Text style={styles.badgeRightText}>Certificate</Text>
              </View>
            )}
          </View>
          {/* Card Body */}
          <View style={styles.cardBody}>
            <View style={styles.categoryBadge}>
              <SvgXml xml={graduationCapSvg} width={12} height={12} color="#1E40AF" />
              <Text style={styles.categoryText}>{item.category || item.type}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.instructor && <Text style={styles.cardDesc}>by {typeof item.instructor === 'object' ? (item.instructor.name || item.instructor.fullName || '') : item.instructor}</Text>}
            <View style={styles.meta}>
              {item.modules && (
                <View style={styles.metaItem}>
                  <SvgXml xml={bookOpenSvg} width={16} height={16} color="#6B7280" />
                  <Text style={styles.metaText}>{item.modules} modules</Text>
                </View>
              )}
              {item.duration && (
                <View style={styles.metaItem}>
                  <SvgXml xml={clockSvg} width={16} height={16} color="#6B7280" />
                  <Text style={styles.metaText}>{item.duration}</Text>
                </View>
              )}
              {item.enrolled && (
                <View style={styles.metaItem}>
                  <SvgXml xml={usersSvg} width={16} height={16} color="#6B7280" />
                  <Text style={styles.metaText}>{item.enrolled}</Text>
                </View>
              )}
            </View>
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
    }

    if (tab === 'conferences') {
      return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.card}>
          <View style={styles.hero}>
            {img ? <Image source={{ uri: img }} style={styles.heroImg} /> : <View style={styles.heroImg} />}
            <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.heroOverlay} />
            {item.seats && <View style={[styles.badgeRight, { backgroundColor: '#10B981' }]}><Text style={styles.badgeRightText}>{item.seats} seats left</Text></View>}
            {item.price === 0 && <View style={styles.badgeLeft}><Text style={styles.badgeLeftText}>FREE</Text></View>}
          </View>
          <View style={styles.cardBody}>
            <View style={[styles.categoryBadge, { backgroundColor: '#F3E8FF' }]}>
              <SvgXml xml={calendarSvg} width={12} height={12} color="#7C3AED" />
              <Text style={[styles.categoryText, { color: '#7C3AED' }]}>{item.category || item.type}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.speakers && <Text style={styles.cardDesc}>{typeof item.speakers === 'string' ? item.speakers : ''}</Text>}
            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <SvgXml xml={calendarSvg} width={16} height={16} color="#6B7280" />
                <Text style={styles.metaText}>{item.date}</Text>
              </View>
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
    }

    if (tab === 'workshops') {
      return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.card}>
          <View style={styles.hero}>
            {img ? <Image source={{ uri: img }} style={styles.heroImg} /> : <View style={styles.heroImg} />}
            <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]} start={{x:0,y:0}} end={{x:0,y:1}} style={styles.heroOverlay} />
            {item.type && <View style={[styles.badgeRight, { backgroundColor: '#F97316' }]}><Text style={styles.badgeRightText}>{item.type}</Text></View>}
            {item.price === 0 && <View style={styles.badgeLeft}><Text style={styles.badgeLeftText}>FREE</Text></View>}
            {item.seats && item.seats < 30 && (
              <View style={[styles.badgeBottom, { right: 12, left: 'auto', backgroundColor: '#EF4444' }]}>
                <Text style={styles.badgeRightText}>{item.seats} seats left</Text>
              </View>
            )}
          </View>
          <View style={styles.cardBody}>
            <View style={[styles.categoryBadge, { backgroundColor: '#FFEDD5' }]}>
              <SvgXml xml={briefcaseSvg} width={12} height={12} color="#C2410C" />
              <Text style={[styles.categoryText, { color: '#C2410C' }]}>{item.category || 'Workshop'}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.instructor && <Text style={styles.cardDesc}>by {typeof item.instructor === 'object' ? (item.instructor.name || item.instructor.fullName || '') : item.instructor}</Text>}
            <View style={styles.meta}>
              {item.date && (
                <View style={styles.metaItem}>
                  <SvgXml xml={calendarSvg} width={16} height={16} color="#6B7280" />
                  <Text style={styles.metaText}>{item.date}</Text>
                </View>
              )}
              {item.time && item.duration && (
                <View style={styles.metaItem}>
                  <SvgXml xml={clockSvg} width={16} height={16} color="#6B7280" />
                  <Text style={styles.metaText}>{item.time} • {item.duration}</Text>
                </View>
              )}
              {item.location && (
                <View style={styles.metaItem}>
                  <SvgXml xml={mapPinSvg} width={16} height={16} color="#6B7280" />
                  <Text style={styles.metaText}>{item.location}</Text>
                </View>
              )}
              {item.enrolled && item.materials && (
                <View style={styles.metaItem}>
                  <SvgXml xml={usersSvg} width={16} height={16} color="#6B7280" />
                  <Text style={styles.metaText}>{item.enrolled} enrolled • {item.materials}</Text>
                </View>
              )}
            </View>
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
    }

    return null;
  };

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        {/* Header with My Learning Button */}
        <LinearGradient 
          colors={['#3B82F6', '#9333EA', '#EC4899']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Learning</Text>
            <TouchableOpacity 
              style={styles.myLearningBtn}
              onPress={() => navigation.navigate('MyLearning')}
            >
              <SvgXml xml={bookOpenSvg} width={16} height={16} color="#fff" />
              <Text style={styles.myLearningText}>My Learning</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <SvgXml xml={searchSvg} width={20} height={20} color="rgba(255,255,255,0.6)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses, conferences, workshops..."
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
              style={[styles.tabBtn, tab === 'courses' && styles.tabBtnActive]}
              onPress={() => setTab('courses')}
            >
              <SvgXml xml={graduationCapSvg} width={16} height={16} color={tab === 'courses' ? '#fff' : '#6B7280'} />
              <Text style={[styles.tabText, tab === 'courses' && styles.tabTextActive]}>Courses</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabBtn, tab === 'conferences' && styles.tabBtnActive]}
              onPress={() => setTab('conferences')}
            >
              <SvgXml xml={calendarSvg} width={16} height={16} color={tab === 'conferences' ? '#111827' : '#6B7280'} />
              <Text style={[styles.tabText, tab === 'conferences' && styles.tabTextActive]}>Conferences</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabBtn, tab === 'workshops' && styles.tabBtnActive]}
              onPress={() => setTab('workshops')}
            >
              <SvgXml xml={briefcaseSvg} width={16} height={16} color={tab === 'workshops' ? '#fff' : '#6B7280'} />
              <Text style={[styles.tabText, tab === 'workshops' && styles.tabTextActive]}>Workshops</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.description}>
            {tab === 'courses' && 'Advance your nursing career with professional development courses'}
            {tab === 'conferences' && 'Join professional conferences, webinars, and CPD events'}
            {tab === 'workshops' && 'Build practical skills with hands-on workshops and training'}
          </Text>

          {/* List */}
          <FlatList
            data={current}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No {tab} available</Text>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  myLearningBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  myLearningText: { color: '#fff', fontSize: 13, fontWeight: '600' },
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
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeRightText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  badgeLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeLeftText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  badgeBottom: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#9333EA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardBody: { padding: 16 },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  categoryText: { color: '#1E40AF', fontSize: 12, fontWeight: '600' },
  cardTitle: { color: '#111827', fontSize: 17, fontWeight: '700', marginBottom: 4, lineHeight: 24 },
  cardDesc: { color: '#6B7280', fontSize: 14, marginBottom: 8, lineHeight: 20 },
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

export default LearningScreen;
