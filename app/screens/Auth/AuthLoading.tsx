import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type Props = StackScreenProps<RootStackParamList, 'AuthLoading'>;

const AuthLoading = ({ navigation } : Props) => {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        navigation.reset({
          index: 0,
          routes: [{ name: 'DrawerNavigation', params: { screen: 'Home' } }],
        });
      } else {
        // No user signed in
        navigation.reset({
          index: 0,
          routes: [{ name: 'ChooseLanguage' }],
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default AuthLoading;
