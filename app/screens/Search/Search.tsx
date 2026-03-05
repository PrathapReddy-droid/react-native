import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Cardstyle1 from '../../components/Card/Cardstyle1';
import { productList } from '../../Api/Product';
import { brandbanner } from '../../Api/Banner';

const Search = () => {
  const theme = useTheme();
  const { colors }: any = theme;
  const navigation = useNavigation<any>();

  const [searchText, setSearchText] = useState('');
  const [brandData, setBrandData] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD BRANDS ================= */
  useEffect(() => {
    brandbanner().then((data) => {
      const brands = data.map((item: any) => ({
        title: item.name,
        image: item.images?.[0],
        _id: item._id,
      }));

      setBrandData(brands);

      // ✅ auto select first brand
      if (brands.length > 0) {
        setSelectedBrand(brands[0]);
      }
    });
  }, []);

  /* ================= LOAD PRODUCTS WHEN BRAND CHANGES ================= */
  useEffect(() => {
    if (!selectedBrand?._id) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const products = await productList(selectedBrand._id);
        console.log(products,"======ssss==============products")
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.log('Product Fetch Error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedBrand]);

  /* ================= SEARCH FILTER ================= */
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredProducts(allProducts);
      return;
    }

    const text = searchText.toLowerCase();

    const filtered = allProducts.filter((item: any) =>
      item?.name?.toLowerCase().includes(text)
    );

    setFilteredProducts(filtered);
  }, [searchText, allProducts]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ================= SEARCH HEADER ================= */}
      <View
        style={{
          padding: 15,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: colors.card,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FeatherIcon name="arrow-left" size={22} color={colors.title} />
        </TouchableOpacity>

        <TextInput
          placeholder="Search products..."
          placeholderTextColor={colors.text}
          value={searchText}
          onChangeText={setSearchText}
          autoFocus
          style={{
            flex: 1,
            height: 45,
            borderRadius: 8,
            paddingHorizontal: 15,
            backgroundColor: theme.dark
              ? 'rgba(255,255,255,.1)'
              : '#F1F1F1',
            color: colors.title,
            fontSize: 16,
          }}
        />
      </View>

      {/* ================= BRAND LIST ================= */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 15, marginTop: 10 }}
      >
        {brandData.map((data, index) => {
          const active = selectedBrand?._id === data._id;

          return (
            <TouchableOpacity
              key={index}
              style={{ alignItems: 'center', marginRight: 20 }}
              onPress={() => setSelectedBrand(data)}
            >
              <View
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: active
                    ? COLORS.primary
                    : COLORS.primaryLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={{ uri: data.image }}
                  style={{ height: 25, width: 25 }}
                />
              </View>
              <Text
                style={[
                  FONTS.fontRegular,
                  {
                    fontSize: 10,
                    marginTop: 5,
                    color: active ? COLORS.primary : colors.title,
                  },
                ]}
              >
                {data.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ================= PRODUCT LIST ================= */}
      <ScrollView>
        <View style={[GlobalStyleSheet.container, { paddingTop: 10 }]}>
          {filteredProducts.length === 0 ? (
            <Text
              style={[
                FONTS.fontMedium,
                { textAlign: 'center', marginTop: 40, color: colors.text },
              ]}
            >
              No products found
            </Text>
          ) : (
            <View style={GlobalStyleSheet.row}>
              {filteredProducts.map((item: any, index: number) => (
                
                <View
                  key={index}
                  style={[GlobalStyleSheet.col50, { marginBottom: 15 }]}
                >
        <Cardstyle1
  product={item}               // ✅ FULL DATA OBJECT

  onPress={() =>
    navigation.navigate('ProductsDetails', {
      product: item,
    })
  }
/>

                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Search;
