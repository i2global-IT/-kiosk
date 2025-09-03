import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../redux/slice/counterSlice';
import lognReducer from '../redux/slice/loginSlic';
import ui from './slice/ui';
import addEmp from './slice/addEmp';
import registerfaceSlice, { registerFace } from './slice/registerfaceSlice';
import Settingslice from './slice/Settingslice';
import PunchHisSlice from './slice/PunchHisSlice';
import FilterSlice from './slice/FilterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    login:lognReducer,
    ui:ui,
    addEmp:addEmp,
  registerFace:registerfaceSlice,
  Settingslice:Settingslice,
  PunchHisSlice:PunchHisSlice,
  FilterSlice:FilterSlice
  },
});
// ✅ Type for the whole state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;