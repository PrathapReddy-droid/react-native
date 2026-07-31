import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Toast from 'react-native-simple-toast';
import { forgotPasswordApi } from '../../Api/User';

const ForgotPassword = ({ navigation }) => {
    const theme = useTheme();
    const { colors } = theme;

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (loading) return;
        if (!email.trim()) {
            Toast.show('Please enter your email', Toast.LONG);
            return;
        }

        try {
            setLoading(true);
            const res = await forgotPasswordApi({ email });
            const body = res?.data;

            if (body?.error) {
                Toast.show(body.message || 'Something went wrong', Toast.LONG);
                return;
            }

            Toast.show(body.message || 'Check your email', Toast.LONG);
            navigation.navigate('VerifyOtp', { email });
        } catch (error) {
            Toast.show(error?.response?.data?.message || 'Something went wrong', Toast.LONG);
        } finally {
            setLoading(false);
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
                        Forgot Password
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
                        Enter your registered email. We'll send you a code to verify it's you.
                    </Text>

                    <View style={{ paddingTop: 15 }}>
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

                    <View style={{ flex: 1 }} />

                    <Button
                        title={loading ? 'Sending...' : 'Send OTP'}
                        onPress={handleSubmit}
                        disabled={loading}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ForgotPassword;