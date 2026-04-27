import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme';
import { authAPI, driverAPI, setAccessToken, connectWebSocket, disconnectWebSocket } from '../services/api';

interface Driver {
  id: string;
  phone: string;
  name: string;
  email?: string;
  isVerified: boolean;
  isOnboarded: boolean;
  rating?: number;
  status?: string;
}

interface AuthContextType {
  driver: Driver | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  verifyOTP: (phone: string, code: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateDriver: (updates: Partial<Driver>) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'driver_auth_token';
const DRIVER_DATA_KEY = 'driver_data';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthData();
  }, []);

  const getStorageItem = async (key: string) => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  };

  const setStorageItem = async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.setItem(key, value);
    }
    return await SecureStore.setItemAsync(key, value);
  };

  const deleteStorageItem = async (key: string) => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.removeItem(key);
    }
    return await SecureStore.deleteItemAsync(key);
  };

  const loadAuthData = async () => {
    try {
      const token = await getStorageItem(AUTH_TOKEN_KEY);
      if (token) {
        setAccessToken(token);
        try {
          const profile = await driverAPI.getProfile();
          const d: Driver = {
            id: profile.id,
            phone: profile.phone,
            name: profile.name || '',
            email: profile.email,
            isVerified: profile.is_verified,
            isOnboarded: profile.is_onboarded,
            rating: profile.rating,
            status: profile.status,
          };
          setDriver(d);
          await setStorageItem(DRIVER_DATA_KEY, JSON.stringify(d));
          connectWebSocket();
        } catch {
          const driverData = await getStorageItem(DRIVER_DATA_KEY);
          if (driverData) {
            setDriver(JSON.parse(driverData));
            connectWebSocket();
          }
        }
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const persistDriver = async (next: Driver) => {
    await setStorageItem(DRIVER_DATA_KEY, JSON.stringify(next));
    setDriver(next);
  };

  const login = async (phone: string) => {
    await authAPI.sendOTP(phone);
  };

  const verifyOTP = async (phone: string, code: string) => {
    const response = await authAPI.verifyOTP(phone, code);
    const token = response.access_token;
    setAccessToken(token);
    await setStorageItem(AUTH_TOKEN_KEY, token);

    const d = response.driver;
    const driverData: Driver = {
      id: d.id,
      phone: d.phone,
      name: d.name || '',
      email: d.email,
      isVerified: d.is_verified || false,
      isOnboarded: d.is_onboarded || false,
      rating: d.rating,
      status: d.status,
    };

    await persistDriver(driverData);
    connectWebSocket();
  };

  const completeOnboarding = async () => {
    if (!driver) return;
    await persistDriver({ ...driver, isOnboarded: true });
  };

  const updateDriver = async (updates: Partial<Driver>) => {
    if (!driver) return;
    await persistDriver({ ...driver, ...updates });
  };

  const logout = async () => {
    disconnectWebSocket();
    setAccessToken(null);
    await deleteStorageItem(AUTH_TOKEN_KEY);
    await deleteStorageItem(DRIVER_DATA_KEY);
    setDriver(null);
  };

  const clearAuthData = async () => {
    disconnectWebSocket();
    setAccessToken(null);
    await deleteStorageItem(AUTH_TOKEN_KEY);
    await deleteStorageItem(DRIVER_DATA_KEY);
    setDriver(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        driver,
        isAuthenticated: !!driver,
        isLoading,
        login,
        verifyOTP,
        completeOnboarding,
        updateDriver,
        logout,
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
