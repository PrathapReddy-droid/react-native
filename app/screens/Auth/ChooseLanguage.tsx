import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { IMAGES } from '../../constants/Images';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';

type SplashScreenProps = StackScreenProps<RootStackParamList, 'Splash'>;

const { width, height } = Dimensions.get('window');

const PRIMARY = COLORS?.primary ?? '#1A1A2E';
const CARD = COLORS?.card ?? '#FFFFFF';
const ACCENT = COLORS?.accent ?? '#FFD166';
const FONT_MEDIUM = FONTS?.fontMedium ?? {};
const FONT_REGULAR = FONTS?.fontRegular ?? {};
const FONT_BOLD = FONTS?.fontBold ?? FONT_MEDIUM;
const LOGO_SOURCE = IMAGES?.FizzFuzz;

const TITLE = 'Welcome to FizzyFuzz';
const SUBTITLE = 'Discover. Connect. Enjoy.';

const PARTICLE_COUNT = 12;
const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
  id: i,
  size: 4 + Math.random() * 8,
  startX: Math.random() * width,
  delay: Math.random() * 2500,
  duration: 4000 + Math.random() * 3000,
  drift: (Math.random() - 0.5) * 70,
}));

const ChooseLanguage = ({ navigation }: SplashScreenProps) => {
  const hasNavigated = useRef(false);

  const screenOpacity = useRef(new Animated.Value(1)).current;

  const logoScale = useRef(new Animated.Value(0.2)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.5)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0.35)).current;
  const ring3Scale = useRef(new Animated.Value(1)).current;
  const ring3Opacity = useRef(new Animated.Value(0.2)).current;

  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeTranslateY = useRef(new Animated.Value(-10)).current;

  // Per-letter animation values for the title
  const letterAnims = useRef(
    TITLE.split('').map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(18),
      scale: new Animated.Value(0.5),
    }))
  ).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(16)).current;

  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  const particleAnims = useRef(
    particles.map(() => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 45,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoFloat, {
            toValue: -10,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(logoFloat, {
            toValue: 0,
            duration: 1400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Pulsing rings
    const makeRingLoop = (
      scaleAnim: Animated.Value,
      opacityAnim: Animated.Value,
      toScale: number,
      toOpacity: number,
      duration: number,
      delay: number
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: toScale,
              duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: toOpacity,
              duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: toOpacity + 0.15,
              duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ])
      );

    makeRingLoop(ring1Scale, ring1Opacity, 1.3, 0.12, 1600, 0).start();
    makeRingLoop(ring2Scale, ring2Opacity, 1.55, 0.08, 1900, 200).start();
    makeRingLoop(ring3Scale, ring3Opacity, 1.8, 0.05, 2200, 400).start();

    // Badge (small pill above title)
    Animated.parallel([
      Animated.timing(badgeOpacity, {
        toValue: 1,
        duration: 400,
        delay: 380,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(badgeTranslateY, {
        toValue: 0,
        duration: 400,
        delay: 380,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    // Title: letter-by-letter cascade
    const letterAnimations = letterAnims.map((anim, i) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 340,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(anim.translateY, {
          toValue: 0,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.spring(anim.scale, {
          toValue: 1,
          friction: 4,
          tension: 70,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(35, letterAnimations).start();

    // Subtitle after letters finish
    const subtitleDelay = 550 + TITLE.length * 35;
    Animated.parallel([
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 450,
        delay: subtitleDelay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(subtitleTranslateY, {
        toValue: 0,
        duration: 450,
        delay: subtitleDelay,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // Loading dots
    const dotPulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 380,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(600),
        ])
      );
    dotPulse(dot1, subtitleDelay + 400).start();
    dotPulse(dot2, subtitleDelay + 550).start();
    dotPulse(dot3, subtitleDelay + 700).start();

    // Ambient particles
    particleAnims.forEach((anim, i) => {
      const p = particles[i];
      const rise = () => {
        anim.translateY.setValue(0);
        anim.translateX.setValue(0);
        anim.opacity.setValue(0);
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: p.duration * 0.25,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: -height * 0.6,
              duration: p.duration,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateX, {
              toValue: p.drift,
              duration: p.duration,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => rise());
        });
      };
      rise();
    });

    // Navigate with fade-out
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'SignUp',
              params: { screen: 'SignUp', params: { screen: 'SignUp' } },
            },
          ],
        });
      });
    }, 3200);

    return () => clearTimeout(timer);
  }, [navigation]);

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-20deg', '0deg'],
  });

  return (
    <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: PRIMARY }}>
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.backdropBlob, styles.blobTopRight]} />
          <View style={[styles.backdropBlob, styles.blobBottomLeft]} />
        </View>

        {particles.map((p, i) => (
          <Animated.View
            key={p.id}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: p.startX,
              bottom: 60,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: CARD,
              opacity: particleAnims[i].opacity,
              transform: [
                { translateY: particleAnims[i].translateY },
                { translateX: particleAnims[i].translateX },
              ],
            }}
          />
        ))}

        <View style={styles.center}>
          <Animated.View
            style={[
              styles.ring,
              { borderColor: ACCENT, opacity: ring3Opacity, transform: [{ scale: ring3Scale }] },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              { borderColor: ACCENT, opacity: ring2Opacity, transform: [{ scale: ring2Scale }] },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              { borderColor: ACCENT, opacity: ring1Opacity, transform: [{ scale: ring1Scale }] },
            ]}
          />

          {LOGO_SOURCE ? (
            <Animated.Image
              source={LOGO_SOURCE}
              style={{
                width: 150,
                height: 150,
                marginBottom: 22,
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { rotate: rotateInterpolate },
                  { translateY: logoFloat },
                ],
              }}
              resizeMode="contain"
            />
          ) : (
            <Animated.View
              style={{
                width: 150,
                height: 150,
                marginBottom: 22,
                borderRadius: 75,
                backgroundColor: CARD,
                opacity: logoOpacity,
                transform: [
                  { scale: logoScale },
                  { rotate: rotateInterpolate },
                  { translateY: logoFloat },
                ],
              }}
            />
          )}

          {/* Small pill badge above title */}
          <Animated.View
            style={[
              styles.badge,
              {
                opacity: badgeOpacity,
                transform: [{ translateY: badgeTranslateY }],
              },
            ]}
          >
            <View style={styles.badgeDot} />
            <Text style={[FONT_REGULAR, styles.badgeText]}>ONLINE COMMUNITY</Text>
          </Animated.View>

          {/* Letter-by-letter animated title */}
          <View style={styles.titleRow}>
            {TITLE.split('').map((char, i) => (
              <Animated.Text
                key={i}
                style={[
                  FONT_BOLD,
                  styles.titleChar,
                  {
                    opacity: letterAnims[i].opacity,
                    transform: [
                      { translateY: letterAnims[i].translateY },
                      { scale: letterAnims[i].scale },
                    ],
                  },
                ]}
              >
                {char === ' ' ? '\u00A0' : char}
              </Animated.Text>
            ))}
          </View>

          <Animated.Text
            style={[
              FONT_REGULAR,
              styles.subtitle,
              {
                opacity: subtitleOpacity,
                transform: [{ translateY: subtitleTranslateY }],
              },
            ]}
          >
            {SUBTITLE}
          </Animated.Text>

          <View style={styles.dotsRow}>
            {[dot1, dot2, dot3].map((dot, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    opacity: dot,
                    transform: [
                      {
                        scale: dot.interpolate({
                          inputRange: [0.3, 1],
                          outputRange: [0.8, 1.3],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  ring: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT,
    marginRight: 7,
  },
  badgeText: {
    color: CARD,
    fontSize: 11,
    letterSpacing: 1.5,
    opacity: 0.8,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  titleChar: {
    fontSize: 30,
    color: CARD,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 15,
    color: CARD,
    opacity: 0.75,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 36,
  },
  dotsRow: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: ACCENT,
  },
  backdropBlob: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: CARD,
    opacity: 0.06,
  },
  blobTopRight: {
    top: -width * 0.35,
    right: -width * 0.35,
  },
  blobBottomLeft: {
    bottom: -width * 0.35,
    left: -width * 0.35,
  },
});

export default ChooseLanguage;