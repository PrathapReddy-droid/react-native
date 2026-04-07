import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider, useSelector } from 'react-redux';
import Route from './app/navigation/Route';
import store from './app/redux/store';
import './app/Firebase/Firebase';
import messaging from '@react-native-firebase/messaging';
import { getFCMToken, setupTokenRefreshListener } from './app/Firebase/Firebase';

/**
 * 🔹 Main App Logic Component (Redux available here)
 */
function MainApp() {
  const user = useSelector((state: any) => state.user.selectedUser);

  useEffect(() => {
    // 🚫 Prevent crash if user not loaded yet
    if (!user?._id) return;

    // ✅ Generate FCM token
    getFCMToken(user?._id);

    // ✅ Token refresh listener
    const unsubscribeRefresh = setupTokenRefreshListener(user?._id);

    // ✅ Foreground notification
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);

      Alert.alert(
        remoteMessage.notification?.title ?? 'Notification',
        remoteMessage.notification?.body ?? ''
      );
    });

    // ✅ Background — user taps notification
    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Background tap:', remoteMessage);
    });

    // ✅ Quit state — user taps notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Quit state tap:', remoteMessage);
        }
      });

    // ✅ Cleanup
    return () => {
      unsubscribeForeground();
      unsubscribeRefresh();
      unsubscribeOpened();
    };
  }, [user]);

  return <Route />;
}

/**
 * 🔹 Root Component (Provider must wrap everything)
 */
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <MainApp />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}
