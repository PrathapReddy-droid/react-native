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
  StyleSheet,
} from 'react-native';
import Header from '../../layout/Header';
import { COLORS, FONTS } from '../../constants/theme';
import { IMAGES } from '../../constants/Images';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Cardstyle2 from '../../components/Card/Cardstyle2';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { getOrder, TracOrder } from '../../Api/Product';
import FeatherIcon from 'react-native-vector-icons/Feather';

type TrackorderScreenProps = StackScreenProps<RootStackParamList, 'Trackorder'>;

/* Enable animation on Android */
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ══════════════════════════════
   SHIPMENT STATUS STEPS
   Maps shiprocket current_status → step index (0-based)
══════════════════════════════ */
const SHIPMENT_STEPS = [
  { label: 'Order Placed',     subtitle: 'We have received your order' },
  { label: 'Order Confirmed',  subtitle: 'Seller has confirmed your order' },
  { label: 'Order Processed',  subtitle: 'Your item is being prepared' },
  { label: 'Ready To Ship',    subtitle: 'Item packed and ready for shipment' },
  { label: 'Shipped',          subtitle: 'Order picked up by courier' },
  { label: 'Out For Delivery', subtitle: 'Delivery partner is on the way' },
  { label: 'Delivered',        subtitle: 'Package delivered successfully' },
];

/* Maps known shiprocket statuses to step index */
const getStepIndex = (currentStatus: string, orderStatus: string): number => {
  const s = (currentStatus || orderStatus || '').toLowerCase();

  if (s.includes('delivered'))        return 6;
  if (s.includes('out for delivery')) return 5;
  if (s.includes('shipped') || s.includes('in transit') || s.includes('picked')) return 4;
  if (s.includes('ready') || s.includes('packed')) return 3;
  if (s.includes('processed') || s.includes('processing')) return 2;
  if (s.includes('confirm'))          return 1;
  return 0; // order placed
};

