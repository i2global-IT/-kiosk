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
    console.log(`✅ Saved key "${key}" with value:`, jsonValue);
  } catch (e) {
    console.error(`❌ Error saving data for key "${key}":`, e);
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
    console.log(`📦 Retrieved key "${key}" with value:`, parsedValue);

    return parsedValue;
  } catch (e) {
    console.error(`❌ Error reading data for key "${key}":`, e);
    return null;
  }
},


  // Remove data
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing data for key "${key}":`, e);
    }
  },

  // Clear all data
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Error clearing storage', e);
    }
  },
};

export default Storage;
