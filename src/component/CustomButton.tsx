import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { AppColors } from '../uitility/color';
import LinearGradient from 'react-native-linear-gradient';
import GlobalStyle from '../uitility/GlobalStyle';
type CustomButtonProps = {
  title?: string;
  onPress?: () => void;
  colors?: string[];
  borderColor?: string;
  borderWidth?: number;
  textColor?: string;
};
const CustomButton: React.FC<CustomButtonProps> = ({
  title = "",
  onPress = () => {},
  colors = [AppColors.gradient, AppColors.gradient2], // default gradient colors
  borderColor = AppColors.textinputBorder,
  borderWidth = 1.5,
  textColor = "#FFFFFF",
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, { borderColor, borderWidth }]}
      >
        <View style={styles.content}>
          <Text style={[ GlobalStyle.semibold_black, styles.text, { color: textColor }]}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CustomButton;
