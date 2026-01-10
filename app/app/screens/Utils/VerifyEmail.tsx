import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { useTheme, useRoute, useNavigation } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-simple-toast';

import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

// 🔥 your already written API
import { VerifyEmailApi } from '../../Api/User';

const VerifyEmail = () => {
  const theme = useTheme();
  const { colors } = theme;
  const navigation = useNavigation();
  const route = useRoute();

  const { email } = route.params || {};
  console.log('🔥 Email from params:', email);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (loading) return;

    if (!otp || otp.length !== 6) {
      Toast.show('Please enter 6 digit OTP', Toast.LONG);
      return;
    }

    try {
      setLoading(true);

      await VerifyEmailApi({
        email: email,
        otp: otp,
      });

      Toast.show('Email verified successfully', Toast.LONG);

      navigation.reset({
        index: 0,
        routes: [{ name: 'SingIn' }],
      });
    } catch (error) {
      console.log('🔥 Verify Email Error:', error);
      Toast.show(
        error?.message || 'OTP verification failed',
        Toast.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      {/* Header */}
      <View style={[GlobalStyleSheet.container, { paddingVertical: 20 }]}>
        <View style={[GlobalStyleSheet.row, { alignItems: 'center' }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FeatherIcon size={24} color={COLORS.card} name="arrow-left" />
          </TouchableOpacity>
          <Text
            style={[
              FONTS.fontMedium,
              { fontSize: 20, color: COLORS.card, marginLeft: 10 },
            ]}
          >
            Verify Email
          </Text>
        </View>
      </View>

      {/* Body */}
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
            <Text
              style={[FONTS.fontMedium, { fontSize: 18, color: colors.title }]}
            >
              Enter the 6-digit code sent to
            </Text>

            <Text
              style={[
                FONTS.fontSemiBold,
                { fontSize: 14, color: COLORS.primary, marginTop: 5 },
              ]}
            >
              {email}
            </Text>

            {/* OTP Input */}
            <View style={{ marginTop: 20 }}>
              <Text
                style={[
                  FONTS.fontMedium,
                  { fontSize: 14, color: colors.text },
                ]}
              >
                OTP
              </Text>

              <Input
                inputBorder
                placeholder="Enter 6 digit OTP"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                style={{ borderColor: COLORS.primary, paddingLeft: 10 }}
              />
            </View>
          </ScrollView>

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

export default VerifyEmail;

const styles = StyleSheet.create({});
