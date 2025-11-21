import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import MyLearningScreen from '../screens/MyLearningScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import MentorshipSessions from '../screens/MentorshipSessions';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return '🏠';
      case 'Learning':
        return '📚';
      case 'Engage':
        return '🎯';
      case 'Sessions':
        return '👨‍⚕️';
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
      <Tab.Screen name="Learning" component={MyLearningScreen} />
      <Tab.Screen name="Engage" component={ActivitiesScreen} />
      <Tab.Screen name="Sessions" component={MentorshipSessions} />
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