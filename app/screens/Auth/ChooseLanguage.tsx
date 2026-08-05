import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { IMAGES } from '../../constants/Images';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type SplashScreenProps = StackScreenProps<RootStackParamList, 'Splash'>;

const ChooseLanguage = ({ navigation }: SplashScreenProps) => {
  const hasNavigated = useRef(false);

  // Logo animations
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  // Text animations
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;

  // Subtle looping "breathing" glow behind the logo
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Logo: rotate + scale + fade in together
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Start looping glow pulse once logo has landed
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(glowScale, {
              toValue: 1.25,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0.15,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(glowScale, {
              toValue: 1,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0.4,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });

    // Title: fade + slide up (starts slightly after logo)
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 500,
      delay: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    Animated.timing(titleTranslateY, {
      toValue: 0,
      duration: 500,
      delay: 400,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();

    // Subtitle: fade + slide up (starts after title)
    Animated.timing(subtitleOpacity, {
      toValue: 1,
      duration: 500,
      delay: 650,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    Animated.timing(subtitleTranslateY, {
      toValue: 0,
      duration: 500,
      delay: 650,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();

    // Navigation timer
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

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

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
        {/* Glow behind logo */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: COLORS.card,
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          }}
        />

        <Animated.Image
          source={IMAGES.FizzFuzz}
          style={{
            width: 160,
            height: 160,
            marginBottom: 30,
            opacity: logoOpacity,
            transform: [
              { scale: logoScale },
              { rotate: rotateInterpolate },
            ],
          }}
          resizeMode="contain"
        />

        <Animated.Text
          style={[
            FONTS.fontMedium,
            {
              fontSize: 32,
              color: COLORS.card,
              marginBottom: 10,
              textAlign: 'center',
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          Welcome to FizzyFuzz
        </Animated.Text>

        <Animated.Text
          style={[
            FONTS.fontRegular,
            {
              fontSize: 16,
              color: COLORS.card,
              opacity: Animated.multiply(subtitleOpacity, 0.85),
              textAlign: 'center',
              transform: [{ translateY: subtitleTranslateY }],
            },
          ]}
        >
          Discover. Connect. Enjoy.
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
};

export default ChooseLanguage;