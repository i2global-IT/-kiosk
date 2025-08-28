import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { registerFace } from "../redux/slice/registerfaceSlice";
import { RootState } from "../redux/store";
import Toast from "react-native-toast-message";

export default function useHomePageViewModal() { 
     const [now, setNow] = useState(new Date());
  const [timeStr, setTimeStr] = useState('');
 const [hasPermission, setHasPermission] = useState(false);
 const error = useSelector((state:RootState) => state.registerFace.error);
  const message = useSelector((state:RootState) => state.registerFace.message);
  const [active, setActive] = useState(false);



  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        setHasPermission(true); // iOS permission handled via Info.plist
      }
    };

    requestCameraPermission();
  }, []);

  const formatTime = (d: Date) => {
    try {
      // device-locale friendly
      return d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch {
      // fallback manual format
      let h = d.getHours();
      const m = d.getMinutes();
      const s = d.getSeconds();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${pad(h)} : ${pad(m)} : ${pad(s)} ${ampm}`;
    }
  };

  useEffect(() => {
    // set immediately, then tick each second
    setTimeStr(formatTime(new Date()));
    const id = setInterval(() => {
      const d = new Date();
      setNow(d);
      setTimeStr(formatTime(d));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const cameraRef = useRef(null);

const [showDialog, setShowDialog] = React.useState(false);
const dispatch=useDispatch();
  // Request camera permission for Android
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        }
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraPermission();
    }
  }, []);
 const [CapturedImage, setCapturedImage] = useState<any>();
// const handleVerify = async () => {
//     console.log('get camera')
//   try {
//     if (cameraRef.current) {
//       const photo =  await cameraRef.current.capture(); 
//        console.log("Photo:", photo);
// const fileUri = Platform.OS === "android" ? "file://" + photo.path : photo.path;

//     // Convert to base64 using FileReader
//     const response = await fetch(fileUri);
//     const blob = await response.blob();

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64data = reader.result as string; // 👉 base64 string with prefix
//       console.log("✅ Base64 Image:", base64data);

//       // If you only want raw base64 (without prefix)
//       const rawBase64 = base64data.split(",")[1];

//       setCapturedImage(rawBase64);

//    dispatch(registerFace({  imagebase64: rawBase64 }));

//    setCapturedImage(photo.uri);
//     reader.readAsDataURL(blob);
//     //  setShowDialog(true);
//     }}
//   } catch (err) {
//     console.log("Error taking photo: ", err);
//   }
// };
const handleVerify = async () => {
  try {
    if (!cameraRef.current) return;

    // Capture image
    const image = await cameraRef.current.capture();
    console.log("📸 Captured Image:", image); // contains `path` or `uri`

    const fileUri = Platform.OS === "android" ? "file://" + image.path : image.path;

    // Convert to base64 using FileReader
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result as string; // 👉 base64 string with prefix
      console.log("✅ Base64 Image:", base64data);

      // If you only want raw base64 (without prefix)
      const rawBase64 = base64data.split(",")[1];

      setCapturedImage(rawBase64);
await apicall(rawBase64);
      // dispatch(newEmployee({ employeeid: "INIT010", imagebase64: rawBase64 }));
    };
    reader.readAsDataURL(blob);
  } catch (err) {
    console.error("❌ Capture error >>>", err);
  }
};

const apicall = async (rawBase64: string) => {
  try {
    const res: any = await dispatch(
      registerFace({ imagebase64: rawBase64 })
    ).unwrap(); // unwraps the thunk result

    // ✅ Check status
    if (res?.status === 200 || res?.status === 201) {
      setShowDialog(true);
    } else {
      Toast.show({
        type: 'failed',
        text1: 'Failed',
        text2: res?.message || "Something went wrong!",
      });
    }
  } catch (err: any) {
    // ❌ Any error from API
    Toast.show({
      type: 'failed',
      text1: 'Failed',
      text2: err?.message || "Something went wrong!",
    });
  }
};

return{handleVerify,active,setActive,
    now, setNow,timeStr,hasPermission,cameraRef,showDialog, setShowDialog,CapturedImage

}}