// Storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const Storage = {
  // Save data
// Save data
setItem: async (key: string, value: any) => {
  try {
    let jsonValue;
    if (typeof value === "string") {
      jsonValue = value; // already a string
    } else {
      jsonValue = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, jsonValue);

    // ✅ Success log
  } catch (e) {
  }
},

// Get data
getItem: async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    let parsedValue;

    try {
      parsedValue = jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch {
      parsedValue = jsonValue; // plain string
    }

    // ✅ Success log

    return parsedValue;
  } catch (e) {
    return null;
  }
},


  // Remove data
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
    }
  },

  // Clear all data
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
    }
  },
};

export default Storage;
