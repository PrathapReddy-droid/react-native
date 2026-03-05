import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Header from '../../layout/Header';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Cardstyle2 from '../../components/Card/Cardstyle2';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { getOrder } from '../../Api/Product';
import { useSelector } from 'react-redux';

type MyorderScreenProps = StackScreenProps<RootStackParamList, 'Myorder'>;

const Myorder = ({ navigation }: MyorderScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [orderData, setOrderData] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all'); // Track active filter
useEffect(() => {
  getOrder().then((res) => {
const mappedData = res.data.flatMap((order) => {
  return order.products.map((product) => ({
    title: product.productTitle,
    price: `₹${product.price}`,
    delevery:
      order.payment_status === 'CASH ON DELIVERY'
        ? 'Cash on Delivery'
        : 'Paid',

    image: product.image,

    offer: '',
    brand: '',
    btntitle: 'Track Order',
    trackorder: order.order_status === 'confirm',
    completed: order.order_status === 'completed',
    EditReview: false,
    status:
      order.order_status === 'confirm' ? 'ongoing' : 'completed',
  }));
});


    console.log('Mapped Orders:', mappedData);
    setOrderData(mappedData);
    console.log(orderData,"==========sssss==================")
  });
}, []);


  const filterData = (val: string) => {
    setActiveFilter(val);
    if (val === 'all') {
      setOrderData([...orderData]); // show all
    } else {
      setOrderData(orderData.filter((e) => e.status === val));
    }
  };

  const removeItem = (indexToRemove: number) => {
    setOrderData((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header title="My Order" leftIcon="back" titleRight />

      {/* Top Filter Bar */}
      <View
        style={[
          {
            padding: 0,
            backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 6.27,
            elevation: 5,
            height: 40,
            width: '100%',
          },
        ]}
      >
        <View style={GlobalStyleSheet.flex}>
          <TouchableOpacity onPress={() => filterData('all')} style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={[
                FONTS.fontMedium,
                { fontSize: 15, color: activeFilter === 'all' ? (orderData.length === 0 ? colors.title : COLORS.primary) : colors.title },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <View style={{ width: 1, height: 40, backgroundColor: COLORS.primaryLight }} />
          <TouchableOpacity onPress={() => filterData('ongoing')} activeOpacity={0.5} style={styles.TopbarCenterLine}>
            <Image
              style={{
                height: 16,
                width: 16,
                resizeMode: 'contain',
                tintColor: activeFilter === 'ongoing' ? (orderData.length === 0 ? colors.title : COLORS.primary) : colors.title,
              }}
              source={IMAGES.deliverytruck2}
            />
            <Text
              style={[
                FONTS.fontMedium,
                { fontSize: 15, color: activeFilter === 'ongoing' ? (orderData.length === 0 ? colors.title : COLORS.primary) : colors.title },
              ]}
            >
              Ongoing
            </Text>
          </TouchableOpacity>
          <View style={{ width: 1, height: 40, backgroundColor: COLORS.primaryLight }} />
          <TouchableOpacity onPress={() => filterData('completed')} activeOpacity={0.5} style={styles.TopbarCenterLine}>
            <Image
              style={{
                height: 16,
                width: 16,
                resizeMode: 'contain',
                tintColor: activeFilter === 'completed' ? (orderData.length === 0 ? colors.title : COLORS.primary) : colors.title,
              }}
              source={IMAGES.savecheck}
            />
            <Text
              style={[
                FONTS.fontMedium,
                { fontSize: 15, color: activeFilter === 'completed' ? (orderData.length === 0 ? colors.title : COLORS.primary) : colors.title },
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Orders List */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: orderData.length === 0 ? 'center' : 'flex-start' }}>
        <View style={[GlobalStyleSheet.container, { paddingTop: 15 }]}>
          <View style={{ marginHorizontal: -15 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                {orderData.map((data: any, index: number) => (
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
                    
                      onPress2={() => navigation.navigate('Trackorder')}
                      onPress3={() => navigation.navigate('Writereview')}
                      onPress4={() => removeItem(index)}
                      closebtn
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
            {orderData.length === 0 && (
              <View style={[GlobalStyleSheet.container, { padding: 0, left: 0, right: 0, bottom: 0, top: 0 }]}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <View
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 60,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.primaryLight,
                      marginBottom: 20,
                    }}
                  >
                    <FeatherIcon color={COLORS.primary} size={24} name="shopping-cart" />
                  </View>
                  <Text style={{ ...FONTS.h5, color: colors.title, marginBottom: 8 }}>Your My Order is Empty!</Text>
                  <Text
                    style={{
                      ...FONTS.fontSm,
                      color: colors.text,
                      textAlign: 'center',
                      paddingHorizontal: 40,
                    }}
                  >
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
