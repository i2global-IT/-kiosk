import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  StatusBar,
  Modal,
  Platform,
} from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import LinearGradient from "react-native-linear-gradient";
import { AppColors } from "../uitility/color";
import GlobalStyle from "../uitility/GlobalStyle";
import CustomTextField from "../component/CustomTextfield";
import { Camera, CameraType } from "react-native-camera-kit";
import useAddEmployeeViewModel from "../viewModel/AddEmpViewModel";
const { width } = Dimensions.get('window');
export const RegisterFaceScreen = ({navigation}) => {
    const viewModel=useAddEmployeeViewModel()
     const [showDialog, setShowDialog] = useState(false);

  return (
    <View style={styles.container}>
     <StatusBar
             translucent
             backgroundColor="transparent"
             barStyle={"dark-content"}
            // use "dark-content" if your header bg is light
           />
      <View style={styles.header}>
        <TouchableOpacity
        onPress={()=>{navigation.pop()}} style={{backgroundColor:"#D2D1D147",
          padding:5,marginTop:8
        ,borderRadius:8}}>
  <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>
      
        <Text style={[GlobalStyle.semibold_black,styles.headerTitle]}>Add employee</Text>
      </View>

   
<CustomTextField heading='Employee ID' hintText='eg.,EMP001' 
  maxLength={50}
value ={viewModel?.empid}
 onChangeText={viewModel.setempid}/>
    {viewModel?.errors.empid && (
          <Text style={GlobalStyle.errorText}>{viewModel.errors.empid}</Text>
        )}
      {/* Camera Circle */}
       <View style={[styles.outerCircle,{marginTop:10}]}>
  <View style={styles.cameraCircle}>
     <Camera
        ref={viewModel.cameraRef}
    style={[StyleSheet.absoluteFill, { transform: [{ scaleX: -1 }] }]} // 👈 mirror fix
        cameraType={CameraType.Front} // front/back
        flashMode="auto"
      />
  </View>
</View>
      {/* Instructions */}
      <Text style={[GlobalStyle.semibold_black,styles.lookText]}>Look at the camera</Text>
      <View style={styles.noteRow}>   
        <View style={{flexDirection:"row"}}>
          <Ionicons name={"information-circle"} size={16} color={"#FE7B01"}/>
        </View>
        <Text style={[GlobalStyle.semibold_black,styles.note]}>
          Upload a clear front photo in good light with only one visible face.
        </Text>
      </View>
      {/* Register Button */}
      <TouchableOpacity
onPress={viewModel?.handleRegisterClick}
      activeOpacity={0.8} style={styles.buttonWrapper}>
        <LinearGradient
          colors={[AppColors.gradient, AppColors.gradient2, ]}
          style={styles.button}
        >
          <Text style={styles.buttonText}>⚡ Register Face</Text>
        </LinearGradient>
      </TouchableOpacity>
   {/* ✅ Call SuccessDialog here */}
      <SuccessDialog
        visible={showDialog}
        onClose={() => setShowDialog(false)}
      />
   {/* ---- Face Preview Modal ---- */}
      <Modal
        visible={viewModel?.previewVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>viewModel?. setPreviewVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={[GlobalStyle.semibold_black,styles.modalTitle]}>Face Preview</Text>
            
            {/* Camera Circle */}
            <View style={styles.outerCircles}>
              <View style={styles.cameraCircle}>
               {/* Captured Image Preview */}
            {viewModel?.image ? (
              <Image 
                source={{ uri: viewModel?.image }} 
                style={styles.previewImage} 
              />
            ) : (
              <Text>No image captured</Text>
            )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#ccc" }]}
                onPress={() =>viewModel?. setPreviewVisible(false)}
              >
                <Text style={[GlobalStyle.semibold_black,styles.actionText]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
                onPress={()=>{
viewModel?.onSave();
// viewModel?.setPreviewVisible(false)
                }}
              >
                <Text style={[GlobalStyle.semibold_black,styles.actionText, { color: "#fff" }]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
    </View>
  );
};

export default RegisterFaceScreen;

const styles = StyleSheet.create({
 outerCircles: {
  width: 220,
  height: 220,
  borderRadius: 110,
  borderWidth: 4,
  borderColor: "#4CAF50",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden", // 👈 ensures cropping inside circle
},
cameraCircle: { 
  width: "100%", 
  height: "100%", 
  borderRadius: 110, 
  overflow: "hidden" 
},
previewImage: {
  width: "100%",   // 👈 fill the circle width
  height: "100%",  // 👈 fill the circle height
  resizeMode: "cover", // 👈 crop instead of stretch
  borderRadius: 110, // 👈 keep circular
},
   containers: { flex: 1, backgroundColor: "#fff" },
  buttonWrapper: { margin: 20, borderRadius: 10, overflow: "hidden" },
  button: { paddingVertical: 15, alignItems: "center", borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  // outerCircles: {
  //   width: 220,
  //   height: 220,
  //   borderRadius: 110,
  //   borderWidth: 4,
  //   borderColor: "#4CAF50",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   overflow: "hidden",
  // },
  // cameraCircle: { width: "100%", height: "100%", borderRadius: 110, overflow: "hidden" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  actionButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: { fontSize: 16, fontWeight: "600" },
    outerCircle: {
    width: width * 0.8,   // slightly bigger
    height: width * 0.8,
    alignSelf: 'center',
    borderRadius: (width * 0.8) / 2,
    borderWidth: 8,       // thick gray ring
    borderColor: '#ccc',  // outer circle color
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    marginTop:18
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,

  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
    marginTop:10,
    alignSelf:"center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    marginBottom: 24,
  },
 
  lookText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    marginTop:10
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },  cameraCircle: {
    width: width * 0.7,   // slightly smaller inside
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "orange",
    marginTop: 5,
    marginRight: 6,
  },
  note: {
    alignSelf:'center',
    fontSize: 13,
    color:AppColors.secondHeading,
    flex: 1,
    lineHeight: 18,
    marginLeft:4
  },
  buttonWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    width: "90%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  bottomTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  tab: {
    alignItems: "center",
  },
  activeTab: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A259FF",
    marginTop: 2,
  },
  inactiveTab: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
    dialog: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CD964",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
});


export const SuccessDialog = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [slideAnim] = useState(new Animated.Value(-200)); // start above screen

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 60, // distance from top
        useNativeDriver: true,
      }).start();

      // Auto hide after 3 seconds
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -200,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onClose());
      }, 3000);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.dialog,
        { transform: [{ translateY: slideAnim }], width: width * 0.9 },
      ]}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name="checkmark" size={28} color="#fff" />
      </View>
      <Text style={styles.title}>Registration Complete</Text>
      <Text style={styles.subtitle}>
        Your face has been saved for attendance.{"\n"}You can now start Punching In/Out.
      </Text>
    </Animated.View>
  );
};



