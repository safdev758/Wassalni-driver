import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { driverAPI, rideAPI, addWSHandler, removeWSHandler, type WSMessage } from '../services/api';

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
    id: string;
    name: string;
    rating: number;
  };
}

interface DriverState {
  isOnline: boolean;
  currentRide: Ride | null;
  pendingRide: Ride | null;
  todayEarnings: number;
  todayTrips: number;
  rating: number;
}

interface DriverContextType {
  driverState: DriverState;
  setOnline: (isOnline: boolean) => Promise<void>;
  acceptRide: (ride: Ride) => Promise<void>;
  rejectRide: () => void;
  completeRide: () => Promise<void>;
  updateEarnings: (amount: number) => void;
  sendCounterOffer: (rideId: string, price: number) => Promise<void>;
  fetchEarnings: () => Promise<void>;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

const initialState: DriverState = {
  isOnline: false,
  currentRide: null,
  pendingRide: null,
  todayEarnings: 0,
  todayTrips: 0,
  rating: 0,
};

export function DriverProvider({ children }: { children: React.ReactNode }) {
  const [driverState, setDriverState] = useState<DriverState>(initialState);

  const handleWSMessage = useCallback((msg: WSMessage) => {
    const payload = msg.payload as Record<string, unknown>;

    switch (msg.type) {
      case 'ride_request': {
        const pickup = payload.pickup as Record<string, unknown>;
        const dropoff = payload.dropoff as Record<string, unknown>;
        const rider = payload.rider as Record<string, unknown>;
        const ride: Ride = {
          id: payload.ride_id as string,
          type: payload.type as string,
          pickup: {
            address: pickup.address as string,
            latitude: pickup.latitude as number,
            longitude: pickup.longitude as number,
          },
          dropoff: {
            address: dropoff.address as string,
            latitude: dropoff.latitude as number,
            longitude: dropoff.longitude as number,
          },
          estimatedFare: payload.estimated_fare as number,
          distance: payload.distance as string || '',
          duration: payload.duration as string || '',
          rider: {
            id: '',
            name: rider.name as string,
            rating: rider.rating as number,
          },
        };
        setDriverState(prev => ({ ...prev, pendingRide: ride }));
        break;
      }
      case 'ride_cancelled':
        setDriverState(prev => ({
          ...prev,
          currentRide: null,
          pendingRide: null,
        }));
        break;
      case 'offer_accepted':
        setDriverState(prev => ({
          ...prev,
          currentRide: prev.pendingRide || prev.currentRide,
          pendingRide: null,
        }));
        break;
    }
  }, []);

  useEffect(() => {
    addWSHandler(handleWSMessage);
    return () => removeWSHandler(handleWSMessage);
  }, [handleWSMessage]);

  const setOnline = async (isOnline: boolean) => {
    try {
      await driverAPI.updateStatus(isOnline);
      setDriverState(prev => ({ ...prev, isOnline }));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const acceptRide = async (ride: Ride) => {
    await rideAPI.accept(ride.id);
    setDriverState(prev => ({
      ...prev,
      currentRide: ride,
      pendingRide: null,
    }));
  };

  const rejectRide = () => {
    setDriverState(prev => ({ ...prev, pendingRide: null }));
  };

  const completeRide = async () => {
    const currentRide = driverState.currentRide;
    if (!currentRide) return;
    try {
      await rideAPI.complete(currentRide.id);
      setDriverState(prev => ({
        ...prev,
        currentRide: null,
        todayTrips: prev.todayTrips + 1,
      }));
    } catch (error) {
      console.error('Failed to complete ride:', error);
    }
  };

  const updateEarnings = (amount: number) => {
    setDriverState(prev => ({
      ...prev,
      todayEarnings: prev.todayEarnings + amount,
    }));
  };

  const sendCounterOffer = async (rideId: string, price: number) => {
    await rideAPI.counterOffer(rideId, price);
  };

  const fetchEarnings = async () => {
    try {
      const data = await driverAPI.getEarningsToday();
      setDriverState(prev => ({
        ...prev,
        todayEarnings: data.today_earnings || 0,
        todayTrips: data.today_trips || 0,
      }));
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    }
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
        sendCounterOffer,
        fetchEarnings,
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
