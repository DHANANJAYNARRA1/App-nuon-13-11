import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import MentorsScreen from '../screens/MentorsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MentorshipSessions from '../screens/MentorshipSessions';
import BookingScreen from '../screens/BookingScreen';
import SessionFeedback from '../screens/SessionFeedback';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return '🏠';
      case 'Activities':
        return '📚';
      case 'Mentorship':
      case 'Mentors':
        return '👨‍⚕️';
      case 'Profile':
        return '👤';
      default:
        return '•';
    }
  };

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 84 }}>
      <Text style={{
        fontSize: 20,
        color: focused ? '#00FFFF' : '#666666',
        textShadowColor: focused ? '#00FFFF' : 'transparent',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: focused ? 10 : 0,
      }}>
        {getIcon()}
      </Text>
      <Text style={{
        marginTop: 2,
        fontSize: 12,
        color: focused ? '#00FFFF' : '#666666',
        fontWeight: focused ? '700' : '600',
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
          backgroundColor: '#1A1A1A',
          borderTopWidth: 2,
          borderTopColor: '#00FFFF',
          height: 64,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#00FFFF',
        tabBarInactiveTintColor: '#666666',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activities" component={ActivitiesScreen} />
      <Tab.Screen
        name="Mentors"
        component={MentorshipSessions}
        options={{
          listeners: {
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('MentorshipSessions');
            },
          },
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;