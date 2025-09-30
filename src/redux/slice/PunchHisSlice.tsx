import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiHelper from '../../service/api';
export const dailyattendance:any = createAsyncThunk(
  "daily/live_attendance/list",
  async (
    {
      page,
      per_page,
      department,
      desgination,
      status,
      date,
          search,   // 👈 added here

    }: {
      page?: number;
      per_page?: number;
      department?: string;
      desgination?: string;
      status?: string;
      date?: string;
          search?: string;   // 👈 added here

    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();

      if (page !== undefined) params.append("page", page.toString());
      if (per_page !== undefined) params.append("per_page", per_page.toString());
      if (department) params.append("department_name", department.trim());
      if (desgination) params.append("designation_name", desgination.trim());
      if (status) params.append("status", status.trim());
      if (date) params.append("attendance_date", date.trim());
          if (search) params.append("search", search.trim()); // 👈 added search param

      const url = `daily/live_attendance/list?${params.toString()}`;
      const response: any = await apiHelper.get(url);
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

  const { employee_details = [], pagination } = action.payload || {};

  if (!employee_details.length) {
    state.hasMore = false;
    return;
  }

  // normalize employee data with latest photo/time
  const normalizedEmployees = employee_details.map((emp: any) => {
    if (!emp.attendance_results?.length) return emp;

    const latest = [...emp.attendance_results].sort((a, b) => {
      const timeA = new Date(a.punch_out_time || a.punch_in_time).getTime();
      const timeB = new Date(b.punch_out_time || b.punch_in_time).getTime();
      return timeB - timeA;
    })[0];

    return {
      ...emp,
      latestPhoto: latest.outtime_photo_url || latest.intime_photo_url,
      latestTime: latest.punch_out_time || latest.punch_in_time
        ? new Date(latest.punch_out_time || latest.punch_in_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "--:--",
    };
  });

  // Append new data
  state.employee_details = [...state.employee_details, ...normalizedEmployees];

  // 🔹 Check pagination before increment
  if (pagination?.page < pagination?.total_pages) {
    state.page += 1;
    state.hasMore = true;
  } else {
    state.hasMore = false;
  }
})

      .addCase(dailyattendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAttendance } = PunchHisSlice.actions;
export default PunchHisSlice.reducer;
