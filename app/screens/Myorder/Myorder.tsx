import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Header from '../../layout/Header';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Cardstyle2 from '../../components/Card/Cardstyle2';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { cancelOrder, getOrder, returnOrder } from '../../Api/Product';

type MyorderScreenProps = StackScreenProps<RootStackParamList, 'Myorder'>;

const Myorder = ({ navigation }: MyorderScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [allOrders, setAllOrders]       = useState<any[]>([]); // source of truth
  const [orderData, setOrderData]       = useState<any[]>([]); // displayed list
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrder();
      const mappedData = res.data.flatMap((order: any) =>
        order.products.map((product: any) => ({
          title:     product.productTitle,
          price:     `₹${product.price}`,
          order_id:  order._id,
          orderId:   order.orderId,
          order_status: order.order_status,
          user_id:   order.userId?._id || order.userId,
          sub_id:    product?.sub_id || '',
          delevery:  order.payment_status === 'CASH ON DELIVERY' ? 'Cash on Delivery' : 'Paid',
          image:     product.image,
          offer:     '',
          brand:     '',
          btntitle:  'Track Order',

          // ── raw status from backend e.g. "confirm", "Delivered", "completed" ──
          rawStatus: order.order_status,

          // ── filter bucket ──
          status:
            (order.order_status || '').toLowerCase() === 'delivered' ||
            (order.order_status || '').toLowerCase() === 'completed'
              ? 'completed'
              : 'ongoing',

          trackorder: (order.order_status || '').toLowerCase() !== 'delivered' &&
                      (order.order_status || '').toLowerCase() !== 'completed',
          completed:  (order.order_status || '').toLowerCase() === 'completed',
          EditReview: false,
        }))
      );
      console.log(mappedData,"==================================order")

      setAllOrders(mappedData);
      setOrderData(mappedData);
    } catch (error) {
      console.log('Order Fetch Error', error);
    } finally {
      setLoading(false);
    }
  };

  /* ── Filter (always from source of truth) ── */
  const filterData = (val: string) => {
    setActiveFilter(val);
    if (val === 'all') {
      setOrderData(allOrders);
    } else {
      setOrderData(allOrders.filter((e) => e.status === val));
    }
  };

  /* ── Cancel Order ── */
  const removeItem = async (indexToRemove: number) => {
    const item = orderData[indexToRemove];
    const payload = {
      order_id: item.order_id,
      sub_id:   item.sub_id,
      user_id:  item.user_id,
    };

    try {
      const res = await cancelOrder(payload);
      if (res?.data?.success) {
        // Update both lists
        const updater = (prev: any[]) =>
          prev.map((o) =>
            o.order_id === item.order_id ? { ...o, rawStatus: 'cancelled', status: 'ongoing', trackorder: false } : o
          );
        setAllOrders(updater);
        setOrderData(updater);
        Alert.alert('Success', 'Order cancelled successfully');
      } else {
        Alert.alert('Error', res?.data?.message || 'Something went wrong');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Request failed');
    }
  };

  /* ── Return Order ── */
  const handleReturn = (index: number) => {
    const item = orderData[index];
    Alert.alert(
      'Return Order',
      'Are you sure you want to return this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Return',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(item,"=i2===================")
              const res = await returnOrder({
                order_id: item.order_id,
                sub_id:   item.sub_id,
                user_id:  item.user_id,
              });
              console.log(res,"============================>>>return")

              if (res?.data?.success) {
                const returnData = res.data.data;

                // Update both lists
                const updater = (prev: any[]) =>
                  prev.map((o) =>
                    o.order_id === item.order_id
                      ? { ...o, rawStatus: 'returned', status: 'completed' }
                      : o
                  );
                setAllOrders(updater);
                setOrderData(updater);

                // Show return details
                Alert.alert(
                  '✅ Return Initiated',
                  `Return Order ID: ${returnData.order_id}\nShipment ID: ${returnData.shipment_id}\nStatus: ${returnData.status}\nCompany: ${returnData.company_name}`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert('Error', res?.data?.message || 'Something went wrong');
              }
            } catch (error: any) {
              Alert.alert('Error', error?.response?.data?.message || 'Request failed');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header title="My Order" leftIcon="back" titleRight />

      {/* ── Top Filter Bar ── */}
      <View
        style={{
          padding: 0,
          backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 6.27,
          elevation: 5,
          height: 40,
          width: '100%',
        }}
      >
        <View style={GlobalStyleSheet.flex}>
          <TouchableOpacity
            onPress={() => filterData('all')}
            style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={[FONTS.fontMedium, { fontSize: 15, color: activeFilter === 'all' ? COLORS.primary : colors.title }]}>
              All
            </Text>
          </TouchableOpacity>

          <View style={{ width: 1, height: 40, backgroundColor: COLORS.primaryLight }} />

          <TouchableOpacity onPress={() => filterData('ongoing')} activeOpacity={0.5} style={styles.TopbarCenterLine}>
            <Image
              style={{ height: 16, width: 16, resizeMode: 'contain', tintColor: activeFilter === 'ongoing' ? COLORS.primary : colors.title }}
              source={IMAGES.deliverytruck2}
            />
            <Text style={[FONTS.fontMedium, { fontSize: 15, color: activeFilter === 'ongoing' ? COLORS.primary : colors.title }]}>
              Ongoing
            </Text>
          </TouchableOpacity>

          <View style={{ width: 1, height: 40, backgroundColor: COLORS.primaryLight }} />

          <TouchableOpacity onPress={() => filterData('completed')} activeOpacity={0.5} style={styles.TopbarCenterLine}>
            <Image
              style={{ height: 16, width: 16, resizeMode: 'contain', tintColor: activeFilter === 'completed' ? COLORS.primary : colors.title }}
              source={IMAGES.savecheck}
            />
            <Text style={[FONTS.fontMedium, { fontSize: 15, color: activeFilter === 'completed' ? COLORS.primary : colors.title }]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Orders List ── */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: orderData.length === 0 ? 'center' : 'flex-start' }}>
        <View style={[GlobalStyleSheet.container, { paddingTop: 15 }]}>
          <View style={{ marginHorizontal: -15 }}>

            {orderData.length > 0 ? (
              orderData.map((data: any, index: number) => {
                const isDelivered = (data.rawStatus || '').toLowerCase() === 'delivered';
                const isReturned  = (data.rawStatus || '').toLowerCase() === 'returned';

                return (
                  <View key={index} style={{ marginBottom: 10 }}>
                    <Cardstyle2
                      title={data.title}
                      price={data.price}
                      delevery={data.delevery}
                      image={data.image}
                      offer={data.offer}
                      brand={data.brand}
                      btntitle={data.btntitle}
                      trackorder={data.trackorder}
                      completed={data.completed}
                      EditReview={data.EditReview}

                      // ✅ Pass delivered so Return Order button shows
                      delivered={isDelivered && !isReturned}
                      onPressReturn={() => handleReturn(index)}

                      onPress2={() => navigation.navigate('Trackorder')}
                      onPress3={() => navigation.navigate('Writereview')}
                      onPress4={() => removeItem(index)}
                      closebtn
                    />
                  </View>
                );
              })
            ) : (
              <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
                  <View
                    style={{
                      height: 60, width: 60, borderRadius: 60,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: COLORS.primaryLight, marginBottom: 20,
                    }}
                  >
                    <FeatherIcon color={COLORS.primary} size={24} name="shopping-cart" />
                  </View>
                  <Text style={{ ...FONTS.h5, color: colors.title, marginBottom: 8 }}>Your My Order is Empty!</Text>
                  <Text style={{ ...FONTS.fontSm, color: colors.text, textAlign: 'center', paddingHorizontal: 40 }}>
                    Add Product to your cart and shop now.
                  </Text>
                </View>
              </View>
            )}

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  TopbarCenterLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: '40%',
    justifyContent: 'center',
  },
});

export default Myorder;