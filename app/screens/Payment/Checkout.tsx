import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Header from '../../layout/Header';
import { COLORS, FONTS } from '../../constants/theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch, useSelector } from 'react-redux';
import { OrderCreate, productdelieverytime } from '../../Api/Product';
import uuid from 'react-native-uuid';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RazorpayCheckout from 'react-native-razorpay';
import {
  removeOrderedProducts,
  clearBuyNowItem,
} from '../../redux/reducer/cartReducer';
import { getUserDetails } from '../../Api/User';
import { creatPayment } from '../../Api/Payment';

type CheckoutScreenProps = StackScreenProps<RootStackParamList, 'Checkout'>;

interface DeliveryInfo {
  success: boolean;
  product: string;
  courier_name: string;
  estimated_days: string;
  estimated_delivery_date: string;
  freight_charge: number;
}

const Checkout = ({ navigation }: CheckoutScreenProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const cartData = useSelector((state: any) => state.cart.cart);
  const buyNowItem = useSelector((state: any) => state.cart.buyNowItem);
  const selectedAddress = useSelector((state: any) => state.address.selectedAddress);
  const paymentMethod = useSelector((state: any) => state.payment.paymentMethod);

  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [useWallet, setUseWallet] = useState(false);

  // Delivery info state
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  const checkoutData = buyNowItem ? [buyNowItem] : cartData;
  const walletBalance = userDetails?.wallet?.balance || 0;

  useEffect(() => {
    getUserDetails()
      .then((data: any) => setUserDetails(data.data))
      .catch((err: any) => console.log('getUserDetails error:', err));
  }, []);

  /* ══════════════════════════════
     FETCH DELIVERY TIME
  ══════════════════════════════ */
  useEffect(() => {
    const fetchDeliveryTime = async () => {
      if (!selectedAddress?.pincode || checkoutData.length === 0) return;

      const firstItem = checkoutData[0];
      const productId = firstItem?.product?._id || firstItem?.product?.id;
      if (!productId) return;

      try {
        setDeliveryLoading(true);
        const response = await productdelieverytime({
          product_id: productId,
          deliveryPincode: String(selectedAddress.pincode),
        });
        if (response) {
          setDeliveryInfo(response);
        }
      } catch (err) {
        console.log('productDeliveryTime error:', err);
      } finally {
        setDeliveryLoading(false);
      }
    };

    fetchDeliveryTime();
  }, [selectedAddress, buyNowItem]);

  /* ══════════════════════════════
     TOTAL CALCULATIONS
  ══════════════════════════════ */

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

  const freightCharge = deliveryInfo?.freight_charge || 0;

  // Wallet covers up to totalAmount; remainder paid via COD/Razorpay
  const walletDiscount = useWallet ? Math.min(walletBalance, totalAmount) : 0;

  // NOTE: freightCharge is displayed but NOT added to payableAmount yet.
  // To enable shipping charges: change to → totalAmount - walletDiscount + freightCharge
  const payableAmount = totalAmount - walletDiscount;

  /* ══════════════════════════════
     HELPERS
  ══════════════════════════════ */

  const buildProducts = () =>
    checkoutData.map((item: any) => {
      const product = item.product || {};
      const selectedVariant = item.selectedVariant || {};
      return {
        productId: product._id || product.id,
        productTitle: product.name || product.title || '',
        image: product.images?.[0] || product.image || '',
        quantity: Number(item.quantity) || 1,
        price: product.price || 0,
        countInStock: product.countInStock ?? 0,
        variant: selectedVariant,
      };
    });

  const clearCart = (products: any[]) => {
    if (buyNowItem) {
      dispatch(clearBuyNowItem());
    } else {
      const orderedIds = products.map((p: any) => p.productId);
      dispatch(removeOrderedProducts(orderedIds));
    }
  };

  /* ══════════════════════════════
     SUBMIT ORDER
  ══════════════════════════════ */
  const handleSubmitOrder = async () => {
    if (!selectedAddress || checkoutData.length === 0) {
      Alert.alert('Error', 'No address or products selected.');
      return;
    }

    const paymentId = uuid.v4() as string;
    const products = buildProducts();
    const orderDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

    /* ── COD ── */
    if (paymentMethod === 'COD') {
      const orderPayload = {
        userId: selectedAddress.userId,
        delivery_address: selectedAddress._id,
        paymentId,
        payment_type: 'COD',
        payment_status: 'CASH ON DELIVERY',
        status: 'Pending',
        reduction: walletDiscount,
        totalAmt: payableAmount,
        products,
        date: orderDate,
      };

      try {
        setLoading(true);
        await OrderCreate(orderPayload);
        clearCart(products);
        Alert.alert('Success', 'Order placed successfully!');
        navigation.navigate('Myorder');
      } catch (error) {
        console.log('OrderCreate Error:', error);
        Alert.alert('Error', 'Failed to place order.');
      } finally {
        setLoading(false);
      }

    /* ── ONLINE (Razorpay) ── */
    } else if (paymentMethod === 'ONLINE') {
      const orderPayload = {
        userId: selectedAddress.userId,
        delivery_address: selectedAddress._id,
        paymentId,
        payment_type: 'ONLINE',
        payment_status: 'ONLINE',
        status: 'Pending',
        reduction: walletDiscount,   // wallet amount deducted
        totalAmt: payableAmount,     // remaining amount after wallet
        products,
        date: orderDate,
        full_wallet:false
      };
      if(payableAmount <= 0){
        orderPayload.full_wallet = true
      }

      try {
        setLoading(true);
        await OrderCreate(orderPayload);

        // Wallet fully covers the order — skip Razorpay
        if (payableAmount <= 0) {
          clearCart(products);
          Alert.alert('Success', 'Order placed! Fully paid via wallet.');
          navigation.navigate('Myorder');
          return;
        }

        // Razorpay for remaining payable amount
        const response = await creatPayment(paymentId);
        const key = response?.key;
        const order = response?.order;

        console.log(response, key, order, '=========== Razorpay ===========');

        const options = {
          description: 'Order Payment',
          currency: 'INR',
          key: key,
          amount: order.amount,
          order_id: order.id,
          name: 'Your Store',
          prefill: {
            email: 'test@gmail.com',
            contact: selectedAddress.mobile || '9999999999',
            name: 'Customer',
          },
          theme: { color: '#3399cc' },
        };

        RazorpayCheckout.open(options)
          .then(() => {
            clearCart(products);
            Alert.alert('Success', 'Order placed successfully!');
            navigation.navigate('Myorder');
          })
          .catch((err: any) => {
            console.log('Razorpay error:', err);
            Alert.alert('Payment Failed', 'Please try again.');
          });

      } catch (error) {
        console.log('OrderCreate Error:', error);
        Alert.alert('Error', 'Failed to place order.');
      } finally {
        setLoading(false);
      }
    }
  };

  /* ══════════════════════════════
     FORMAT DATE
  ══════════════════════════════ */
  const formatDeliveryDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  /* ══════════════════════════════
     UI
  ══════════════════════════════ */

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Checkout" leftIcon="back" />

      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>

        {/* ── DELIVERY ADDRESS ── */}
        {selectedAddress && (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconWrap}>
                <FeatherIcon name="map-pin" size={14} color={COLORS.primary} />
              </View>
              <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: colors.title }]}>
                Delivery Address
              </Text>
              <View style={[styles.typeBadge, { marginLeft: 'auto' }]}>
                <Text style={styles.typeBadgeText}>
                  {selectedAddress.addressType || 'Home'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={[FONTS.fontMedium, { fontSize: 13, color: colors.title, marginBottom: 2 }]}>
              {selectedAddress.address_line1}
            </Text>
            <Text style={[FONTS.fontRegular, { fontSize: 12, color: colors.text }]}>
              {selectedAddress.landmark ? `${selectedAddress.landmark}, ` : ''}
              {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
            </Text>
            <Text style={[FONTS.fontRegular, { fontSize: 12, color: colors.text }]}>
              {selectedAddress.country}
            </Text>
            <View style={styles.mobileRow}>
              <FeatherIcon name="phone" size={12} color={colors.text} />
              <Text style={[FONTS.fontRegular, { fontSize: 12, color: colors.text, marginLeft: 5 }]}>
                {selectedAddress.mobile}
              </Text>
            </View>
          </View>
        )}

        {/* ── DELIVERY INFO CARD ── */}
        <View style={[styles.card, { backgroundColor: colors.card, marginTop: 12 }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconWrap, { backgroundColor: '#FFA50020' }]}>
              <FeatherIcon name="truck" size={14} color="#FFA500" />
            </View>
            <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: colors.title }]}>
              Delivery Info
            </Text>
          </View>

          <View style={styles.divider} />

          {deliveryLoading ? (
            <View style={styles.deliveryLoadingRow}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={[FONTS.fontRegular, { fontSize: 12, color: colors.text, marginLeft: 10 }]}>
                Fetching delivery details...
              </Text>
            </View>
          ) : deliveryInfo ? (
            <View>
              {/* Courier Name */}
              <View style={styles.deliveryRow}>
                <View style={styles.deliveryIconWrap}>
                  <FeatherIcon name="package" size={13} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[FONTS.fontRegular, { fontSize: 11, color: colors.text }]}>
                    Courier Partner
                  </Text>
                  <Text style={[FONTS.fontSemiBold, { fontSize: 13, color: colors.title }]}>
                    {deliveryInfo.courier_name}
                  </Text>
                </View>
              </View>

              {/* Estimated Days + Date */}
              <View style={[styles.deliveryRow, { marginTop: 10 }]}>
                <View style={styles.deliveryIconWrap}>
                  <FeatherIcon name="calendar" size={13} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[FONTS.fontRegular, { fontSize: 11, color: colors.text }]}>
                    Estimated Delivery
                  </Text>
                  <Text style={[FONTS.fontSemiBold, { fontSize: 13, color: colors.title }]}>
                    {formatDeliveryDate(deliveryInfo.estimated_delivery_date)}
                  </Text>
                </View>
                <View style={styles.daysBadge}>
                  <FeatherIcon name="clock" size={11} color="#fff" />
                  <Text style={styles.daysBadgeText}>
                    {deliveryInfo.estimated_days} days
                  </Text>
                </View>
              </View>

              {/* Freight Charge — displayed only, NOT added to total */}
              <View style={[styles.deliveryRow, { marginTop: 10 }]}>
                <View style={styles.deliveryIconWrap}>
                  <FeatherIcon name="dollar-sign" size={13} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[FONTS.fontRegular, { fontSize: 11, color: colors.text }]}>
                    Shipping Charge
                  </Text>
                  <Text style={[FONTS.fontSemiBold, { fontSize: 13, color: freightCharge === 0 ? COLORS.success : colors.title }]}>
                    {freightCharge === 0 ? 'FREE' : `₹${freightCharge}`}
                  </Text>
                </View>
                {freightCharge === 0 ? (
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>FREE</Text>
                  </View>
                ) : (
                  <View style={styles.daysBadge}>
                    <Text style={styles.daysBadgeText}>₹{freightCharge}</Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.deliveryLoadingRow}>
              <FeatherIcon name="alert-circle" size={14} color={colors.text} />
              <Text style={[FONTS.fontRegular, { fontSize: 12, color: colors.text, marginLeft: 8 }]}>
                Delivery info unavailable for this pincode.
              </Text>
            </View>
          )}
        </View>

        {/* ── PRODUCT LIST ── */}
        <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: colors.title, marginHorizontal: 16, marginBottom: 8, marginTop: 12 }]}>
          Order Items ({totalItems})
        </Text>

        <View style={{ marginHorizontal: 16 }}>
          {checkoutData.map((item: any, index: number) => {
            const product = item.product || {};
            const selectedVariant = item.selectedVariant || {};

            return (
              <View key={index} style={[styles.productCard, { backgroundColor: colors.card }]}>
                <Image
                  source={{ uri: product.images?.[0] || product.image || '' }}
                  style={styles.productImage}
                />

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text numberOfLines={2} style={[FONTS.fontSemiBold, { fontSize: 13, color: colors.title }]}>
                    {product.name || product.title}
                  </Text>

                  {Object.keys(selectedVariant).length > 0 && (
                    <View style={styles.variantRow}>
                      {Object.entries(selectedVariant).map(([key, value]: any, i) => (
                        <View key={i} style={styles.variantChip}>
                          <Text style={styles.variantChipText}>{key}: {value}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={styles.productFooter}>
                    <View style={styles.qtyChip}>
                      <Text style={styles.qtyChipText}>Qty: {item.quantity}</Text>
                    </View>
                    <Text style={[FONTS.fontBold, { fontSize: 15, color: COLORS.success }]}>
                      ₹{(product.price * item.quantity).toFixed(0)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── WALLET SECTION ── */}
        {walletBalance > 0 && (
          <View style={[styles.card, { backgroundColor: colors.card, marginTop: 12 }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrap, { backgroundColor: COLORS.success + '20' }]}>
                <FeatherIcon name="credit-card" size={14} color={COLORS.success} />
              </View>
              <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: colors.title }]}>
                Wallet Balance
              </Text>
              <Text style={[FONTS.fontBold, { fontSize: 14, color: COLORS.success, marginLeft: 'auto' as any }]}>
                ₹{walletBalance}
              </Text>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setUseWallet(w => !w)}
              style={styles.walletToggleRow}
            >
              <View style={{ flex: 1 }}>
                <Text style={[FONTS.fontMedium, { fontSize: 13, color: colors.title }]}>
                  Apply wallet balance
                </Text>
                <Text style={[FONTS.fontRegular, { fontSize: 11, color: colors.text, marginTop: 2 }]}>
                  {useWallet
                    ? walletBalance >= totalAmount
                      ? `Fully covered by wallet — no payment needed!`
                      : `₹${walletDiscount} deducted, pay ₹${payableAmount} via ${paymentMethod}`
                    : `Save ₹${Math.min(walletBalance, totalAmount)} on this order`}
                </Text>
              </View>

              <View style={[styles.checkbox, useWallet && styles.checkboxSelected]}>
                {useWallet && <FeatherIcon name="check" size={12} color="#fff" />}
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* ── PRICE BREAKDOWN ── */}
        <View style={[styles.card, { backgroundColor: colors.card, marginTop: 12 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <FeatherIcon name="tag" size={14} color={COLORS.primary} />
            </View>
            <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: colors.title }]}>
              Price Details
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={[FONTS.fontRegular, { fontSize: 13, color: colors.text }]}>
              Items ({totalItems})
            </Text>
            <Text style={[FONTS.fontMedium, { fontSize: 13, color: colors.title }]}>
              ₹{totalAmount.toFixed(0)}
            </Text>
          </View>

          {/* Shipping charge — shown for info only, NOT included in total */}
          <View style={styles.priceRow}>
            <Text style={[FONTS.fontRegular, { fontSize: 13, color: colors.text }]}>
              Shipping Charge{' '}
              <Text style={{ fontSize: 10, color: colors.text }}>(info only)</Text>
            </Text>
            {deliveryLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={[FONTS.fontMedium, { fontSize: 13, color: freightCharge === 0 ? COLORS.success : colors.text }]}>
                {freightCharge === 0 ? 'FREE' : `₹${freightCharge}`}
              </Text>
            )}
          </View>

          {walletDiscount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[FONTS.fontRegular, { fontSize: 13, color: COLORS.success }]}>
                Wallet Discount
              </Text>
              <Text style={[FONTS.fontMedium, { fontSize: 13, color: COLORS.success }]}>
                − ₹{walletDiscount.toFixed(0)}
              </Text>
            </View>
          )}

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={[FONTS.fontBold, { fontSize: 15, color: colors.title }]}>
              Total Payable
            </Text>
            <Text style={[FONTS.fontBold, { fontSize: 17, color: COLORS.success }]}>
              {payableAmount <= 0 ? 'FREE' : `₹${payableAmount.toFixed(0)}`}
            </Text>
          </View>

          {payableAmount <= 0 && (
            <View style={styles.zeroBadge}>
              <FeatherIcon name="check-circle" size={14} color={COLORS.success} />
              <Text style={[FONTS.fontMedium, { fontSize: 12, color: COLORS.success, marginLeft: 6 }]}>
                Fully covered by wallet — no payment needed!
              </Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* ── FIXED BOTTOM BAR ── */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card }]}>
        <View style={styles.bottomSummary}>
          <View>
            <Text style={[FONTS.fontRegular, { fontSize: 11, color: colors.text }]}>Total Payable</Text>
            <Text style={[FONTS.fontBold, { fontSize: 20, color: COLORS.success }]}>
              {payableAmount <= 0 ? 'FREE' : `₹${payableAmount.toFixed(0)}`}
            </Text>
            {walletDiscount > 0 && (
              <Text style={[FONTS.fontRegular, { fontSize: 10, color: COLORS.success }]}>
                ₹{walletDiscount} saved via wallet
              </Text>
            )}
            {deliveryInfo && (
              <Text style={[FONTS.fontRegular, { fontSize: 10, color: colors.text }]}>
                Delivery by {formatDeliveryDate(deliveryInfo.estimated_delivery_date)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubmitOrder}
            disabled={loading}
            style={[styles.placeOrderBtn, loading && { opacity: 0.6 }]}
          >
            {loading ? (
              <Text style={styles.placeOrderText}>Placing...</Text>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.placeOrderText}>Place Order</Text>
                <FeatherIcon name="arrow-right" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Checkout;

/* ══════════════════════════════
   STYLES
══════════════════════════════ */

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.primaryLight + '60',
    marginVertical: 12,
  },
  typeBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
  },
  mobileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  /* DELIVERY INFO */
  deliveryLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deliveryIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFA500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  daysBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
  },
  freeBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  freeBadgeText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '700',
  },

  /* PRODUCT CARD */
  productCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  variantRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    gap: 5,
  },
  variantChip: {
    backgroundColor: '#e8f0ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  variantChipText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },
  productFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qtyChip: {
    backgroundColor: COLORS.primaryLight + '40',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qtyChipText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },

  /* WALLET */
  walletToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.success + '08',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.success + '25',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },

  /* PRICE BREAKDOWN */
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalRow: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLight + '60',
    marginBottom: 0,
  },
  zeroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: COLORS.success + '12',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  /* BOTTOM BAR */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  bottomSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeOrderBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeOrderText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});