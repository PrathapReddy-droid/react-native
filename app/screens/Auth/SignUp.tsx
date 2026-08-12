import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StackScreenProps } from '@react-navigation/stack';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Toast from 'react-native-simple-toast';
import { registerApi } from '../../Api/User';

type SignUpScreenProps = StackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp = ({ }: SignUpScreenProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { colors }: { colors: any } = theme;

  // Inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    if (loading) return;

    if (!username.trim()) {
      Toast.show('Please enter your name', Toast.LONG);
      return;
    }

    const trimmedMobile = mobile.trim();
    if (!trimmedMobile) {
      Toast.show('Please enter your mobile', Toast.LONG);
      return;
    }
    if (!/^\d{10}$/.test(trimmedMobile.replace('+91', ''))) {
      Toast.show('Please enter a valid 10-digit mobile number', Toast.LONG);
      return;
    }

    if (!email.trim()) {
      Toast.show('Please enter email', Toast.LONG);
      return;
    }

    try {
      setLoading(true);

      const res = await registerApi({
        name: username,
        email: email,
        mobile: trimmedMobile,
      });
      const body = res?.data;
      console.log(res)

      if (res?.error === true) {
        Toast.show(res.message || 'Registration failed', Toast.LONG);
        return;
      }

      if (res?.success == true) {
        Toast.show(body?.message || 'OTP sent', Toast.LONG);
        navigation.navigate('VerifyOtp', {
          type: 'register',
          sessionToken: res.data.sessionToken,
          mobile: res.data.mobile,
        });
        return;
      }

      Toast.show('Something went wrong, please try again', Toast.LONG);
    } catch (error: any) {
      const serverMsg = error?.response?.data?.message;
      Toast.show(serverMsg || error.message || 'Registration failed', Toast.LONG);
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
              Create Account
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
          backgroundColor: theme.dark ? colors.background : colors.card,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <View style={[GlobalStyleSheet.container, { flexGrow: 1, marginTop: 15 }]}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={[FONTS.fontMedium, { fontSize: 18, color: colors.title }]}>
              Fresh Arrival, Ready To Explore?
            </Text>
            <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.text }]}>
              Register using your details. We'll send an OTP to your mobile to confirm it's you.
            </Text>

            {/* Name */}
            <View style={{ paddingTop: 15 }}>
              <Text style={[FONTS.fontMedium, { fontSize: 14, color: colors.text }]}>
                Your Name
              </Text>
              <Input
                inputBorder
                icon={<FontAwesome name="user" size={20} color={COLORS.primary} />}
                placeholder="Enter Username"
                value={username}
                onChangeText={setUsername}
                style={{ borderColor: COLORS.primary, paddingLeft: 40 }}
              />
            </View>

            {/* Mobile */}
            <View style={{ paddingTop: 15 }}>
              <Text style={[FONTS.fontMedium, { fontSize: 14, color: colors.text }]}>
                Mobile Number
              </Text>
              <Input
                inputBorder
                placeholder="Enter Mobile Number"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
                style={{ borderColor: COLORS.primary, paddingLeft: 10 }}
              />
            </View>

            {/* Email */}
            <View style={{ paddingTop: 15 }}>
              <Text style={[FONTS.fontMedium, { fontSize: 14, color: colors.text }]}>
                Email
              </Text>
              <Input
                inputBorder
                placeholder="Enter Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={{ borderColor: COLORS.primary, paddingLeft: 10 }}
              />
            </View>

            <View style={{ paddingTop: 15 }}>
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
              Existing User?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SingIn')}>
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
                Log in
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title={loading ? 'Sending OTP...' : 'Continue'}
            onPress={onContinue}
            disabled={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;