import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, Alert } from 'react-native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useSelector } from 'react-redux';
import { OrderCreate } from '../../Api/Product';

type CheckoutScreenProps = StackScreenProps<RootStackParamList, 'Checkout'>;

const Checkout = ({ navigation }: CheckoutScreenProps) => {
  const checkoutData = useSelector((state: RootState) => state.cart.cart);
  const selectedAddress = useSelector((state: RootState) => state.address.selectedAddress);
    const user = useSelector((state:RootState)=> state.user.selectedUser)
    console.log(selectedAddress,user,"================================>>>>")
  

  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const { colors }: { colors: any } = theme;
    console.log(checkoutData,"=======checj=================")

  const handleSubmitOrder = async () => {
    if (!selectedAddress || checkoutData.length === 0) {
      Alert.alert('Error', 'No address or products selected.');
      return;
    }

    const orderPayload = {
      userId: selectedAddress.userId,
      delivery_address: selectedAddress._id,
      paymentId: '',
      payment_status: 'CASH ON DELIVERY',
      products: checkoutData.map(item => ({
        productId: item.product._id,
        productTitle: item.product.name,
        image:item.product.images[0],
        quantity: Number(item.quantity) || 1,
        price: item.product.price,
        countInStock:10,
      })),
      totalAmt: checkoutData.reduce((total, item) => total + item.product.price * item.quantity, 0),
      date: new Date().toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    try {
      setLoading(true);
      await OrderCreate(orderPayload); // Call API
      Alert.alert('Success', 'Order placed successfully!');

      setTimeout(() => {
        navigation.navigate('Myorder');
      }, 3000);
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
      console.log('OrderCreate Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header title="Checkout" leftIcon="back" titleRight />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Selected Address */}
        {selectedAddress && (
          <View
            style={[
              GlobalStyleSheet.container,
              {
                paddingTop: 10,
                backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card,
                marginTop: 15,
              },
            ]}
          >
            <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, marginBottom: 10 }}>
              Delivery Address
            </Text>
            <View style={{ padding: 10, borderWidth: 1, borderColor: COLORS.primaryLight, borderRadius: 4 }}>
              <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: colors.title }}>{selectedAddress.addressType}</Text>
              <Text style={{ ...FONTS.fontRegular, fontSize: 13, color: colors.text }}>{selectedAddress.address_line1}</Text>
              <Text style={{ ...FONTS.fontRegular, fontSize: 13, color: colors.text }}>
                {selectedAddress.city}, {selectedAddress.state}
              </Text>
              <Text style={{ ...FONTS.fontRegular, fontSize: 13, color: colors.text }}>
                {selectedAddress.country} - {selectedAddress.pincode}
              </Text>
              <Text style={{ ...FONTS.fontRegular, fontSize: 13, color: colors.text }}>
                Landmark: {selectedAddress.landmark}
              </Text>
              <Text style={{ ...FONTS.fontRegular, fontSize: 13, color: colors.text }}>Mobile: {selectedAddress.mobile}</Text>
            </View>
          </View>
        )}

        {/* Products */}
        <View
          style={[
            GlobalStyleSheet.container,
            { paddingTop: 10, backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card, marginTop: 15 },
          ]}
        >
          {checkoutData.map((item: any, index: number) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: COLORS.primaryLight,
                paddingVertical: 10,
              }}
            >
              <Image
                source={{ uri: item?.product?.images[0] }}
                style={{ width: 60, height: 60, resizeMode: 'contain', marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>{item.product.name}</Text>
                <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.text }}>{item.product.description}</Text>
                <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.text }}>Qty: {item.quantity}</Text>
                <Text style={{ ...FONTS.fontMedium, fontSize: 14, color: COLORS.success }}>
                  Price: ₹{item.product.price}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Additional Notes */}
        <View style={{ marginTop: 20, paddingHorizontal: 15 }}>
          <Text style={{ ...FONTS.fontRegular, fontSize: 15, color: colors.title }}>Additional Notes:</Text>
          <TextInput
            style={{
              ...FONTS.fontRegular,
              fontSize: 15,
              color: colors.title,
              borderBottomWidth: 2,
              borderBottomColor: COLORS.primaryLight,
              paddingBottom: 50,
            }}
            placeholder="Write Here"
            multiline
            placeholderTextColor={colors.text}
          />
        </View>

        {/* Price Details */}
        <View
          style={[
            GlobalStyleSheet.container,
            { paddingTop: 10, backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card, marginTop: 15 },
          ]}
        >
          <View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.primaryLight,
                marginHorizontal: -15,
                paddingHorizontal: 15,
                paddingBottom: 15,
                marginTop: 5,
              }}
            >
              <Text style={[FONTS.fontMedium, { fontSize: 16, color: colors.title }]}>Price Details</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 5,
                marginTop: 15,
              }}
            >
              <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>
                Price ({checkoutData[0].quantity})
              </Text>
              <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>
                ₹{checkoutData[0].product.oldPrice * checkoutData[0].quantity}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Discount</Text>
              <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>{checkoutData[0].product.discount}%</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
              <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.title }}>Delivery Charges</Text>
              <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: COLORS.success }}>Free Delivery</Text>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: COLORS.primaryLight,
                marginHorizontal: -15,
                paddingHorizontal: 15,
                paddingTop: 15,
                paddingBottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={[FONTS.fontMedium, { fontSize: 16, color: colors.title }]}>Total</Text>
              <Text style={[FONTS.fontMedium, { fontSize: 16, color: COLORS.success }]}>
                ₹{checkoutData[0].product.price * checkoutData[0].quantity}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Order Button */}
      <View style={[GlobalStyleSheet.container, { paddingHorizontal: 0, paddingBottom: 0 }]}>
        <View
          style={{
            height: 88,
            width: '100%',
            backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card,
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}
        >
          <Button title="Submit Order" color={COLORS.secondary} text={COLORS.title} onPress={handleSubmitOrder} />
        </View>
      </View>
    </View>
  );
};

export default Checkout;
