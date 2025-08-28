import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiHelper from "../../service/api";
import Storage from "../../uitility/Sotrage";

export const registerFace = createAsyncThunk(
  'kiosk/mark_attendance',
  async (
    {  imagebase64 }: { imagebase64: string },
    { rejectWithValue }
  ) => {
    try {
           const organization_id = await Storage.getItem('organization_id');
      const response: any = await apiHelper.post(  'kiosk/mark_attendance', {
        collection_id: "dummy_test",
        organization_id:  organization_id,
        image: imagebase64,
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
  name: 'registerfaceSlice',
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
      .addCase(registerFace.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerFace.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.empId = action.payload.employee_id; // assuming API returns this
        state.message = 'Employee registered successfully 🎉';

      
      })
      .addCase(registerFace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload as string;
      });
  },
});

export const { clearMessage ,resetMessage} = addEmp.actions;
export default addEmp.reducer;