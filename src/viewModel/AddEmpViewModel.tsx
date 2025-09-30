import {  useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {  Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { newEmployee, resetMessage } from "../redux/slice/addEmp";
import { RootState } from "../redux/store";
import Toast from "react-native-toast-message";

export default function useAddEmployeeViewModel() { 
   const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const { message, error } = useSelector((state: RootState) => state.addEmp);
      const [previewVisible, setPreviewVisible] = useState(false); // modal state
    const [empid,setempid]=useState("");
  const cameraRef = useRef(null);
  const dispatch = useDispatch();
   const [image, setimage] = useState(null);
 const [errors, setErrors] = useState({});
 const validate = () => {
    let tempErrors = {};
    if (!empid?.trim()) {
      tempErrors.empid = "Enter Employee ID";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
 const onSave = () => {
    if (validate()) {
      // handleSave()
     handleRegisterFace()
    }
  };


    const handleRegisterClick = async () => {
      if (validate()) {
    try {
      if (cameraRef.current) {

          const image = await cameraRef.current.capture();        
            const fileUri = Platform.OS === "android" ? "file://" + image.path : image.path;
        setimage(fileUri);
        setPreviewVisible(true); // show modal with captured image
      }
    } catch (error) {
    }
  }
  };


const handleRegisterFace = async () => {
  try {


    // // Capture image
    // const image = await cameraRef.current.capture();
    // console.log("📸 Captured Image:", image); // contains `path` or `uri`

    // const fileUri = Platform.OS === "android" ? "file://" + image.path : image.path;

    // Convert to base64 using FileReader
    const response = await fetch(image);
    const blob = await response.blob();

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result as string; // 👉 base64 string with prefix
      // console.log("✅ Base64 Image:", base64data);

      // If you only want raw base64 (without prefix)
      const rawBase64 = base64data.split(",")[1];

      setCapturedImage(rawBase64);
 await apicall(image)
 setPreviewVisible(false)
      // dispatch(newEmployee({ employeeid: "INIT010", imagebase64: rawBase64 }));
    };
    reader.readAsDataURL(blob);
  } catch (err) {
  }
};

const navigation=useNavigation()
const apicall = async (rawBase64: string) => {
  try {
    const res: any = await dispatch(
       dispatch(newEmployee({ employeeid: empid, imagebase64: rawBase64 }))
    ).unwrap().then(()=>{
  Toast.show({
        type: error ? "error" : "success",
        text1: message ? "Error" : "Success",
        text2: message,
      });
    }); // unwraps the thunk result

    // ✅ Check status
    if (res?.status === 200 || res?.status === 201) {

navigation.pop();
    }
  } catch (err: any) {
    // ❌ Any error from API
    // Toast.show({
    //   type: 'failed',
    //   text1: 'Failed',
    //   text2: err?.message || "Something went wrong!",
    // });
  }
};

 useEffect(() => {
    if (message) {
      Toast.show({
        type: error ? "error" : "success",
        text1: error ? `😞 ${message} ` : `😃 ${message} `,
        text2: error ? "Error":"Success",
      });

      // reset slice message after showing toast
      dispatch(resetMessage());
    }
  }, [message, error,]);

return{handleRegisterClick,capturedImage,image, setimage,
handleRegisterFace,cameraRef,empid,setempid,validate,errors,onSave,previewVisible, setPreviewVisible
}}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      