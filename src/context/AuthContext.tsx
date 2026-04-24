import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme';

interface Driver {
  id: string;
  phone: string;
  name: string;
  email?: string;
  isVerified: boolean;
  isOnboarded: boolean;
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
      const driverData = await getStorageItem(DRIVER_DATA_KEY);

      if (token && driverData) {
        setDriver(JSON.parse(driverData));
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
    // API call to send OTP
    // For now, simulate
    console.log('Sending OTP to:', phone);
  };

  const verifyOTP = async (phone: string, _code: string) => {
    // API call to verify OTP
    // For now, simulate
    const mockDriver: Driver = {
      id: 'drv_001',
      phone,
      name: '',
      isVerified: true,
      isOnboarded: false,
    };

    await setStorageItem(AUTH_TOKEN_KEY, 'mock_token');
    await persistDriver(mockDriver);
  };

  const completeOnboarding = async () => {
    if (!driver) {
      return;
    }
    await persistDriver({ ...driver, isOnboarded: true });
  };

  const updateDriver = async (updates: Partial<Driver>) => {
    if (!driver) {
      return;
    }
    await persistDriver({ ...driver, ...updates });
  };

  const logout = async () => {
    await deleteStorageItem(AUTH_TOKEN_KEY);
    await deleteStorageItem(DRIVER_DATA_KEY);
    setDriver(null);
  };

  const clearAuthData = async () => {
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
