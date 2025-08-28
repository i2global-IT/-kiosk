import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDevices } from "../redux/slice/Settingslice";
import { RootState } from "../redux/store";


export default function SettingViewModel() {
  const dispatch = useDispatch();

  // Selectors
  const devices = useSelector((state:RootState) => state.Settingslice.devices);
  const loading = useSelector((state:RootState) => state.Settingslice.loading);
  const error = useSelector((state:RootState) => state.Settingslice.error);

  // API Call
  const getDevices = () => {
    dispatch(fetchDevices());
  };

  // Auto fetch when ViewModel is used


  return {
devices,
    // loading,
    // error,
    getDevices, // expose if component wants to refresh manually
  };
}
