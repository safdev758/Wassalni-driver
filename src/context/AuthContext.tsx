import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const login = async (phone: string) => {
    // API call to send OTP
    // For now, simulate
    console.log('Sending OTP to:', phone);
  };

  const verifyOTP = async (phone: string, code: string) => {
    // API call to verify OTP
    // For now, simulate
    const mockDriver: Driver = {
      id: 'drv_001',
      phone,
      name: 'Driver',
      isVerified: true,
      isOnboarded: false,
    };
    
    await setStorageItem(AUTH_TOKEN_KEY, 'mock_token');
    await setStorageItem(DRIVER_DATA_KEY, JSON.stringify(mockDriver));
    setDriver(mockDriver);
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
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        driver,
        isAuthenticated: !!driver,
        isLoading,
        login,
        verifyOTP,
        logout,
        clearAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
