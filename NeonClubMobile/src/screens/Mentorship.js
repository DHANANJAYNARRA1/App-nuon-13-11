import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MentorsScreen from './MentorsScreen';
import MySessions from './MySessions';

const Mentorship = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('Browse Mentors');
  const underlineAnim = new Animated.Value(0);

  // Auto-switch to "My Sessions" tab if newBooking is passed
  useEffect(() => {
    if (route?.params?.newBooking) {
      setActiveTab('My Sessions');
    }
  }, [route?.params?.newBooking]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    Animated.timing(underlineAnim, {
      toValue: tabName === 'Browse Mentors' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Custom Tab Bar */}
      <LinearGradient
        colors={['#8B5CF6', '#EC4899', '#F59E0B']}
        style={styles.tabBarContainer}
      >
        <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => handleTabChange('Browse Mentors')}
            style={[styles.tabButton, activeTab === 'Browse Mentors' && styles.activeTabButton]}
          >
            <Text style={[styles.tabLabel, activeTab === 'Browse Mentors' && styles.activeTabLabel]}>
              Browse Mentors
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabChange('My Sessions')}
            style={[styles.tabButton, activeTab === 'My Sessions' && styles.activeTabButton]}
          >
            <Text style={[styles.tabLabel, activeTab === 'My Sessions' && styles.activeTabLabel]}>
              My Sessions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Underline indicator */}
        <View
          style={[
            styles.underlineContainer,
            { left: activeTab === 'Browse Mentors' ? '0%' : '50%' },
          ]}
        >
          <View style={styles.underline} />
        </View>
      </LinearGradient>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'Browse Mentors' ? (
          <MentorsScreen navigation={navigation} />
        ) : (
          <MySessions navigation={navigation} route={route} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabBarContainer: {
    paddingTop: 12,
    paddingBottom: 0,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  underlineContainer: {
    width: '50%',
    height: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  underline: {
    width: '90%',
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },
  contentContainer: {
    flex: 1,
  },
});

export default Mentorship;