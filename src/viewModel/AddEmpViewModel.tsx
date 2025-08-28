import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { newEmployee, resetMessage } from "../redux/slice/addEmp";
import { RootState } from "../redux/store";
import Toast from "react-native-toast-message";

export default function useAddEmployeeViewModel() { 
   const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const { message, error } = useSelector((state: RootState) => state.addEmp);
  const cameraRef = useRef(null);
  const dispatch = useDispatch();


const handleRegisterFace = async () => {
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
 await apicall(rawBase64)
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
       dispatch(newEmployee({ employeeid: "INIT010", imagebase64: rawBase64 }))
    ).unwrap(); // unwraps the thunk result

    // ✅ Check status
    if (res?.status === 200 || res?.status === 201) {
  
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

 useEffect(() => {
    if (message) {
      Toast.show({
        type: error ? "error" : "success",
        text1: error ? "❌ Error" : "✅ Success",
        text2: message,
      });

      // reset slice message after showing toast
      dispatch(resetMessage());
    }
  }, [message, error, dispatch]);

return{
handleRegisterFace,cameraRef
}}