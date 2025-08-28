import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { AppColors } from './color';
import  { useEffect, useRef } from "react";
import { Animated, Text,  } from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons';// or "react-native-vector-icons/Ionicons"
export default function Loader() {
  const loadingCount = useSelector((state: any) => state.ui.loadingCount);
  if (loadingCount === 0) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={AppColors.gradient} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
    toastContainer: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toastText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
});


type ToastProps = {
  visible: boolean;
  type: "success" | "error";
  message: string;
  onHide: () => void;
};

export const CustomToast: React.FC<ToastProps> = ({ visible, type, message, onHide }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current; // hidden top

  useEffect(() => {
    if (visible) {
      // Slide In
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto Hide
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          borderColor: type === "success" ? "green" : "red",
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Ionicons
        name={type === "success" ? "checkmark-circle" : "close-circle"}
        size={22}
        color={type === "success" ? "green" : "red"}
        style={{ marginRight: 8 }}
      />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};



