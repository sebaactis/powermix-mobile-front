import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/home/ProfileScreen';
import { mainColor } from '../constant';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: mainColor,
        tabBarInactiveTintColor: '#CCCCCC',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <MaterialIcon name="home" size={27} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <MaterialIcon name="user" size={27} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    paddingTop: 1,
    backgroundColor: '#2f2d2d',
    borderColor: '#2f2d2d',
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
  },
  tabBarLabel: {
    marginTop: 4,
    fontSize: 13,
  },
});