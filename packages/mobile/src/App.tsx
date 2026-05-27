import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore, useOfflineStore } from '@sisio/shared';
import { theme, tabBarStyle } from './theme';

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
      tabBarActiveTintColor: theme.colors.secondary,
      tabBarInactiveTintColor: theme.colors.textSecondary,
      tabBarStyle,
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

const navTheme = {
  dark: true,
  colors: {
    primary: theme.colors.secondary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.accent,
  },
};

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
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
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
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
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
