import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import type { RootStackParamList, MainTabParamList } from '../types/navigation';

// Auth Screens
import QuickLoginScreen from '../screens/auth/QuickLoginScreen';
import PhoneAuthScreen from '../screens/auth/PhoneAuthScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';

// Onboarding Screens
import PersonalDocumentsScreen from '../screens/onboarding/PersonalDocumentsScreen';
import VehicleInformationScreen from '../screens/onboarding/VehicleInformationScreen';
import DraftsScreen from '../screens/DraftsScreen';

// Main Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import RadarDashboardScreen from '../screens/main/RadarDashboardScreen';
import RideRequestScreen from '../screens/main/RideRequestScreen';

// Earnings Screens
import EarningsScreen from '../screens/earnings/EarningsScreen';
import TripHistoryScreen from '../screens/earnings/TripHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1b1b1b',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingBottom: 24,
          paddingTop: 12,
          height: 80,
        },
        tabBarActiveTintColor: '#b7c4ff',
        tabBarInactiveTintColor: '#393939',
      }}
    >
      <Tab.Screen 
        name="RadarDashboard" 
        component={RadarDashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="TripHistory" 
        component={TripHistoryScreen}
        options={{ title: 'Activity' }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen}
        options={{ title: 'Wallet' }}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, driver } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Group>
            <Stack.Screen name="QuickLogin" component={QuickLoginScreen} />
            <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          </Stack.Group>
        ) : !driver?.isOnboarded ? (
          // Onboarding Stack
          <Stack.Group>
            <Stack.Screen name="PersonalDocuments" component={PersonalDocumentsScreen} />
            <Stack.Screen name="VehicleInformation" component={VehicleInformationScreen} />
            <Stack.Screen name="Drafts" component={DraftsScreen} />
          </Stack.Group>
        ) : (
          // Main App Stack
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen 
              name="RideRequest" 
              component={RideRequestScreen}
              options={{ presentation: 'modal' }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
