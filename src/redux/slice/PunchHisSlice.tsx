import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiHelper from '../../service/api';
export const dailyattendance = createAsyncThunk(
  "daily/live_attendance/list",
  async (
    {
      page,
      per_page,
      department,
      desgination,
      status,
      date
    }: {
      page?: number;
      per_page?: number;
      department?: any;
      desgination?: any;
      status?: string;
      date?: string;
    },
    { rejectWithValue }
  ) => {
    try {
       console.log("live_attendance....");
      const response: any = await apiHelper.get(
        `daily/live_attendance/list?page=${page}&per_page=${per_page}${
          department ? `&department_name=${department}` : ""}
          ${
          desgination ? `&designation_name=${desgination}` : ""}
            ${
          status ? `&status=${status}` : ""}
           ${
          date ? `&date=${date}` : ""}`
          
      );

      console.log("live_attendance....", response?.data);
      return response.data;
    } catch (error: any) {
     
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



const PunchHisSlice = createSlice({
  name: 'PunchHisSlice',
  initialState: {
    employee_details: [] as any[],
    loading: false,
    error: null as string | null,
    message: null as string | null,
    page: 1,
    hasMore: true,
  },
  reducers: {
    resetMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    resetAttendance: (state) => { // for refreshing
      state.employee_details = [];
      state.page = 1;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(dailyattendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(dailyattendance.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // If API returns an empty array, no more data
        if (!action.payload.employee_details?.length) {
          state.hasMore = false;
        } else {
          // Append new data instead of replacing
          state.employee_details = [
            ...state.employee_details,
            ...action.payload.employee_details,
          ];
          state.page += 1; // increment page
        }
      })
      .addCase(dailyattendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export default PunchHisSlice.reducer;
