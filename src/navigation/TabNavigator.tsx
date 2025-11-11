import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import CustomTabBar from '@/components/tabbar/CustomTabBar';
import { MAIN_COLOR } from '../constant';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/home/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: MAIN_COLOR,
        tabBarInactiveTintColor: '#CCCCCC',
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={27} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Icon name="user-circle-o" size={25} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Proofs"
        component={ProfileScreen}
        options={{
          title: 'Comprobantes',
          tabBarIcon: ({ color }) => (
            <Icon name="wpforms" size={25} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Help"
        component={ProfileScreen}
        options={{
          title: 'Ayuda',
          tabBarIcon: ({ color }) => (
            <Icon name="question-circle-o" size={25} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

