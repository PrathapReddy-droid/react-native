import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Button from '../../components/Button/Button';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import {
    verifyForgotPasswordOtpApi,
    forgotPasswordApi,
    verifyLoginOtpApi,
    verifyRegOtpApi,
    getUserDetails,
} from '../../Api/User';
import { setselectedUser } from '../../redux/reducer/User';
import { saveUserToStorage } from '../../redux/reducer/userStorage';

const OTP_LENGTH = 6;

const VerifyOtp = ({ navigation, route }) => {
    const theme = useTheme();
    const { colors } = theme;
    const dispatch = useDispatch();
    const params = route.params || {};
    console.log('VerifyOtp params:', params); // Debug
    const { type, email, sessionToken, mobile } = params;

    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef([]);

    const otp = digits.join('');

    const handleChange = (text, index) => {
        if (!/^\d*$/.test(text)) return;
        const next = [...digits];
        next[index] = text.slice(-1);
        setDigits(next);

        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const completeAuthSession = async (accesstoken, refreshToken) => {
        await AsyncStorage.setItem('AccessToken', accesstoken);
        await AsyncStorage.setItem('RefreshToken', refreshToken);

        const details = await getUserDetails();
        dispatch(setselectedUser(details.data));
        await saveUserToStorage(details.data);
    };

    const handleVerify = async () => {
        if (loading) return;
        if (otp.length !== OTP_LENGTH) {
            Toast.show('Enter the complete OTP', Toast.LONG);
            return;
        }

        try {
            setLoading(true);

            if (type === 'login') {
                // ---- Login OTP flow ----
                const res = await verifyLoginOtpApi({ otp, sessionToken });
                const body = res?.data;

                if (body?.error) {
                    Toast.show(body.message || 'Invalid OTP', Toast.LONG);
                    return;
                }

                await completeAuthSession(body.accesstoken, body.refreshToken);

                Toast.show('Login Successful', Toast.LONG);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'DrawerNavigation', params: { screen: 'Home' } }],
                });
            } else if (type === 'register') {
                // ---- Registration OTP flow ----
                const res = await verifyRegOtpApi({ otp, sessionToken });
                const body = res?.data;

                if (body?.error) {
                    Toast.show(body.message || 'Invalid OTP', Toast.LONG);
                    return;
                }

                await completeAuthSession(body.accesstoken, body.refreshToken);

                Toast.show('Account verified successfully', Toast.LONG);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'DrawerNavigation', params: { screen: 'Home' } }],
                });
            } else {
                // ---- Forgot-password OTP flow ----
                const res = await verifyForgotPasswordOtpApi({ email, otp });
                const body = res?.data;

                if (body?.error) {
                    Toast.show(body.message || 'Invalid OTP', Toast.LONG);
                    return;
                }

                Toast.show(res.message || 'OTP verified', Toast.LONG);
                navigation.navigate('SingIn');
            }
        } catch (error) {
            Toast.show(error?.response?.data?.message || 'OTP verification failed', Toast.LONG);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resending) return;
        try {
            setResending(true);
            if (type === 'login' || type === 'register') {
                Toast.show(
                    type === 'login'
                        ? 'Please go back and log in again to resend OTP'
                        : 'Please go back and sign up again to resend OTP',
                    Toast.LONG,
                );
                return;
            }
            await forgotPasswordApi({ email });
            Toast.show('OTP resent', Toast.LONG);
        } catch (error) {
            Toast.show(error?.response?.data?.message || 'Could not resend OTP', Toast.LONG);
        } finally {
            setResending(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <View style={[GlobalStyleSheet.container, { paddingVertical: 20 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <FeatherIcon size={24} color={COLORS.card} name="arrow-left" />
                    </TouchableOpacity>
                    <Text style={[FONTS.fontMedium, { fontSize: 20, color: COLORS.card }]}>
                        Verify OTP
                    </Text>
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
                <View style={[GlobalStyleSheet.container, { flexGrow: 1, marginTop: 20 }]}>
                    <Text style={[FONTS.fontMedium, { fontSize: 16, color: colors.title }]}>
                        Enter the 6-digit code sent to{' '}
                        {(type === 'login' || type === 'register')
                            ? (mobile || 'your registered mobile')
                            : email}
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 25,
                        }}
                    >
                        {digits.map((d, i) => (
                            <TextInput
                                key={i}
                                ref={(r) => (inputRefs.current[i] = r)}
                                value={d}
                                onChangeText={(t) => handleChange(t, i)}
                                onKeyPress={(e) => handleKeyPress(e, i)}
                                keyboardType="number-pad"
                                maxLength={1}
                                style={{
                                    width: 45,
                                    height: 55,
                                    borderWidth: 1,
                                    borderColor: COLORS.primary,
                                    borderRadius: 8,
                                    textAlign: 'center',
                                    fontSize: 20,
                                    color: colors.title,
                                }}
                            />
                        ))}
                    </View>

                    <TouchableOpacity onPress={handleResend} style={{ marginTop: 20 }}>
                        <Text
                            style={[
                                FONTS.fontMedium,
                                { fontSize: 14, color: COLORS.primary, textDecorationLine: 'underline' },
                            ]}
                        >
                            {resending ? 'Resending...' : 'Resend OTP'}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />

                    <Button
                        title={loading ? 'Verifying...' : 'Verify'}
                        onPress={handleVerify}
                        disabled={loading}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default VerifyOtp;