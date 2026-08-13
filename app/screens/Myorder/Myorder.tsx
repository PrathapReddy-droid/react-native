import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import {
  useTheme,
} from '@react-navigation/native';

import Header from '../../layout/Header';

import {
  COLORS,
  FONTS,
} from '../../constants/theme';

import {
  IMAGES,
} from '../../constants/Images';

import FeatherIcon from 'react-native-vector-icons/Feather';

import Cardstyle2 from '../../components/Card/Cardstyle2';

import {
  StackScreenProps,
} from '@react-navigation/stack';

import {
  RootStackParamList,
} from '../../navigation/RootStackParamList';

import {
  cancelOrder,
  getOrder,
  returnOrder,
} from '../../Api/Product';


type MyorderScreenProps =
  StackScreenProps<
    RootStackParamList,
    'Myorder'
  >;


const Myorder = ({
  navigation,
}: MyorderScreenProps) => {

  const theme = useTheme();

  const {
    colors,
  }: {
    colors: any;
  } = theme;


  // =========================================================
  // STATE
  // =========================================================

  const [
    allOrders,
    setAllOrders,
  ] = useState<any[]>([]);

  const [
    orderData,
    setOrderData,
  ] = useState<any[]>([]);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState('all');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  // =========================================================
  // FETCH ORDERS
  // =========================================================

  useEffect(() => {
    fetchOrders();
  }, []);


  const fetchOrders = async () => {

    try {

      const res = await getOrder();

      const mappedData =
        res.data.flatMap(
          (order: any) => {

            const rawStatus =
              (
                order.order_status ||
                ''
              ).toLowerCase();

            const isDelivered =
              rawStatus === 'delivered';

            const isCompleted =
              rawStatus === 'completed';

            const isReturned =
              rawStatus === 'returned';


            return order.products.map(
              (product: any) => ({

                // =================================================
                // PRODUCT
                // =================================================

                title:
                  product.productTitle ||
                  'Product',

                price:
                  `₹${product.price || 0}`,

                image:
                  product.image || '',

                brand:
                  product.brand ||
                  product.brandName ||
                  '',

                discount:
                  product.discount ||
                  '',

                offer:
                  product.offer ||
                  '',


                // =================================================
                // IDS
                // =================================================

                order_id:
                  order._id,

                orderId:
                  order.orderId,

                user_id:
                  order.userId?._id ||
                  order.userId,

                sub_id:
                  product?.sub_id ||
                  '',

                product_id:
                  product?._id ||
                  product?.productId ||
                  '',


                // =================================================
                // QUANTITY
                // =================================================

                quantity:
                  String(
                    product.quantity ||
                    1
                  ),


                // =================================================
                // DELIVERY
                // =================================================

                delevery:
                  order.payment_status ===
                    'CASH ON DELIVERY'
                    ? 'Cash on Delivery'
                    : 'Paid',


                // =================================================
                // STATUS
                // =================================================

                rawStatus,

                isDelivered,

                isReturned,

                status:
                  isDelivered ||
                    isCompleted ||
                    isReturned
                    ? 'completed'
                    : 'ongoing',


                trackorder:
                  !isDelivered &&
                  !isCompleted &&
                  !isReturned,


                completed:
                  isCompleted ||
                  isReturned,


                EditReview:
                  false,

              })
            );
          }
        );


      console.log(
        mappedData,
        '================ ORDER DATA'
      );


      setAllOrders(mappedData);

      setOrderData(mappedData);

    } catch (error) {

      console.log(
        'Order Fetch Error',
        error
      );

      Alert.alert(
        'Error',
        'Unable to load your orders.'
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================================================
  // REFRESH
  // =========================================================

  const onRefresh = async () => {

    setRefreshing(true);

    await fetchOrders();

    setRefreshing(false);
  };


  // =========================================================
  // FILTER
  // =========================================================

  const filterData = (
    value: string
  ) => {

    setActiveFilter(value);

    if (value === 'all') {

      setOrderData(
        allOrders
      );

      return;
    }

    setOrderData(
      allOrders.filter(
        (item) =>
          item.status === value
      )
    );
  };


  // =========================================================
  // COUNTS
  // =========================================================

  const allCount =
    allOrders.length;

  const ongoingCount =
    allOrders.filter(
      item =>
        item.status === 'ongoing'
    ).length;

  const completedCount =
    allOrders.filter(
      item =>
        item.status === 'completed'
    ).length;


  // =========================================================
  // CANCEL ORDER
  // =========================================================

  const removeItem = async (
    indexToRemove: number
  ) => {

    const item =
      orderData[indexToRemove];


    if (!item) {
      return;
    }


    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',

      [
        {
          text: 'No',
          style: 'cancel',
        },

        {
          text: 'Yes, Cancel',
          style: 'destructive',

          onPress:
            async () => {

              const payload = {

                order_id:
                  item.order_id,

                sub_id:
                  item.sub_id,

                user_id:
                  item.user_id,

              };


              try {

                const res =
                  await cancelOrder(
                    payload
                  );


                if (
                  res?.data?.success
                ) {

                  const updater =
                    (
                      prev: any[]
                    ) =>
                      prev.map(
                        (
                          order
                        ) => {

                          if (
                            order.order_id ===
                            item.order_id
                          ) {

                            return {
                              ...order,

                              rawStatus:
                                'cancelled',

                              status:
                                'ongoing',

                              trackorder:
                                false,

                            };
                          }

                          return order;
                        }
                      );


                  setAllOrders(
                    updater
                  );

                  setOrderData(
                    updater
                  );


                  Alert.alert(
                    'Success',
                    'Order cancelled successfully'
                  );

                } else {

                  Alert.alert(
                    'Error',
                    res?.data?.message ||
                    'Something went wrong'
                  );
                }

              } catch (
              error: any
              ) {

                console.log(
                  error
                );

                Alert.alert(
                  'Error',
                  error?.response
                    ?.data
                    ?.message ||
                  'Request failed'
                );
              }
            },
        },
      ]
    );
  };


  // =========================================================
  // RETURN ORDER
  // =========================================================

  const handleReturn = (
    index: number
  ) => {

    const item =
      orderData[index];


    if (!item) {
      return;
    }


    Alert.alert(
      'Return Order',
      'Are you sure you want to return this order?',

      [
        {
          text: 'No',
          style: 'cancel',
        },

        {
          text: 'Yes, Return',
          style: 'destructive',

          onPress:
            async () => {

              try {

                const res =
                  await returnOrder({

                    order_id:
                      item.order_id,

                    sub_id:
                      item.sub_id,

                    user_id:
                      item.user_id,

                  });


                console.log(
                  res,
                  '================ RETURN'
                );


                if (
                  res?.data?.success
                ) {

                  const returnData =
                    res.data.data;


                  const updater =
                    (
                      prev: any[]
                    ) =>
                      prev.map(
                        (
                          order
                        ) => {

                          if (
                            order.order_id ===
                            item.order_id
                          ) {

                            return {

                              ...order,

                              rawStatus:
                                'returned',

                              status:
                                'completed',

                              isReturned:
                                true,

                              isDelivered:
                                false,

                              trackorder:
                                false,

                              completed:
                                true,

                            };
                          }

                          return order;
                        }
                      );


                  setAllOrders(
                    updater
                  );

                  setOrderData(
                    updater
                  );


                  Alert.alert(

                    'Return Initiated',

                    `Return Order ID: ${returnData?.order_id ||
                    '-'
                    }\n\nShipment ID: ${returnData?.shipment_id ||
                    '-'
                    }\n\nStatus: ${returnData?.status ||
                    '-'
                    }\n\nCompany: ${returnData?.company_name ||
                    '-'
                    }`,

                    [
                      {
                        text: 'OK',
                      },
                    ]
                  );

                } else {

                  Alert.alert(
                    'Error',
                    res?.message ||
                    'Something went wrong'
                  );
                }

              } catch (
              error: any
              ) {

                console.log(
                  error
                );

                Alert.alert(
                  'Error',
                  error?.response
                    ?.data
                    ?.message ||
                  'Request failed'
                );
              }
            },
        },
      ]
    );
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >

        <View
          style={[
            styles.loadingIcon,
            {
              backgroundColor:
                COLORS.primaryLight,
            },
          ]}
        >

          <FeatherIcon
            name="shopping-bag"
            size={25}
            color={COLORS.primary}
          />

        </View>

        <ActivityIndicator
          size="small"
          color={COLORS.primary}
        />

        <Text
          style={[
            FONTS.fontRegular,
            styles.loadingText,
            {
              color: colors.text,
            },
          ]}
        >
          Loading your orders...
        </Text>

      </View>
    );
  }


  // =========================================================
  // FILTER BUTTON
  // =========================================================

  const renderFilterButton = (
    key: string,
    label: string,
    icon: string,
    count: number
  ) => {

    const active =
      activeFilter === key;


    return (

      <TouchableOpacity
        key={key}
        onPress={() =>
          filterData(key)
        }
        activeOpacity={0.8}

        style={[
          styles.filterButton,

          active && {
            backgroundColor:
              COLORS.primary,
          },
        ]}
      >

        <FeatherIcon
          name={icon}
          size={14}

          color={
            active
              ? '#FFFFFF'
              : colors.text
          }
        />

        <Text
          style={[
            styles.filterText,

            {
              color:
                active
                  ? '#FFFFFF'
                  : colors.text,
            },
          ]}
        >
          {label}
        </Text>

        <View
          style={[
            styles.countBadge,

            active && {
              backgroundColor:
                'rgba(255,255,255,0.20)',
            },
          ]}
        >

          <Text
            style={[
              styles.countText,

              {
                color:
                  active
                    ? '#FFFFFF'
                    : colors.text,
              },
            ]}
          >
            {count}
          </Text>

        </View>

      </TouchableOpacity>
    );
  };


  // =========================================================
  // MAIN
  // =========================================================

  return (

    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Header
        title="My Orders"
        leftIcon="back"
        titleRight
      />


      {/* ================================================= */}
      {/* FILTER */}
      {/* ================================================= */}

      <View
        style={[
          styles.filterWrapper,

          {
            backgroundColor:
              theme.dark
                ? 'rgba(255,255,255,0.06)'
                : '#F1F5F9',
          },
        ]}
      >

        {renderFilterButton(
          'all',
          'All',
          'list',
          allCount
        )}

        {renderFilterButton(
          'ongoing',
          'Ongoing',
          'truck',
          ongoingCount
        )}

        {renderFilterButton(
          'completed',
          'Completed',
          'check-circle',
          completedCount
        )}

      </View>


      {/* ================================================= */}
      {/* ORDER LIST */}
      {/* ================================================= */}

      <ScrollView

        showsVerticalScrollIndicator={false}

        contentContainerStyle={[
          styles.scrollContent,

          orderData.length === 0 &&
          styles.emptyScroll,
        ]}

        refreshControl={

          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={
              COLORS.primary
            }
            colors={[
              COLORS.primary,
            ]}
          />

        }
      >

        {orderData.length > 0 ? (

          <View style={styles.ordersContainer}>

            {/* SMALL RESULT TEXT */}

            <View
              style={styles.resultHeader}
            >

              <Text
                style={[
                  FONTS.fontRegular,
                  styles.resultText,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {orderData.length}{' '}
                {orderData.length === 1
                  ? 'order'
                  : 'orders'}
              </Text>

            </View>


            {/* ORDERS */}

            {orderData.map(
              (
                data: any,
                index: number
              ) => {

                const isDelivered =
                  (
                    data.rawStatus ||
                    ''
                  ).toLowerCase() ===
                  'delivered';

                const isReturned =
                  (
                    data.rawStatus ||
                    ''
                  ).toLowerCase() ===
                  'returned';


                return (

                  <Cardstyle2

                    key={
                      `${data.order_id}-${data.sub_id}-${index}`
                    }



                    id={
                      data.product_id ||
                      data.sub_id ||
                      data.order_id ||
                      ''
                    }

                    quantity={
                      data.quantity ||
                      '1'
                    }

                    title={
                      data.title
                    }

                    price={
                      data.price
                    }

                    image={
                      data.image
                    }

                    brand={
                      data.brand
                    }

                    discount={
                      data.discount
                    }

                    offer={
                      data.offer
                    }



                    delevery={
                      data.delevery
                    }



                    trackorder={
                      data.trackorder
                    }

                    completed={
                      data.completed
                    }

                    delivered={
                      isDelivered &&
                      !isReturned
                    }



                    onPress={() => {

                      console.log(
                        'Order pressed:',
                        data
                      );

                    }}



                    onPress2={() =>
                      navigation.navigate(
                        'Trackorder'
                      )
                    }



                    onPress3={() =>
                      navigation.navigate(
                        'Writereview'
                      )
                    }



                    onPress4={() =>
                      removeItem(
                        index
                      )
                    }



                    onPressReturn={() =>
                      handleReturn(
                        index
                      )
                    }

                  />

                );
              }
            )}

          </View>

        ) : (

          /* ================================================= */
          /* EMPTY */
          /* ================================================= */

          <View
            style={[
              styles.emptyContainer,
            ]}
          >

            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor:
                    COLORS.primaryLight,
                },
              ]}
            >

              <FeatherIcon
                name="package"
                size={34}
                color={
                  COLORS.primary
                }
              />

            </View>


            <Text
              style={[
                FONTS.h5,
                styles.emptyTitle,
                {
                  color:
                    colors.title,
                },
              ]}
            >
              No orders found
            </Text>


            <Text
              style={[
                FONTS.fontRegular,
                styles.emptyDescription,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              {activeFilter ===
                'ongoing'
                ? 'You have no ongoing orders right now.'
                : activeFilter ===
                  'completed'
                  ? 'You have no completed orders yet.'
                  : 'You haven’t placed any orders yet.'}
            </Text>

          </View>

        )}

      </ScrollView>

    </View>
  );
};


// =============================================================
// STYLES
// =============================================================

const styles = StyleSheet.create({

  // =========================================================
  // CONTAINER
  // =========================================================

  container: {
    flex: 1,
  },


  // =========================================================
  // LOADING
  // =========================================================

  loadingContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingIcon: {
    width: 65,
    height: 65,

    borderRadius: 33,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 18,
  },

  loadingText: {
    marginTop: 10,

    fontSize: 13,

    opacity: 0.7,
  },


  // =========================================================
  // FILTER
  // =========================================================

  filterWrapper: {
    flexDirection: 'row',

    marginHorizontal: 15,

    marginTop: 10,
    marginBottom: 5,

    padding: 4,

    borderRadius: 14,
  },

  filterButton: {
    flex: 1,

    height: 42,

    borderRadius: 11,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 5,
  },

  filterText: {
    fontSize: 12,

    fontWeight: '600',
  },

  countBadge: {
    minWidth: 20,

    height: 20,

    paddingHorizontal: 5,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    fontSize: 10,

    fontWeight: '700',
  },


  // =========================================================
  // SCROLL
  // =========================================================

  scrollContent: {
    paddingTop: 5,

    paddingBottom: 30,
  },

  emptyScroll: {
    flexGrow: 1,
  },


  // =========================================================
  // ORDERS
  // =========================================================

  ordersContainer: {
    paddingTop: 2,
  },

  resultHeader: {
    paddingHorizontal: 18,

    paddingTop: 8,

    paddingBottom: 8,
  },

  resultText: {
    fontSize: 12,

    opacity: 0.65,
  },


  // =========================================================
  // EMPTY
  // =========================================================

  emptyContainer: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 20,
  },

  emptyIcon: {
    width: 82,
    height: 82,

    borderRadius: 41,

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 20,
  },

  emptyTitle: {
    marginBottom: 8,
  },

  emptyDescription: {
    fontSize: 13,

    lineHeight: 20,

    textAlign: 'center',

    maxWidth: 290,

    opacity: 0.7,
  },

});


export default Myorder;