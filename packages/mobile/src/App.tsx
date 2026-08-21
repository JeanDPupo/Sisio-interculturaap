import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore, useOfflineStore } from '@sisio/shared';
import { theme } from './theme';
import Reanimated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

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

const IdentifyStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="IdentifyChooser" component={HomeScreen} />
    <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
    <Stack.Screen name="AudioCapture" component={AudioCaptureScreen} />
    <Stack.Screen name="BirdResult" component={BirdResultScreen} />
  </Stack.Navigator>
);

const FABButton = ({ onPress }: { onPress: () => void }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.9, { damping: 15 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15 }); };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.fabContainer}
    >
      <Reanimated.View style={[styles.fab, animatedStyle]}>
        <Feather name="camera" size={26} color="#F0F7EE" />
      </Reanimated.View>
    </TouchableOpacity>
  );
};

const MainTabNavigator = () => {
  const navigationRef = React.useRef<any>(null);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Sightings') iconName = 'list';
          else if (route.name === 'Map') iconName = 'map';
          else if (route.name === 'Profile') iconName = 'user';
          return <Feather name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
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
        name="Identify"
        component={IdentifyStackNavigator}
        options={{
          title: '',
          tabBarButton: () => (
            <FABButton
              onPress={() => navigationRef.current?.navigate('Home', { screen: 'PhotoCapture' })}
            />
          ),
        }}
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
};

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
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
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
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(13, 27, 15, 0.95)',
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  fabContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(212, 160, 23, 0.3)',
  },
});
