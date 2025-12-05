import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MentorsScreen from './MentorsScreen';
import MySessions from './MySessions';

const Tab = createMaterialTopTabNavigator();

const Mentorship = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Browse Mentors" component={MentorsScreen} />
      <Tab.Screen name="My Sessions" component={MySessions} />
    </Tab.Navigator>
  );
};

export default Mentorship;