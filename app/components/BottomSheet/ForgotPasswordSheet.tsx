import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useTheme, useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { forgotPasswordApi } from '../../Api/User';

type Props = {
    sheetRef: any;
}

const ForgotPasswordSheet = ({ sheetRef }: Props) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const navigation = useNavigation<any>();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async () => {
        setErrorMsg('');

        if (!email.trim()) {
            setErrorMsg('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            const res = await forgotPasswordApi(email.trim());
            setLoading(false);

            if (res.success) {
                sheetRef.current?.close();
                // navigate to your OTP verification screen, passing the email
                navigation.navigate('VerifyOtp', { email: email.trim() });
            } else {
                setErrorMsg(res.message || 'Something went wrong');
            }
        } catch (error: any) {
            setLoading(false);
            setErrorMsg(error?.message || 'Something went wrong. Please try again.');
        }
    }

    return (
        <View
            style={{
                backgroundColor: theme.dark ? 'rgba(0,3,3,.95)' : colors.card,
            }}
        >
            <View style={[GlobalStyleSheet.container, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.10)' : colors.card }]}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: 15,
                        marginBottom: 20,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                    }}
                >
                    <Text style={{ flex: 1, ...FONTS.h6, color: colors.title }}>Forgot Password</Text>
                    <TouchableOpacity
                        onPress={() => sheetRef.current.close()}
                        style={{
                            height: 32,
                            width: 32,
                            borderRadius: 32,
                            backgroundColor: colors.background,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <FeatherIcon size={20} color={colors.title} name="x" />
                    </TouchableOpacity>
                </View>

                <Text style={{ ...FONTS.font, color: colors.text, marginBottom: 20 }}>
                    Enter your registered email address. We'll send you a 6-digit OTP to reset your password.
                </Text>

                <View style={{ marginBottom: 10 }}>
                    <Text style={{ ...FONTS.font, color: colors.title, marginBottom: 4 }}>Email</Text>
                    <Input
                        placeholder={'Type Your Email Here'}
                        onChangeText={(value: string) => setEmail(value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {errorMsg ? (
                    <Text style={{ color: 'red', marginBottom: 10, ...FONTS.fontSm }}>{errorMsg}</Text>
                ) : null}

                <View style={{ marginTop: 15 }}>
                    {loading ? (
                        <ActivityIndicator size="small" color={COLORS.secondary} />
                    ) : (
                        <Button
                            onPress={handleSubmit}
                            title={'Send OTP'}
                            text={COLORS.title}
                            color={COLORS.secondary}
                        />
                    )}
                </View>
            </View>
        </View>
    );
};

export default ForgotPasswordSheet;