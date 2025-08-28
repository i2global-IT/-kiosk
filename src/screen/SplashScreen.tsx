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
} from "react-native";
import { images } from "../uitility/image";
import Storage from "../uitility/Sotrage";

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
        "Automatically recognize faces in seconds. Punch in/out instantly and track attendance with ease.",
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
  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };
    let accessToken:any;
  // auto scroll effect
  useEffect(() => {
    accessToken =  Storage.getItem('accessToken');
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % slides.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      {/* Title */}
      <Text style={styles.title}>{item.title}</Text>
      {/* Subtitle */}
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background Image + Logo */}
      <ImageBackground
        source={images.onboarding}
        style={styles.header}
        resizeMode="cover"
      >
        <Image source={images.onboard} style={styles.logo} resizeMode="contain" />
      </ImageBackground>

      {/* Bottom Card Section */}
      <View style={styles.bottomCard}>
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onScroll={handleScroll}
        />

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>{
            if(accessToken!=null){
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
  );
};

export default OnboardingScreen;


const styles = StyleSheet.create({
    dotsContainer: {
    flexDirection: "row",
    marginVertical: 15,
  },
     dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
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
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
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
