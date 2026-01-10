import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StackScreenProps } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Toast from 'react-native-simple-toast';
import { registerApi } from '../../Api/User';

type SignUpScreenProps = StackScreenProps<RootStackParamList, 'SignUp'>;

const SignUp = ({  }: SignUpScreenProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { colors }: { colors: any } = theme;

  const [showPhone, setShowPhone] = useState(false); // UI only

  // Inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile ,setMobile] = useState()

  const [loading, setLoading] = useState(false);

  // Email signup only
  const onContinue = async () => {
    if (!username.trim()) {
      Toast.show('Please enter your name', Toast.LONG);
      return;
    }
    if(!mobile.trim()){
      Toast.show('Please enter your mobile', Toast.LONG)
    }
    if (!email.trim() || !password.trim()) {
      Toast.show('Please enter email and password', Toast.LONG);
      return;
    }
    

    try {
      setLoading(true);

      await registerApi({name:username,email:email,password:password, mobile:mobile})
      Toast.show('Account created successfully!', Toast.LONG);
navigation.navigate('VerifyEmail', { email });
    } catch (error: any) {
      Toast.show(error.message, Toast.LONG);
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
                params: { screen: 'VerifyEmail' },
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
              Register Using Your Email To Begin
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

            {/* UI Tabs (unchanged) */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 15,
                paddingBottom: 5,
              }}
            >
              <TouchableOpacity onPress={() => setShowPhone(false)}>
                <Text
                  style={[
                    FONTS.fontMedium,
                    { fontSize: 12, color: COLORS.primary },
                  ]}
                >
                  Use Email Id
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity>
                <Text
                  style={[
                    FONTS.fontMedium,
                    { fontSize: 14, color: colors.text },
                  ]}
                >
                  Enter Mobile Number
                </Text>
              </TouchableOpacity> */}
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

                  <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 15,
                paddingBottom: 5,
              }}
            >
              <TouchableOpacity onPress={() => setShowPhone(false)}>
                <Text
                  style={[
                    FONTS.fontMedium,
                    { fontSize: 12, color: COLORS.primary },
                  ]}
                >
                  Mobile Number
                </Text>
              </TouchableOpacity>
       
            </View>
            {/* Email */}
            <Input
              inputBorder
              placeholder="Enter Mobile"
              keyboardType="email-address"
              autoCapitalize="none"
              value={mobile}
              onChangeText={setMobile}
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
            </View>

            <View style={{ paddingTop: 10 }}>
              <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.title }]}>
                By continuing, you agree to FizzFuzz's{' '}
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
            title={loading ? 'Loading...' : 'Continue'}
            onPress={onContinue}
            disabled={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
