import { useTheme, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Header from '../../layout/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS, FONTS } from '../../constants/theme';
import Input from '../../components/Input/Input';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { PostAddressApi } from '../../Api/User';
import { useSelector } from 'react-redux';

type Props = StackScreenProps<
  RootStackParamList,
  'AddDeleveryAddress'
>;

const AddDeleveryAddress = ({ navigation }: Props) => {
  const theme = useTheme();
  const route = useRoute<any>();
  const { colors }: any = theme;

  const addressTypes = ['Home', 'Shop', 'Office'];
  const [activeType, setActiveType] = useState(addressTypes[0]);
  const user = useSelector((state)=> state.user.selectedUser)
  console.log(user,"========================================================")

  const [addressData, setAddressData] = useState({
    addressType: activeType,
    address_line1: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    landmark: '',
    mobile: '',
    userId: user._id,
  });

  // ✅ RECEIVE ADDRESS FROM MAP
  useEffect(() => {
    if (route.params?.selectedAddress) {
      setAddressData(prev => ({
        ...prev,
        ...route.params.selectedAddress,
        addressType: activeType,
      }));
    }
  }, [route.params?.selectedAddress]);

  const handleChange = (key: string, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [key]: value,
      addressType: activeType,
    }));
  };

  const handleSave = async () => {
    await PostAddressApi(addressData);
    navigation.navigate('DeleveryAddress');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Add Delivery Address" leftIcon="back" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

        {/* CONTACT */}
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

        {/* MAP BUTTON */}
        <View style={[GlobalStyleSheet.container, { backgroundColor: colors.card, marginTop: 15 }]}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MapAddressPicker')}
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: COLORS.primary,
              borderRadius: 6,
            }}
          >
            <Text style={{ textAlign: 'center', color: COLORS.primary }}>
              Select Address From Map
            </Text>
          </TouchableOpacity>
        </View>

        {/* ADDRESS */}
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

        {/* ADDRESS TYPE */}
        <View style={[GlobalStyleSheet.container, { backgroundColor: colors.card, marginTop: 15 }]}>
          <Text style={{ ...FONTS.fontMedium, fontSize: 18, color: colors.title }}>
            Save Address As
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            {addressTypes.map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setActiveType(type)}
                style={{
                  padding: 10,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  backgroundColor: activeType === type ? COLORS.primary : 'transparent',
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: activeType === type ? '#fff' : colors.title }}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>

      <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
        <Button title="Save Address" color={COLORS.secondary} onPress={handleSave} />
      </View>
    </View>
  );
};

export default AddDeleveryAddress;
