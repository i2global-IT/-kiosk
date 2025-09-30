import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import { useDispatch, } from "react-redux";
import { registerFace, setFileUri } from "../redux/slice/registerfaceSlice";
import Toast from "react-native-toast-message";
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { baseUrl } from "../service/endpoint";
import axios from "axios";
import GetLocation, { isLocationError, } from "react-native-get-location";
import {  promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';

export default function useHomePageViewModal() { 
     const [now, setNow] = useState(new Date());
  const [timeStr, setTimeStr] = useState('');
 const [hasPermission, setHasPermission] = useState(false);
  const [active, setActive] = useState(false);
 const [buttonactive, setButtonactive] = useState(false);
  const [CapturedImage, setCapturedImage] = useState<any>();
  const [address, setAddress] = useState<any>(null); // To store total duration worked

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

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
        setActive(true); // only set active if permission granted
      } else {
        setHasPermission(false);
        setActive(false);
      }
    } else {
      // iOS permission handled via Info.plist
      setHasPermission(true);
      setActive(true);
    }
  };

  requestCameraPermission();
}, []);
  const [locationLodaing, setLocationLoading] = useState(false);
const requestLocationPunchin = async () => {
  setLocationLoading(true);

  try {
    // 1️⃣ Check foreground location permission
    const fgPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    let fgResult = await check(fgPermission);

    if (fgResult === RESULTS.DENIED) {
      fgResult = await request(fgPermission);
      if (fgResult !== RESULTS.GRANTED) {
        Alert.alert(
          'Location Required',
          'Please allow location access for this app.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }
    } else if (fgResult === RESULTS.BLOCKED) {
      Alert.alert(
        'Location Permission Blocked',
        'Enable location in settings to proceed.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    // 2️⃣ Get current location
    const location = await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    });

    // 3️⃣ Convert coordinates to address
    await getAddressFromCoordinates(location.latitude, location.longitude);

  } catch (error) {
    if (isLocationError(error)) {
        handleLocationError(error);
      }
    console.error('Error fetching location:', error);
  } finally {
    setLocationLoading(false);
  }
};
const getAddressFromCoordinates = async (lat: number, lng: number) => {
  setLocationLoading(true);

  const apiKey = baseUrl.geoKey;
  const url = `${baseUrl.geoLoc}?latlng=${lat},${lng}&key=${apiKey}&result_type=street_address`;

  try {
    const response = await axios.post(
      url,
      
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data?.results?.length > 0) {
      const formattedAddress = response.data.results[0].formatted_address;
      setAddress(formattedAddress);
    }
  } catch (error) {
  } finally {
    setLocationLoading(false);
  }
};
const handleLocationError = async (error: any) => {

  if (error.code === "UNAUTHORIZED") {
    Alert.alert(
      "Location Permission Required",
      "Please enable location permissions in settings.",
      [{ text: "Open Settings", onPress: () => Linking.openSettings() }]
    );
  } 
  else if (error.code === "UNAVAILABLE") {
    if (Platform.OS === "android") {
      try {
        const result = await promptForEnableLocationIfNeeded()
        if (result === "enabled" || result === "already-enabled") {
          setLocationLoading(true)
          const newLocation = await GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
          });

          await getAddressFromCoordinates(
            newLocation.latitude,
            newLocation.longitude
          );
        
          return true;
        }
      }
       catch (err: any) {

        Alert.alert(
          "GPS Required",
          "You need to enable GPS for punch in/out",
        
          [
            {
              text: "Try Again",

              onPress: () => {
                handleLocationError({ code: "UNAVAILABLE" });
              },
            },
           
          ]
        );
        return false;
      }
    } else {
      await promptForEnableLocationIfNeeded();
    }
  } 
  else {
  }
};
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
  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } 
      
      else {
        setHasPermission(true); // iOS permission handled via Info.plist
      }
    };

    requestCameraPermission();

  }, []);

const handleVerify = async () => {
  try {
    if (!cameraRef.current) return;
    // Capture image
    const image = await cameraRef.current.capture();
    const fileUri = Platform.OS === "android" ? "file://" + image.path : image.path;
await apicall(fileUri);
setCapturedImage(fileUri)
dispatch(setFileUri(fileUri,));

    // Convert to base64 using FileReader
    // const response = await fetch(fileUri);
    // const blob = await response.blob();

    // const reader = new FileReader();
    // reader.onloadend = async () => {
    //   const base64data = reader.result as string; // 👉 base64 string with prefix
    //   console.log("✅ Base64 Image:", base64data);

    //   // If you only want raw base64 (without prefix)
    //   const rawBase64 = base64data.split(",")[1];

    //   setCapturedImage(rawBase64);

    //   // dispatch(newEmployee({ employeeid: "INIT010", imagebase64: rawBase64 }));
    // };
    // reader.readAsDataURL(blob);
  } catch (err) {
  }
};
const [details,setDetails]=useState()
const [currentTime,setCurrentTime]=useState()
const apicall = async (imageuri: string) => {
  setButtonactive(true)
  const now = new Date();
const hours = now.getHours().toString().padStart(2, "0");
const minutes = now.getMinutes().toString().padStart(2, "0");
const punchTime = `${hours}:${minutes}`;
setCurrentTime(punchTime)
  try {
    const res = await dispatch(registerFace({ imageUri: imageuri,punchTime:punchTime,address:address })).unwrap();
setDetails(res.data)
    if (res?.status === 200 || res?.status === 201) {
          setButtonactive(false)
        setShowDialog(true);
    //     dispatch(resetAttendance()); // reset state
    //

    //   dispatch(dailyattendance({ page: 1, per_page: 20 })); // fetch first page
    } else {
      Toast.show({
        type: "failed",
        text1: "Failed",
        text2: res?.data?.message || "Something went wrong!",
      });
    }
  } catch (err: any) {
    Toast.show({
      type: "failed",
      text1: "Failed",
      text2: err?.message || "Something went wrong!",
    });
  }
  finally{
    setButtonactive(false)
  }
};

const getCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format
  const mins = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${mins} ${ampm}`;
};

return{handleVerify,active,setActive,getCurrentTime,details,currentTime,buttonactive,    requestLocationPunchin,
    now, setNow,timeStr,hasPermission,cameraRef,showDialog, setShowDialog,CapturedImage,    locationLodaing,setLocationLoading


}}



