import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Header from '@/components/Header';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/home/ProfileScreen';


// si usas algún paquete de íconos, importalo acá
// import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                // Header custom para TODAS las tabs
                header: () => <Header />,
                // estilos generales de la barra de tabs
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Inicio',
                    // de momento un ícono dummy; después metemos los que usás vos
                    // tabBarIcon: ({ focused }) => (
                    //   <Icon name="home" size={24} color={focused ? 'tomato' : 'gray'} />
                    // ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Perfil',
                    // tabBarIcon: ({ focused }) => (
                    //   <Icon name="user" size={24} color={focused ? 'tomato' : 'gray'} />
                    // ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;

const styles = StyleSheet.create({
    tabBar: {
        height: 80,
        paddingTop: 7,
    },
});
