import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import { COLORS, FONTS } from '../../constants/theme'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather';
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from '../../navigation/RootStackParamList'
import Button from '../../components/Button/Button'
import OTPInput from '../../components/Input/OTPInput'
import Toast from 'react-native-simple-toast';
import auth from '@react-native-firebase/auth';

type Props = StackScreenProps<RootStackParamList, 'OTPAuthentication'>;

const OTPAuthentication = ({ route, navigation }: Props) => {
    
    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    const { verificationId,  phoneNumber, countryCode } = route.params;

    const [otpCode, setOTPCode] = useState("");
    const [isPinReady, setIsPinReady] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const maximumCodeLength = 6;
    
    const onVerifyOtp = async () => {
        if (!otpCode.trim()) {
            Toast.show('Please enter OTP', Toast.LONG);
            return;
        }
        if (!verificationId) {
            Toast.show('Verification ID missing', Toast.LONG);
            return;
        }
        try {
            setLoading(true);
            const credential = auth.PhoneAuthProvider.credential(verificationId, otpCode);
            await auth().signInWithCredential(credential);
            
            Toast.show('Login Successful', Toast.LONG)
            navigation.reset({
                index: 0,
                routes: [{ name: 'DrawerNavigation', params: { screen: 'Home' } }],
            })
        } catch (error: any) {
            console.log('OTP Verification Error:', error.code); // Optional: for debugging
            switch (error.code) {
                case 'auth/invalid-verification-code':
                Toast.show('Incorrect verification code.', Toast.LONG);
                break;
                default:
                Toast.show(error.message || 'Invalid OTP. Please try again.', Toast.LONG);
            }
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
    const [Verifycode, setVerifycode] = useState(false);

    //resendOTP Function
    const resendOTP = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            Toast.show("Enter a valid phone number", Toast.LONG);
            return;
        }
        
        try {
            setVerifycode(true);
            const fullPhone = `${countryCode}${phoneNumber}`;
            const confirmation = await auth().signInWithPhoneNumber(fullPhone);
            
            setConfirm(confirmation);        // Save the new confirmation result
            setOtpExpiry(600);              // Reset OTP expiry to 10 minutes
                Toast.show("OTP Resent Successfully", Toast.SHORT);
            } catch (error: any) {
                console.log('Resend OTP Error:', error);
                Toast.show(error.message, Toast.LONG);
            } finally {
                setVerifycode(false);
        }
    };
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <View style={[GlobalStyleSheet.container, { paddingVertical: 20 }]}>
                <View style={[GlobalStyleSheet.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <FeatherIcon size={24} color={COLORS.card} name={'arrow-left'} />
                        </TouchableOpacity>
                        <Text style={[FONTS.fontMedium, { fontSize: 20, color: COLORS.card }]}>OTP</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: theme.dark ? colors.background : colors.card, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <View style={[GlobalStyleSheet.container, { flexGrow: 1, marginTop: 15 }]}>
                    <ScrollView>
                        <Text style={[FONTS.fontMedium,{fontSize:18,color:colors.title,}]}>Please enter the OTP sent to</Text>
                        {countryCode &&
                            <Text style={[FONTS.fontMedium,{fontSize:18,color:COLORS.primary}]}>{countryCode} {phoneNumber}</Text>
                        }
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:15}}>
                            <Text style={[FONTS.fontMedium,{fontSize:14,color:colors.text}]}>Enter OTP</Text>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <OTPInput
                                code={otpCode}
                                setCode={setOTPCode}
                                maximumLength={maximumCodeLength}
                                setIsPinReady={setIsPinReady}
                            />
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:15,paddingHorizontal:5}}>
                            <Text  
                                style={[
                                    FONTS.fontMedium,
                                    { fontSize: 14, color:colors.text },
                                ]}
                            >
                                OTP expires in: {Math.floor(otpExpiry / 60)}:{(otpExpiry % 60).toString().padStart(2, '0')}
                            </Text>
                            <TouchableOpacity onPress={resendOTP} disabled={otpExpiry > 570}>
                                <Text style={[{...FONTS.fontMedium,fontSize:12, color: otpExpiry > 570 ? 'gray' : 'blue' }]}>
                                    Resend OTP {otpExpiry > 570 && `(wait ${otpExpiry - 570}s)`}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <View>
                        <Button
                            title={loading ? 'Loading...' : Verifycode ? 'Verifying...' : 'Continue'}
                            onPress={onVerifyOtp}
                            disabled={otpCode.length < maximumCodeLength || loading}
                            loading={loading}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default OTPAuthentication;
