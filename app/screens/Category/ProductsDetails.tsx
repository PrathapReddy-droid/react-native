import { useTheme, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  ScrollView,
  Alert,
} from 'react-native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Swiper from 'react-native-swiper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch } from 'react-redux';
import {
  addToCart,
  setBuyNowItem,
} from '../../redux/reducer/cartReducer';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import { productList, productreview } from '../../Api/Product';

type ProductsDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  'ProductsDetails'
>;

const ProductsDetails = ({ navigation }: ProductsDetailsScreenProps) => {
  const route = useRoute();
  const { product } = route.params as any;

  const isOutOfStock = product?.countInStock <= 0;

  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});

  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const dispatch = useDispatch();

  /* ---------------- VARIANT SELECT ---------------- */

  const handleVariantSelect = (variantType: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantType]: option,
    }));
  };

  /* ---------------- ADD TO CART ---------------- */

  const addItemToCart = () => {
    if (
      product.variants &&
      Object.keys(product.variants).some(
        key =>
          product.variants[key]?.length > 0 &&
          !selectedVariants[key]
      )
    ) {
      Alert.alert('Select Variant', 'Please select all required variants.');
      return;
    }

    dispatch(
      addToCart({
        product,
        selectedVariants,
      })
    );

    navigation.navigate('MyCart');
  };

  /* ---------------- BUY NOW (REDUX ONLY) ---------------- */

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    if (
      product.variants &&
      Object.keys(product.variants).some(
        key =>
          product.variants[key]?.length > 0 &&
          !selectedVariants[key]
      )
    ) {
      Alert.alert('Select Variant', 'Please select all required variants.');
      return;
    }

    dispatch(
      setBuyNowItem({
        product,
        selectedVariant: selectedVariants,
      })
    );

    navigation.navigate('DeleveryAddress');
  };

  /* ---------------- SHARE ---------------- */

  const onShare = async () => {
    try {
      await Share.share({ message: 'Check out this product!' });
    } catch (error: any) {}
  };

  /* ---------------- API CALLS ---------------- */

  useEffect(() => {
    productreview(product._id).then(res =>
      setReviews(res?.reviews || [])
    );

    productList(product.catId).then(res =>
      setRelatedProducts(res || [])
    );
  }, []);

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <FeatherIcon
        key={i}
        name="star"
        size={14}
        color={i < rating ? COLORS.warning : COLORS.primaryLight}
        style={{ marginRight: 2 }}
      />
    ));

  /* ---------------- UI ---------------- */

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Product Details"
        leftIcon="back"
        rightIcon1="search"
        rightIcon2="cart"
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        
        {/* IMAGE SWIPER */}
        <View
          style={{
            width: '100%',
            height: SIZES.height / 2.3,
            paddingTop: 40,
            backgroundColor: theme.dark
              ? 'rgba(255,255,255,.1)'
              : colors.card,
            paddingBottom: 30,
          }}
        >
          <Swiper loop={false}>
            {product.images?.map((img: string, index: number) => (
              <View key={index}>
                <Image
                  style={{
                    height: '100%',
                    width: '100%',
                    resizeMode: 'contain',
                  }}
                  source={{ uri: img }}
                />
              </View>
            ))}
          </Swiper>
        </View>

        {/* PRODUCT INFO */}
        <View
          style={[
            GlobalStyleSheet.container,
            {
              backgroundColor: theme.dark
                ? 'rgba(255,255,255,.1)'
                : colors.card,
              paddingVertical: 15,
            },
          ]}
        >
          <Text
            style={[
              FONTS.fontMedium,
              { fontSize: 18, color: colors.title },
            ]}
          >
            {product.name}
          </Text>

          <Text
            style={[
              FONTS.fontSemiBold,
              { fontSize: 20, color: COLORS.success },
            ]}
          >
            ₹{product.price}
          </Text>
        </View>

        {/* VARIANTS */}
        {product.variants &&
          Object.keys(product.variants).length > 0 && (
            <View
              style={[
                GlobalStyleSheet.container,
                {
                  backgroundColor: theme.dark
                    ? 'rgba(255,255,255,.1)'
                    : colors.card,
                  marginVertical: 10,
                  paddingVertical: 10,
                },
              ]}
            >
              <Text
                style={[
                  FONTS.fontMedium,
                  { fontSize: 16, color: colors.title },
                ]}
              >
                Select Variant
              </Text>

              {Object.entries(product.variants).map(
                ([key, values]: [string, any]) => (
                  <View key={key} style={{ marginVertical: 10 }}>
                    <Text>{key.toUpperCase()}</Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {values.map((option: string) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() =>
                            handleVariantSelect(key, option)
                          }
                          style={{
                            padding: 8,
                            margin: 5,
                            borderWidth: 1,
                            borderColor:
                              selectedVariants[key] === option
                                ? COLORS.primary
                                : COLORS.primaryLight,
                          }}
                        >
                          <Text>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )
              )}
            </View>
          )}
      </ScrollView>

      {/* BUTTONS */}
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: '50%' }}>
          {!isOutOfStock && (
            <Button
              onPress={addItemToCart}
              title="Add to cart"
              color={COLORS.white}
              text={COLORS.primary}
            />
          )}
        </View>

        <View style={{ width: '50%' }}>
          <Button
            title={isOutOfStock ? 'Out of Stock' : 'Buy Now'}
            color={
              isOutOfStock
                ? COLORS.borderColor
                : COLORS.secondary
            }
            text={COLORS.title}
            disabled={isOutOfStock}
            onPress={handleBuyNow}
          />
        </View>
      </View>
    </View>
  );
};

export default ProductsDetails;
