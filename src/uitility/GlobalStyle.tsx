import { Dimensions, StyleSheet } from "react-native";
import { AppColors } from "./color";



export const height = {
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height
} 
const fontSize = {
    fontSize: 10,
    fs11: 11,
    fs12: 12,
    fs13: 13,
    fs14: 14,
    fs15: 15,
    fs16: 16,
    fs17: 17,
    fs18: 18,
    fs19: 19,
    fs20: 20,

}
export const fontFamily = {
    poppin_regular: "Inter_18pt-Regular.ttf",
    poppin_bold: "Inter_18pt-Bold.ttf",
    poppin_semibold: "Inter_18pt-SemiBold.ttf",
    poppin_medium: "Inter_18pt-Medium.ttf",
}

export default StyleSheet.create({
    

  center: { alignSelf: "center", },
  padding: { padding: 10 },
  placeholderClr: { color: "#888888" },
  regular_Font: {
    fontSize: fontSize.fs15,
    color: AppColors.white,
    fontFamily: fontFamily.poppin_regular
  },
  regular_FontMedium: {
    fontSize: fontSize.fs15,
    color: AppColors.white,
    fontFamily: fontFamily.poppin_medium
  },
  
  regular_FontMediumblack: {
    fontSize: fontSize.fs15,
    color: AppColors.black,
    fontFamily: fontFamily.poppin_medium
  },

  regular_Fontblack: {
    fontSize: fontSize.fs13,
    color: AppColors.black,
    fontFamily: fontFamily.poppin_regular
  },
  regular_FontblackFontWeight: {
    fontSize: fontSize.fs13,
    color: AppColors.black,
    fontFamily: fontFamily.poppin_regular,
    fontWeight: "700"
  },
  semibold_black: {
    fontSize: fontSize.fs15,
    color: AppColors.black,
    fontFamily: fontFamily.poppin_bold

  },
  bold_white: {
    fontSize: fontSize.fs15,
    color: AppColors.white,
    fontFamily: fontFamily.poppin_bold
  },

  spbtwn: {
    justifyContent: "space-between",
    flexDirection: "row"
  },
  
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    fontFamily: fontFamily.poppin_medium
  },
  row: {
    flexDirection: "row"
  },
  placeholderStyle: {
    fontSize: fontSize.fs15,
    color: AppColors.black,
    fontFamily: fontFamily.poppin_regular
  },
  dropdown: {
    height: 50,
    borderColor: 'transparent',
    borderWidth: 0.5,
    paddingHorizontal: 8,
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    justifyContent: 'center',
    // padding:10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 13,
    borderRadius: 15,
    elevation: 5, // Adds shadow on Android
    // Optional: Add height to ensure it doesn't take full screen
    // maxHeight: '50%', // Adjust this value as needed
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: AppColors.green,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  button: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 15,
    marginLeft: 10,
    alignItems: 'center',
  },



  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  //  fab: {
  //   position: 'absolute',
  //   bottom: 40,
  //   right: 20,
  //   backgroundColor: '#1cc88a',
  //   borderRadius: 25,
  //   paddingHorizontal: 20,
  //   paddingVertical: 12,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 3 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 5,
  //   elevation: 5, // For Android
  // },
  bg: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    marginTop: 5
  },
  ///login page
  topSection: {

    margin: 10,
    justifyContent: "center",
  },

  loginImg: {
    height: height.windowHeight * 0.3,
    width: height.windowWidth * 0.7,
    resizeMode: "contain",
    alignSelf: "center",
  },
  


})


