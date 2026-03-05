import React, { useRef, useState, useEffect } from 'react';
import { useTheme, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { IMAGES } from '../../constants/Images';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import Cardstyle1 from '../../components/Card/Cardstyle1';
import Header from '../../layout/Header';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import { useDispatch } from 'react-redux';
import { productList } from '../../Api/Product';
import { brandbanner } from '../../Api/Banner';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Button from '../../components/Button/Button';
import ButtonOutline from '../../components/Button/ButtonOutline';

type ProductsScreenProps = StackScreenProps<RootStackParamList, 'Products'>;

const Products = ({ navigation }: ProductsScreenProps) => {
  const dispatch = useDispatch();
  const route = useRoute<any>();
  const product = route?.params?.product;
  const showBrandList = !product?._id;

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [cardgridData, setcardgridData] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [brandData, setbrandData] = useState<any[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const [filterVisible, setFilterVisible] = useState(false);

  // Dynamic filter states
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [activeBrand, setActiveBrand] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [multiSliderValue, setMultiSliderValue] = useState<[number, number]>([0, 1000]);

  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  const fetchProducts = (brandId: string) => {
    setSelectedBrandId(brandId);
    productList(brandId).then((data) => {
      console.log(cardgridData,data,"===dddd===========calling==========>>>>")
      setAllProducts(data);
      setcardgridData(data);
      initializeFilters(data);
    });
  };

  // Fetch brands and initial products
  useEffect(() => {
    brandbanner().then((data) => {
      const brands = data.map((item: any) => ({
        title: item.name,
        image: item.images[0],
        _id: item._id,
      }));
      setbrandData(brands);

      if (!product?._id && brands.length > 0) fetchProducts(brands[0]._id);
      if (product?._id) fetchProducts(product._id);
    });
  }, []);

  // Initialize dynamic filter options based on products
  const initializeFilters = (products: any[]) => {
    if (!products || products.length === 0) return;

    // Brands
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).map(b => ({ title: b }));
    setBrands(uniqueBrands);
    setActiveBrand(uniqueBrands[0] || null);

    // Categories
    const uniqueCategories = Array.from(new Set(products.map(p => p.catName))).filter(Boolean);
    setCategories(['All', ...uniqueCategories]);
    setActiveCategory('All');

    // Sizes
    const allSizes = products.flatMap(p => p.variants?.map((v: any) => v.size) || []);
    setSizes(Array.from(new Set(allSizes)));
    setActiveSize(null);

    // Price
    const prices = products.map(p => p.price || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setPriceRange([minPrice, maxPrice]);
    setMultiSliderValue([minPrice, maxPrice]);
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...allProducts];

    if (activeBrand?.title) filtered = filtered.filter(p => p.brand === activeBrand.title);
    if (activeCategory && activeCategory !== 'All') filtered = filtered.filter(p => p.catName === activeCategory);
    if (activeSize) filtered = filtered.filter(p => (p.variants?.map((v: any) => v.size) || []).includes(activeSize));
    filtered = filtered.filter(p => p.price >= multiSliderValue[0] && p.price <= multiSliderValue[1]);

    setcardgridData(filtered);
    setFilterVisible(false);
  };

  const resetFilters = () => {
    setActiveBrand(brands[0] || null);
    setActiveCategory('All');
    setActiveSize(null);
    setMultiSliderValue(priceRange);
    setcardgridData(allProducts);
    setFilterVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title={product?.title || 'Products'} leftIcon="back" titleLeft rightIcon1="search" rightIcon2="cart" />

      {/* FILTER BAR */}
      <View style={{ backgroundColor: colors.card, height: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
          >
            <Image style={{ height: 16, width: 16 }} source={IMAGES.filter3} />
            <Text style={[FONTS.fontMedium, { marginLeft: 5 }]}>FILTER</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BRAND LIST */}
      {showBrandList && (
        <View style={{ paddingVertical: 10, backgroundColor: colors.card }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
              {brandData.map((data, index) => {
                const isActive = selectedBrandId === data._id;
                return (
                  <TouchableOpacity
                    key={index}
                    style={{ alignItems: 'center', marginRight: 20 }}
                    onPress={() => fetchProducts(data._id)}
                  >
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: isActive ? COLORS.primary : COLORS.primaryLight,
                        backgroundColor: isActive ? COLORS.primaryLight : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image style={{ height: 22, width: 22, resizeMode: 'contain' }} source={{ uri: data.image }} />
                    </View>
                    <Text style={{ fontSize: 10, marginTop: 6, color: isActive ? COLORS.primary : colors.title }}>
                      {data.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}

      {/* PRODUCTS */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={[GlobalStyleSheet.container, { paddingHorizontal: 0 }]}>
          <View style={GlobalStyleSheet.row}>
            {cardgridData.map((data: any, index) => (
            
              
              <View key={index} style={GlobalStyleSheet.col50}>
                                                  <Cardstyle1
  product={data}               // ✅ FULL DATA OBJECT
  onPress={() =>
    navigation.navigate('ProductsDetails', {
      product: data,            // ✅ SAME FULL DATA
    })
  }
  onPress3={() => addItemToWishList(data)}
/>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FILTER SHEET INLINE */}
      {filterVisible && (
        <View style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          maxHeight: '80%',
          backgroundColor: theme.dark ? colors.background : colors.card,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          padding: 15,
          zIndex: 1000,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>Filters</Text>
            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Image source={IMAGES.close} style={{ width: 18, height: 18, tintColor: colors.title }} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* Brand */}
            <Text style={{ ...FONTS.fontMedium, marginBottom: 5, color: colors.title }}>Brand</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {brands.map((b, i) => (
                <TouchableOpacity key={i} onPress={() => setActiveBrand(b)} style={{ marginRight: 15, alignItems: 'center' }}>
                  <View style={{
                    height: 45,
                    width: 45,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: activeBrand === b ? COLORS.primary : COLORS.primaryLight,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text style={{ color: activeBrand === b ? COLORS.primary : colors.title }}>{b.title}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Category */}
            <Text style={{ ...FONTS.fontMedium, marginBottom: 5, color: colors.title }}>Category</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
              {categories.map((c, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setActiveCategory(c)}
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderColor: COLORS.primaryLight,
                    backgroundColor: activeCategory === c ? COLORS.primary : 'transparent',
                  }}
                >
                  <Text style={{ color: activeCategory === c ? COLORS.white : colors.title }}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Size */}
            <Text style={{ ...FONTS.fontMedium, marginBottom: 5, color: colors.title }}>Size</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
              {sizes.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setActiveSize(s)}
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderColor: COLORS.primaryLight,
                    backgroundColor: activeSize === s ? COLORS.primary : 'transparent',
                  }}
                >
                  <Text style={{ color: activeSize === s ? COLORS.white : colors.title }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price */}
            <Text style={{ ...FONTS.fontMedium, marginBottom: 5, color: colors.title }}>Price</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ borderWidth: 1, borderColor: COLORS.primaryLight, padding: 5 }}>${multiSliderValue[0]}</Text>
              <Text style={{ borderWidth: 1, borderColor: COLORS.primaryLight, padding: 5 }}>${multiSliderValue[1]}</Text>
            </View>
            <MultiSlider
              values={multiSliderValue}
              sliderLength={300}
              min={priceRange[0]}
              max={priceRange[1]}
              onValuesChange={(vals) => setMultiSliderValue(vals as [number, number])}
              selectedStyle={{ backgroundColor: COLORS.primary }}
              markerStyle={{
                height: 24,
                width: 24,
                borderRadius: 12,
                backgroundColor: COLORS.white,
                borderWidth: 2,
                borderColor: COLORS.primary,
              }}
            />

            {/* Buttons */}
            <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 50, gap: 10 }}>
              <ButtonOutline title="Reset" text={COLORS.primary} color={COLORS.primaryLight} onPress={resetFilters} />
              <Button title="Apply" text={COLORS.white} color={COLORS.primary} onPress={applyFilters} />
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Products;
