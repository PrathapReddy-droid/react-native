import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Header from '../../layout/Header';
import { COLORS, FONTS } from '../../constants/theme';
import { IMAGES } from '../../constants/Images';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Cardstyle2 from '../../components/Card/Cardstyle2';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { getOrder } from '../../Api/Product';

type TrackorderScreenProps = StackScreenProps<
  RootStackParamList,
  'Trackorder'
>;

/* Enable animation on Android */
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const Trackorder = ({ navigation }: TrackorderScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [orderData, setOrderData] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrder();

      const mappedData = res.data.flatMap((order: any) =>
        order.products.map((product: any) => ({
          orderId: order._id,
          orderDate: order.date,
          paymentStatus: order.payment_status,
          title: product.productTitle,
          price: `₹${product.price}`,
          image: product.image,
          status: order.order_status, // confirm | shipped | delivered
        }))
      );

      setOrderData(mappedData);
    } catch (error) {
      console.log('Order Fetch Error', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTrackOrder = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Track Order" leftIcon="back" titleRight />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={GlobalStyleSheet.container}>
          {orderData.map((item, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <View key={index} style={{ marginBottom: 15 }}>
                {/* ================= PRODUCT CARD ================= */}
                <View
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <Cardstyle2
                    title={item.title}
                    price={item.price}
                    image={item.image}
                    removebottom
                    onPress={() => toggleTrackOrder(index)}
                  />

                  {/* ================= ORDER META ================= */}
                  <View style={{ marginTop: 8 }}>
                    <Text style={metaText(colors)}>
                      Order ID: {item.orderId}
                    </Text>
                    <Text style={metaText(colors)}>
                      Order Date: {item.orderDate}
                    </Text>

                    <View style={{ flexDirection: 'row', marginTop: 6 }}>
                      <Badge
                        label={item.paymentStatus}
                        color={COLORS.success}
                      />
                      <Badge
                        label={item.status.toUpperCase()}
                        color={getStatusColor(item.status)}
                      />
                    </View>
                  </View>

                  {/* ================= TRACK BUTTON ================= */}
                  <TouchableOpacity
                    onPress={() => toggleTrackOrder(index)}
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={{
                        ...FONTS.fontMedium,
                        color: COLORS.primary,
                      }}
                    >
                      Track Order
                    </Text>
                    <Image
                      source={IMAGES.downArrow}
                      style={{
                        width: 14,
                        height: 14,
                        tintColor: COLORS.primary,
                        transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
                      }}
                    />
                  </TouchableOpacity>
                </View>

                {/* ================= DROPDOWN TIMELINE ================= */}
                {isExpanded && (
                  <View
                    style={{
                      marginTop: 10,
                      padding: 15,
                      borderRadius: 10,
                      backgroundColor: theme.dark
                        ? 'rgba(255,255,255,0.08)'
                        : colors.card,
                    }}
                  >
                    <Text
                      style={{
                        ...FONTS.fontMedium,
                        fontSize: 16,
                        marginBottom: 15,
                        color: colors.title,
                      }}
                    >
                      Shipment Progress
                    </Text>

                    <Timeline status={item.status} />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Trackorder;

/* ================= TIMELINE ================= */

const Timeline = ({ status }: { status: string }) => {
  return (
    <>
      <TimelineItem
        title="Order Placed"
        subtitle="We have received your order"
        active
      />
      <TimelineItem
        title="Order Confirmed"
        subtitle="Seller has confirmed your order"
        active
      />
      <TimelineItem
        title="Order Processed"
        subtitle="Your item is being prepared"
        active={status !== 'confirm'}
      />
      <TimelineItem
        title="Ready To Ship"
        subtitle="Item packed and ready for shipment"
        active={status === 'shipped' || status === 'delivered'}
      />
      <TimelineItem
        title="Out For Delivery"
        subtitle="Delivery partner is on the way"
        active={status === 'delivered'}
        last
      />
    </>
  );
};

/* ================= TIMELINE ITEM ================= */

const TimelineItem = ({
  title,
  subtitle,
  active = false,
  last = false,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
  last?: boolean;
}) => {
  return (
    <View style={{ flexDirection: 'row', marginBottom: last ? 0 : 22 }}>
      {active ? (
        <Image
          source={IMAGES.check4}
          style={{ width: 20, height: 20, tintColor: COLORS.primary }}
        />
      ) : (
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: COLORS.primaryLight,
          }}
        />
      )}

      <View style={{ marginLeft: 12 }}>
        <Text
          style={{
            ...FONTS.fontMedium,
            fontSize: 15,
            color: active ? COLORS.primary : COLORS.title,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            ...FONTS.fontRegular,
            fontSize: 13,
            color: COLORS.textLight,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

/* ================= HELPERS ================= */

const Badge = ({ label, color }: { label: string; color: string }) => (
  <View
    style={{
      backgroundColor: `${color}20`,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
      marginRight: 8,
    }}
  >
    <Text
      style={{
        fontSize: 12,
        color,
        fontWeight: '600',
      }}
    >
      {label}
    </Text>
  </View>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirm':
      return COLORS.warning;
    case 'shipped':
      return COLORS.primary;
    case 'delivered':
      return COLORS.success;
    default:
      return COLORS.text;
  }
};

const metaText = (colors: any) => ({
  ...FONTS.fontRegular,
  fontSize: 12,
  color: colors.textLight,
});
