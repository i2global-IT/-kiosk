import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiHelper from "../../service/api";

// Async thunk for API call
export const fetchDevices :any= createAsyncThunk(
  "devices/fetchDevices",
  async (_, { rejectWithValue }) => {
    try {
        const response: any = await apiHelper.get('kiosk/devices',); 
   console.log("deice response....",response?.data)
      return response.data; // expecting an array
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const deviceSlice = createSlice({
  name: "Settingslice",
  initialState: {
    devices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default deviceSlice.reducer;
