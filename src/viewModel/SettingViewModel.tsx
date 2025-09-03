import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDevices } from "../redux/slice/Settingslice";
import { RootState } from "../redux/store";
import Storage from "../uitility/Sotrage";


export default function SettingViewModel() {


  // // Selectors
  // const devices = useSelector((state:RootState) => state.Settingslice.devices);
  // const loading = useSelector((state:RootState) => state.Settingslice.loading);
  // const error = useSelector((state:RootState) => state.Settingslice.error);
   let devicename:any;
      let devicemail:any;
       let password:any;
  // API Call
  const getDevices = async () => {
console.log("decviname......",)
devicename =  await Storage.getItem('device_name')
console.log("decviname......",devicename)
devicemail= await Storage.getItem('device_email')
password= await Storage.getItem('password')


 
  };

  // Auto fetch when ViewModel is used


  return {
devicename,devicemail,password,
    getDevices, // expose if component wants to refresh manually
  };
}
