import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
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
  console.log(product,"============product========")
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
        ...product,          // ✅ FULL PRODUCT OBJECT
        id: product._id,     // ✅ ensure id exists for matching
      })
    );
  }
};


  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        backgroundColor: dark ? 'rgba(255,255,255,.1)' : colors.card,
        borderRightWidth: 1,
        borderRightColor: COLORS.primaryLight,
        borderTopWidth: hascolor || borderTop ? 1 : 0,
        borderTopColor: COLORS.primaryLight,
        paddingBottom: 15,
      }}
    >
      {/* ================= IMAGE / CAROUSEL ================= */}
      <View
        style={{ width: '100%', aspectRatio: 1 }}
        onLayout={(e) => setImageWidth(e.nativeEvent.layout.width)}
      >
        {/* ===== MULTIPLE IMAGES → CAROUSEL ===== */}
        {images.length > 1 && imageWidth > 0 && (
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  width: imageWidth,
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                />
              </View>
            )}
          />
        )}

        {/* ===== SINGLE IMAGE ===== */}
        {images.length === 1 && (
          <View
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={{ uri: images[0] }}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </View>
        )}
      </View>

      {/* ================= LIKE BUTTON ================= */}
      <View style={{ position: 'absolute', right: 0, top: -5 }}>
        <LikeBtn isLiked={isInWishlist} onPress={toggleWishlist} />
      </View>

      {/* ================= CONTENT ================= */}
      <View style={{ paddingHorizontal: hascolor ? 30 : 20, marginTop: 10 }}>
        <Text style={[FONTS.fontMedium, { fontSize: 12, color: COLORS.primary }]}>
          {brand}
        </Text>

        <Text
          numberOfLines={1}
          style={[
            FONTS.fontMedium,
            { fontSize: 12, color: colors.title, marginTop: 5 },
          ]}
        >
          {title}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: 5,
          }}
        >
          <Text style={[FONTS.fontMedium, { fontSize: 14, color: colors.title }]}>
            {price}
          </Text>

          {discount && (
            <Text
              style={[
                FONTS.fontJostLight,
                {
                  fontSize: 12,
                  textDecorationLine: 'line-through',
                  opacity: 0.6,
                },
              ]}
            >
              {discount}
            </Text>
          )}

          {offer && (
            <Text
              style={[
                FONTS.fontRegular,
                { fontSize: 12, color: COLORS.danger },
              ]}
            >
              {offer}
            </Text>
          )}
        </View>
      </View>

      {/* ================= ADD TO CART ================= */}
      {wishlist && (
        <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setShow(!show);
              onPress4?.();
            }}
            style={{
              height: 40,
              borderWidth: 2,
              borderColor: show ? COLORS.primary : COLORS.primaryLight,
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: show ? COLORS.primary : colors.card,
            }}
          >
            <Text
              style={[
                FONTS.fontMedium,
                { fontSize: 14, color: show ? COLORS.card : COLORS.primary },
              ]}
            >
              Add To Cart
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Cardstyle1;
