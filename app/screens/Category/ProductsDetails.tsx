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
  StyleSheet,
} from 'react-native';
import Header from '../../layout/Header';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Swiper from 'react-native-swiper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch } from 'react-redux';
import { addToCart, setBuyNowItem } from '../../redux/reducer/cartReducer';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import { productList, productreview } from '../../Api/Product';

type ProductsDetailsScreenProps = StackScreenProps<RootStackParamList, 'ProductsDetails'>;

const ProductsDetails = ({ navigation }: ProductsDetailsScreenProps) => {
  const route = useRoute();
  const { product } = route.params as any;

  const isOutOfStock = product?.countInStock <= 0;

  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [wishListed, setWishListed] = useState(false);

  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const dispatch = useDispatch();

  /* ---------------- QUANTITY CONTROLS ---------------- */

  const incrementQty = () => {
    if (quantity < (product?.countInStock || 99)) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  /* ---------------- VARIANT SELECT ---------------- */

  const handleVariantSelect = (variantType: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantType]: option }));
  };

  /* ---------------- VARIANT VALIDATION ---------------- */

  const validateVariants = (): boolean => {
    if (
      product.variants &&
      Object.keys(product.variants).some(
        key => product.variants[key]?.length > 0 && !selectedVariants[key]
      )
    ) {
      Alert.alert('Select Variant', 'Please select all required variants.');
      return false;
    }
    return true;
  };

  /* ---------------- ADD TO CART ---------------- */

  const addItemToCart = () => {
    if (!validateVariants()) return;

    dispatch(
      addToCart({
        product,
        selectedVariants, // reducer reads this as selectedVariant key
        quantity,         // ✅ quantity sent
      })
    );

    navigation.navigate('MyCart');
  };

  /* ---------------- BUY NOW ---------------- */

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (!validateVariants()) return;

    dispatch(
      setBuyNowItem({
        product,
        selectedVariant: selectedVariants, // ✅ matches reducer key
        quantity,                          // ✅ quantity sent — reducer now reads this
      })
    );

    navigation.navigate('DeleveryAddress');
  };

  /* ---------------- WISHLIST ---------------- */

  const handleWishlist = () => {
    console.log(product,"=========================wwwww")
    setWishListed(w => !w);
    dispatch(addTowishList({ ...product }));
  };

  /* ---------------- SHARE ---------------- */

  const onShare = async () => {
    try {
      await Share.share({ message: `Check out ${product.name}!` });
    } catch (error: any) {}
  };

  /* ---------------- API CALLS ---------------- */

  useEffect(() => {
    productreview(product._id).then(res => setReviews(res?.reviews || []));
    productList(product.catId);
  }, []);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, i) => (
      <FeatherIcon
        key={i}
        name="star"
        size={14}
        color={i < Math.round(rating) ? COLORS.warning : COLORS.primaryLight}
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

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>

        {/* ── IMAGE SWIPER ── */}
        <View
          style={{
            width: '100%',
            height: SIZES.height / 2.3,
            paddingTop: 40,
            backgroundColor: theme.dark ? 'rgba(255,255,255,.08)' : colors.card,
            paddingBottom: 30,
          }}
        >
          <View style={styles.floatingActions}>
            <TouchableOpacity onPress={handleWishlist} style={styles.floatingBtn}>
              <FeatherIcon
                name="heart"
                size={18}
                color={wishListed ? COLORS.danger : colors.title}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} style={styles.floatingBtn}>
              <FeatherIcon name="share-2" size={18} color={colors.title} />
            </TouchableOpacity>
          </View>

          <Swiper loop={false} dotStyle={styles.dot} activeDotStyle={styles.activeDot}>
            {product.images?.map((img: string, index: number) => (
              <View key={index}>
                <Image
                  style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                  source={{ uri: img }}
                />
              </View>
            ))}
          </Swiper>
        </View>

        {/* ── PRODUCT INFO CARD ── */}
        <View style={[styles.card, { backgroundColor: theme.dark ? 'rgba(255,255,255,.08)' : colors.card }]}>

          <Text style={[FONTS.fontMedium, { fontSize: 19, color: colors.title, marginBottom: 6 }]}>
            {product.name}
          </Text>

          {reviews.length > 0 && (
            <View style={styles.ratingRow}>
              {renderStars(averageRating)}
              <Text style={[FONTS.fontRegular, { fontSize: 12, color: colors.text, marginLeft: 6 }]}>
                ({reviews.length} reviews)
              </Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={[FONTS.fontBold, { fontSize: 24, color: COLORS.success }]}>
              ₹{product.price}
            </Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={[styles.stockBadge, { backgroundColor: isOutOfStock ? '#FFF0F0' : '#F0FFF4' }]}>
            <View style={[styles.stockDot, { backgroundColor: isOutOfStock ? COLORS.danger : COLORS.success }]} />
            <Text style={{ fontSize: 12, color: isOutOfStock ? COLORS.danger : COLORS.success, ...FONTS.fontMedium }}>
              {isOutOfStock ? 'Out of Stock' : `In Stock (${product.countInStock} left)`}
            </Text>
          </View>
        </View>

        {/* ── VARIANTS — only shown when at least one key has options ── */}
        {product.variants &&
          Object.values(product.variants).some(
            (v: any) => Array.isArray(v) && v.length > 0
          ) && (
            <View style={[styles.card, { backgroundColor: theme.dark ? 'rgba(255,255,255,.08)' : colors.card }]}>
              <Text style={[FONTS.fontSemiBold, { fontSize: 15, color: colors.title, marginBottom: 10 }]}>
                Select Variants
              </Text>

              {Object.entries(product.variants)
                .filter(([, values]: [string, any]) => Array.isArray(values) && values.length > 0)
                .map(([key, values]: [string, any]) => (
                  <View key={key} style={{ marginBottom: 14 }}>
                    <Text style={[FONTS.fontMedium, {
                      fontSize: 13, color: colors.text, marginBottom: 8,
                      textTransform: 'uppercase', letterSpacing: 0.8,
                    }]}>
                      {key}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {values.map((option: string) => {
                        const selected = selectedVariants[key] === option;
                        return (
                          <TouchableOpacity
                            key={option}
                            onPress={() => handleVariantSelect(key, option)}
                            style={[styles.variantChip, selected && styles.variantChipSelected]}
                          >
                            <Text style={[styles.variantChipText, selected && styles.variantChipTextSelected]}>
                              {option}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
            </View>
          )}

        {/* ── QUANTITY SELECTOR — hidden when out of stock ── */}
        {!isOutOfStock && (
          <View style={[styles.card, { backgroundColor: theme.dark ? 'rgba(255,255,255,.08)' : colors.card }]}>
            <View style={styles.qtyRow}>
              <Text style={[FONTS.fontSemiBold, { fontSize: 15, color: colors.title }]}>
                Quantity
              </Text>

              <View style={styles.qtyControls}>
                <TouchableOpacity
                  onPress={decrementQty}
                  disabled={quantity <= 1}
                  style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                >
                  <FeatherIcon
                    name="minus"
                    size={16}
                    color={quantity <= 1 ? COLORS.primaryLight : COLORS.primary}
                  />
                </TouchableOpacity>

                <View style={styles.qtyDisplay}>
                  <Text style={[FONTS.fontBold, { fontSize: 16, color: colors.title }]}>
                    {quantity}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={incrementQty}
                  disabled={quantity >= (product?.countInStock || 99)}
                  style={[
                    styles.qtyBtn,
                    quantity >= (product?.countInStock || 99) && styles.qtyBtnDisabled,
                  ]}
                >
                  <FeatherIcon
                    name="plus"
                    size={16}
                    color={quantity >= (product?.countInStock || 99) ? COLORS.primaryLight : COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Live subtotal */}
            <View style={styles.subtotalRow}>
              <Text style={[FONTS.fontRegular, { fontSize: 13, color: colors.text }]}>
                Subtotal
              </Text>
              <Text style={[FONTS.fontBold, { fontSize: 16, color: COLORS.success }]}>
                ₹{(product.price * quantity).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* ── DESCRIPTION ── */}
        {product.description && (
          <View style={[styles.card, { backgroundColor: theme.dark ? 'rgba(255,255,255,.08)' : colors.card }]}>
            <Text style={[FONTS.fontSemiBold, { fontSize: 15, color: colors.title, marginBottom: 8 }]}>
              Description
            </Text>
            <Text style={[FONTS.fontRegular, { fontSize: 13, color: colors.text, lineHeight: 20 }]}>
              {product.description}
            </Text>
          </View>
        )}

        {/* ── REVIEWS ── */}
        {reviews.length > 0 && (
          <View style={[styles.card, { backgroundColor: theme.dark ? 'rgba(255,255,255,.08)' : colors.card }]}>
            <Text style={[FONTS.fontSemiBold, { fontSize: 15, color: colors.title, marginBottom: 12 }]}>
              Customer Reviews
            </Text>
            {reviews.slice(0, 3).map((review: any, i: number) => (
              <View key={i} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>
                      {review.name?.[0]?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[FONTS.fontMedium, { fontSize: 13, color: colors.title }]}>
                      {review.name || 'Anonymous'}
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                </View>
                {review.comment && (
                  <Text style={[FONTS.fontRegular, { fontSize: 12, color: colors.text, marginTop: 6, lineHeight: 18 }]}>
                    {review.comment}
                  </Text>
                )}
                {i < reviews.slice(0, 3).length - 1 && <View style={styles.reviewDivider} />}
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* ── BOTTOM ACTION BUTTONS ── */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        {!isOutOfStock ? (
          <>
            <TouchableOpacity
              onPress={addItemToCart}
              style={[styles.cartButton, { borderColor: COLORS.primary }]}
            >
              <FeatherIcon name="shopping-cart" size={18} color={COLORS.primary} />
              <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: COLORS.primary, marginLeft: 8 }]}>
                Add to Cart
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleBuyNow} style={styles.buyButton}>
              <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: COLORS.white }]}>
                Buy Now
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.outOfStockBar}>
            <FeatherIcon name="x-circle" size={18} color={COLORS.danger} />
            <Text style={[FONTS.fontSemiBold, { fontSize: 15, color: COLORS.danger, marginLeft: 8 }]}>
              Out of Stock
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

/* ── STYLES ── */

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
  floatingActions: {
    position: 'absolute',
    top: 12,
    right: 14,
    zIndex: 10,
    flexDirection: 'row',
    gap: 10,
  },
  floatingBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  dot: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 18,
    height: 6,
    borderRadius: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  originalPrice: {
    fontSize: 15,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    color: COLORS.warning,
    fontWeight: '700',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  variantChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    backgroundColor: 'transparent',
  },
  variantChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  variantChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  variantChipTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: {
    borderColor: COLORS.primaryLight,
  },
  qtyDisplay: {
    width: 48,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: COLORS.primaryLight,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLight + '50',
  },
  reviewItem: {
    marginBottom: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: COLORS.primaryLight + '40',
    marginVertical: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    gap: 10,
  },
  cartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
  },
  buyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
  },
  outOfStockBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
  },
});

export default ProductsDetails;
