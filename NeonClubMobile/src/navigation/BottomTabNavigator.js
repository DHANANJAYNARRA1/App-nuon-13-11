import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const homeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
const bookOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const heartSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
const usersSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

import HomeScreen from '../screens/HomeScreen';
import LearningScreen from '../screens/LearningScreen';
import EngageScreen from '../screens/EngageScreen';
import MentorshipSessions from '../screens/MentorshipSessions';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return homeSvg;
      case 'Learning':
        return bookOpenSvg;
      case 'Engage':
        return heartSvg;
      case 'Mentors':
        return usersSvg;
      default:
        return homeSvg;
    }
  };

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 70, position: 'relative' }}>
      {focused && (
        <LinearGradient
          colors={['#7C3AED', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: -8,
            width: 48,
            height: 4,
            borderRadius: 2,
          }}
        />
      )}
      <SvgXml
        xml={getIcon()}
        width={24}
        height={24}
        color={focused ? '#4F46E5' : '#9CA3AF'}
      />
      <Text style={{
        marginTop: 4,
        fontSize: 11,
        color: focused ? '#4F46E5' : '#9CA3AF',
        fontWeight: focused ? '600' : '500',
        textAlign: 'center'
      }}>
        {name}
      </Text>
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarLabel: () => null,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learning" component={LearningScreen} />
      <Tab.Screen name="Engage" component={EngageScreen} />
      <Tab.Screen name="Mentors" component={MentorshipSessions} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#00FFFF',
    height: 60,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00FFFF',
  },
  profileIcon: {
    fontSize: 20,
  },
});

export default BottomTabNavigator;