import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, type BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
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
import RideNavigationScreen from '../screens/main/RideNavigationScreen';

// Earnings Screens
import EarningsScreen from '../screens/earnings/EarningsScreen';
import TripHistoryScreen from '../screens/earnings/TripHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<keyof MainTabParamList, { active: TabIconName; inactive: TabIconName }> = {
  RadarDashboard: { active: 'home', inactive: 'home-outline' },
  TripHistory: { active: 'list', inactive: 'list-outline' },
  Earnings: { active: 'wallet', inactive: 'wallet-outline' },
  Dashboard: { active: 'person', inactive: 'person-outline' },
};

function MainTabs() {
  const { t } = useTranslation();

  const renderTabIcon =
    (name: keyof MainTabParamList): BottomTabNavigationOptions['tabBarIcon'] =>
    ({ focused, color, size }) => {
      const iconName = focused ? TAB_ICONS[name].active : TAB_ICONS[name].inactive;
      return <Ionicons name={iconName} size={size} color={color} />;
    };

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
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="RadarDashboard"
        component={RadarDashboardScreen}
        options={{ title: t('main.home'), tabBarIcon: renderTabIcon('RadarDashboard') }}
      />
      <Tab.Screen
        name="TripHistory"
        component={TripHistoryScreen}
        options={{ title: t('main.activity'), tabBarIcon: renderTabIcon('TripHistory') }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{ title: t('main.wallet'), tabBarIcon: renderTabIcon('Earnings') }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: t('main.profile'), tabBarIcon: renderTabIcon('Dashboard') }}
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
          <Stack.Group>
            <Stack.Screen name="QuickLogin" component={QuickLoginScreen} />
            <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          </Stack.Group>
        ) : !driver?.isOnboarded ? (
          <Stack.Group>
            <Stack.Screen name="PersonalDocuments" component={PersonalDocumentsScreen} />
            <Stack.Screen name="VehicleInformation" component={VehicleInformationScreen} />
            <Stack.Screen name="Drafts" component={DraftsScreen} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="RideRequest"
              component={RideRequestScreen}
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="RideNavigation" component={RideNavigationScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
