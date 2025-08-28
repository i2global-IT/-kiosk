
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { store } from './src/redux/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screen/login';
import Loader from './src/uitility/circularprogress';

import Dashboard from './src/screen/dashboard/HomePage';
import RegisterFaceScreen from './src/screen/AddEmployee';
import PunchHistory from './src/screen/PunchHistory';
import React from 'react';
import { StatusBar } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import GlobalStyle from './src/uitility/GlobalStyle';
import SettingsScreen from './src/screen/setting';
import OnboardingScreen from './src/screen/SplashScreen';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
   <Provider store={store}>
  <NavigationContainer>
      <StatusBar
          translucent
          backgroundColor="transparent"
         // use "dark-content" if your header bg is light
        />
     <Loader />
    <Stack.Navigator
      initialRouteName="OnboardingScreen"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={Dashboard} />
            <Stack.Screen name="RegisterFaceScreen" component={RegisterFaceScreen} />
                    <Stack.Screen name="PunchHistory" component={PunchHistory} />
 <Stack.Screen name="SettingsScreen" component={SettingsScreen} />

      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />              
                      
    </Stack.Navigator>
       <Toast config={toastConfig} />
  </NavigationContainer>
</Provider>

  );
}
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={GlobalStyle.semibold_black}
    />
  ),
  failed: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: 'red' }}
      text1Style={GlobalStyle.semibold_black}
    />
  ),
};