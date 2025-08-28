// App.tsx

import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from "@react-native-vector-icons/ionicons";
import { images } from '../../uitility/image';
import LinearGradient from 'react-native-linear-gradient';
import { AppColors } from '../../uitility/color';
import { SafeAreaFrameContext } from 'react-native-safe-area-context';
import useHomePageViewModal from '../../viewModel/HomePageViewModel';
import GlobalStyle from '../../uitility/GlobalStyle';
import CustomButton from '../../component/CustomButton';
import { Camera, CameraType } from 'react-native-camera-kit';
import React = require('react');
import ConfirmDialog from './SuccesDialog';
import PunchHistory from '../PunchHistory';
import SettingsScreen from '../setting';
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
      <TouchableOpacity style={styles.addButton}
      onPress={()=>{
        navigation.navigate("RegisterFaceScreen")
      }}>
        <Text style={styles.addText}>+ Add employee</Text>
      </TouchableOpacity>
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
     <View style={{paddingHorizontal:10,marginTop:15}}>
<CustomButton title='Verify'  onPress={ viewModel.handleVerify}/>
    </View>
<ConfirmDialog
  visible={viewModel.showDialog}
  onClose={() => viewModel.setShowDialog(false)}
  user={{
    name: 'Mike Johnson',
    role: 'Sales',
    id: 'I2GBD003',
    punchTime: '10:00 AM',
   image: viewModel.CapturedImage ? { uri: viewModel.CapturedImage } : images.onboard,  // replace with real photo
  }}/>

  </View>
    )
}




export default function Dashboard() {
  return (
    
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
       
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={PunchHistory} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
   
  );
}

const styles = StyleSheet.create({
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
  headerRight: { flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between' },
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
