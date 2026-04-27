import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, type BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import SettingsScreen from '../screens/main/SettingsScreen';
import HelpScreen from '../screens/profile/HelpScreen';
import TermsOfServiceScreen from '../screens/profile/TermsOfServiceScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';

// Earnings Screens
import EarningsScreen from '../screens/earnings/EarningsScreen';
import TripHistoryScreen from '../screens/earnings/TripHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconName = keyof typeof Ionicons.glyphMap;

const TAB_CONFIG: { name: keyof MainTabParamList; activeIcon: TabIconName; inactiveIcon: TabIconName; labelKey: string }[] = [
  { name: 'RadarDashboard', activeIcon: 'navigate', inactiveIcon: 'navigate-outline', labelKey: 'main.home' },
  { name: 'TripHistory', activeIcon: 'time', inactiveIcon: 'time-outline', labelKey: 'main.activity' },
  { name: 'Earnings', activeIcon: 'wallet', inactiveIcon: 'wallet-outline', labelKey: 'main.wallet' },
  { name: 'Dashboard', activeIcon: 'person', inactiveIcon: 'person-outline', labelKey: 'main.profile' },
];

const TAB_COMPONENTS: Record<keyof MainTabParamList, React.ComponentType<any>> = {
  RadarDashboard: RadarDashboardScreen,
  TripHistory: TripHistoryScreen,
  Earnings: EarningsScreen,
  Dashboard: DashboardScreen,
};

function MainTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLow + 'E6',
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -12 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          height: 64 + insets.bottom,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
        },
        tabBarBackground: () => null,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.surfaceBright,
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={TAB_COMPONENTS[tab.name]}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={focused ? tabStyles.activeTab : tabStyles.inactiveTab}>
                <Ionicons
                  name={focused ? tab.activeIcon : tab.inactiveIcon}
                  size={22}
                  color={focused ? colors.onPrimary : colors.surfaceBright}
                />
                <Text style={focused ? tabStyles.activeLabel : tabStyles.inactiveLabel}>
                  {t(tab.labelKey)}
                </Text>
              </View>
            ),
            tabBarLabel: () => null,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  activeTab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: colors.onPrimaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  inactiveTab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  activeLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.onPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  inactiveLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.surfaceBright,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
});

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
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
