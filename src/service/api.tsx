// api.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import Storage from '../uitility/Sotrage';
import { store } from '../redux/store';
import { startLoading, stopLoading } from '../redux/slice/ui';

// Endpoints that do NOT require token
const EXCLUDE_TOKEN = ['device_login'];
  const token =  Storage.getItem('accessToken');
// ----------- Helpers for pretty, safe logging -----------
let REQ_COUNTER = 0;
const nextReqId = () => `REQ-${++REQ_COUNTER}-${Date.now()}`;

const SENSITIVE_KEYS = ['password', 'pass', 'pwd', 'token', 'access_token', 'Authorization'];
const maskSensitive = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(maskSensitive);
  const copy: any = {};
  Object.keys(obj).forEach((k) => {
    if (SENSITIVE_KEYS.includes(k)) {
      copy[k] = '***';
    } else if (obj[k] && typeof obj[k] === 'object') {
      copy[k] = maskSensitive(obj[k]);
    } else {
      copy[k] = obj[k];
    }
  });
  return copy;
};

// Extend Axios config to keep metadata (id + timings)
type AxiosConfigWithMeta = AxiosRequestConfig & {
  metadata?: { id: string; startTime: number };
};

// Create instance
const api = axios.create({
  baseURL: 'https://devhrms.i2global.co.in/api/v2/',
  timeout: 10000,
});


// ---------------- REQUEST INTERCEPTOR ----------------
api.interceptors.request.use(
  async (config: AxiosConfigWithMeta) => {
    // Start loader
    store.dispatch(startLoading());

    // Attach metadata
    const id = nextReqId();
    config.metadata = { id, startTime: Date.now() };

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert('No Internet', 'Please check your internet connection.');
  
      store.dispatch(stopLoading()); // Stop loader
      return Promise.reject({ message: 'No internet connection' });
    }

    // STEP 3: Token decision
    const requiresToken = !EXCLUDE_TOKEN.some((url) => (config.url ?? '').includes(url));
    console.log(`🔷 [${id}] STEP 3: Token required = ${requiresToken}`);
    if (requiresToken) {
      const token = await Storage.getItem('accessToken');
      console.log(`🔷 [${id}] Token ${token ? 'FOUND' : 'NOT FOUND'}`);
      if (token) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${token}`,
          "X-App-Key":"33"
        };
      }
    }

  
    console.log(`🔷 [${id}] Request ready → sending...\n`);
    return config;
  },
  (error: AxiosError) => {
    store.dispatch(stopLoading()); // Stop loader if request build fails
    console.log('❌ Request build error:', error.message);
    return Promise.reject(error);
  }
);

// ---------------- RESPONSE INTERCEPTOR ----------------
// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    store.dispatch(stopLoading()); // stop loader on success
    return response;
  },
  async (error: AxiosError) => {
    store.dispatch(stopLoading()); // stop loader on error

    if (!error.response) {
      Alert.alert('Network Error', 'Please check your internet connection.');
      return Promise.reject({ message: 'Network Error', error });
    }

    const { status, data } = error.response;
    console.log(`HTTP ${status} error:`, maskSensitive(data));
    return Promise.reject(error);
  }
);


// ---------------- API HELPER (logs at call site too) ----------------
const DEFAULT_HEADERS = { 'X-App-key': '33' };

// ---------------- API HELPER (logs at call site too) ----------------


const apiHelper = {
get: async (url: string, params: any = {}, headers: any = {}) => {
  const id = nextReqId();


  return api.get(url, {
    params,
    headers: {
      ...DEFAULT_HEADERS,
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
},
  post: async (url: string, data: any = {}, headers: any = {}) => {
    const id = nextReqId();
    console.log(`📗 [${id}] POST call → ${url}`);
    console.log(`📗 [${id}] Payload:`,data);
    console.log(`📗 [${id}] Extra headers:`, maskSensitive(headers));

    return api.post(url, data, {
      headers: {
        ...DEFAULT_HEADERS,
        ...(headers || {}),
      },
    });
  },

  put: async (url: string, data: any = {}, headers: any = {}) => {
    const id = nextReqId();
    return api.put(url, data, {
      headers: {
        ...DEFAULT_HEADERS,
        ...(headers || {}),
      },
    });
  },

  delete: async (url: string, data: any = {}, headers: any = {}) => {
    const id = nextReqId();
    return api.delete(url, {
      data,
      headers: {
        ...DEFAULT_HEADERS,
        ...(headers || {}),
      },
    });
  },
};


export default apiHelper;
