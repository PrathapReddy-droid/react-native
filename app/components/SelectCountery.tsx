import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CountryButton, CountryPicker } from 'react-native-country-codes-picker';
import { COLORS } from '../constants/theme';

const SelectCountery = () => {

  const theme = useTheme();
  const { colors } : {colors :any}= theme;

  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [countryflag, setCountryflag] = useState('🇮🇳');

  return (
    <View>
      <CountryButton
        onPress={() => setShow(true)}
        item={{
          dial_code: countryCode,
          flag: countryflag,
        }}
        style={{
          countryButtonStyles: {
            height: 20,
            backgroundColor: 'transparent',
            width: 65,
            paddingHorizontal: 0,
            paddingVertical: 0,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 0,
          },
          dialCode: {
            flex: 1,
            color: colors.title,
          },
          flag: {
            flex: 0,
            width: 20,
            marginRight: 5,
          },
          countryName: {
            display: 'none',
          },
        }}
      />
      <CountryPicker
        show={show}
        pickerButtonOnPress={(item) => {
          setCountryflag(item.flag);
          setCountryCode(item.dial_code);
          setShow(false);
        }}
        style={{
          modal: {
            height: 500,
            backgroundColor: theme.dark ? 'rgba(255,255,255,0.6)' : COLORS.card,
          },
          countryButtonStyles: {
            backgroundColor: theme.dark ? colors.background : colors.input,
          },
          dialCode: {
            color: colors.title,
          },
          countryName: {
            color: colors.title,
          },
          textInput: {
            color: colors.title,
          },
        }}
        lang="en"
      />
    </View>
  );
};

export default SelectCountery;
