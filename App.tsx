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

// ❌ Remove these two imports — no modal logic in App.tsx
// import { authEvents, AUTH_MODAL_OPEN } from './app/Api/AuthEvents';
// import AuthModal from './app/screens/Payment/AuthModel';

function MainApp() {
  const user = useSelector((state: any) => state.user.selectedUser);

  // ❌ Remove the authModalRef and authEvents useEffect entirely

  useEffect(() => {
    if (!user?._id) return;

    getFCMToken(user?._id);
    const unsubscribeRefresh = setupTokenRefreshListener(user?._id);

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title ?? 'Notification',
        remoteMessage.notification?.body ?? ''
      );
    });

    const unsubscribeOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Background tap:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) console.log('Quit state tap:', remoteMessage);
      });

    return () => {
      unsubscribeForeground();
      unsubscribeRefresh();
      unsubscribeOpened();
    };
  }, [user]);

  // ❌ Remove <AuthModal> from here
  return <Route />;
}

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