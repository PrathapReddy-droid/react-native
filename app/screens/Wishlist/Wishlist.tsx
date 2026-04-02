import React from 'react';
import { useTheme } from '@react-navigation/native';
import { View, ScrollView, Text } from 'react-native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Cardstyle1 from '../../components/Card/Cardstyle1';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/reducer/cartReducer';
import { COLORS, FONTS } from '../../constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';

type WishlistScreenProps = StackScreenProps<
  RootStackParamList,
  'Wishlist'
>;

const Wishlist = ({ navigation }: WishlistScreenProps) => {
  const wishList = useSelector(
    (state: any) => state.wishList.wishList
  );
  console.log(wishList,"==============================whist")

  const dispatch = useDispatch();
  const { colors } = useTheme();

  const addItemToCart = (product: any) => {
    dispatch(addToCart(product));
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title="My Wishlist"
        leftIcon="back"
        righttitle
        titleLeft
      />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 10,
          justifyContent:
            wishList.length === 0 ? 'center' : 'flex-start',
        }}
      >
        <View
          style={[
            GlobalStyleSheet.container,
            { paddingHorizontal: 0, padding: 0 },
          ]}
        >
          <View style={GlobalStyleSheet.row}>
            {wishList.map((product: any, index: number) => (
              <View
                key={product._id || index}
                style={[
                  GlobalStyleSheet.col50,
                  { marginBottom: 0, paddingHorizontal: 0 },
                ]}
              >
                {/* ✅ PASS FULL PRODUCT OBJECT */}
                <Cardstyle1
                  product={product}
                  wishlist={true}
                  onPress={() =>
                    navigation.navigate('ProductsDetails', {
                      product,
                    })
                  }
              onPress4={() => {
  addItemToCart({
    ...product,
    quantity: product.quantity ?? 1,
  });
  navigation.navigate('ProductsDetails', { product });
}}
                />


              </View>
            ))}
          </View>

          {/* ================= EMPTY STATE ================= */}
          {wishList.length === 0 && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
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
                <FeatherIcon
                  color={COLORS.primary}
                  size={24}
                  name="heart"
                />
              </View>

              <Text
                style={{
                  ...FONTS.h5,
                  color: colors.title,
                  marginBottom: 8,
                }}
              >
                Your Wishlist is Empty!
              </Text>

              <Text
                style={{
                  ...FONTS.fontSm,
                  color: colors.text,
                  textAlign: 'center',
                  paddingHorizontal: 40,
                  marginBottom: 30,
                }}
              >
                Add products to your favourites and shop now.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Wishlist;
