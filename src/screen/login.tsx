import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
} from "react-native";
import useLoginViewModel from "../viewModel/LoginViewModel";
import GlobalStyle from "../uitility/GlobalStyle";
import { AppColors } from "../uitility/color";
import CustomTextField from "../component/CustomTextfield";
import CustomButton from "../component/CustomButton";
import { images } from "../uitility/image";


const { width, height } = Dimensions.get("window");

export const LoginScreen = ({ navigation }) => {
  const viewModel = useLoginViewModel();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}style={{backgroundColor:AppColors}}>
  
   <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={"dark-content"}
           // use "dark-content" if your header bg is light
          />
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={images.logoimage}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Illustration */}
        <Image
          source={images.login}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Heading */}
        <Text style={[GlobalStyle.semibold_black,styles.singin]}>Sign in to continue!</Text>
        <Text style={[GlobalStyle.regular_Font,{color:AppColors.secondHeading,paddingBottom:5}]}>
          Record attendance and track in real time
        </Text>

        {/* Email Field */}
        <View style={styles.inputContainer}>

<CustomTextField
  value={viewModel.email}
  heading="Email ID"
  hintText="Enter your Email"
  prefixIcon="person-outline"
  onChangeText={viewModel.setEmail}
  hasError={viewModel.isSubmitted && !!viewModel.emailError}  // ✅ show error only after submit
  errorText={viewModel.emailError}
/>
<CustomTextField
  value={viewModel.password}
  heading="Password"
  hintText="Enter your Password"
  prefixIcon="lock-closed-outline"
  secureTextEntry
   onChangeText={viewModel.setPassword}  
  hasError={viewModel.isSubmitted && !!viewModel.passError}  // ✅ show error only after submit
  errorText={viewModel.passError}
/>
      
        </View>
        <View style={{width:"100%"}}>
<CustomButton  title="Sign in"  onPress={()=>{viewModel.handleLogin()}}/>
        </View>

  
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  singin:{color:AppColors.gradient,fontWeight:"700",fontSize:20},
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: width * 0.05,
    paddingBottom:5
  },
  logo: {
    width: width * 0.4,
    height: height * 0.1,
   
  },
  illustration: {
    width: width ,
    height: height * 0.3,
  
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#6A1B9A",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: width * 0.035,
    color: "#666",
    textAlign: "center",
    marginBottom: height * 0.03,
  },
  inputContainer: {
      marginTop: height * 0.05,
    width: "100%",
    marginBottom: height * 0.02,
  },
});

export default LoginScreen;
