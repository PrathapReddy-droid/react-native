import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import { getUserDetails, loginApi } from '../../Api/User';
import { hydrateUser, setselectedUser } from '../../redux/reducer/User';
import { useDispatch } from 'react-redux';
import { saveUserToStorage } from '../../redux/reducer/userStorage';
import { getFCMToken, setupTokenRefreshListener } from '../../Firebase/Firebase';

type SingInScreenProps = StackScreenProps<RootStackParamList, 'SingIn'>;

const SingIn = ({ navigation }: SingInScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [show, setShow] = useState(false); // UI only

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user,setUser] = useState()
  const [loading, setLoading] = useState(false);
const dispatch = useDispatch()


  const handleContinue = async () => {
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      Toast.show('Please enter email and password', Toast.LONG);
      return;
    }

    try {
      setLoading(true);

      await loginApi({email:email,password:password})
      
      getUserDetails().then(async data=>{

       dispatch(setselectedUser(data.data)) 
       setUser(data.data)
  await saveUserToStorage(data.data);

      })


      Toast.show('Login Successful', Toast.LONG);

      navigation.reset({
        index: 0,
        routes: [{ name: 'DrawerNavigation', params: { screen: 'Home' } }],
      });
    } catch (error: any) {
      console.log('🔥 Login Error:', error.code, error.message);

      switch (error.code) {
        case 'auth/user-not-found':
          Toast.show('User not found. Please sign up.', Toast.LONG);
          break;
        case 'auth/wrong-password':
          Toast.show('Incorrect password', Toast.LONG);
          break;
        case 'auth/invalid-email':
          Toast.show('Invalid email address', Toast.LONG);
          break;
        default:
          Toast.show(error.message || 'Login failed', Toast.LONG);
      }
    } finally {
      setLoading(false);
    }
  };
                useEffect(() => {
  getFCMToken(user?._id);

  // Returns an unsubscribe function — clean up on unmount
  const unsubscribe = setupTokenRefreshListener(user?._id);
  return unsubscribe;
}, []);

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
