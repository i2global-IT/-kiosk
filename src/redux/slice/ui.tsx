// uiSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { loadingCount: 0 },
  reducers: {
    startLoading: (state) => { state.loadingCount += 1; },
    stopLoading: (state) => { state.loadingCount = Math.max(0, state.loadingCount - 1); },
  },
});

export const { startLoading, stopLoading } = uiSlice.actions;
export default uiSlice.reducer;
