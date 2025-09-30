import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiHelper from "../../service/api";
import { baseUrl } from "../../service/endpoint";
import Storage from "../../uitility/Sotrage";
import axios from "axios";
import { startLoading, stopLoading } from "./ui";
import { store } from "../store";

export const newEmployee = createAsyncThunk(
  'employee/register',
  async (
    { employeeid, imagebase64 }: { employeeid: string; imagebase64: string },
    { rejectWithValue }
  ) => {
    try {
        store.dispatch(startLoading());
  const token = await Storage.getItem("accessToken");

      const formData = new FormData();
         formData.append("image", {
        uri: imagebase64,
        name: "face.jpg",
        type: "image/jpeg",
      } as any);
      formData.append("employee_id", employeeid|| "");
      const response = await axios.post(
        `${baseUrl.baseUrl}attendance/register`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            "X-App-key": "33",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
    finally{
        store.dispatch(stopLoading());
    }
  }
);
const addEmp = createSlice({
  name: 'addEmp',
  initialState: {
    empId: null,
    loading: false,
    error: null,
    message: "",
  },
  reducers: {
      resetMessage: (state) => {
    state.message = "";
    state.error = null;
  },
    clearMessage: (state) => {
      state.message = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(newEmployee.pending, (state) => {
        state.loading = true;
    
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
        state.message = action.payload;
      });
  },
});

export const { clearMessage ,resetMessage} = addEmp.actions;
export default addEmp.reducer;