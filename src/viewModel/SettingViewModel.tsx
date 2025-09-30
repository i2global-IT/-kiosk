
import Storage from "../uitility/Sotrage";
export default function SettingViewModel() {
   let devicename:any;
      let devicemail:any;
       let password:any;
  // API Call
  const getDevices = async () => {
devicename =  await Storage.getItem('device_name')
devicemail= await Storage.getItem('device_email')
password= await Storage.getItem('password')
 };

  // Auto fetch when ViewModel is used
  return {
devicename,devicemail,password,
    getDevices, // expose if component wants to refresh manually
  };
}
