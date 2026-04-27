const API_BASE_URL = __DEV__
  ? 'http://localhost:8080/api/v1'
  : 'https://api.wasselni.dz/api/v1';

const WS_BASE_URL = __DEV__
  ? 'ws://localhost:8080/api/v1'
  : 'wss://api.wasselni.dz/api/v1';

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

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
    post('/driver/auth/phone/send', { phone, country_code: 'DZ' }),

  verifyOTP: (phone: string, code: string) =>
    post('/driver/auth/phone/verify', { phone, code }),
};

// --- Driver Profile ---
export const driverAPI = {
  getProfile: () => get('/driver/profile'),

  updateStatus: (isOnline: boolean, lat?: number, lng?: number) =>
    put('/driver/status', { is_online: isOnline, location: lat != null && lng != null ? { latitude: lat, longitude: lng } : undefined }),

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
  accept: (rideId: string) => post(`/driver/rides/${rideId}/accept`),

  counterOffer: (rideId: string, offeredPrice: number) =>
    post(`/driver/rides/${rideId}/counter`, { offered_price: offeredPrice }),

  complete: (rideId: string) => post(`/driver/rides/${rideId}/complete`),

  cancel: (rideId: string, reason?: string) =>
    del(`/driver/rides/${rideId}`, reason ? { reason } : undefined),

  get: (rideId: string) => get(`/driver/rides/${rideId}`),

  rate: (rideId: string, data: {
    rating: number; compliments?: string[]; tip_amount?: number; note?: string;
  }) => post(`/driver/rides/${rideId}/rate`, data),

  sendMessage: (rideId: string, message: string) =>
    post(`/driver/rides/${rideId}/messages`, { message }),

  getMessages: (rideId: string) => get(`/driver/rides/${rideId}/messages`),
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
let wsReconnectAttempts = 0;
const WS_MAX_RECONNECT = 5;

export const connectWebSocket = () => {
  if (wsConnection?.readyState === WebSocket.OPEN || wsConnection?.readyState === WebSocket.CONNECTING) return;
  if (!accessToken) return;
  wsIntentionalClose = false;

  const url = `${WS_BASE_URL}/ws?token=${accessToken}`;
  wsConnection = new WebSocket(url);

  wsConnection.onopen = () => {
    wsReconnectAttempts = 0;
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

  wsConnection.onclose = (event) => {
    if (wsIntentionalClose) return;
    // 4001/4003 = auth rejected by server — don't retry
    if (event.code === 4001 || event.code === 4003 || event.code === 1008) return;
    if (wsReconnectAttempts >= WS_MAX_RECONNECT) return;
    wsReconnectAttempts++;
    wsReconnectTimer = setTimeout(connectWebSocket, 3000);
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
