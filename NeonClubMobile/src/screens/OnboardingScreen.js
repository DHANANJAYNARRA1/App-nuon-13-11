import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Learn & Grow',
      subtitle: 'Advance Your Nursing Career',
      description: 'Access premium courses, workshops, and training programs designed specifically for nursing professionals.',
      gradient: ['#00FFFF', '#FF1493'],
    },
    {
      title: 'Events & Workshops',
      subtitle: 'Connect & Network',
      description: 'Join live events, conferences, and workshops to connect with fellow nurses and industry experts.',
      gradient: ['#FF1493', '#BF00FF'],
    },
    {
      title: 'Expert Mentorship',
      subtitle: '1-on-1 Guidance',
      description: 'Get personalized mentorship from experienced nurses and healthcare leaders.',
      gradient: ['#BF00FF', '#39FF14'],
    },
    {
      title: 'Become a Champion',
      subtitle: 'Nightingale Certification',
      description: 'Complete our 3-step program to become a certified Nightingale Champion and mentor others.',
      gradient: ['#39FF14', '#FFFF00'],
    },
    {
      title: 'Earn Rewards',
      subtitle: 'Points & Recognition',
      description: 'Earn reward points for every activity and redeem them for exclusive benefits.',
      gradient: ['#FFFF00', '#FF6600'],
    },
    {
      title: 'Career Advancement',
      subtitle: 'Your Success Journey',
      description: 'Track your progress, build your profile, and advance your nursing career with confidence.',
      gradient: ['#FF6600', '#00FFFF'],
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  const skipOnboarding = () => {
    onFinish();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slideIndex);
        }}
        contentOffset={{ x: currentSlide * width, y: 0 }}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View
              style={[
                styles.slideContent,
                {
                  background: `linear-gradient(135deg, ${slide.gradient[0]}, ${slide.gradient[1]})`,
                },
              ]}
            >
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
          <Text style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  slideContent: {
    width: '100%',
    height: '70%',
    borderRadius: 20,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#00FFFF',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00FFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FF1493',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#00FFFF',
  },
  inactiveDot: {
    backgroundColor: '#333333',
  },
  nextButton: {
    backgroundColor: '#FF1493',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#FF1493',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;