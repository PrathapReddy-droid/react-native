import { useTheme, useRoute } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import AuthModal from '../Payment/AuthModel';
import { PostAddressApi } from '../../Api/User';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';

const AddDeleveryAddress = ({ navigation }) => {

  const theme = useTheme();
  const { colors } = theme;
  const route = useRoute();

  const authModalRef = useRef(null);

  const user = useSelector((state) => state.user?.selectedUser);

  const addressTypes = ['Home', 'Shop', 'Office'];
  const [activeType, setActiveType] = useState(addressTypes[0]);

  const [pendingSave, setPendingSave] = useState(false);

  const [addressData, setAddressData] = useState({
    addressType: activeType,
    address_line1: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    landmark: '',
    mobile: '',
  });

  // ✅ If user not logged in when screen loads
  useEffect(() => {
    if (!user?._id) {
      authModalRef.current?.open();
    }
  }, []);

  // ✅ If user logs in and we were waiting to save
  useEffect(() => {
    if (user?._id && pendingSave) {
      saveAddress(user._id);
      setPendingSave(false);
    }
  }, [user]);

  // Update address if selected from map
  useEffect(() => {
    if (route.params?.selectedAddress) {
      setAddressData(prev => ({
        ...prev,
        ...route.params.selectedAddress,
      }));
    }
  }, [route.params?.selectedAddress]);

  const handleChange = (key, value) => {
    setAddressData(prev => ({
      ...prev,
      [key]: value,
      addressType: activeType,
    }));
  };

  const saveAddress = async (userId) => {
    try {
      await PostAddressApi({ ...addressData, userId });
      navigation.navigate('DeleveryAddress');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = () => {

    // 🚨 If not logged in → open login modal
    if (!user?._id) {
      setPendingSave(true);
      authModalRef.current?.open();
      return;
    }

    saveAddress(user._id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      
      <Header title="Add Delivery Address" leftIcon="back" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

        <View style={[GlobalStyleSheet.container, { backgroundColor: colors.card, marginTop: 15 }]}>
          <Text style={{ ...FONTS.fontMedium, fontSize: 18, color: colors.title }}>
            Contact Details
          </Text>

          <Input
            inputBorder
            placeholder="Mobile No."
            keyboardType="number-pad"
            value={addressData.mobile}
            onChangeText={(v) => handleChange('mobile', v)}
          />
        </View>

        <View style={[GlobalStyleSheet.container, { backgroundColor: colors.card, marginTop: 15 }]}>
          <Text style={{ ...FONTS.fontMedium, fontSize: 18, color: colors.title }}>
            Address
          </Text>

          <Input inputBorder placeholder="Pin Code" value={addressData.pincode} onChangeText={(v) => handleChange('pincode', v)} />
          <Input inputBorder placeholder="Address" value={addressData.address_line1} onChangeText={(v) => handleChange('address_line1', v)} />
          <Input inputBorder placeholder="Landmark" value={addressData.landmark} onChangeText={(v) => handleChange('landmark', v)} />
          <Input inputBorder placeholder="City" value={addressData.city} onChangeText={(v) => handleChange('city', v)} />
          <Input inputBorder placeholder="State" value={addressData.state} onChangeText={(v) => handleChange('state', v)} />
          <Input inputBorder placeholder="Country" value={addressData.country} onChangeText={(v) => handleChange('country', v)} />
        </View>

      </ScrollView>

      <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
        <Button
          title="Save Address"
          color={COLORS.secondary}
          onPress={handleSave}
        />
      </View>

      {/* ✅ LOGIN MODAL (forwardRef version) */}
      <AuthModal ref={authModalRef} />

    </View>
  );
};

export default AddDeleveryAddress;
