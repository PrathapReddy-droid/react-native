/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { getMessaging } from '@react-native-firebase/messaging';

getMessaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
