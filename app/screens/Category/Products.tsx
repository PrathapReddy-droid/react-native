import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTheme, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
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

const PER_PAGE = 10;

const Products = ({ navigation }: ProductsScreenProps) => {
  const dispatch = useDispatch();
  const route = useRoute<any>();
  const product = route?.params?.product;
  const showBrandList = !product?._id;

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  // ── Product data ───────────────────────────────────
  const [cardgridData, setCardgridData] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [brandData, setBrandData] = useState<any[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  // ── Pagination ─────────────────────────────────────
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  // currentBrandId ref so loadMore always uses latest brand
  const currentBrandIdRef = useRef<string | null>(null);
  // ──────────────────────────────────────────────────

  // ── Filter states ──────────────────────────────────
  const [filterVisible, setFilterVisible] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [activeBrand, setActiveBrand] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [multiSliderValue, setMultiSliderValue] = useState<[number, number]>([0, 1000]);
  // ──────────────────────────────────────────────────

  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  // ── Fetch first page for a brand ──────────────────
  const fetchProducts = useCallback((brandId: string) => {
    setSelectedBrandId(brandId);
    currentBrandIdRef.current = brandId;

    // Reset pagination & data
    setPage(1);
    setHasMore(true);
    setCardgridData([]);
    setAllProducts([]);
    setInitialLoading(true);

    productList(brandId, 1, PER_PAGE)
      .then((data: any) => {
        const items = data || [];
        setAllProducts(items);
        setCardgridData(items);
        initializeFilters(items);
        setPage(1);
        if (items.length < PER_PAGE) setHasMore(false);
      })
      .finally(() => setInitialLoading(false));
  }, []);
  // ──────────────────────────────────────────────────

  // ── Load next page (append) ────────────────────────
  const loadMoreProducts = useCallback(() => {
    const brandId = currentBrandIdRef.current;
    if (!brandId || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    productList(brandId, nextPage, PER_PAGE)
      .then((data: any) => {
        const items = data || [];
        if (items.length === 0 || items.length < PER_PAGE) {
          setHasMore(false);
        }
        if (items.length > 0) {
          setAllProducts(prev => [...prev, ...items]);
          setCardgridData(prev => [...prev, ...items]);
          setPage(nextPage);
        }
      })
      .finally(() => setLoadingMore(false));
  }, [page, loadingMore, hasMore]);
  // ──────────────────────────────────────────────────

  // ── Fetch brands on mount ─────────────────────────
  useEffect(() => {
    brandbanner().then((data) => {
      const mapped = data.map((item: any) => ({
        title: item.name,
        image: item.images[0],
        _id: item._id,
      }));
      setBrandData(mapped);

      const initialId = product?._id || (mapped.length > 0 ? mapped[0]._id : null);
      if (initialId) fetchProducts(initialId);
    });
  }, []);
  // ──────────────────────────────────────────────────

  // ── Build filter options from loaded products ─────
  const initializeFilters = (products: any[]) => {
    if (!products || products.length === 0) return;

    const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).map(b => ({ title: b }));
    setBrands(uniqueBrands);
    setActiveBrand(uniqueBrands[0] || null);

    const uniqueCategories = Array.from(new Set(products.map(p => p.catName))).filter(Boolean);
    setCategories(['All', ...uniqueCategories]);
    setActiveCategory('All');

    const allSizes = products.flatMap(p => p.variants?.map((v: any) => v.size) || []);
    setSizes(Array.from(new Set(allSizes)));
    setActiveSize(null);

    const prices = products.map(p => p.price || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setPriceRange([minPrice, maxPrice]);
    setMultiSliderValue([minPrice, maxPrice]);
  };
  // ──────────────────────────────────────────────────

  // ── Apply / Reset filters (client-side) ──────────
  // Note: filters apply on top of ALL loaded products.
  // Pagination still continues fetching in the background.
  const applyFilters = () => {
    let filtered = [...allProducts];
    if (activeBrand?.title) filtered = filtered.filter(p => p.brand === activeBrand.title);
    if (activeCategory && activeCategory !== 'All') filtered = filtered.filter(p => p.catName === activeCategory);
    if (activeSize) filtered = filtered.filter(p => (p.variants?.map((v: any) => v.size) || []).includes(activeSize));
    filtered = filtered.filter(p => p.price >= multiSliderValue[0] && p.price <= multiSliderValue[1]);
    setCardgridData(filtered);
    setFilterVisible(false);
  };

  const resetFilters = () => {
    setActiveBrand(brands[0] || null);
    setActiveCategory('All');
    setActiveSize(null);
    setMultiSliderValue(priceRange);
    setCardgridData(allProducts);
    setFilterVisible(false);
  };
  // ──────────────────────────────────────────────────

  // ── Render each product card ───────────────────────
  const renderItem = useCallback(({ item: data }: { item: any }) => (
    <View style={{ width: '50%', paddingHorizontal: 0 }}>
      <Cardstyle1
        product={data}
        onPress={() => navigation.navigate('ProductsDetails', { product: data })}
        onPress3={() => addItemToWishList(data)}
      />
    </View>
  ), [navigation]);
  // ──────────────────────────────────────────────────

  // ── Footer: spinner while loading more ────────────
  const ListFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator color={COLORS.primary} size="small" />
      </View>
    );
  }, [loadingMore]);
  // ──────────────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title={product?.title || 'Products'}
        leftIcon="back"
        titleLeft
        rightIcon1="search"
        rightIcon2="cart"
      />

      {/* ── Filter Bar ── */}
      <View style={{ backgroundColor: colors.card, height: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', height: 40 }}
          >
            <Image style={{ height: 16, width: 16 }} source={IMAGES.filter3} />
            <Text style={[FONTS.fontMedium, { marginLeft: 5 }]}>FILTER</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Brand Selector Row ── */}
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
                    <View style={{
                      height: 40, width: 40, borderRadius: 20, borderWidth: 1,
                      borderColor: isActive ? COLORS.primary : COLORS.primaryLight,
                      backgroundColor: isActive ? COLORS.primaryLight : 'transparent',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
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

      {/* ── Initial loading spinner ── */}
      {initialLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        /* ── Product Grid with pagination ── */
        <FlatList
          data={cardgridData}
          keyExtractor={(item: any, index) => item._id ? `${item._id}-${index}` : `${index}`}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 0 }}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          onEndReached={loadMoreProducts}  // ← triggers when 50% from bottom
          ListFooterComponent={ListFooter}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: colors.title, ...FONTS.fontRegular }}>No products found</Text>
            </View>
          }
        />
      )}

      {/* ── Filter Bottom Sheet ── */}
      {filterVisible && (
        <View style={{
          position: 'absolute', bottom: 0, width: '100%', maxHeight: '80%',
          backgroundColor: theme.dark ? colors.background : colors.card,
          borderTopLeftRadius: 15, borderTopRightRadius: 15,
          padding: 15, zIndex: 1000,
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
                    height: 45, width: 45, borderRadius: 50, borderWidth: 1,
                    borderColor: activeBrand?.title === b.title ? COLORS.primary : COLORS.primaryLight,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ color: activeBrand?.title === b.title ? COLORS.primary : colors.title, fontSize: 10 }}>
                      {b.title}
                    </Text>
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
                    paddingHorizontal: 15, paddingVertical: 5, borderWidth: 1,
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
                    paddingHorizontal: 15, paddingVertical: 5, borderWidth: 1,
                    borderColor: COLORS.primaryLight,
                    backgroundColor: activeSize === s ? COLORS.primary : 'transparent',
                  }}
                >
                  <Text style={{ color: activeSize === s ? COLORS.white : colors.title }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price Range */}
            <Text style={{ ...FONTS.fontMedium, marginBottom: 5, color: colors.title }}>Price</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ borderWidth: 1, borderColor: COLORS.primaryLight, padding: 5, color: colors.title }}>
                ${multiSliderValue[0]}
              </Text>
              <Text style={{ borderWidth: 1, borderColor: COLORS.primaryLight, padding: 5, color: colors.title }}>
                ${multiSliderValue[1]}
              </Text>
            </View>
            <MultiSlider
              values={multiSliderValue}
              sliderLength={300}
              min={priceRange[0]}
              max={priceRange[1]}
              onValuesChange={(vals) => setMultiSliderValue(vals as [number, number])}
              selectedStyle={{ backgroundColor: COLORS.primary }}
              markerStyle={{
                height: 24, width: 24, borderRadius: 12,
                backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.primary,
              }}
            />

            {/* Action Buttons */}
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