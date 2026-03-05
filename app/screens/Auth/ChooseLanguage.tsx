import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { IMAGES } from '../../constants/Images';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type SplashScreenProps = StackScreenProps<
  RootStackParamList,
  'Splash'
>;

const ChooseLanguage = ({ navigation }: SplashScreenProps) => {
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'SignUp',
            params: {
              screen: 'SignUp',
              params: {
                screen: 'SignUp',
              },
            },
          },
        ],
      });
    }, 3000); // ⏱ splash duration

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 30,
        }}
      >
        <Image
          source={IMAGES.FizzFuzz}
          style={{ width: 160, height: 160, marginBottom: 30 }}
          resizeMode="contain"
        />

        <Text
          style={[
            FONTS.fontMedium,
            {
              fontSize: 32,
              color: COLORS.card,
              marginBottom: 10,
              textAlign: 'center',
            },
          ]}
        >
          Welcome to FizzyFuzz
        </Text>

        <Text
          style={[
            FONTS.fontRegular,
            {
              fontSize: 16,
              color: COLORS.card,
              opacity: 0.85,
              textAlign: 'center',
            },
          ]}
        >
          Discover. Connect. Enjoy.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ChooseLanguage;
