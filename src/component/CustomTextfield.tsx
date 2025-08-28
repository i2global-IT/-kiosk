import React, { useState, useEffect, ReactNode } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { AppColors } from '../uitility/color';
import Ionicons from '@react-native-vector-icons/ionicons';

interface CustomTextFieldProps {
  heading: string;
  hintText: string;
  value?: string;
  onChangeText: (text: string) => void;
  onTap?: () => void;
  hasError?: boolean;
  errorText?: string;
  keyboardType?: TextInputProps['keyboardType'];
   suffixIcon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  readOnly?: boolean;
  isRequired?: boolean;
  textColor?: string;
  backgroundColor?: string;
  borderColorDefault?: string;
  borderColorFocused?: string;
  borderColorError?: string;
  maxLength?: number;
  maxLines?: number;
  secureTextEntry?: boolean;
  onSubmitEditing?: () => void;
}

export const CustomTextField: React.FC<CustomTextFieldProps>  = ({
  heading="",
  hintText="",
  value="",
  onChangeText=()=>{},
  onTap=()=>{},
  hasError = false,
  errorText="",
  keyboardType = 'default',
  suffixIcon,
  prefixIcon,
  readOnly = false,
  isRequired = true,
  textColor = '#000',
  backgroundColor = AppColors.textinputBg,
  borderColorDefault = AppColors.textinputBorder,
  borderColorFocused =AppColors.gradient,
  borderColorError = 'red',
  maxLength=10,
  maxLines = 1,
  secureTextEntry = false,
  onSubmitEditing=()=>{},
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const currentBorderColor = hasError
    ? borderColorError
    : isFocused
    ? borderColorFocused
    : borderColorDefault;

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Heading */}
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>{heading}</Text>
        {isRequired && <Text style={styles.required}>*</Text>}
      </View>

      {/* TextInput */}
      <TouchableOpacity activeOpacity={1} onPress={onTap}>
        <View
          style={[
            styles.inputContainer,
            {marginTop:5, borderColor: currentBorderColor, backgroundColor: backgroundColor },
          ]}
        >
          {/* {prefixIcon && <View style={styles.icon}>{prefixIcon}</View>} */}
  {prefixIcon && (
          <Ionicons style={[styles.icon, ]} size={15} name=  {prefixIcon}>
        
          </Ionicons>
        )}
          <TextInput
            style={[styles.textInput, { color: textColor,marginLeft:2 }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={hintText}
            placeholderTextColor={AppColors.hintext}
        
            keyboardType={keyboardType}
            editable={!readOnly}
            maxLength={maxLength}
            secureTextEntry={secureTextEntry}
            multiline={maxLines > 1}
            numberOfLines={maxLines}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={onSubmitEditing}
          />

          {suffixIcon &&   <Ionicons style={[styles.icon, ]} size={15} 
          name=  {suffixIcon}>
        
          </Ionicons>}
        </View>
      </TouchableOpacity>

      {/* Error Text */}
      {hasError && errorText && (
        <Text style={styles.errorText}>{errorText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headingContainer: { flexDirection: 'row', alignItems: 'center' },
  headingText: { fontSize: 14, fontWeight: '600', color: '#000' },
  required: { color: 'red', marginLeft: 4, fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
  icon: {  color:AppColors.gradient},
  errorText: { color: 'red', fontSize: 12, marginTop: 4, marginLeft: 4 },
});

export default CustomTextField;
