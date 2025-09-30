// useLoginViewModel.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slice/loginSlic';
import { RootState } from '../redux/store';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export default function useLoginViewModel() {
  const [email, setEmail] = useState("");
const [emailError, setEmailError] = useState("");
const [passError, setPasswordError] = useState("");
  const [password, setPassword] = useState('');
  const [orgkey, setOrg] = useState('');
  const [orgError, setOrgError] = useState("");
  const navigation=useNavigation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  // const { loading, error, token } = useSelector((state:any) => state.auth);

const handleLogin = () => {

  setIsSubmitted(true); // ✅ enable error visibility
  let valid = true;
  if (!email) {
    setEmailError("Email is required");
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    setEmailError("Enter a valid email");
    valid = false;
  } else {
    setEmailError("");
  }

  if (!password) {
    setPasswordError("Password is required");
    valid = false;
  } else {
    setPasswordError("");
  }
  if (!orgkey) {
    setOrgError("Organization Key is required");
    valid = false;
  } else {
    setOrgError("");
  }
 if (!valid) return; // stop if errors exist
  // ✅ proceed with API call
  dispatch(loginUser({ email, password ,orgkey}))
    .unwrap()
    .then((res) => {
      Toast.show({ type: "success", text1: "😃 Success", text2: "Login Successful" });
      navigation.navigate("HomeScreen");
    })
    .catch((err) => {
      
      Toast.show({ type: "error", text1: `${err}`, text2: "Failed"});
    });
};



  return {
    email,
    setEmail,
    password,
    setPassword,orgkey, setOrg,orgError,
    handleLogin,emailError,passError,isSubmitted
    // loading,
    // error,
    // token,
  };
}
