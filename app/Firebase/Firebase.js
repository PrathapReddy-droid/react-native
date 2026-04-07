import messaging from '@react-native-firebase/messaging';
import { FcmToken } from '../Api/User';

export async function getFCMToken(id) {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.log('Permission denied');
    return null;
  }

  const token = await messaging().getToken();
  let data = {
    id:id,
    token :token
  }
  console.log('FCM Token:', token,data);
  await FcmToken(data);
  return token;
}

export function setupTokenRefreshListener() {
  return messaging().onTokenRefresh(async (newToken) => {

    console.log('Token refreshed:', newToken);
    await FcmToken(newToken);
  });
}