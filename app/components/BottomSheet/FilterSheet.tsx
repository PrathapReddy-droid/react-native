import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';
import Button from '../Button/Button';
import ButtonOutline from '../Button/ButtonOutline';
import { useTheme } from '@react-navigation/native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

type Props = {
  sheetRef?: any;
  products: any[]; // all products from API
  onApplyFilters?: (filteredProducts: any[]) => void;
};

const FilterSheet2 = ({ sheetRef, products, onApplyFilters }: Props) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [multiSliderValue, setMultiSliderValue] = useState<[number, number]>([0, 1000]);

  const [brandsData, setBrandsData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<string[]>([]);
  const [sizesData, setSizesData] = useState<string[]>([]);

  // Initialize filter data from products
  useEffect(() => {
    if (!products || products.length === 0) return;

    // Brands
    const brands = Array.from(new Set(products.map(p => p.brand))).map(b => ({ title: b }));
    setBrandsData(brands);

    // Categories
    const categories = Array.from(new Set(products.map(p => p.catName)));
    setCategoriesData(['All', ...categories]);

    // Sizes (from variants)
    const allSizes = products.flatMap(p => p.variants?.size || []);
    const uniqueSizes = Array.from(new Set(allSizes));
    setSizesData(uniqueSizes);

    // Price range
    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setPriceRange([minPrice, maxPrice]);
    setMultiSliderValue([minPrice, maxPrice]);

    // Default brand
    setSelectedBrand(brands[0]);
  }, [products]);

  // MultiSlider change
  const multiSliderValuesChange = (values: any) => setMultiSliderValue(values);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...products];

    if (selectedBrand?.title) {
      filtered = filtered.filter(p => p.brand === selectedBrand.title);
    }

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.catName === selectedCategory);
    }

    if (selectedSize) {
      filtered = filtered.filter(p => (p.variants?.size || []).includes(selectedSize));
    }

    if (multiSliderValue.length === 2) {
      filtered = filtered.filter(
        p => p.price >= multiSliderValue[0] && p.price <= multiSliderValue[1]
      );
    }

    if (onApplyFilters) onApplyFilters(filtered);
    sheetRef.current.close();
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedBrand(brandsData[0]);
    setSelectedCategory('All');
    setSelectedSize(null);
    setMultiSliderValue(priceRange);
    if (onApplyFilters) onApplyFilters(products);
    sheetRef.current.close();
  };

  return (
    <View style={[GlobalStyleSheet.container, { paddingTop: 0, backgroundColor: theme.dark ? colors.background : colors.card }]}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10, paddingTop: 10, marginHorizontal: -15, paddingHorizontal: 15 }}>
        <Text style={[FONTS.fontMedium, { color: colors.title, fontSize: 16 }]}>Filters</Text>
        <TouchableOpacity style={{ height: 38, width: 38, backgroundColor: colors.card, borderRadius: 38, alignItems: 'center', justifyContent: 'center' }} onPress={() => sheetRef.current.close()}>
          <Text style={{ color: colors.title, fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ paddingHorizontal: 15 }}>
        {/* Brand */}
        <Text style={[FONTS.fontMedium, { color: colors.title, fontSize: 15, marginTop: 15 }]}>Brand</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
          {brandsData.map((b, i) => (
            <TouchableOpacity key={i} onPress={() => setSelectedBrand(b)} style={{ paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: selectedBrand?.title === b.title ? COLORS.primary : COLORS.primaryLight, borderRadius: 8 }}>
              <Text style={{ color: selectedBrand?.title === b.title ? COLORS.primary : colors.title }}>{b.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <Text style={[FONTS.fontMedium, { color: colors.title, fontSize: 15, marginTop: 15 }]}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
          {categoriesData.map((c, i) => (
            <TouchableOpacity key={i} onPress={() => setSelectedCategory(c)} style={{ paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: selectedCategory === c ? COLORS.primary : COLORS.primaryLight, borderRadius: 8 }}>
              <Text style={{ color: selectedCategory === c ? COLORS.primary : colors.title }}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Size */}
        <Text style={[FONTS.fontMedium, { color: colors.title, fontSize: 15, marginTop: 15 }]}>Size</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
          {sizesData.map((s, i) => (
            <TouchableOpacity key={i} onPress={() => setSelectedSize(s)} style={{ paddingHorizontal: 15, paddingVertical: 8, borderWidth: 1, borderColor: selectedSize === s ? COLORS.primary : COLORS.primaryLight, borderRadius: 8 }}>
              <Text style={{ color: selectedSize === s ? COLORS.primary : colors.title }}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Slider */}
        <Text style={[FONTS.fontMedium, { color: colors.title, fontSize: 15, marginTop: 15 }]}>Price</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text>${multiSliderValue[0]}</Text>
          <Text>${multiSliderValue[1]}</Text>
        </View>
        <MultiSlider
          values={[multiSliderValue[0], multiSliderValue[1]]}
          sliderLength={300}
          selectedStyle={{ backgroundColor: COLORS.primary }}
          containerStyle={{ alignSelf: 'center', marginTop: 10 }}
          onValuesChange={multiSliderValuesChange}
          min={priceRange[0]}
          max={priceRange[1]}
          allowOverlap={false}
          minMarkerOverlapDistance={10}
          markerStyle={{ height: 24, width: 24, borderRadius: 50, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.primary }}
        />

        {/* Buttons */}
        <View style={{ flexDirection: 'row', gap: 10, marginVertical: 20 }}>
          <ButtonOutline title="Reset" text={COLORS.primary} color={COLORS.primaryLight} onPress={resetFilters} />
          <Button title="Apply" text={COLORS.white} color={COLORS.primary} onPress={applyFilters} />
        </View>
      </ScrollView>
    </View>
  );
};

export default FilterSheet2;
