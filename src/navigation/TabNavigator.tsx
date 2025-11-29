import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import CustomTabBar from '@/components/tabbar/CustomTabBar';
import { MAIN_COLOR } from '../constant';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ProofScreen from '../screens/proof/ProofScreen';
import Header from '@/components/header/Header';
import HelpStackNavigator from './HelpStackNavigator';
import ProofsNavigator from './ProofsNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: MAIN_COLOR,
        tabBarInactiveTintColor: '#CCCCCC',
        tabBarShowLabel: false,
        header: () => <Header />
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
        component={ProofsNavigator}
        options={{
          title: 'Comprobantes',
          tabBarIcon: ({ color }) => (
            <Icon name="wpforms" size={25} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Help"
        component={HelpStackNavigator}
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

