import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import LikeBtn from '../LikeBtn';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTowishList,
  removeFromwishList,
} from '../../redux/reducer/wishListReducer';

type Props = {
  product: any;
  wishlist?: boolean;
  borderTop?: boolean;
  onPress?: () => void;
  onPress4?: () => void;
};

const Cardstyle1 = ({
  product,
  wishlist,
  borderTop,
  onPress,
  onPress4,
}: Props) => {
  console.log(product, "============product========")
  const { colors, dark } = useTheme();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [imageWidth, setImageWidth] = useState(0);

  /* ================= PRODUCT DATA ================= */
  const id = product?._id;
  const title = product?.name;
  const price = product?.price;
  const brand = product?.brand;
  const discount = product?.discount;
  const offer = product?.oldPrice;
  const hascolor = product?.hascolor;

  /* ================= IMAGE NORMALIZATION ================= */
  const images: string[] = Array.isArray(product?.images) && product.images.length
    ? product.images
    : product?.image
      ? [product.image]
      : [];

  /* ================= WISHLIST ================= */
  const wishList = useSelector((state: any) => state.wishList.wishList);

  const isInWishlist = useMemo(
    () => wishList.some((item: any) => item.id === id),
    [wishList, id]
  );

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromwishList(id));
    } else {
      dispatch(
        addTowishList({
          ...product,
          id: product._id,
        })
      );
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: dark ? 'rgba(255,255,255,.1)' : colors.card,
          borderTopWidth: hascolor || borderTop ? 1 : 0,
        }
      ]}
    >
      {/* ── IMAGE AREA ── */}
      <View
        style={styles.imageWrapper}
        onLayout={(e) => setImageWidth(e.nativeEvent.layout.width)}
      >
        {/* MULTIPLE IMAGES → CAROUSEL */}
        {images.length > 1 && imageWidth > 0 && (
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ width: imageWidth, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={{ uri: item }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
              </View>
            )}
          />
        )}

        {/* SINGLE IMAGE */}
        {images.length === 1 && (
          <Image
            source={{ uri: images[0] }}
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
        )}

        {/* DISCOUNT BADGE */}
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>{discount}</Text>
          </View>
        )}
      </View>

      {/* ── LIKE BUTTON ── */}
      <View style={styles.likeBtn}>
        <LikeBtn isLiked={isInWishlist} onPress={toggleWishlist} />
      </View>

      {/* ── CONTENT ── */}
      <View style={styles.content}>
        {brand && (
          <Text style={[FONTS.fontMedium, { fontSize: 10, color: COLORS.primary, letterSpacing: 0.5, textTransform: 'uppercase' }]}>
            {brand}
          </Text>
        )}

        <Text
          numberOfLines={1}
          style={[FONTS.fontMedium, { fontSize: 12, color: colors.title, marginTop: 3 }]}
        >
          {title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[FONTS.fontSemiBold, { fontSize: 14, color: colors.title }]}>
            ₹{price}
          </Text>

          {offer && (
            <Text style={[FONTS.fontRegular, { fontSize: 11, textDecorationLine: 'line-through', color: colors.text, opacity: 0.5 }]}>
              ₹{offer}
            </Text>
          )}
        </View>
      </View>

      {/* ── ADD TO CART (wishlist mode) ── */}
      {wishlist && (
        <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setShow(!show);
              onPress4?.();
            }}
            style={[
              styles.addToCartBtn,
              {
                borderColor: show ? COLORS.primary : COLORS.primaryLight,
                backgroundColor: show ? COLORS.primary : colors.card,
              }
            ]}
          >
            <Text style={[FONTS.fontMedium, { fontSize: 13, color: show ? COLORS.card : COLORS.primary }]}>
              Add To Cart
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Cardstyle1;

const styles = StyleSheet.create({
  card: {
    borderRightWidth: 1,
    borderRightColor: COLORS.primaryLight,
    borderTopColor: COLORS.primaryLight,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  likeBtn: {
    position: 'absolute',
    right: 0,
    top: -5,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  addToCartBtn: {
    height: 38,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
