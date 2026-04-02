// components/ProductRating.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import apiClient from '../../Api/BASEURL';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Review = {
  _id: string;
  rating: string;
  userId: string;
  productId: string;
  review: string;
  userName: string;
  image: string;
  createdAt: string;
};

type Props = {
  productId: string;
};

// ─── ★★★★☆ row ───────────────────────────────────────────────────────────────
const StarRow = ({ rating }: { rating: number }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <FeatherIcon
        key={i}
        name="star"
        size={12}
        color={i <= Math.round(rating) ? '#FFAC5F' : '#ccc'}
      />
    ))}
  </View>
);

// ─── Single review card — stars + text only ───────────────────────────────────
const ReviewCard = ({ item, colors }: { item: Review; colors: any }) => {
  const rating = parseFloat(item.rating || '0');

  return (
    <View
      style={{
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primaryLight,
        gap: 5,
      }}
    >
      <StarRow rating={rating} />
      <Text
        style={[
          FONTS.fontRegular,
          {
            fontSize: 12,
            color: item.review ? colors.text : colors.title,
            opacity: item.review ? 1 : 0.4,
            lineHeight: 18,
          },
        ]}
      >
        {item.review || 'No written review.'}
      </Text>
    </View>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const ProductRating = ({ productId }: Props) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [reviews, setReviews]             = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading]             = useState<boolean>(true);
  const [expanded, setExpanded]           = useState<boolean>(false);

  useEffect(() => {
    if (!productId) return;
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
          const response = await apiClient.get('/api/homeSlides');
      
      const res  = await apiClient.get(`/api/user/getReviews?productId=${productId}`);
      // const data = await res;
      console.log(res,"======================")

      if (res.success && Array.isArray(res.reviews)) {
        setReviews(res.reviews);
        if (res.reviews.length > 0) {
          const total = res.reviews.reduce(
            (sum: number, r: Review) => sum + parseFloat(r.rating || '0'),
            0
          );
          setAverageRating(total / res.reviews.length);
        }
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  if (loading) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 }}>
        <Image style={{ height: 12, width: 64 }} source={IMAGES.star7} />
        <Text style={[FONTS.fontRegular, { fontSize: 12, color: colors.title, opacity: 0.5 }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 2 }}>

      {/* ── Tappable summary row ─────────────────────────────────────────── */}
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.7}
        disabled={reviews.length === 0}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
      >
        {/* <Image style={{ height: 12, width: 64 }} source={IMAGES.star7} /> */}

        <Text style={[FONTS.fontRegular, { fontSize: 12, color: colors.title, opacity: 0.5 }]}>
          {reviews.length > 0
            ? `(${reviews.length} Review${reviews.length > 1 ? 's' : ''})`
            : '(No Reviews)'}
        </Text>

        {reviews.length > 0 && (
          <FeatherIcon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={13}
            color={colors.title}
            style={{ opacity: 0.5 }}
          />
        )}
      </TouchableOpacity>

      {/* ── Accordion: review cards ──────────────────────────────────────── */}
      {expanded && (
        <View style={{ marginTop: 6, borderTopWidth: 1, borderTopColor: COLORS.primaryLight }}>
          {reviews.map((item) => (
            <ReviewCard key={item._id} item={item} colors={colors} />
          ))}
        </View>
      )}

    </View>
  );
};

export default ProductRating;