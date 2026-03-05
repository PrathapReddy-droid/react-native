import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { IMAGES } from '../../constants/Images';
import Header from '../../layout/Header';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Button from '../../components/Button/Button';
import { AddressApi } from '../../Api/User';
import { setSelectedAddress } from '../../redux/reducer/addressSlice';
import { useDispatch, useSelector } from 'react-redux';
import AuthModal from './AuthModel';

const DeleveryAddress = ({ navigation }) => {

  const theme = useTheme();
  const { colors } = theme;

  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const [isChecked, setIsChecked] = useState(null);
  const [AddressData, setAddressData] = useState([]);

  // ✅ Get logged in user
  const user = useSelector((state) => state.user?.selectedUser);

  // ✅ Check login & fetch address
  useEffect(() => {

    if (!user) {
      modalRef.current?.open();
      return;
    }

    AddressApi()
      .then((data) => {
        setAddressData(data?.data?.address_details || []);
      })
      .catch((err) => {
        console.log('Address error:', err);
      });

  }, [user]);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>

      <Header
        title='Delivery Address'
        leftIcon='back'
        titleLeft
      />

      {/* Step Indicator */}
      <View
        style={[
          GlobalStyleSheet.container,
          {
            paddingHorizontal: 15,
            backgroundColor: theme.dark
              ? 'rgba(255,255,255,.1)'
              : colors.card,
          },
        ]}
      >
        <Text style={{ ...FONTS.fontMedium, color: colors.title }}>
          Select Delivery Address
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={[
            GlobalStyleSheet.container,
            {
              paddingTop: 10,
              backgroundColor: theme.dark
                ? 'rgba(255,255,255,.1)'
                : colors.card,
              marginTop: 15,
            },
          ]}
        >

          {/* Address List */}
          {AddressData?.map((data, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setIsChecked(data)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: COLORS.primaryLight,
                paddingVertical: 15,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    ...FONTS.fontMedium,
                    fontSize: 16,
                    color: colors.title,
                  }}
                >
                  {data.addressType}
                </Text>

                <Text style={{ color: colors.text }}>
                  {data.address_line1}
                </Text>

                <Text style={{ color: colors.text }}>
                  {data.city}, {data.state}
                </Text>

                <Text style={{ color: colors.text }}>
                  {data.country} - {data.pincode}
                </Text>

                <Text style={{ color: colors.text }}>
                  Mobile: {data.mobile}
                </Text>
              </View>

              {/* Radio Button */}
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 50,
                  backgroundColor:
                    isChecked === data
                      ? COLORS.primary
                      : COLORS.primaryLight,
                }}
              />
            </TouchableOpacity>
          ))}

          {/* Add Address */}
          <TouchableOpacity
            style={{
              height: 48,
              backgroundColor: COLORS.primaryLight,
              justifyContent: 'center',
              paddingHorizontal: 15,
              marginTop: 20,
            }}
            onPress={() => navigation.navigate('AddDeleveryAddress')}
          >
            <Text style={{ color: COLORS.primary }}>
              + Add Address
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Bottom Continue Button */}
      <View
        style={[
          GlobalStyleSheet.container,
          { paddingHorizontal: 0, paddingBottom: 0 },
        ]}
      >
        <View
          style={{
            height: 88,
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}
        >
          <Button
            title='Continue'
            color={COLORS.secondary}
            text={COLORS.title}
            onPress={() => {

              if (!user) {
                modalRef.current?.open();
                return;
              }

              if (!isChecked) {
                alert('Please select address');
                return;
              }

              dispatch(setSelectedAddress(isChecked));
              navigation.navigate('Payment');
            }}
          />
        </View>
      </View>

      {/* ✅ LOGIN MODAL */}
      <AuthModal ref={modalRef} />

    </View>
  );
};

export default DeleveryAddress;
