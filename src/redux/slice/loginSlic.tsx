import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiHelper from '../../service/api';
import Storage from '../../uitility/Sotrage';


// Async thunk for login API call
export const loginUser = createAsyncThunk(
  '',
  async ({ email, password ,orgkey}: { email: string; password: string ,orgkey:string}, { rejectWithValue }) => {
    try {
      // Use apiHelper instead of raw axios
 const response:any = await apiHelper.post('device_login', {
 device_email: email,
  password:password,
  org_key:orgkey,
  mobile_app: "true"    
      });
      // Assuming API returns { access_token, refresh_token, user }
      return response.data;
    } catch (error: any) {
            return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    email: '',
    password: '',
    user: null,
    accessToken: null,
    refreshToken: null,
    organization_id:null,

    loading: false,
    loginaccess:false,
    error: null,
    message: null,   // 👈 add here
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.email = '';
      state.password = '';
    },
    clearMessage: (state) => {   // 👈 new reducer
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
         state.loginaccess = true;
        Storage.setItem('accessToken', action.payload.access_token);
        Storage.setItem('refreshToken', action.payload.refresh_token);
         Storage.setItem('organization_id', action.payload.organization_id);
        Storage.setItem('loginaccess', true);
        Storage.setItem('user_name', action.payload.user_name);
        Storage.setItem('device_name', action.payload.device_name);
        Storage.setItem('device_email', action.payload.device_email);
        Storage.setItem('password', action.payload.password);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload as string; // 👈 failure msg
      });
  },
});

export const { setEmail, setPassword, logout } = loginSlice.actions;
export default loginSlice.reducer;
