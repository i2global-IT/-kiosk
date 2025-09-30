import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
  Modal,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Header } from "./PunchHistory";
import CustomTextField from "../component/CustomTextfield";
import GlobalStyle from "../uitility/GlobalStyle";
import CustomButton from "../component/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "../uitility/Sotrage";
import { AppColors } from "../uitility/color";
const SettingsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
    const [deviceName, setDeviceName] = useState("");
  const [deviceEmail, setDeviceEmail] = useState("");
  const [devicePassword, setDevicePassword] = useState("");
  const handleConfirmLogout = async () => {
    try {
      Storage.setItem('loginaccess', false);
      await AsyncStorage.clear(); // Clear storage
      setModalVisible(false);
      navigation.replace("login"); // Go to login
    } catch (error) {
    }
  };

  useEffect(() => {
    getDevice();
  }, []);

  const getDevice = async () => {
    try {
      const name = await Storage.getItem("device_name");
      const email = await Storage.getItem("device_email");
      const password = await Storage.getItem("password");

      setDeviceName(name || "");
      setDeviceEmail(email || "");
      setDevicePassword(password || "");
      // console.log("password.......",password)
    } catch (error) {
      // console.log("Error loading device info:", error);
    }
  };



  const checkPassword = async () => {
    // console.log("Error loading device info:", enteredPassword,"jhjhjhjhj",devicePassword);

    if (enteredPassword == devicePassword) {
      setShowPasswordField(false);
      setEnteredPassword("");
      setErrorMessage(""); // clear error
      navigation.navigate("RegisterFaceScreen");
    } else {
      setErrorMessage("Incorrect password"); // show validation message instead of alert
    }
  };

  return (
    <View style={{backgroundColor:AppColors.white,flex:1}}>
      {/* Header */}
      <Header title={"Settings"} onBack={() => navigation.pop()} onpop={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text
          style={[
            GlobalStyle.semibold_black,
            { fontWeight: "700", fontSize: 18, marginVertical: 10 },
          ]}
        >
          Device Information
        </Text>

        {/* Device Info */}
        <CustomTextField
          heading={"Device name"}
          maxLength={50}
          hintText=""
          value={deviceName || "--"}
          readOnly={true}
          isRequired={false}
          onChangeText={() => { }}
        />


        <TouchableOpacity
          style={styles.option}
          onPress={() => setShowPasswordField(!showPasswordField)} // toggle on click
        >
          <Ionicons name="lock-closed" size={20} color="#8E31EC" />
          <Text style={styles.optionText}>Add Employee</Text>
          <Ionicons
            name={showPasswordField ? "chevron-up" : "chevron-down"} // change icon dynamically
            size={20}
            color="#8E31EC"
          />
        </TouchableOpacity>

        {showPasswordField && (
          <View>


            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter Password"
                
                secureTextEntry
                value={enteredPassword}
                onChangeText={(text) => {
                  setEnteredPassword(text);
                  setErrorMessage(""); // clear error on typing
                }}
                style={[GlobalStyle.semibold_black,styles.input]}
              />

              {/* Validation message */}


              <TouchableOpacity style={styles.submitBtn} onPress={checkPassword}>
                <Text style={{ color: "#fff" }}>Submit</Text>
              </TouchableOpacity>
            </View>
            {errorMessage ? (
              <Text style={[GlobalStyle.regular_FontMedium, { color: "red", marginTop: 5, marginBottom: 10 }]}>{errorMessage}</Text>
            ) : null}
          </View>
        )}

        <TouchableOpacity
          style={styles.option}
          onPress={() => Linking.openURL("https://i2global.in/policies/")}
        >
          <Ionicons name="lock-closed" size={20} color="#8E31EC" />
          <Text style={[GlobalStyle.semibold_black, styles.optionText]}>
            Privacy policies
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#8E31EC" />
        </TouchableOpacity>
        {/* Help Center */}
        <TouchableOpacity
          style={styles.option}
          onPress={() =>
            Linking.openURL(
              "https://i2global.in/support/?issues=true&status=false"
            )
          }
        >
          <Ionicons name="help-circle" size={20} color="#8E31EC" />
          <Text style={styles.optionText}>Help center</Text>
          <Ionicons name="chevron-forward" size={20} color="#8E31EC" />
        </TouchableOpacity>
        <View style={{ height: 20 }}></View>
        <CustomButton title="Logout" onPress={() => setModalVisible(true)} />
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={[GlobalStyle.semibold_black, { marginBottom: 8 }]}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.buttonRow}>
              <CustomButton title="No" onPress={() => setModalVisible(false)} />
              <CustomButton title="Yes" onPress={handleConfirmLogout} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  submitBtn: {
    backgroundColor: "#8E31EC",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
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
    margin: 5,
    color: "#333",
    width: "75%",
    alignSelf: "center"
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
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
