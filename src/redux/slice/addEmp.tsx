import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiHelper from "../../service/api";

export const newEmployee = createAsyncThunk(
  'employee/register',
  async (
    { employeeid, imagebase64 }: { employeeid: string; imagebase64: string },
    { rejectWithValue }
  ) => {
    try {
      const response: any = await apiHelper.post('attendance/register', {
        employee_id: "INIT010",
        image: imagebase64,
        collection_id: 'dummy_test',
      });

      console.log('Employee Register Response >>>', response.data);

      return response.data;
    } catch (error: any) {
      console.log('Employee Register Error >>>', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);
const addEmp = createSlice({
  name: 'addEmp',
  initialState: {
    empId: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
      resetMessage: (state) => {
    state.message = null;
    state.error = null;
  },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(newEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.empId = action.payload.employee_id; // assuming API returns this
        state.message = 'Employee registered successfully 🎉';

      
      })
      .addCase(newEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload as string;
      });
  },
});

export const { clearMessage ,resetMessage} = addEmp.actions;
export default addEmp.reducer;