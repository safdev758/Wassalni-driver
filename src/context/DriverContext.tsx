import React, { createContext, useContext, useState } from 'react';

interface DriverState {
  isOnline: boolean;
  currentRide: Ride | null;
  todayEarnings: number;
  todayTrips: number;
  rating: number;
}

interface Ride {
  id: string;
  type: string;
  pickup: {
    address: string;
    latitude: number;
    longitude: number;
  };
  dropoff: {
    address: string;
    latitude: number;
    longitude: number;
  };
  estimatedFare: number;
  distance: string;
  duration: string;
  rider: {
    name: string;
    rating: number;
  };
}

interface DriverContextType {
  driverState: DriverState;
  setOnline: (isOnline: boolean) => void;
  acceptRide: (ride: Ride) => void;
  rejectRide: () => void;
  completeRide: () => void;
  updateEarnings: (amount: number) => void;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

const initialState: DriverState = {
  isOnline: false,
  currentRide: null,
  todayEarnings: 0,
  todayTrips: 0,
  rating: 0,
};

export function DriverProvider({ children }: { children: React.ReactNode }) {
  const [driverState, setDriverState] = useState<DriverState>(initialState);

  const setOnline = (isOnline: boolean) => {
    setDriverState(prev => ({ ...prev, isOnline }));
  };

  const acceptRide = (ride: Ride) => {
    setDriverState(prev => ({ ...prev, currentRide: ride }));
  };

  const rejectRide = () => {
    setDriverState(prev => ({ ...prev, currentRide: null }));
  };

  const completeRide = () => {
    setDriverState(prev => ({
      ...prev,
      currentRide: null,
      todayTrips: prev.todayTrips + 1,
    }));
  };

  const updateEarnings = (amount: number) => {
    setDriverState(prev => ({
      ...prev,
      todayEarnings: prev.todayEarnings + amount,
    }));
  };

  return (
    <DriverContext.Provider
      value={{
        driverState,
        setOnline,
        acceptRide,
        rejectRide,
        completeRide,
        updateEarnings,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
}

export function useDriver() {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriver must be used within DriverProvider');
  }
  return context;
}
