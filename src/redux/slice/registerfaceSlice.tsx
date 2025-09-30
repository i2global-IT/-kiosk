import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiHelper from "../../service/api";
import axios from "axios";
import Storage from "../../uitility/Sotrage";
import { startLoading, stopLoading } from "./ui";
import { store } from "../store";
import { baseUrl } from "../../service/endpoint";



export const registerFace = createAsyncThunk(
  "kiosk/mark_attendance",
  async ({ imageUri ,punchTime,address}: { imageUri: string,punchTime:string ,address:String}, { rejectWithValue }) => {
    try {
      store.dispatch(startLoading());
      const token = await Storage.getItem("accessToken");
      const formData = new FormData();
     formData.append("punch", punchTime|| "");
     formData.append("intime_geolocation", address||"");
      formData.append("file", {
        uri: imageUri,
        name: "face.jpg",
        type: "image/jpeg",
      } as any);
     
      const response = await axios.post(
        `${baseUrl.baseUrl}kiosk/mark_attendance`,
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
      return { status: response.status, data: response.data };
    } catch (error: any) {
      store.dispatch(stopLoading());
      if (axios.isAxiosError(error) && error.response?.data) {
        const backendMessage = error.response.data?.error || error.response.data?.message;
        // Check for "no faces" error
        const message =
          backendMessage?.includes("There are no faces") ||
          backendMessage?.includes("InvalidParameterException")
            ? "No face detected in the image. Please make sure your face is clearly visible."
            : backendMessage || "Something went wrong.";

        return rejectWithValue({
          status: error.response.status,
          message,
        });
      }

      return rejectWithValue({
        status: 0,
        message: error.message || "Something went wrong",
      });
    } finally {
      store.dispatch(stopLoading());
    }
  }
);


const addEmp = createSlice({
  name: "addEmp",
  initialState: {
    details: null,
    loading: false,
    error: null,
    message: null,
    fileUri: null,
    status: null, // store status code
  },
  reducers: {
    resetMessage: (state) => {
      state.message = null;
      state.error = null;
      state.status = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setFileUri: (state, action) => {
      state.fileUri = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerFace.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.status = null;
      })
      .addCase(registerFace.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
          state.details = action.payload.data?.data?.response || null;

        state.message =
          action.payload.data.message || "Employee registered successfully 🎉";
        state.status = action.payload.status;
    
      })
      .addCase(registerFace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.message = action.payload?.message || "Something went wrong";
        state.status = action.payload?.status || 0;
    
      });
  },
});



export const { clearMessage, resetMessage, setFileUri, } = addEmp.actions;
export default addEmp.reducer;
