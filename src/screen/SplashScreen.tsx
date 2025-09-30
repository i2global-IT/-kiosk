import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
  BackHandler,
  StatusBar,
} from "react-native";
import { images } from "../uitility/image";
import Storage from "../uitility/Sotrage";
import GlobalStyle from "../uitility/GlobalStyle";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const slides = [
    {
      id: "1",
      title: (
        <>
          Fast <Text style={styles.highlight}>Check-in / Check-out</Text> for{" "}
          <Text style={styles.bold}>Everyone</Text>
        </>
      ),
      subtitle:
        "Tap to detect your face and mark attendance instantly",
    },
    {
      id: "2",
      title: (
        <>
          Scan — <Text style={styles.highlight}>Verified</Text> — You’re In
        </>
      ),
      subtitle:
        "Scan your face and get verified in seconds. Punch in or out instantly with seamless tracking.",
    },
  ];

  // handle scroll manually

    let loginaccess:any;
  // auto scroll effect
  useEffect(() => {

    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slides.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

const renderItem = ({ item }) => (
  <View style={[styles.slide, { width }]}>
    <Text style={[GlobalStyle.semibold_black, styles.title]}>
      {item.title}
    </Text>
    <Text style={[GlobalStyle.semibold_black, styles.subtitle]}>
      {item.subtitle}
    </Text>
  </View>
);

const scrollX = useRef(new Animated.Value(0)).current;
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
    <SafeAreaView style={{flex:1}}>
      <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={"dark-content"}
               // use "dark-content" if your header bg is light
              />
    <View style={styles.container}>
      {/* Background Image + Logo */}
      <ImageBackground
        source={images.onboarding}
        style={styles.header}
        resizeMode="cover"
      >
        {/* <Image source={images.onboard} style={styles.logo} resizeMode="contain" /> */}
      </ImageBackground>

      {/* Bottom Card Section */}
      <View style={styles.bottomCard}>
     <Animated.FlatList
  ref={flatListRef}
  data={slides}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  )}
  scrollEventThrottle={16}
/>

        {/* Dots Indicator */}
   <View style={styles.dotsContainer}>
  {slides.map((_, index) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const dotWidth = scrollX.interpolate({
      inputRange,
      outputRange: [8, 16, 8],
      extrapolate: "clamp",
    });

    const dotColor = scrollX.interpolate({
      inputRange,
      outputRange: ["#ccc", "#7b2ff7", "#ccc"],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.dot,
          {
            width: dotWidth,
            backgroundColor: dotColor,
          },
        ]}
      />
    );
  })}
</View>


        {/* Action Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={async () =>{
                loginaccess = JSON.parse( await Storage.getItem('loginaccess')) 
            if(loginaccess==true){
  navigation.navigate("HomeScreen")
            }else{
  navigation.navigate("login")
            }
          
          }
            
            }
        >
          <Text style={styles.buttonText}>Let’s Go !</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;


const styles = StyleSheet.create({

    dotsContainer: {
    flexDirection: "row",
    marginVertical: 15,
  },
slide: {
  justifyContent: "center",
  alignItems: "center",
},
dot: {
  height: 8,
  borderRadius: 4,
  marginHorizontal: 5,
},

    activeDot: {
    backgroundColor: "#7b2ff7",
    width: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#C084FC", // fallback gradient color
  },
  header: {
    flex: 0.65,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.4,
    height: 40,
    marginBottom: 400,
  },
  bottomCard: {
    flex: 0.35,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    width:"100%",
    padding:10
    
  },
  highlight: {
    color: "#f44336", // red for emphasis
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 10,
    margin:15
  },
  button: {
    marginTop: 20,
    backgroundColor: "#7b2ff7",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  
});