const Trackorder = ({ navigation }: TrackorderScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [orderData, setOrderData] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // ✅ Both maps keyed by order._id (order_id) consistently
  const [trackingMap, setTrackingMap] = useState<{ [orderId: string]: any }>({});
  const [trackingLoading, setTrackingLoading] = useState<{ [orderId: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrder();

      const mappedData = res.data.flatMap((order: any) =>
        order.products.map((product: any) => ({
          order_id: order._id,          // DB primary key — used as map key
          orderId: order.orderId,        // Display order number
          orderDate: new Date(order.updatedAt).toLocaleDateString(),
          paymentStatus: order.payment_status,
          title: product.productTitle,
          subId: product.sub_id,        // Shiprocket sub_id — key in tracking API response
          price: `₹${product.price}`,
          image: product.image,
          status: order.order_status,
        }))
      );

      setOrderData(mappedData);
    } catch (error) {
      console.log('Order Fetch Error', error);
    } finally {
      setLoading(false);
    }
  };

  /* ══════════════════════════════
     FETCH TRACKING FOR ONE ORDER
  ══════════════════════════════ */
  const fetchTracking = async (order_id: string, subId: string) => {
    console.log('Fetching tracking:', order_id, subId);

    if (trackingMap[order_id] !== undefined) return; // already fetched

    // No sub_id means order hasn't been shipped yet — no tracking available
    if (!subId) {
      setTrackingMap(prev => ({ ...prev, [order_id]: 'NO_SUB_ID' }));
      return;
    }

    try {
      setTrackingLoading(prev => ({ ...prev, [order_id]: true }));

      const payload = { sub_id: subId, order_id: order_id };
      console.log('Track payload:', payload);

      const res = await TracOrder(payload);
      console.log('Track response:', JSON.stringify(res?.data, null, 2));

      // ✅ API response data is keyed by sub_id (e.g., "1218906717")
      const dataBlock = res?.data?.data;
      const trackingData =
        dataBlock?.[subId]?.tracking_data ||
        dataBlock?.[order_id]?.tracking_data ||
        null;

      console.log('Resolved trackingData:', trackingData);

      // ✅ Store under order_id consistently
      setTrackingMap(prev => ({ ...prev, [order_id]: trackingData }));
    } catch (err) {
      console.log('Track order error:', err);
      setTrackingMap(prev => ({ ...prev, [order_id]: null }));
    } finally {
      // ✅ Clear loading under order_id
      setTrackingLoading(prev => ({ ...prev, [order_id]: false }));
    }
  };

  const toggleTrackOrder = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const isOpening = expandedIndex !== index;
    setExpandedIndex(isOpening ? index : null);

    if (isOpening) {
      const item = orderData[index];
      fetchTracking(item.order_id, item.subId);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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

            // ✅ Both consistently keyed by item.order_id (DB _id)
            const tracking = trackingMap[item.order_id];
            const isTrackLoading = trackingLoading[item.order_id];

            return (
              <View key={index} style={{ marginBottom: 15 }}>
                {/* ── PRODUCT CARD ── */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                  <Cardstyle2
                    title={item.title}
                    price={item.price}
                    image={item.image}
                    subId={item.subId}
                    order_id={item.order_id}
                    removebottom
                    onPress={() => toggleTrackOrder(index)}
                  />

                  {/* ── ORDER META ── */}
                  <View style={{ marginTop: 8 }}>
                    <Text style={metaText(colors)}>Order ID: {item.orderId}</Text>
                    <Text style={metaText(colors)}>Order Date: {item.orderDate}</Text>

                    <View style={{ flexDirection: 'row', marginTop: 6, flexWrap: 'wrap', gap: 6 }}>
                      <Badge label={item.paymentStatus} color={COLORS.success} />
                      <Badge label={item.status?.toUpperCase?.()} color={getStatusColor(item.status)} />
                    </View>
                  </View>

                  {/* ── TRACK BUTTON ── */}
                  <TouchableOpacity
                    onPress={() => toggleTrackOrder(index)}
                    style={styles.trackBtn}
                  >
                    <Text style={[FONTS.fontMedium, { color: COLORS.primary }]}>
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

                {/* ── TRACKING PANEL ── */}
                {isExpanded && (
                  <View style={[styles.trackPanel, {
                    backgroundColor: theme.dark ? 'rgba(255,255,255,0.08)' : colors.card,
                  }]}>

                    {isTrackLoading ? (
                      <View style={styles.centerRow}>
                        <ActivityIndicator size="small" color={COLORS.primary} />
                        <Text style={[FONTS.fontRegular, { fontSize: 13, color: colors.text, marginLeft: 10 }]}>
                          Fetching shipment details...
                        </Text>
                      </View>

                    ) : tracking === 'NO_SUB_ID' ? (
                      <View style={styles.centerRow}>
                        <FeatherIcon name="info" size={16} color="#FFA500" />
                        <Text style={[FONTS.fontRegular, { fontSize: 13, color: colors.text, marginLeft: 8, flex: 1 }]}>
                          Tracking will be available once your order is shipped.
                        </Text>
                      </View>

                    ) : tracking ? (
                      <ShipmentPanel
                        tracking={tracking}
                        orderStatus={item.status}
                        colors={colors}
                      />

                    ) : (
                      <View style={styles.centerRow}>
                        <FeatherIcon name="alert-circle" size={16} color={colors.text} />
                        <Text style={[FONTS.fontRegular, { fontSize: 13, color: colors.text, marginLeft: 8 }]}>
                          Tracking info not available yet.
                        </Text>
                      </View>
                    )}
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

/* ══════════════════════════════
   SHIPMENT PANEL
   Parses tracking_data and shows:
   - Courier / AWB / EDD info
   - Timeline progress
   - Pending banner if track_status is 0
   - Activity log if available
══════════════════════════════ */

const ShipmentPanel = ({
  tracking,
  orderStatus,
  colors,
}: {
  tracking: any;
  orderStatus: string;
  colors: any;
}) => {
  const track = tracking?.shipment_track?.[0] || {};
  const activities: any[] = tracking?.shipment_track_activities || [];
  const errorMsg: string = tracking?.error || '';
  const isPending = tracking?.track_status === 0 && tracking?.shipment_status === 0;

  const currentStatus = track.current_status || '';
  const activeStep = getStepIndex(currentStatus, orderStatus);

  return (
    <View>
      <Text style={[FONTS.fontSemiBold, { fontSize: 15, color: colors.title, marginBottom: 12 }]}>
        Shipment Progress
      </Text>

      {/* ── PENDING BANNER (track_status: 0) ── */}
      {isPending && (
        <View style={[styles.pendingBanner, { marginBottom: 16 }]}>
          <FeatherIcon name="clock" size={14} color="#FFA500" />
          <Text style={[FONTS.fontRegular, { fontSize: 12, color: '#FFA500', marginLeft: 8, flex: 1 }]}>
            {errorMsg
              ? errorMsg
              : 'Shipment picked up — live tracking details will appear shortly.'}
          </Text>
        </View>
      )}

      {/* ── COURIER INFO STRIP ── */}
      {(track.courier_name || track.awb_code) ? (
        <View style={styles.courierStrip}>
          {track.courier_name ? (
            <InfoChip icon="truck" label="Courier" value={track.courier_name} colors={colors} />
          ) : null}
          {track.awb_code ? (
            <InfoChip icon="hash" label="AWB" value={track.awb_code} colors={colors} />
          ) : null}
          {track.edd ? (
            <InfoChip icon="calendar" label="EDD" value={formatDate(track.edd)} colors={colors} />
          ) : null}
          {track.current_status ? (
            <InfoChip icon="activity" label="Status" value={track.current_status} colors={colors} highlight />
          ) : null}
        </View>
      ) : null}

      {/* ── TIMELINE ── */}
      <Timeline activeStep={activeStep} colors={colors} />

      {/* ── ACTIVITY LOG (if available) ── */}
      {activities.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={[FONTS.fontSemiBold, { fontSize: 13, color: colors.title, marginBottom: 8 }]}>
            Activity Log
          </Text>
          {activities.slice(0, 5).map((act: any, i: number) => (
            <View key={i} style={styles.activityRow}>
              <View style={styles.activityDot} />
              <View style={{ flex: 1 }}>
                <Text style={[FONTS.fontMedium, { fontSize: 12, color: colors.title }]}>
                  {act.activity || act.status || '—'}
                </Text>
                {act.date && (
                  <Text style={[FONTS.fontRegular, { fontSize: 11, color: colors.text, marginTop: 2 }]}>
                    {act.date}
                  </Text>
                )}
                {act.location && (
                  <Text style={[FONTS.fontRegular, { fontSize: 11, color: colors.text }]}>
                    📍 {act.location}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ── ERROR MESSAGE (only when not already shown in pending banner) ── */}
      {!isPending && errorMsg ? (
        <View style={styles.pendingBanner}>
          <FeatherIcon name="clock" size={14} color="#FFA500" />
          <Text style={[FONTS.fontRegular, { fontSize: 12, color: '#FFA500', marginLeft: 8, flex: 1 }]}>
            {errorMsg}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

/* ══════════════════════════════
   TIMELINE
══════════════════════════════ */

const Timeline = ({ activeStep, colors }: { activeStep: number; colors: any }) => (
  <View>
    {SHIPMENT_STEPS.map((step, i) => {
      const isDone = i <= activeStep;
      const isLast = i === SHIPMENT_STEPS.length - 1;
      return (
        <View key={i} style={{ flexDirection: 'row', marginBottom: isLast ? 0 : 0 }}>
          {/* Left column: dot + line */}
          <View style={{ alignItems: 'center', width: 24 }}>
            <View style={[
              styles.timelineDot,
              isDone
                ? { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                : { backgroundColor: colors.background, borderColor: COLORS.primaryLight },
            ]}>
              {isDone && <FeatherIcon name="check" size={10} color="#fff" />}
            </View>
            {!isLast && (
              <View style={[
                styles.timelineLine,
                { backgroundColor: i < activeStep ? COLORS.primary : COLORS.primaryLight + '60' },
              ]} />
            )}
          </View>

          {/* Right: text */}
          <View style={{ flex: 1, paddingLeft: 12, paddingBottom: isLast ? 0 : 20 }}>
            <Text style={[
              FONTS.fontMedium,
              { fontSize: 13, color: isDone ? COLORS.primary : colors.text },
            ]}>
              {step.label}
            </Text>
            <Text style={[FONTS.fontRegular, { fontSize: 11, color: colors.text, marginTop: 2 }]}>
              {step.subtitle}
            </Text>
          </View>
        </View>
      );
    })}
  </View>
);

/* ══════════════════════════════
   INFO CHIP
══════════════════════════════ */

const InfoChip = ({
  icon, label, value, colors, highlight,
}: {
  icon: string; label: string; value: string; colors: any; highlight?: boolean;
}) => (
  <View style={styles.infoChip}>
    <FeatherIcon name={icon as any} size={12} color={highlight ? COLORS.primary : colors.text} />
    <View style={{ marginLeft: 6 }}>
      <Text style={[FONTS.fontRegular, { fontSize: 10, color: colors.text }]}>{label}</Text>
      <Text style={[FONTS.fontSemiBold, {
        fontSize: 12,
        color: highlight ? COLORS.primary : colors.title,
      }]}>
        {value}
      </Text>
    </View>
  </View>
);

/* ══════════════════════════════
   BADGE
══════════════════════════════ */

const Badge = ({ label, color }: { label: string; color: string }) => (
  <View style={{ backgroundColor: `${color}20`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
    <Text style={{ fontSize: 12, color, fontWeight: '600' }}>{label}</Text>
  </View>
);

/* ══════════════════════════════
   HELPERS
══════════════════════════════ */

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirm':   return COLORS.warning;
    case 'shipped':   return COLORS.primary;
    case 'delivered': return COLORS.success;
    default:          return COLORS.text;
  }
};

const metaText = (colors: any) => ({
  ...FONTS.fontRegular,
  fontSize: 12,
  color: colors.text,
  marginBottom: 2,
});

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/* ══════════════════════════════
   STYLES
══════════════════════════════ */

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  trackBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackPanel: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  courierStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 18,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFA50015',
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#FFA50030',
  },
});