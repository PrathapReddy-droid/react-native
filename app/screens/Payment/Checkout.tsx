import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch, useSelector } from 'react-redux';
import { OrderCreate } from '../../Api/Product';
import uuid from 'react-native-uuid';
import RazorpayCheckout from 'react-native-razorpay';


import {
  removeOrderedProducts,
  clearBuyNowItem,
} from '../../redux/reducer/cartReducer';
import { creatPayment } from '../../Api/Payment';

type CheckoutScreenProps = StackScreenProps<
  RootStackParamList,
  'Checkout'
>;

const Checkout = ({ navigation }: CheckoutScreenProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const cartData = useSelector((state: any) => state.cart.cart);
  const buyNowItem = useSelector((state: any) => state.cart.buyNowItem);
  const selectedAddress = useSelector(
    (state: any) => state.address.selectedAddress
  );
  const paymentMethod = useSelector(
   (state:any) => state.payment.paymentMethod
);
console.log(paymentMethod,"=========================================>>paymentmethod")


  const [loading, setLoading] = useState(false);

  /* ==============================
     BUILD CHECKOUT DATA
  ============================== */

  const checkoutData = buyNowItem
    ? [buyNowItem]
    : cartData;

  /* ==============================
     TOTAL CALCULATIONS
  ============================== */

  const totalItems = checkoutData.reduce(
    (sum: number, item: any) => sum + Number(item.quantity || 1),
    0
  );

  const totalAmount = checkoutData.reduce(
    (sum: number, item: any) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    },
    0
  );

  /* ==============================
     SUBMIT ORDER
  ============================== */

  const handleSubmitOrder = async () => {
    if (!selectedAddress || checkoutData.length === 0) {
      Alert.alert('Error', 'No address or products selected.');
      return;
    }
    const paymentId = uuid.v4();

    if(paymentMethod === 'COD'){
    const orderPayload = {
      userId: selectedAddress.userId,
      delivery_address: selectedAddress._id,
      paymentId: paymentId,
      status:"Pending",
      payment_status: 'CASH ON DELIVERY',

      products: checkoutData.map((item: any) => {
        const product = item.product || {};
        const selectedVariant = item.selectedVariant || {};

        return {
          productId: product._id || product.id,
          productTitle: product.name || product.title || '',
          image: product.images?.[0] || product.image || '',
          quantity: Number(item.quantity) || 1,
          price: product.price || 0,
          countInStock: product.countInStock ?? 0,
          variant: selectedVariant, // ✅ VARIANT SENT TO API
        };
      }),

      totalAmt: totalAmount,

      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    try {
      setLoading(true);
      await OrderCreate(orderPayload);

      // 🔥 CLEAR CORRECT DATA
      if (buyNowItem) {
        dispatch(clearBuyNowItem());
      } else {
        const orderedIds = orderPayload.products.map(
          (p: any) => p.productId
        );
        dispatch(removeOrderedProducts(orderedIds));
      }

      Alert.alert('Success', 'Order placed successfully!');
      navigation.navigate('Myorder');
    } catch (error) {
      console.log('OrderCreate Error:', error);
      Alert.alert('Error', 'Failed to place order.');
    } finally {
      setLoading(false);
    }
    }else if(paymentMethod == 'ONLINE'){
      console.log('here i am')
          const orderPayload = {
      userId: selectedAddress.userId,
      delivery_address: selectedAddress._id,
      paymentId: paymentId,
      payment_status:'ONLINE',
      status:"Pending",


      products: checkoutData.map((item: any) => {
        const product = item.product || {};
        const selectedVariant = item.selectedVariant || {};

        return {
          productId: product._id || product.id,
          productTitle: product.name || product.title || '',
          image: product.images?.[0] || product.image || '',
          quantity: Number(item.quantity) || 1,
          price: product.price || 0,
          countInStock: product.countInStock ?? 0,
          variant: selectedVariant, // ✅ VARIANT SENT TO API
        };
      }),

      totalAmt: totalAmount,

      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    try {
      setLoading(true);
      await OrderCreate(orderPayload);
const response = await creatPayment(paymentId);

console.log("Full Response:", response);

const key = response?.key;
const order = response?.order;
  
     console.log(response,key,order,"=========================================")


        const options = {
            description: "Order Payment",
            currency: "INR",
            key: key,
            amount: order.amount,
            order_id: order.id,
            name: "Your Store",
            prefill: {
                email: "test@gmail.com",
                contact: "9505597205",
                name: "Customer"
            },
            theme: { color: "#3399cc" }
        };

        RazorpayCheckout.open(options)
            .then(() => {
                Alert("Payment Processing...");
                // Do NOT mark success here
                // Webhook will confirm
            })
            .catch(() => {
                Alert("Payment Failed");
            });


      // 🔥 CLEAR CORRECT DATA
      if (buyNowItem) {
        dispatch(clearBuyNowItem());
      } else {
        const orderedIds = orderPayload.products.map(
          (p: any) => p.productId
        );
        dispatch(removeOrderedProducts(orderedIds));
      }

      Alert.alert('Success', 'Order placed successfully!');
      navigation.navigate('Myorder');
    } catch (error) {
      console.log('OrderCreate Error:', error);
      Alert.alert('Error', 'Failed to place order.');
    } finally {
      setLoading(false);
    }
    }


  };

  /* ==============================
     UI
  ============================== */

return (
  <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
    <Header title="Checkout" leftIcon="back" />

    <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>

      {/* DELIVERY ADDRESS CARD */}
      {selectedAddress && (
        <View
          style={{
            margin: 15,
            padding: 15,
            borderRadius: 12,
            backgroundColor: colors.card,
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
          }}
        >
          <Text style={[FONTS.fontSemiBold, { fontSize: 16 }]}>
            📍 Delivery Address
          </Text>

          <Text style={{ marginTop: 8, color: colors.text }}>
            {selectedAddress.address_line1}
          </Text>

          <Text style={{ color: colors.text }}>
            {selectedAddress.city}, {selectedAddress.state} -{' '}
            {selectedAddress.pincode}
          </Text>

          <Text style={{ marginTop: 4, color: colors.text }}>
            📞 {selectedAddress.mobile}
          </Text>
        </View>
      )}

      {/* PRODUCTS LIST */}
      <View style={{ marginHorizontal: 15 }}>
        {checkoutData.map((item: any, index: number) => {
          const product = item.product || {};
          const selectedVariant = item.selectedVariant || {};

          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                padding: 12,
                marginBottom: 12,
                borderRadius: 14,
                backgroundColor: colors.card,
                elevation: 3,
              }}
            >
              <Image
                source={{
                  uri:
                    product.images?.[0] ||
                    product.image ||
                    '',
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 10,
                }}
              />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  numberOfLines={2}
                  style={[
                    FONTS.fontSemiBold,
                    { fontSize: 14 },
                  ]}
                >
                  {product.name || product.title}
                </Text>

                {/* VARIANTS */}
                {Object.keys(selectedVariant).length > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: 6,
                    }}
                  >
                    {Object.entries(selectedVariant).map(
                      ([key, value]: any, i) => (
                        <View
                          key={i}
                          style={{
                            backgroundColor: '#e8f0ff',
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 6,
                            marginRight: 6,
                            marginBottom: 4,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              color: COLORS.primary,
                            }}
                          >
                            {key}: {value}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                )}

                <Text
                  style={{
                    marginTop: 6,
                    color: colors.text,
                    fontSize: 12,
                  }}
                >
                  Qty: {item.quantity}
                </Text>

                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: COLORS.success,
                  }}
                >
                  ₹{product.price}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>

    {/* FIXED BOTTOM SUMMARY */}
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 15,
        backgroundColor: colors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 14 }}>Total Items</Text>
        <Text style={{ fontWeight: 'bold' }}>
          {totalItems}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Total Amount
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: COLORS.success,
          }}
        >
          ₹{totalAmount}
        </Text>
      </View>

      <Button
        title={
          loading
            ? 'Placing Order...'
            : 'Place Order'
        }
        color={COLORS.secondary}
        text={COLORS.title}
        onPress={handleSubmitOrder}
      />
    </View>
  </View>
);

};

export default Checkout;
