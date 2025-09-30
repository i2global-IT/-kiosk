// App.tsx

import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, BackHandler, Animated, Linking, StatusBar, Platform, ActivityIndicator, Modal } from 'react-native';
import {useFocusEffect, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@react-native-vector-icons/ionicons";
import { images } from '../../uitility/image';
import LinearGradient from 'react-native-linear-gradient';
import { AppColors } from '../../uitility/color';
import useHomePageViewModal from '../../viewModel/HomePageViewModel';
import GlobalStyle from '../../uitility/GlobalStyle';
import CustomButton from '../../component/CustomButton';
import { Camera, CameraType } from 'react-native-camera-kit';

import ConfirmDialog from './SuccesDialog';
import PunchHistory from '../PunchHistory';
import SettingsScreen from '../setting';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { checkVersion } from 'react-native-check-version';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const Header = () => {
  const navigation:any=useNavigation()
    const viewModel=useHomePageViewModal()
    return(
         <LinearGradient
      colors={['#6D28D9', '#C084FC']} // change colors as needed
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
  <View style={styles.header}>

    <Image
           source={images.onboard}
           style={{height:50,width:150,alignSelf:'center',marginTop:25}}
           resizeMode="contain"
        
         />
  <Text style={styles.addText}>Smarter Attendance, Smarter WorkForce</Text>
     
   
    <View style={styles.headerRight}>
      <View style={styles.timeBox}>
        <Ionicons name='time' style={{alignSelf:'center',}}
        color={'#FF7E00'} size={20}/>
        <Text style={[GlobalStyle.semibold_black,styles.timeText]}>{viewModel.timeStr}</Text>
      </View>
      {/* <TouchableOpacity style={styles.addButton}
      onPress={()=>{
        navigation.navigate("RegisterFaceScreen")
      }}>
        <Text style={styles.addText}>+ Add employee</Text>
      </TouchableOpacity> */}
    </View>
 
  </View>
     </LinearGradient>
    )
}
   
const HomeScreen = () => {
    const viewModel=useHomePageViewModal()

  useFocusEffect(
    React.useCallback(() => {
      // Screen focused → show camera
      viewModel.setActive(true);

      return () => {
        // Screen blurred → hide camera
      viewModel.  setActive(false);
      viewModel.  cameraRef.current = null; // 👈 important: release ref
      };
    }, [])
  );
useEffect(()=>{
  viewModel.setActive(true);
  viewModel?. requestLocationPunchin()
},[])
const { details } = useSelector((state: any) => state.addEmp);

    return(
          <View style={styles.container}>
    <Header />
    <View style={styles.instructions}>
      <View style={styles.instructionItem}>
         <View style={styles.iconbg}>
        <Ionicons name="camera-outline" size={20}  color="#8E31EC" />

         </View>
        <Text style={[GlobalStyle.semibold_black,styles.instructionText]}>Look at the camera to Punch In / Out</Text>
      </View>
      <View style={styles.instructionItem}>
        <View style={styles.iconbg}>
 <Ionicons name="happy-outline" size={20} color="#8E31EC" />
        </View>
       
        <Text style={[GlobalStyle.semibold_black,styles.instructionText]}>Align your face within the frame</Text>
      </View>
    </View>

 
    <View style={styles.outerCircle}>
  <View style={styles.cameraCircle}>
     {viewModel?.active && (
        <Camera
          ref={viewModel?.cameraRef}
          style={{ flex: 1 }}
          cameraType={CameraType.Front}
          torchMode="off"
          focusMode="on"
          zoomMode="on"
          scanBarcode={false}
        />
      )}
  </View>
</View>
    { !viewModel?.buttonactive&&
    <View style={{paddingHorizontal:10,marginTop:20}}>
<CustomButton title='Verify'  onPress={ viewModel.handleVerify}/>
    </View>}
{viewModel.details && (
  <ConfirmDialog
    visible={viewModel.showDialog}
    onClose={() => viewModel.setShowDialog(false)}
    user={{
      name: viewModel?.details?.employee_name ?? "",
      punch:viewModel?. details?.punch=="punch_in" ?"Punch IN": "Punch Out",
      id: viewModel?.details?.employee_id ?? "",
      punchTime: viewModel?.currentTime??"",
      image: viewModel?.CapturedImage
        ? { uri: viewModel?.CapturedImage }
        : images.onboard,
    }}
  />
)}

          <GETLocation visible={viewModel?.locationLodaing} onClose={()=>viewModel?.setLocationLoading(false)}/>

  </View>
    )
}




export default function Dashboard() {
 const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

  const [updateUrl, setUpdateUrl] = useState('');
    const { height } = Dimensions.get('screen');
  const slideAnim = useRef(new Animated.Value(height)).current;
    const showModal = () => {
    setUpdateModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: height * 0.66, // Slide up to 60% of screen height
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: height, // Slide down
      duration: 300,
      useNativeDriver: false,
    }).start(() => setUpdateModalVisible(false));
  };
  const handleUpdate = () => {
    hideModal()
    Linking.openURL(updateUrl)
  };
 useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const currentVersion = DeviceInfo.getVersion();  // e.g. 1.2.25.03 (from build.gradle)
        const version = await checkVersion({ bundleId: "com.pplsyncbiometric" }); // API response
        const latestVersion = version.version; // e.g. 1.2.25.04

        if (latestVersion && isNewerVersion(latestVersion, currentVersion)) {

          setUpdateUrl(`https://play.google.com/store/apps/details?id=com.pplsyncbiometric`);
              showModal();
        } else {
              // showModal();
        }
      } catch (error) {

      }
    };

    checkForUpdate();
  }, []);
  const isNewerVersion = (latest, current) => {
    const latestParts = latest.split('.').map(Number);
    const currentParts = current.split('.').map(Number)

    for (let i = 0; i < latestParts.length; i++) {
      const latestNum = latestParts[i] || 0;
      const currentNum = currentParts[i] || 0;
      if (latestNum > currentNum) {
        return true;
      } else if (latestNum < currentNum) {
        return false;
      }
    }

    return false;
  };
    useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp(); // Close the app immediately
      return true; // Prevent default back navigation
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={{flex:1}}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
     <View style={{flex:1}}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'scan';
            if (route.name === 'History') iconName = 'document-text-outline';
            else if (route.name === 'Settings') iconName = 'settings';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#8E31EC',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
       
        <Tab.Screen name="HomeScreen" component={HomeScreen} />
        <Tab.Screen name="History" component={PunchHistory} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
        {isUpdateModalVisible && (
        <Animated.View style={[styles.modalContainer, { top: slideAnim }]}>
          <Text style={[GlobalStyle.semibold_black, styles.modalTitle]}>Update Available</Text>
          <Text style={[GlobalStyle.bold_white, styles.modalMessage]}>A new version of the app is available. Please update to continue.</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
              <Text style={[GlobalStyle.semibold_black, styles.updateText]}>Update</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      </View>
      </View>
   
  );
}
export const GETLocation = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.locationWrapper}>
          <View style={styles.iconContainer}>
            <Ionicons name="location-sharp" size={40} color={AppColors.gradient} />
          </View>
          <Text style={styles.title}>Fetching your location…</Text>
          <ActivityIndicator size="small" color={AppColors.gradient} style={{marginTop: 10}} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  locationWrapper: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    width: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "rgba(0,200,83,0.1)",
    borderRadius: 50,
    padding: 15,
    marginBottom: 15,
  },
  space: {height: 15},
  spaceLarge: {height: 20},
  modalOverlay: {
    flex: 1,
    padding: 5,
    // width:"90%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Transparent background
  },
  toastContainer: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    margin: 15,
    // maxWidth: '80%',
    alignItems: 'center',
  },
  toastText: {
    color: AppColors.white,
    fontSize: 14,
    margin: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    height: 100,
    width: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
   updateButton: {
    flex: 1,
    padding: 12,
    backgroundColor: AppColors.gradient2,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateText: {
    color: 'white',
    fontWeight: 'bold',
  },
   modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    elevation: 5, // For shadow effect on Android
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: AppColors.black
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
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
  cameraCircle: {
    width: width * 0.7,   // slightly smaller inside
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
    iconbg:{backgroundColor:'#F6EDFF',padding:5,borderRadius:5},
  container: { flex: 1, backgroundColor: '#fff', paddingBottom: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {


    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logo: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center',
     marginTop: 10, justifyContent: 'center' },
  timeBox: { backgroundColor: 'rgba(255,255,255,0.3)',
    flexDirection:'row',
     paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10 },
  timeText: { color: '#fff', fontWeight: 'bold',marginLeft:5 },
  addButton: { backgroundColor: '#FE7B01',
     paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10 },
  addText: { color: '#fff', fontWeight: 'bold' ,marginLeft:10},
  instructions: { padding: 20 },
  instructionItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  instructionText: { marginLeft: 10,  fontSize: 14 },
  cameraCircle1: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    borderWidth: 3,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    
  },
   cameraCircle: {
     width: width * 0.7,
    height: width * 0.7,
    alignSelf:'center',
   
    borderRadius: (width * 0.7) / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#999',
  },
  verifyButton: {
    backgroundColor: '#6B46C1',
    marginHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  verifyText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
