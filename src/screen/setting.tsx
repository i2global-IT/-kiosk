import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
  Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Header } from "./PunchHistory";
import CustomTextField from "../component/CustomTextfield";
import GlobalStyle from "../uitility/GlobalStyle";
import CustomButton from "../component/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SettingViewModel from "../viewModel/SettingViewModel";
import { useSelector } from "react-redux";

import { RootState } from "../redux/store";
const SettingsScreen = ({navigation}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirmLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear storage
      setModalVisible(false);
      navigation.replace("login"); // Go to login
    } catch (error) {
      console.log("Error clearing storage:", error);
    }
  };
  const viewModal=SettingViewModel()
  useEffect(()=>{
viewModal.getDevices();
  },[])
   const device = viewModal.devices.length > 0 ? viewModal.devices[0] : null;
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
         <Header title={"Settings"} onBack={()=>{navigation.pop()}}/>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[GlobalStyle.semibold_black,{fontWeight:"700",fontSize:18,marginVertical:10}]}>
            Device Information
        </Text>
        {/* Device Info */}
        <CustomTextField heading={"Device name"}    
        hintText=""
           value={device?.device_name ?? "--"}
        readOnly={true}
        isRequired={false}
        onChangeText={function (text: string): void {
                  throw new Error("Function not implemented.");
              } }/>
  

        {/* Device name */}
           <CustomTextField heading={"Email"} hintText={"attendance@gmail.com"}
        readOnly={true}
        value={device?.device_email ?? "--"}
        isRequired={false}
        onChangeText={function (text: string): void {
                  throw new Error("Function not implemented.");
              } }/>
    
<CustomTextField heading={"Password"} hintText={"*********"}
value={passwordVisible ? device?.device_password ?? "" : "*********"}
        readOnly={true}
        isRequired={false}
        suffixIcon={!passwordVisible?"eye-off" : "eye"}
        onTap={() => setPasswordVisible(!passwordVisible)}
        onChangeText={function (text: string): void {
                  throw new Error("Function not implemented.");
              } }/>
     

       

        {/* Privacy Policy */}
        <TouchableOpacity style={styles.option}
          onPress={() => Linking.openURL("https://i2global.in/policies/")}>
          <Ionicons name="lock-closed" size={20} color="#8E31EC" />
          <Text style={[GlobalStyle.semibold_black,styles.optionText]}>Privacy policies</Text>
          <Ionicons name="chevron-forward" size={20} color="#8E31EC" />
        </TouchableOpacity>

        {/* Help Center */}
       <TouchableOpacity style={styles.option}
          onPress={() => Linking.openURL("https://i2global.in/support/?issues=true&status=false")}>
          <Ionicons name="help-circle" size={20} color="#8E31EC" />
          <Text style={styles.optionText}>Help center</Text>
          <Ionicons name="chevron-forward" size={20} color="#8E31EC" />
        </TouchableOpacity>
<View
style={{height:20}}></View>
<CustomButton title="Logout"onPress={() => setModalVisible(true)} />
        {/* Logout Button */}
       
      </ScrollView>
       <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={[GlobalStyle.semibold_black,{marginBottom:8}]}>Are you sure you want to logout?</Text>

            <View style={styles.buttonRow}>
              <CustomButton
                title="No"
                onPress={() => setModalVisible(false)}
             
              />
              <CustomButton
                title="Yes"
                onPress={handleConfirmLogout}
               
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
     overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    flex: 1,
    marginRight: 10,
  },
  confirmBtn: {
    backgroundColor: "#8E31EC",
    flex: 1,
    marginLeft: 10,
  },
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: { marginRight: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  content: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCF4FF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  optionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 8 },
});

export default SettingsScreen;
