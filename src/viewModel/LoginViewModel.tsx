// useLoginViewModel.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setEmail, setPassword, loginUser } from '../redux/slice/loginSlic';
import { Alert } from 'react-native';
import { RootState } from '../redux/store';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export default function useLoginViewModel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const navigation=useNavigation();
  const dispatch = useDispatch();
  // const { loading, error, token } = useSelector((state:any) => state.auth);
const { user, accessToken, loading, error } = useSelector(
  (state: RootState) => state.login   // 'auth' must match slice name in store
);
const handleLogin = () => {
  // if (!email || !password) {
  //   Alert.alert("Validation", "Email and password are required");
  //   return;
  // }

  dispatch(loginUser({ email, password }))
    .unwrap() // ✅ unwraps promise
    .then((res) => {
    
Toast.show({
  type: 'success',
  text1: 'Success',
  text2: 'Login Successfull....',
});
navigation.navigate("HomeScreen");
      // here res = API response (access_token, org_id, etc.)
      console.log(" Login sucess:", res);
    })
    .catch((err) => {
      console.log("❌ Login Failed:", err);
      Toast.show({
  type: 'failed',
  text1: 'Failed',
  text2: 'Your action was successful ✅',
});
 
    });
};


  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    // loading,
    // error,
    // token,
  };
}
