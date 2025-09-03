//  desingation: 'employee_designation',
//   workType: 'employee_work_type',
//   department: 'employee_department',

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiHelper from "../../service/api";

export const desingation = createAsyncThunk(
  'employee_designation',
  async ( ) => {
    try {
     
      const response: any = await apiHelper.get('employee_designation');

      console.log('Employee Register Response >>>', response.data);

      return response.data;
    } catch (error: any) {
      console.log('Employee Register Error >>>', error);
     
    }
  }
);
export const department = createAsyncThunk(
  'employee_department',
  async ( ) => {
    try {
     
      const response: any = await apiHelper.get('employee_department');

      console.log('Employee Register Response >>>', response.data);

      return response.data;
    } catch (error: any) {
      console.log('Employee Register Error >>>', error);
    }
  }
);
const FilterSlice = createSlice({
  name: 'FilterSlice',
  initialState: {
    departmentlist: null,
    desingationList:null,
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
      .addCase(desingation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(desingation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.desingationList = action.payload; // assuming API returns this
      
console.log("desingation list.....",state.desingationList)
      
      })
   .addCase(department.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(department.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.departmentlist = action.payload; // assuming API returns this
      

      
      })
  
  },
});

export const { clearMessage ,resetMessage} = FilterSlice.actions;
export default FilterSlice.reducer;