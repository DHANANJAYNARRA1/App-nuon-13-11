import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// import icon components
import GraduationCapIcon from '../components/GraduationCapIcon';
import CalendarIcon from '../components/CalendarIcon';
import UsersIcon from '../components/UsersIcon';
import GiftIcon from '../components/GiftIcon';
import BriefcaseIcon from '../components/BriefcaseIcon';
import AwardIcon from '../components/AwardIcon';
import { AuthContext } from '../contexts/AuthContext';
import IconBox from '../components/IconBox';
import { SvgXml } from 'react-native-svg';

const trophySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;
const trendingUpSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`;
const arrowRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
const chevronRightSvgOnboarding = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: 'learn',
    title: 'Learn & Grow',
    description:
      'Access exclusive courses, workshops, and training programs designed specifically for nursing professionals.',
    // gradient-only slide (no background image)
    Icon: GraduationCapIcon,
    colors: ['rgba(168,85,247,0.86)', 'rgba(255,106,61,0.7)'],
  },
  {
    key: 'events',
    title: 'Events & Workshops',
    description:
      'Participate in live events, webinars, and hands-on workshops with industry experts and peers.',
    // gradient-only slide (no background image)
    Icon: CalendarIcon,
    colors: ['rgba(236,72,153,0.85)', 'rgba(139,92,246,0.8)'],
  },
  {
    key: 'mentor',
    title: 'Expert Mentorship',
    description: 'Connect with experienced mentors for personalized guidance and career development support.',
    // gradient-only slide (no background image)
    Icon: UsersIcon,
    colors: ['rgba(3,169,244,0.85)', 'rgba(6,182,212,0.7)'],
  },
  {
    key: 'champ',
    title: 'Become a Champion',
    description: 'Complete the Nightingale Programme and earn certification as a Neon Club Champion Mentor.',
    // gradient-only slide (no background image)
    Icon: () => <SvgXml xml={trophySvg} width={56} height={56} color="#FFFFFF" />,
    colors: ['rgba(249,115,22,0.86)', 'rgba(236,72,153,0.7)'],
  },
  {
    key: 'rewards',
    title: 'Earn Rewards',
    description: 'Get reward points for every activity, course completion, and engagement. Redeem for exclusive benefits!',
    // gradient-only slide (no background image)
    Icon: GiftIcon,
    colors: ['rgba(255,153,0,0.86)', 'rgba(255,94,0,0.7)'],
  },
  {
    key: 'career',
    title: 'Advance Your Career',
    description: 'Build your professional profile, track your growth, and unlock new opportunities in healthcare.',
    // gradient-only slide (no background image)
    Icon: () => <SvgXml xml={trendingUpSvg} width={56} height={56} color="#FFFFFF" />,
    colors: ['rgba(16,185,129,0.86)', 'rgba(5,150,105,0.75)'],
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef(null);

  const onMomentum = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrent(idx);
  };

  const { user } = useContext(AuthContext);

  const goNext = () => {
    if (current < slides.length - 1) {
      scrollRef.current.scrollTo({ x: (current + 1) * width, animated: true });
    } else {
      // final action: navigate depending on auth state
      navigation.navigate('OTPAuth');
    }
  };

  const skip = () => {
    navigation.navigate('OTPAuth');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentum}
      >
        {slides.map((s, i) => (
          <View key={s.key} style={styles.slide}>
            {/* gradient-only slide (no image) */}
            <LinearGradient
              colors={s.colors || ['rgba(124,58,237,0.85)', 'rgba(37,99,235,0.7)']}
              style={styles.overlay}
            />

            <View style={styles.topContent}>
               <IconBox size={110}>
                 {s.Icon ? <s.Icon width={56} height={56} color="#FFFFFF" /> : null}
               </IconBox>

              {/* Title and description shown once under the icon */}
              <Text style={styles.title}>{s.title}</Text>
              <Text style={styles.description}>{s.description}</Text>
            </View>

            <View style={styles.bottomSheet}>
              <TouchableOpacity style={styles.nextBtn} onPress={goNext} activeOpacity={0.9}>
                <LinearGradient colors={[ '#A855F7', '#FF6A3D' ]} style={styles.nextGradient}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.nextText}>{current === slides.length -1 ? 'Get Started' : 'Next'}</Text>
                    <SvgXml xml={arrowRightSvg} width={20} height={20} color="#fff" style={{marginLeft: 8}} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.dotsRowCentered}>
                {slides.map((_, idx) => (
                  idx === current ? (
                    <LinearGradient
                      key={idx}
                      colors={[ '#A855F7', '#FF6A3D' ]}
                      style={styles.activePill}
                    />
                  ) : (
                    <View key={idx} style={styles.dot} />
                  )
                ))}
              </View>

              <TouchableOpacity onPress={skip} style={styles.skipLink}>
                <Text style={styles.skipLinkText}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slide: {
    width,
    height,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.85,
  },
  topContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  iconBoxTop: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  topSubtitle: {
    color: 'rgba(255,255,255,0.95)',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    borderRadius: 0,
  },
  progressRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 0,
  },
  dotsRowCentered: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 6,
    justifyContent: 'center',
    width: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E6E6E6',
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: '#A855F7',
  },
  activePill: {
    width: 48,
    height: 8,
    borderRadius: 8,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  nextBtn: {
    width: '100%',
  },
  nextGradient: {
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  skipLink: {
    marginTop: 12,
  },
  skipLinkText: {
    color: '#8A8A8A',
    fontSize: 14,
  },
});

export default OnboardingScreen;