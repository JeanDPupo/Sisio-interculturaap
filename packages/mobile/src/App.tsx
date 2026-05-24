import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore, useOfflineStore } from '@sisio/shared';

import {
  SplashScreen,
  OnboardingScreen,
  LoginScreen,
  RegisterScreen,
  HomeScreen,
  PhotoCaptureScreen,
  AudioCaptureScreen,
  BirdResultScreen,
  SightingsScreen,
  MapScreen,
  ProfileScreen,
  SettingsScreen,
} from './screens';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeTab" component={HomeScreen} />
    <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
    <Stack.Screen name="AudioCapture" component={AudioCaptureScreen} />
    <Stack.Screen name="BirdResult" component={BirdResultScreen} />
  </Stack.Navigator>
);

const SightingsStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SightingsTab" component={SightingsScreen} />
    <Stack.Screen name="BirdDetail" component={BirdResultScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: any;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Sightings') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Map') {
          iconName = focused ? 'map' : 'map-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeStackNavigator}
      options={{ title: 'Inicio' }}
    />
    <Tab.Screen
      name="Sightings"
      component={SightingsStackNavigator}
      options={{ title: 'Avistamientos' }}
    />
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{ title: 'Mapa' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Perfil' }}
    />
  </Tab.Navigator>
);

export default function App() {
  const { user, isGuest, isAuthenticated } = useAuthStore();
  const { isOnline } = useOfflineStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(false);
    };

    initializeApp();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  if (!isAuthenticated && !isGuest) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated && isGuest ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
