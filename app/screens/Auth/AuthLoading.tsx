import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type Props = StackScreenProps<RootStackParamList, 'AuthLoading'>;

const AuthLoading = ({ navigation }: Props) => {
  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      try {
        const token = await AsyncStorage.getItem('AccessToken');

        if (token) {
          // ✅ Token exists → go to Home
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'DrawerNavigation',
                params: { screen: 'Home' },
              },
            ],
          });
        } else {
          // ❌ No token → Choose language / signup
          navigation.reset({
            index: 0,
            routes: [{ name: 'ChooseLanguage' }],
          });
        }
      } catch (error) {
        // Fail-safe
        navigation.reset({
          index: 0,
          routes: [{ name: 'ChooseLanguage' }],
        });
      }
    };

    checkTokenAndNavigate();
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

export default AuthLoading;
