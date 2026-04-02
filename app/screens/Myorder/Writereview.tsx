import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  Alert,
} from 'react-native';
import Header from '../../layout/Header';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Cardstyle2 from '../../components/Card/Cardstyle2';
import { IMAGES } from '../../constants/Images';
import { getOrder, submitReview } from '../../Api/Product';

/* Enable animation on Android */
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const WriteReview = () => {
  const { colors } = useTheme();

  const [products, setProducts] = useState<any[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await getOrder();

    const mapped = res.data.flatMap((order: any) =>
      order.products.map((p: any) => ({
        productId: p.productId,
        title: p.productTitle,
        image: p.image,
        price: p.price,
      }))
    );

    setProducts(mapped);
  };

  const toggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(prev => (prev === index ? null : index));
    setRating(0);
    setComment('');
  };

  const submit = async (productId: string) => {
    if (!rating || !comment) {
      Alert.alert('Error', 'Please give rating & comment');
      return;
    }

      await submitReview({
        productId,
        rating,
        comment,
      });

      Alert.alert('Success', 'Review submitted');
      setExpandedIndex(null);
    
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Write Review" leftIcon="back" />

      <ScrollView>
        <View style={GlobalStyleSheet.container}>
          {products.map((item, index) => {
            const open = expandedIndex === index;

            return (
              <View key={index} style={{ marginBottom: 15 }}>
                <View
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <Cardstyle2
                    title={item.title}
                    price={`₹${item.price}`}
                    image={item.image}
                    id={item.productId}
                    removebottom
                    onPress={() => toggle(index)}
                  />

                  <TouchableOpacity
                    onPress={() => toggle(index)}
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ ...FONTS.fontMedium, color: COLORS.primary }}>
                      Write Review
                    </Text>
                    <Image
                      source={IMAGES.downArrow}
                      style={{
                        width: 14,
                        height: 14,
                        tintColor: COLORS.primary,
                        transform: [{ rotate: open ? '180deg' : '0deg' }],
                      }}
                    />
                  </TouchableOpacity>
                </View>

                {open && (
                  <View
                    style={{
                      marginTop: 10,
                      padding: 15,
                      borderRadius: 10,
                      backgroundColor: colors.card,
                    }}
                  >
                    {/* ⭐ RATING */}
                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                      {[1, 2, 3, 4, 5].map(num => (
                        <TouchableOpacity
                          key={num}
                          onPress={() => setRating(num)}
                        >
                          <Text
                            style={{
                              fontSize: 26,
                              marginRight: 5,
                              color:
                                num <= rating
                                  ? COLORS.warning
                                  : COLORS.textLight,
                            }}
                          >
                            ★
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* COMMENT */}
                    <TextInput
                      placeholder="Write your review..."
                      placeholderTextColor={COLORS.textLight}
                      multiline
                      value={comment}
                      onChangeText={setComment}
                      style={{
                        borderWidth: 1,
                        borderColor: COLORS.borderColor,
                        borderRadius: 8,
                        padding: 10,
                        minHeight: 80,
                        color: colors.text,
                        marginBottom: 15,
                      }}
                    />

                    {/* SUBMIT */}
                    <TouchableOpacity
                      onPress={() => submit(item.productId)}
                      style={{
                        backgroundColor: COLORS.primary,
                        padding: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          ...FONTS.fontMedium,
                          color: COLORS.white,
                        }}
                      >
                        Submit Review
                      </Text>
                    </TouchableOpacity>
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

export default WriteReview;
