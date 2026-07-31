import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Toast from 'react-native-simple-toast';
import { loginApi } from '../../Api/User';

type SingInScreenProps = StackScreenProps<RootStackParamList, 'SingIn'>;

const SingIn = ({ navigation }: SingInScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [show, setShow] = useState(false); // UI only

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      Toast.show('Please enter email and password', Toast.LONG);
      return;
    }

    try {
      setLoading(true);

      const res = await loginApi({ email, password });
      console.log(res)
      const body = res?.data;

      // Backend returned 200 but with error:true in body (e.g. "Check your password")
      if (body?.error) {
        Toast.show(body.message || 'Login failed', Toast.LONG);
        return;
      }

      // Case 1: OTP required — do NOT go to home yet, go verify first
      if (res?.otpRequired) {
        Toast.show(body.message || 'OTP sent', Toast.LONG);
        navigation.navigate('VerifyOtp', {
          type: 'login',
          sessionToken: body.sessionToken,
          mobile: body.mobile,
        });
        return;
      }

      // Case 2 (fallback): if backend ever returns tokens directly without OTP,
      // this branch is unused by your current API but kept safe/defensive.
      Toast.show('Login Successful', Toast.LONG);
    } catch (error: any) {
      console.log('🔥 Login Error:', error?.response?.data || error.message);
      const serverMsg = error?.response?.data?.message;
      Toast.show(serverMsg || error.message || 'Login failed', Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={[GlobalStyleSheet.container, { paddingVertical: 20 }]}>
        <View
          style={[
            GlobalStyleSheet.row,
            { alignItems: 'center', justifyContent: 'space-between' },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FeatherIcon size={24} color={COLORS.card} name="arrow-left" />
            </TouchableOpacity>
            <Text style={[FONTS.fontMedium, { fontSize: 20, color: COLORS.card }]}>
              Login
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DrawerNavigation', {
                screen: 'BottomNavigation',
                params: { screen: 'Home' },
              })
            }
          >
            <Text
              style={[
                FONTS.fontRegular,
                {
                  fontSize: 16,
                  color: COLORS.card,
                  textDecorationLine: 'underline',
                },
              ]}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: theme.dark ? colors.background : COLORS.card,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <View style={[GlobalStyleSheet.container, { flexGrow: 1, marginTop: 15 }]}>
          <ScrollView>
            <Text style={[FONTS.fontMedium, { fontSize: 18, color: colors.title }]}>
              Unlock Personalized Content{'\n'}Tailored Just For You
            </Text>

            {/* UI Tabs (kept same) */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 15,
                paddingBottom: 5,
              }}
            >
              <TouchableOpacity onPress={() => setShow(false)}>
                <Text
                  style={[
                    FONTS.fontMedium,
                    { fontSize: 12, color: COLORS.primary },
                  ]}
                >
                  Use Email Id
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email */}
            <Input
              inputBorder
              placeholder="Enter Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={{ borderColor: COLORS.primary, paddingLeft: 10 }}
            />

            {/* Password */}
            <View style={{ paddingTop: 15 }}>
              <Text style={[FONTS.fontMedium, { fontSize: 14, color: colors.text }]}>
                Password
              </Text>
              <Input
                inputBorder
                placeholder="Enter Password"
                type="password"
                value={password}
                onChangeText={setPassword}
                style={{ borderColor: COLORS.primary, paddingLeft: 10 }}
              />

              {/* Forgot Password */}
              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginTop: 8 }}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text
                  style={[
                    FONTS.fontMedium,
                    {
                      fontSize: 13,
                      color: COLORS.primary,
                      textDecorationLine: 'underline',
                    },
                  ]}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ paddingTop: 10 }}>
              <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.title }]}>
                By continuing, you agree to FizzyFuzz's{' '}
                <Text style={[FONTS.fontSemiBold, { color: COLORS.primary }]}>
                  Terms of Use
                </Text>
                {'\n'}and{' '}
                <Text style={[FONTS.fontSemiBold, { color: COLORS.primary }]}>
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 15,
              gap: 5,
            }}
          >
            <Text style={[FONTS.fontRegular, { fontSize: 15, color: colors.title }]}>
              Not a member?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text
                style={[
                  FONTS.fontRegular,
                  {
                    fontSize: 16,
                    color: COLORS.primary,
                    textDecorationLine: 'underline',
                  },
                ]}
              >
                Create an account
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title={loading ? 'Loading...' : 'Continue'}
            onPress={handleContinue}
            disabled={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SingIn;