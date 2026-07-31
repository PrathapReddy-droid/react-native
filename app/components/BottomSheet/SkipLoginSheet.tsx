import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { useNavigation, useTheme } from '@react-navigation/native';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Button from '../Button/Button';
import Input from '../Input/Input';
import SelectCountery from '../SelectCountery';
import Toast from 'react-native-simple-toast';
import auth from '@react-native-firebase/auth';


type Props = {
    moresheet2?: any;
}

const SkipLoginSheet = ({ moresheet2 }: Props) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const navigation = useNavigation<any>();

    const [showPhone, setShowPhone] = useState(true);

    // Inputs
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [countryCode, setCountryCode] = useState('+91');

    // OTP flow
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const [otpCode, setOtpCode] = useState('');

    const [loading, setLoading] = useState(false);

    // Handle country code selection callback
    const onSelectCountry = (dialCode: string) => {
        setCountryCode(dialCode);
    };

    // Continue button handler (start phone/email signup)
    const onContinue = async () => {
        if (Platform.OS ? !showPhone : showPhone) {
            if (!phoneNumber.trim()) {
                Toast.show('Please enter your phone number', Toast.LONG);
                return;
            }
            if (!/^\d{10}$/.test(phoneNumber)) {
                Toast.show('Please enter a valid 10-digit phone number', Toast.LONG);
                return;
            }

            try {
                setLoading(true);
                const sanitizedCountryCode = countryCode.replace(/\D/g, '');
                const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, '');
                const fullPhone = `+${sanitizedCountryCode}${sanitizedPhoneNumber}`;
                const confirmation = await auth().signInWithPhoneNumber(fullPhone);
                setVerificationId(confirmation.verificationId);
                Toast.show('OTP Sent, Please check your phone.', Toast.LONG);
            } catch (error: any) {
                switch (error.code) {
                    case 'auth/invalid-phone-number':
                        Toast.show('Incorrect Phone-number.', Toast.LONG);
                        break;
                    case 'auth/billing-not':
                        Toast.show('Invalid Phone-number. Please Use Testing Number.', Toast.LONG)
                        break
                    case 'auth/too-many-requests':
                        Toast.show('Too many attempts. Please Use Testing Number.', Toast.LONG);
                        break;
                    default:
                        Toast.show(`Error: ${error.message}`, Toast.LONG);
                        break;
                }
            } finally {
                setLoading(false);
            }
        } if (!email || !password) {
            return Toast.show('Please enter email and password', Toast.LONG);
        }

        try {
            setLoading(true);

            // Try logging in
            await auth().signInWithEmailAndPassword(email, password);
            Toast.show('Login Successful', Toast.LONG);

            navigation.reset({
                index: 0,
                routes: [{ name: 'DrawerNavigation', params: { screen: 'Home' } }],
            });

        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                try {
                    // Register the user
                    await auth().createUserWithEmailAndPassword(email, password);
                    Toast.show('Registered and Logged in Successfully', Toast.LONG);

                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'DrawerNavigation', params: { screen: 'Home' } }],
                    });

                } catch (registerError: any) {
                    Toast.show(`Registration failed: ${registerError.message}`, Toast.LONG);
                }
            } else {
                // Handle login errors
                switch (error.code) {

                    case 'auth/wrong-password':
                        Toast.show('Incorrect password.', Toast.LONG);
                        break;
                    case 'auth/invalid-email':
                        Toast.show('Invalid email address.', Toast.LONG);
                        break;
                    case 'auth/invalid-credential':
                        Toast.show('Incorrect credentials.', Toast.LONG);
                        break;
                    case 'auth/user-not-found':
                        Toast.show('User not found. Please sign up first.', Toast.LONG);
                        break;
                    default:
                        Toast.show(`Login failed: ${error?.message || 'Something went wrong'}`, Toast.LONG);
                        break;
                }
            }
        } finally {
            setLoading(false);
        }
    };


    // Verify OTP handler
    const onVerifyOtp = async () => {
        if (!otpCode.trim()) {
            Toast.show('Please enter OTP', Toast.LONG);
            return;
        }

        if (!/^\d{6}$/.test(otpCode)) {
            Toast.show('OTP must be exactly 6 digits', Toast.LONG);
            return;
        }

        if (!verificationId) return;

        try {
            setLoading(true);
            const credential = auth.PhoneAuthProvider.credential(verificationId, otpCode);
            await auth().signInWithCredential(credential);

            Toast.show('Success, Phone authentication successful!', Toast.LONG);

            // ✅ Close the bottom sheet after success
            moresheet2.current?.close();

            // Navigate to Home
            navigation.navigate('DrawerNavigation', { screen: 'Home' });

        } catch (error: any) {
            console.log('OTP verification error:', error);
            Toast.show('Invalid OTP. Please try again.', Toast.LONG);
        } finally {
            setLoading(false);
        }
    };



    //Set OTP Expiry to 10 Minutes (600 seconds)
    const [otpExpiry, setOtpExpiry] = useState(600); // 600 seconds = 10 mins

    useEffect(() => {
        const timer = setInterval(() => {
            setOtpExpiry(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // maybe disable OTP input or show expiry message
                }
                return prev - 1;
            });
        }, 1000);


        return () => clearInterval(timer); // cleanup
    }, []);

    const [confirm, setConfirm] = useState<any>(null);

    //resendOTP Function
    const resendOTP = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            Toast.show("Enter a valid phone number", Toast.LONG);
            return;
        }

        try {
            setLoading(true);
            const fullPhone = `${countryCode}${phoneNumber}`;
            const confirmation = await auth().signInWithPhoneNumber(fullPhone);

            setConfirm(confirmation);        // Save the new confirmation result
            setOtpExpiry(600);              // Reset OTP expiry to 10 minutes
            Toast.show("OTP Resent Successfully", Toast.SHORT);
        } catch (error: any) {
            console.log('Resend OTP Error:', error);
            Toast.show(error.message, Toast.LONG);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[GlobalStyleSheet.container, { paddingTop: 15, padding: 0, backgroundColor: theme.dark ? COLORS.title : COLORS.white }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Image
                        style={{ height: 24, width: 28, resizeMode: 'contain' }}
                        source={IMAGES.headerlogo}
                    />
                    <Text style={[FONTS.fontMedium, { fontSize: 20, color: colors.title }]}>Fizz <Text style={{ color: COLORS.primary }}>Fuzz</Text></Text>
                </View>
                <TouchableOpacity
                    style={{
                        height: 38,
                        width: 38,
                        backgroundColor: colors.card,
                        borderRadius: 38,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        moresheet2.current?.close();
                        setTimeout(() => {
                            moresheet2.current?.open(); // Re-open after 30 seconds
                        }, 30000); // 30000 milliseconds = 30 seconds
                    }}
                >
                    <FeatherIcon size={20} color={colors.title} name={'x'} />
                </TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <View style={{ paddingVertical: 5, marginHorizontal: -15, paddingTop: 0 }}>
                        <Image
                            style={{ width: '100%', height: undefined, aspectRatio: 1 / .3, resizeMode: 'contain' }}
                            source={IMAGES.ads4}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 15 }}>
                        <Text style={[FONTS.fontMedium, { fontSize: 18, color: colors.title, }]}>Unlock Personalized Content{"\n"}Tailored Just For You</Text>
                        {Platform.OS === 'ios' ?
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingTop: 15,
                                    paddingBottom: 5,
                                }}
                            >
                                <TouchableOpacity onPress={() => setShowPhone(true)}>
                                    <Text
                                        style={[
                                            FONTS.fontMedium,
                                            { fontSize: 12, color: showPhone ? COLORS.primary : colors.text },
                                        ]}
                                    >
                                        Use Email Id
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowPhone(false)}>
                                    <Text
                                        style={[
                                            FONTS.fontMedium,
                                            { fontSize: 14, color: showPhone ? colors.text : COLORS.primary },
                                        ]}
                                    >
                                        Enter Mobile Number
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingTop: 15,
                                    paddingBottom: 5,
                                }}
                            >
                                <TouchableOpacity onPress={() => setShowPhone(true)}>
                                    <Text
                                        style={[
                                            FONTS.fontMedium,
                                            { fontSize: 14, color: showPhone ? colors.text : COLORS.primary },
                                        ]}
                                    >
                                        Enter Mobile Number
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowPhone(false)}>
                                    <Text
                                        style={[
                                            FONTS.fontMedium,
                                            { fontSize: 12, color: showPhone ? COLORS.primary : colors.text },
                                        ]}
                                    >
                                        Use Email Id
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {Platform.OS === 'ios' ?
                            <View>
                                {showPhone ? (
                                    <View>
                                        <Input
                                            inputBorder
                                            placeholder="Enter Email"
                                            onChangeText={setEmail}
                                            style={{ borderColor: COLORS.primary, paddingLeft: 10 }}
                                            value={email}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                        <View style={{ paddingTop: 15 }}>
                                            <Text style={[FONTS.fontMedium, { fontSize: 14, color: colors.text }]}>Password</Text>
                                            <Input
                                                inputBorder
                                                placeholder="Enter Password"
                                                onChangeText={setPassword}
                                                style={{ borderColor: COLORS.primary, paddingLeft: 10 }}
                                                value={password}
                                                type='password'
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{ position: 'relative', }}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ position: 'absolute', bottom: 13, zIndex: 99 }}>
                                                <SelectCountery onSelectCountry={onSelectCountry} />
                                            </View>
                                            <Input
                                                inputBorder
                                                placeholder="Enter phone number"
                                                keyboardType="number-pad"
                                                onChangeText={setPhoneNumber}
                                                style={{ borderColor: COLORS.primary, flex: 1, paddingLeft: 70 }}
                                                value={phoneNumber}
                                            />
                                        </View>

                                        {verificationId && (
                                            <>
                                                <Text style={[FONTS.fontMedium, { marginTop: 15 }]}>Enter OTP</Text>
                                                <Input
                                                    inputBorder
                                                    placeholder="Enter OTP"
                                                    keyboardType="number-pad"
                                                    onChangeText={setOtpCode}
                                                    value={otpCode}
                                                    style={{ borderColor: COLORS.primary, paddingLeft: 10, marginBottom: 5 }}
                                                />
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                                                    <Text
                                                        style={[
                                                            FONTS.fontMedium,
                                                            { fontSize: 14, color: colors.text },
                                                        ]}
                                                    >
                                                        OTP expires in: {Math.floor(otpExpiry / 60)}:{(otpExpiry % 60).toString().padStart(2, '0')}
                                                    </Text>
                                                    <TouchableOpacity onPress={resendOTP} disabled={otpExpiry > 570}>
                                                        <Text style={{ color: otpExpiry > 570 ? 'gray' : 'blue' }}>
                                                            Resend OTP {otpExpiry > 570 && `(wait ${otpExpiry - 570}s)`}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                )}
                            </View>
                            :
                            <View>
                                {showPhone ? (
                                    <View style={{ position: 'relative', }}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ position: 'absolute', bottom: 13, zIndex: 99 }}>
                                                <SelectCountery onSelectCountry={onSelectCountry} />
                                            </View>
                                            <Input
                                                inputBorder
                                                placeholder="Enter phone number"
                                                keyboardType="number-pad"
                                                onChangeText={setPhoneNumber}
                                                style={{ borderColor: COLORS.primary, flex: 1, paddingLeft: 70 }}
                                                value={phoneNumber}
                                            />
                                        </View>

                                        {verificationId && (
                                            <>
                                                <Text style={[FONTS.fontMedium, { marginTop: 15 }]}>Enter OTP</Text>
                                                <Input
                                                    inputBorder
                                                    placeholder="Enter OTP"
                                                    keyboardType="number-pad"
                                                    onChangeText={setOtpCode}
                                                    value={otpCode}
                                                    style={{ borderColor: COLORS.primary, paddingLeft: 10, marginBottom: 5 }}
                                                />
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                                                    <Text
                                                        style={[
                                                            FONTS.fontMedium,
                                                            { fontSize: 14, color: colors.text },
                                                        ]}
                                                    >
                                                        OTP expires in: {Math.floor(otpExpiry / 60)}:{(otpExpiry % 60).toString().padStart(2, '0')}
                                                    </Text>
                                                    <TouchableOpacity onPress={resendOTP} disabled={otpExpiry > 570}>
                                                        <Text style={{ color: otpExpiry > 570 ? 'gray' : 'blue' }}>
                                                            Resend OTP {otpExpiry > 570 && `(wait ${otpExpiry - 570}s)`}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        )}
                                    </View>
                                ) : (
                                    <View>
                                        <Input
                                            inputBorder
                                            placeholder="Enter Email"
                                            onChangeText={setEmail}
                                            style={{ borderColor: COLORS.primary, paddingLeft: 10 }}
                                            value={email}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                        <View style={{ paddingTop: 15 }}>
                                            <Text style={[FONTS.fontMedium, { fontSize: 14, color: colors.text }]}>Password</Text>
                                            <Input
                                                inputBorder
                                                placeholder="Enter Password"
                                                onChangeText={setPassword}
                                                style={{ borderColor: COLORS.primary, paddingLeft: 10 }}
                                                value={password}
                                                type='password'
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        }
                        <View style={{ paddingTop: 10 }}>
                            <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.title }]}>By continuing, you agree to FizzyFuzz's <Text style={[FONTS.fontSemiBold, { color: COLORS.primary }]}>Terms of Use</Text>{"\n"}and <Text style={[FONTS.fontSemiBold, { color: COLORS.primary }]}>Privacy Policy</Text>.</Text>
                        </View>
                    </View>
                    {verificationId && (
                        <View style={{ marginTop: 10, paddingHorizontal: 15 }}>
                            <Button
                                title={loading ? 'Verifying...' : 'Verify OTP'}
                                onPress={onVerifyOtp}
                                disabled={loading}
                            />
                        </View>
                    )}
                    {!verificationId && (
                        <View style={{ marginTop: 10, paddingHorizontal: 15 }}>
                            <Button
                                title={loading ? 'Loading...' : 'Continue'}
                                onPress={onContinue}
                                disabled={loading}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SkipLoginSheet