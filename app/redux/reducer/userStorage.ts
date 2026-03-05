import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'USER_DATA';

export const saveUserToStorage = async (user: any) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserFromStorage = async () => {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearUserFromStorage = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};
