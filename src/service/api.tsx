// api.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import Storage from '../uitility/Sotrage';
import { store } from '../redux/store';
import { startLoading, stopLoading } from '../redux/slice/ui';
import { baseUrl } from './endpoint';

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
  baseURL: `${baseUrl.baseUrl}`,
  timeout: 10000,
});


// ---------------- REQUEST INTERCEPTOR ----------------
api.interceptors.request.use(
  async (config: AxiosConfigWithMeta) => {
    store.dispatch(startLoading());

    const id = nextReqId();
    config.metadata = { id, startTime: Date.now() };

    const state = await NetInfo.fetch();
    // if (!state.isConnected) {
    //   store.dispatch(stopLoading());
    //   Alert.alert('No Internet', 'Please check your internet connection.');
    //   return Promise.reject(new Error('No internet connection'));
    // }

    // Only add token if needed
    const requiresToken = !EXCLUDE_TOKEN.some((url) => (config.url ?? '').includes(url));
    if (requiresToken) {
      const token = await Storage.getItem('accessToken');
      
      if (token) {
        config.headers = {
          ...config.headers, // ✅ don’t drop existing headers (like FormData)
          Authorization: `Bearer ${token}`,
          "X-App-Key": "33",
        };
      }
    }

    return config;
  },
  (error: AxiosError) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

export let navigationRef:any = null;
export const setNavigationRef = (ref) => {
  navigationRef = ref;
};
// ---------------- RESPONSE INTERCEPTOR ----------------
// Response interceptor
// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    store.dispatch(stopLoading());
    return response;
  },
  async (error: AxiosError) => {
    store.dispatch(stopLoading());

    if (!error.response) {
      return Promise.reject({
        message: 'Network Error',
        status: 0,
      });
    }

    const { status, data } = error.response;

    // Extract clean error
    const customError = {
      status,
      message: (data as any)?.message || `Request failed with status ${status}`,
    };


    // 🚨 Handle 401 Unauthorized
    if (status === 401) {
   

      // Navigate to Login screen
      // if you are using navigationRef
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'login' }],
      });
    }

    return Promise.reject(customError);
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

    return api.post(url, data, {
      headers: {
        ...DEFAULT_HEADERS,
        ...(headers || {}),
      },
    });
  },

  put: async (url: string, data: any = {}, headers: any = {}) => {
 
    return api.put(url, data, {
      headers: {
        ...DEFAULT_HEADERS,
        ...(headers || {}),
      },
    });
  },

  delete: async (url: string, data: any = {}, headers: any = {}) => {

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
