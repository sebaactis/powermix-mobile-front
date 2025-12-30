import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MAIN_COLOR } from '../constant';

import CustomTabBar from '@/components/tabbar/CustomTabBar';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import VoucherScreen from '../screens/voucher/VoucherScreen';
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
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <Icon name="user-circle-o" size={23} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Proofs"
        component={ProofsNavigator}
        options={{
          title: 'Comprobantes',
          tabBarIcon: ({ color }) => (
            <Icon name="wpforms" size={23} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Vouchers"
        component={VoucherScreen}
        options={{
          title: 'QRs',
          tabBarIcon: ({ color }) => (
            <Icon name="qrcode" size={23} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Help"
        component={HelpStackNavigator}
        options={{
          title: 'Ayuda',
          tabBarIcon: ({ color }) => (
            <Icon name="question-circle-o" size={23} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

