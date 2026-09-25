import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const createTokenCache = () => {
  return {
    async getToken(key: string) {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return await SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    }
  };
};

// Use SecureStore for native, but undefined for Web (Clerk handles Web automatically)
export const tokenCache = Platform.OS === 'web' ? undefined : createTokenCache();