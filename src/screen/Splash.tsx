import { useEffect, useState } from 'react';
import { AppColors } from '../uitility/color';
import { images } from '../uitility/image';
import { Animated, StyleSheet, View } from 'react-native';
import React from 'react';
import Storage from '../uitility/Sotrage';
import { height } from '../uitility/GlobalStyle';
// Get screen dimensions to help with the overlay expansion
// const { width, height } = Dimensions.get('window');
export const Splash= ({ navigation }) => {
  const [overlayScale] = useState(new Animated.Value(0)); // Scale for zoom-out effect
  const [imageOpacity] = useState(new Animated.Value(0)); // Image opacity for fade-in effect
   let loginaccess:any;
  useEffect(() => {
    // Step 1: Start zoom-out effect for the overlay background
    Animated.timing(overlayScale, {
      toValue: 6, // Increase the scale to cover the entire screen
      duration: 3000, // 3 seconds for full transition
      useNativeDriver: true,
    }).start();
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 1500, // 1.5 seconds for the image to fully appear
      delay: 2000, // Start fading in after 2 seconds
      useNativeDriver: true,
    }).start();
    // Step 3: Navigate to the main screen after a delay
    setTimeout(async () => {
           loginaccess = JSON.parse( await Storage.getItem('loginaccess')) 
            if(loginaccess==true || "null"){
  navigation.navigate("SplashScreen")
            }else{
  navigation.navigate("HomeScreen")
            }  // Replace 'Home' with your main screen
    }, 3000); // 5 seconds total splash screen time
  }, [overlayScale, imageOpacity, navigation]);

  return (
    <View style={styles.container}>
      <View style={[styles.container, { backgroundColor: AppColors.white }]} />
      <Animated.View
        style={[
          styles.overlay,
          {
            transform: [{ scale: overlayScale }],
          },
        ]}
      />
      <Animated.Image
        source={images.splash} // Replace with your image path
        style={[styles.image, { opacity: imageOpacity }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    width: height.windowWidth * 2, // Start larger than screen width
    height: height.windowWidth * 2, // Maintain circular shape
    borderRadius: height.windowWidth, // Ensure it's a large circle
    backgroundColor: AppColors.primaryLinear2, // Blue color for overlay
    top: height.windowHeight / 2 - height.windowWidth, // Center vertically
    left: height.windowWidth / 2 - height.windowWidth, // Center horizontally
  },
  image: {
    width: 250,  // Adjust to the desired size
    height: 200,
    position: 'absolute',
  },
});
export default Splash;
