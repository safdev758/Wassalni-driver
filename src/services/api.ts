import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
  ? 'http://localhost:8080/api/v1'
  : 'https://api.wasselni.dz/api/v1';

const WS_BASE_URL = __DEV__
  ? 'ws://localhost:8080/api/v1'
  : 'wss://api.wasselni.dz/api/v1';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    AsyncStorage.setItem('driver_access_token', token);
  } else {
    AsyncStorage.removeItem('driver_access_token');
  }
};

export const getAccessToken = () => accessToken;

export const loadStoredToken = async () => {
  accessToken = await AsyncStorage.getItem('driver_access_token');
  return accessToken;
};

const headers = (): HeadersInit => {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (accessToken) {
    h['Authorization'] = `Bearer ${accessToken}`;
  }
  return h;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

const get = (path: string) =>
  fetch(`${API_BASE_URL}${path}`, { headers: headers() }).then(handleResponse);

const post = (path: string, body?: object | FormData) => {
  const isFormData = body instanceof FormData;
  const h: HeadersInit = {};
  if (accessToken) h['Authorization'] = `Bearer ${accessToken}`;
  if (!isFormData) h['Content-Type'] = 'application/json';

  return fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: h,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  }).then(handleResponse);
};

const put = (path: string, body?: object) =>
  fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  }).then(handleResponse);

const del = (path: string, body?: object) =>
  fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  }).then(handleResponse);

// --- Auth ---
export const authAPI = {
  sendOTP: (phone: string) =>
    post('/auth/phone/send', { phone, user_type: 'driver' }),

  verifyOTP: (phone: string, code: string) =>
    post('/auth/phone/verify', { phone, code, user_type: 'driver' }),
};

// --- Driver Profile ---
export const driverAPI = {
  getProfile: () => get('/driver/profile'),

  updateStatus: (isOnline: boolean, lat?: number, lng?: number) =>
    put('/driver/status', { is_online: isOnline, latitude: lat, longitude: lng }),

  onboardPersonal: (data: { name: string; email: string }) =>
    post('/driver/onboarding/personal-info', data),

  onboardVehicle: (data: {
    make: string; model: string; year: number;
    plate_number: string; color: string; vehicle_type: string;
  }) => post('/driver/onboarding/vehicle-info', data),

  getEarningsToday: () => get('/driver/earnings/today'),

  getTransactions: () => get('/driver/earnings/transactions'),

  getDocuments: () => get('/driver/documents'),
};

// --- Document OCR ---
export const documentAPI = {
  uploadAndVerify: (documentType: string, imageUri: string) => {
    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${documentType}.jpg`,
    } as unknown as Blob);
    return post('/driver/documents/verify', formData);
  },
};

// --- Rides ---
export const rideAPI = {
  accept: (rideId: string) => post(`/rides/${rideId}/accept`),

  counterOffer: (rideId: string, offeredPrice: number) =>
    post(`/rides/${rideId}/counter`, { offered_price: offeredPrice }),

  complete: (rideId: string) => post(`/rides/${rideId}/complete`),

  cancel: (rideId: string, reason?: string) =>
    del(`/rides/${rideId}`, reason ? { reason } : undefined),

  get: (rideId: string) => get(`/rides/${rideId}`),

  rate: (rideId: string, data: {
    stars: number; compliments?: string[]; tip_amount?: number; note?: string;
  }) => post(`/rides/${rideId}/rate`, data),

  sendMessage: (rideId: string, content: string) =>
    post(`/rides/${rideId}/messages`, { content }),

  getMessages: (rideId: string) => get(`/rides/${rideId}/messages`),
};

// --- Reports ---
export const reportAPI = {
  create: (data: {
    subject_type: string; subject_id: string;
    ride_id?: string; category: string; description: string;
  }) => post('/reports', data),
};

// --- Ratings ---
export const ratingAPI = {
  getCompliments: () => get('/ratings/compliments'),
};

// --- WebRTC ---
export const webrtcAPI = {
  getICEServers: () => get('/webrtc/ice-servers'),
  signal: (rideId: string, targetType: string, targetId: string, signal: object) =>
    post(`/rides/${rideId}/call/signal`, { target_type: targetType, target_id: targetId, signal }),
};

// --- WebSocket ---
export type WSMessage = {
  type: string;
  payload: Record<string, unknown>;
};

export type WSHandler = (msg: WSMessage) => void;

let wsConnection: WebSocket | null = null;
let wsHandlers: WSHandler[] = [];
let wsReconnectTimer: ReturnType<typeof setTimeout> | null = null;
let wsIntentionalClose = false;

export const connectWebSocket = () => {
  if (wsConnection?.readyState === WebSocket.OPEN) return;
  wsIntentionalClose = false;

  const url = `${WS_BASE_URL}/ws?token=${accessToken}`;
  wsConnection = new WebSocket(url);

  wsConnection.onopen = () => {
    if (wsReconnectTimer) {
      clearTimeout(wsReconnectTimer);
      wsReconnectTimer = null;
    }
  };

  wsConnection.onmessage = (event) => {
    try {
      const msg: WSMessage = JSON.parse(event.data);
      wsHandlers.forEach(handler => handler(msg));
    } catch (e) {
      console.warn('[WS] Parse error:', e);
    }
  };

  wsConnection.onclose = () => {
    if (!wsIntentionalClose) {
      wsReconnectTimer = setTimeout(connectWebSocket, 3000);
    }
  };

  wsConnection.onerror = () => {};
};

export const disconnectWebSocket = () => {
  wsIntentionalClose = true;
  if (wsReconnectTimer) {
    clearTimeout(wsReconnectTimer);
    wsReconnectTimer = null;
  }
  if (wsConnection) {
    wsConnection.close();
    wsConnection = null;
  }
};

export const addWSHandler = (handler: WSHandler) => {
  wsHandlers.push(handler);
  return () => {
    wsHandlers = wsHandlers.filter(h => h !== handler);
  };
};

export const removeWSHandler = (handler: WSHandler) => {
  wsHandlers = wsHandlers.filter(h => h !== handler);
};
