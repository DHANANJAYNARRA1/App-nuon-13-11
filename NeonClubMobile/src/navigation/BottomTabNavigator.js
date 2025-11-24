import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
        return '❤️';
      case 'Sessions':
        return '👥';
      default:
        return '•';
    }
  };

  const getLabel = () => {
    switch (name) {
      case 'Home':
        return 'Home';
      case 'Learning':
        return 'Learning';
      case 'Engage':
        return 'Engage';
      case 'Sessions':
        return 'Mentors';
      default:
        return name;
    }
  };

  return (
    <View style={styles.tabButton}>
      {focused && (
        <LinearGradient
          colors={['#7C3AED', '#EC4899']}
          start={{x:0, y:0}}
          end={{x:1, y:0}}
          style={styles.activeIndicator}
        />
      )}
      <Text style={[styles.icon, { color: focused ? '#7C3AED' : '#6B7280' }]}>
        {getIcon()}
      </Text>
      <Text
        style={[styles.label, {
          color: focused ? '#7C3AED' : '#6B7280',
          fontWeight: focused ? '600' : '400'
        }]}
      >
        {getLabel()}
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
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 64,
          paddingBottom: 0,
          paddingTop: 0,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
          elevation: 10,
        },
        tabBarActiveTintColor: '#7C3AED',
        tabBarInactiveTintColor: '#6B7280',
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
  tabButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 64,
    paddingTop: 8,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -24,
    width: 48,
    height: 4,
    borderRadius: 999,
  },
  icon: {
    fontSize: 20,
    lineHeight: 20,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
  },
});

export default BottomTabNavigator;