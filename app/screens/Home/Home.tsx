import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Modal } from 'react-native'
import { useTheme, useRoute, useFocusEffect } from '@react-navigation/native';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Button from '../../components/Button/Button';
import Cardstyle1 from '../../components/Card/Cardstyle1';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import BottomSheet2 from '../Components/BottomSheet2';
import StopWatch from '../../components/StopWatch';
import Swiper from 'react-native-swiper';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import { abs2Databanner, absDatabanner, brandbanner, HomeBanner } from '../../Api/Banner';
import { productList, VideoApi } from '../../Api/Product';
import { WebView } from 'react-native-webview';

const offerData = [
    {
        image: IMAGES.check3,
        title: "Secure Payment",
        text: "We ensure secure payment",
        popupTitle: "100% Secure Payments",
        popupDesc: "All transactions are encrypted with 256-bit SSL security. We support Visa, Mastercard, RuPay, UPI, and Net Banking. Your card details are never stored on our servers.",
    },
    {
        image: IMAGES.technicalsupport,
        title: "Customer Support",
        text: "Call or email us 24/7",
        popupTitle: "We're Here to Help",
        popupDesc: "Reach our support team anytime at support@yourapp.com or call +1 (800) 555-0199. Average response time is under 2 hours, 7 days a week.",
    },
    {
        image: IMAGES.wallet2,
        title: "Flexible Payment",
        text: "Pay with Multiple Credit Card",
        popupTitle: "Flexible Payment Options",
        popupDesc: "Split your purchase into easy EMIs, pay via multiple cards, or use wallet balance. No hidden charges — cancel or modify anytime before shipping.",
    },
]

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

const PER_PAGE = 10; // items per page

const Home = ({ navigation }: HomeScreenProps) => {

    const dispatch = useDispatch();
    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const route = useRoute<any>();
    const moresheet2 = useRef<any>(null);

    const [Select, setSelect] = useState(offerData[0]);
    const [bannerData, setbannerData] = useState([]);
    const [brandData, setbrandData] = useState<any[]>([]);
    const [absData, setabsData] = useState([]);
    const [cardData, setcardData] = useState([]);
    const [videoData, setVideoData] = useState<any[]>([]);
    const [abs2Data, setabs2Data] = useState([]);

    // ── Offer popup modal ──────────────────────────────
    const [offerModalVisible, setOfferModalVisible] = useState(false);
    const [activeOffer, setActiveOffer] = useState<any>(null);
    // ──────────────────────────────────────────────────

    // ── Section 1: Brand filter (first half) ──────────
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [selectedBrandTitle, setSelectedBrandTitle] = useState<string | null>(null);
    const [card2Data, setcard2Data] = useState<any[]>([]);
    const [page2, setPage2] = useState(1);
    const [loadingMore2, setLoadingMore2] = useState(false);
    const [hasMore2, setHasMore2] = useState(true);
    // ──────────────────────────────────────────────────

    // ── Section 2: Arrival filter (second half) ───────
    const [selectedArrivalId, setSelectedArrivalId] = useState<string | null>(null);
    const [selectedArrivalTitle, setArrivalTitle] = useState<string | null>(null);
    const [card3Data, setcard3Data] = useState<any[]>([]);
    const [page3, setPage3] = useState(1);
    const [loadingMore3, setLoadingMore3] = useState(false);
    const [hasMore3, setHasMore3] = useState(true);
    // ──────────────────────────────────────────────────

    // ── Computed halves ────────────────────────────────
    // Math.floor ensures a balanced split e.g. 3 items → [1, 2] instead of [2, 1]
    const halfIndex = Math.floor(brandData.length / 2);
    const firstHalfBrands = brandData.slice(0, halfIndex);
    const secondHalfBrands = brandData.slice(halfIndex);
    // ──────────────────────────────────────────────────

    const addItemToWishList = (data: any) => {
        console.log(data, "========================www")
        dispatch(addTowishList(data));
    }

    // ── Load card2Data with pagination ─────────────────
    const loadCard2Data = (pageNum: number, brandId: string) => {
        if (loadingMore2) return;
        setLoadingMore2(true);
        productList(brandId, pageNum, PER_PAGE)
            .then((data: any) => {
                if (!data || data.length === 0) {
                    setHasMore2(false);
                } else {
                    if (pageNum === 1) {
                        setcard2Data(data);
                    } else {
                        setcard2Data(prev => [...prev, ...data]);
                    }
                    setPage2(pageNum);
                    // If returned less than PER_PAGE, no more pages
                    if (data.length < PER_PAGE) setHasMore2(false);
                }
                setLoadingMore2(false);
            })
            .catch(() => setLoadingMore2(false));
    }

    // ── Load card3Data with pagination ─────────────────
    const loadCard3Data = (pageNum: number, arrivalId: string) => {
        if (loadingMore3) return;
        setLoadingMore3(true);
        productList(arrivalId, pageNum, PER_PAGE)
            .then((data: any) => {
                if (!data || data.length === 0) {
                    setHasMore3(false);
                } else {
                    if (pageNum === 1) {
                        setcard3Data(data);
                    } else {
                        setcard3Data(prev => [...prev, ...data]);
                    }
                    setPage3(pageNum);
                    // If returned less than PER_PAGE, no more pages
                    if (data.length < PER_PAGE) setHasMore3(false);
                }
                setLoadingMore3(false);
            })
            .catch(() => setLoadingMore3(false));
    }
    // ──────────────────────────────────────────────────

    // ── Initial data fetch ─────────────────────────────
    useEffect(() => {
        HomeBanner().then((data) => {
            setbannerData(data.map((item: any) => ({ image: item.images[0] })));
        });
        brandbanner().then((data) => {
            setbrandData(data.map((item: any) => ({
                title: item.name,
                image: item.images[0],
                _id: item._id,
            })));
        });
        absDatabanner().then((data) => {
            setabsData(data.map((item: any) => ({ image: item.images[0] })));
        });
        abs2Databanner().then((data) => {
            setabs2Data(data);
        });
        VideoApi()
            .then((result: any) => {
                if (result?.success && result?.data) setVideoData(result.data);
            })
            .catch((error) => console.log("Error fetching videos:", error));
    }, []);
    // ──────────────────────────────────────────────────

    // ── Set defaults when brandData loads ─────────────
    useEffect(() => {
        if (brandData.length > 0) {
            const half = Math.floor(brandData.length / 2);
            const first = brandData.slice(0, half);
            const second = brandData.slice(half);

            // Always reset to first item of each half when brandData changes
            if (first.length > 0) {
                setSelectedBrandId(first[0]._id);
                setSelectedBrandTitle(first[0].title);
            }
            if (second.length > 0) {
                setSelectedArrivalId(second[0]._id);
                setArrivalTitle(second[0].title);
            }
        }
    }, [brandData]);
    // ──────────────────────────────────────────────────

    // ── Reload card2 when brand selection changes ──────
    useEffect(() => {
        if (selectedBrandId) {
            setHasMore2(true);
            setPage2(1);
            setcard2Data([]);
            loadCard2Data(1, selectedBrandId);
        }
    }, [selectedBrandId]);
    // ──────────────────────────────────────────────────

    // ── Reload card3 when arrival selection changes ────
    useEffect(() => {
        if (selectedArrivalId) {
            setHasMore3(true);
            setPage3(1);
            setcard3Data([]);
            loadCard3Data(1, selectedArrivalId);
        }
    }, [selectedArrivalId]);
    // ──────────────────────────────────────────────────

    useFocusEffect(
        React.useCallback(() => {
            if (route.params?.showLoginSheet) {
                moresheet2.current?.openSheet('SkipLoginSheet');
                navigation.setParams({ showLoginSheet: false } as any);
            }
        }, [route.params])
    );

    return (
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* ── Header ── */}
                <View style={{ height: 60, backgroundColor: COLORS.primary }}>
                    <View style={[GlobalStyleSheet.container, { paddingHorizontal: 20 }]}>
                        <View style={[GlobalStyleSheet.row, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: -5 }}>
                                <TouchableOpacity style={{ margin: 5 }} onPress={() => navigation.openDrawer()}>
                                    <Image style={{ height: 22, width: 22, tintColor: COLORS.card, resizeMode: 'contain' }} source={IMAGES.grid5} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => navigation.navigate('Search')} style={{ height: 35, width: 35, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image style={{ height: 22, width: 22, tintColor: COLORS.card, resizeMode: 'contain' }} source={IMAGES.search} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => moresheet2.current.openSheet('notification')} style={{ height: 35, width: 35, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image style={{ height: 20, width: 20, tintColor: COLORS.card, resizeMode: 'contain' }} source={IMAGES.ball} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ── All Brands Icons Row ── */}
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 0, backgroundColor: colors.card, marginTop: 10 }]}>
                    <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 20, flexGrow: 1 }} showsHorizontalScrollIndicator={false}>
                        {brandData.map((data: any, index) => (
                            <TouchableOpacity
                                activeOpacity={0.5}
                                key={index}
                                style={{ alignItems: 'center', marginRight: 20 }}
                                onPress={() => navigation.navigate('Products', { product: data })}
                            >
                                <View style={{ height: 30, width: 30, borderRadius: 25, borderWidth: 1, borderColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image style={{ height: 20, width: 22.5, resizeMode: 'contain' }} source={{ uri: data.image }} />
                                </View>
                                <Text style={[FONTS.fontRegular, { fontSize: 9, color: colors.title, marginTop: 10 }]}>{data.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* ── Banner Swiper ── */}
                <Swiper
                    autoplay={true}
                    autoplayTimeout={5}
                    height={'auto'}
                    dotStyle={{ height: 6, width: 6, backgroundColor: COLORS.card, opacity: .2 }}
                    activeDotStyle={{ height: 6, width: 6, backgroundColor: COLORS.card }}
                    paginationStyle={{ bottom: 10 }}
                >
                    {bannerData.map((data: any, index) => (
                        <View key={index} style={{ width: '100%', height: 220 }}>
                            <Image source={{ uri: data.image }} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" />
                            <View style={[GlobalStyleSheet.container, { paddingHorizontal: 30, flex: 1, justifyContent: 'center' }]}>
                                <View style={{ width: '50%' }}>
                                    {/* <Button
                                        title="Buy Now"
                                        size="sm"
                                        color={COLORS.white}
                                        text={COLORS.title}
                                        onPress={() => navigation.navigate('ProductsDetails', { product: data })}
                                    /> */}
                                </View>
                            </View>
                        </View>
                    ))}
                </Swiper>

                {/* ── Abs Banner Row ── */}
                <View style={[GlobalStyleSheet.container, { paddingVertical: 0 }]}>
                    <View style={{ marginHorizontal: -15, marginVertical: 10 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {absData.map((data: any, index) => (
                                <View key={index} style={{ marginRight: 10 }}>
                                    <Image style={{ width: 201, height: 110 }} source={{ uri: data?.image }} resizeMode="cover" />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                {/* ── Top Deals ── */}
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 20, backgroundColor: colors.card }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={[FONTS.fontMedium, { fontSize: 18, color: colors.title, marginBottom: 5 }]}>Top Deals Of The Day</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <Text style={[FONTS.fontMedium, { fontSize: 14, color: '#BF0A30' }]}>Offer Ends in</Text>
                                <View><StopWatch /></View>
                            </View>
                        </View>
                        <View>
                            <Image style={{ resizeMode: 'contain', height: 65, width: 115 }} source={IMAGES.ads1} />
                        </View>
                    </View>
                </View>

                {/* ── Top Deals Card List ── */}
                <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {cardData.map((data: any, index: any) => (
                                <View style={{ marginBottom: 0, width: SIZES.width > SIZES.container ? SIZES.container / 3 : SIZES.width / 2.3 }} key={index}>
                                    <Cardstyle1
                                        id={data._id}
                                        title={data.name}
                                        image={data.image}
                                        price={data.price}
                                        offer={data.offer}
                                        color={data.color}
                                        brand={data.brand}
                                        hascolor={data.hascolor}
                                        discount={data.discount}
                                        data={data}
                                        rating={data.rating}
                                        onPress={() => navigation.navigate('ProductsDetails', { product: data })}
                                        onPress3={() => addItemToWishList(data)}
                                    />
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* ── Offer Feature Banners ── */}
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: -15, paddingVertical: 20, paddingBottom: 15 }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                            {offerData.map((data: any, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[{ padding: 10, backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card, borderRadius: 4 }, Select === data && { backgroundColor: COLORS.primary }]}
                                    onPress={() => {
                                        setSelect(data);
                                        setActiveOffer(data);
                                        setOfferModalVisible(true);
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <Image style={{ height: 45, width: 45, tintColor: Select === data ? COLORS.white : COLORS.primary }} source={data.image} />
                                        <View>
                                            <Text style={[FONTS.fontMedium, { fontSize: 15, color: Select === data ? COLORS.white : colors.title }]}>{data.title}</Text>
                                            <Text style={[FONTS.fontRegular, { fontSize: 12, color: Select === data ? COLORS.white : colors.title, opacity: .7 }]}>{data.text}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* ── Brand Filter (First Half) ── */}
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 0, paddingTop: 10 }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 10 }}>
                            {firstHalfBrands.map((data: any) => {
                                const isSelected = selectedBrandId === data._id;
                                return (
                                    <TouchableOpacity
                                        key={data._id}
                                        activeOpacity={0.8}
                                        onPress={() => { setSelectedBrandId(data._id); setSelectedBrandTitle(data.title); }}
                                        style={{
                                            backgroundColor: isSelected ? '#FFE5E5' : colors.card,
                                            height: 35, alignItems: 'center', gap: 5, flexDirection: 'row',
                                            borderRadius: 34, borderWidth: 1,
                                            borderColor: isSelected ? '#FF6B6B' : colors.text,
                                            paddingHorizontal: 8, paddingVertical: 5, marginRight: 10,
                                        }}
                                    >
                                        <Image style={{ width: 15, height: 25, resizeMode: 'contain' }} source={{ uri: data.image }} />
                                        <Text style={{ ...FONTS.fontMedium, fontSize: 13, color: isSelected ? '#FF3B3B' : colors.title }}>{data.title}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>

                {/* ── Section 1 Title ── */}
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 20, backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card, paddingVertical: 5 }]}>
                    <Text style={[FONTS.fontMedium, { fontSize: 18, color: colors.title }]}>{selectedBrandTitle}</Text>
                </View>

                {/* ── card2Data: horizontal paginated list ── */}
                <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                    <FlatList
                        data={card2Data}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item: any, index) => `card2-${item._id || index}`}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            // ✅ Only fetch next page if there are more AND not already loading
                            if (hasMore2 && !loadingMore2 && card2Data.length > 0) {
                                loadCard2Data(page2 + 1, selectedBrandId!);
                            }
                        }}
                        ListFooterComponent={loadingMore2 ? <ActivityIndicator style={{ marginHorizontal: 10 }} color={COLORS.primary} /> : null}
                        renderItem={({ item: data }: any) => (
                            <View style={{ marginBottom: 0, width: SIZES.width > SIZES.container ? SIZES.container / 3 : SIZES.width / 2.3 }}>
                                <Cardstyle1
                                    product={data}
                                    onPress={() => navigation.navigate('ProductsDetails', { product: data })}
                                    onPress3={() => addItemToWishList(data)}
                                />
                            </View>
                        )}
                    />
                </View>

                {/* ── Abs2 Banner Row ── */}
                <View style={[GlobalStyleSheet.container, { paddingVertical: 5 }]}>
                    <View style={{ marginHorizontal: -15, marginVertical: 10 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {abs2Data.map((data: any, index) => (
                                <View key={index} style={{ marginRight: 10 }}>
                                    <Image style={{ width: 201, height: 110 }} resizeMode="cover" source={{ uri: data.images?.[0] }} />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                {/* ── Video Row 1 ── */}
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 20, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: COLORS.primaryLight, paddingVertical: 10 }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5 }}>
                        {videoData.map((video, index) => (
                            <View style={styles.videoContainer} key={video._id || index}>
                                <WebView style={styles.webview} javaScriptEnabled={true} domStorageEnabled={true} source={{ uri: video.live_link }} />
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* ── Brand Filter (Second Half) ── */}
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 0, paddingTop: 15 }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 10 }}>
                            {secondHalfBrands.map((data: any) => {
                                const isSelected = selectedArrivalId === data._id;
                                return (
                                    <TouchableOpacity
                                        key={data._id}
                                        activeOpacity={0.8}
                                        onPress={() => { setSelectedArrivalId(data._id); setArrivalTitle(data.title); }}
                                        style={{
                                            backgroundColor: isSelected ? '#FFE5E5' : colors.card,
                                            height: 35, alignItems: 'center', gap: 5, flexDirection: 'row',
                                            borderRadius: 34, borderWidth: 1,
                                            borderColor: isSelected ? '#FF6B6B' : colors.text,
                                            paddingHorizontal: 8, paddingVertical: 5, marginRight: 10,
                                        }}
                                    >
                                        <Image style={{ width: 15, height: 25, resizeMode: 'contain' }} source={{ uri: data.image }} />
                                        <Text style={{ ...FONTS.fontMedium, fontSize: 13, color: isSelected ? '#FF3B3B' : colors.title }}>{data.title}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>

                {/* ── Section 2 Title ── */}
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 20, backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card, paddingVertical: 5 }]}>
                    <Text style={[FONTS.fontMedium, { fontSize: 18, color: colors.title }]}>{selectedArrivalTitle}</Text>
                </View>

                {/* ── card3Data: 2-column paginated grid ── */}
                <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                    <FlatList
                        data={card3Data}
                        numColumns={2}
                        scrollEnabled={false}
                        keyExtractor={(item: any, index) => `card3-${item._id || index}`}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            // ✅ Only fetch next page if there are more AND not already loading
                            if (hasMore3 && !loadingMore3 && card3Data.length > 0) {
                                loadCard3Data(page3 + 1, selectedArrivalId!);
                            }
                        }}
                        columnWrapperStyle={{ marginTop: 5, borderBottomWidth: 1, borderBottomColor: COLORS.primaryLight, marginBottom: 15 }}
                        ListFooterComponent={loadingMore3 ? <ActivityIndicator style={{ marginVertical: 10 }} color={COLORS.primary} /> : null}
                        renderItem={({ item: data }: any) => (
                            <View style={[GlobalStyleSheet.col50, { marginBottom: 0, paddingHorizontal: 0 }]}>
                                <Cardstyle1
                                    product={data}
                                    onPress={() => navigation.navigate('ProductsDetails', { product: data })}
                                    onPress3={() => addItemToWishList(data)}
                                />
                            </View>
                        )}
                    />
                </View>

                {/* ── Ads / Video Row 2 ── */}
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 20, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: COLORS.primaryLight, paddingVertical: 10 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text style={[FONTS.fontMedium, { fontSize: 18, color: colors.title }]}>Ads</Text>
                        <Text style={[FONTS.fontRegular, { fontSize: 13, color: COLORS.success }]}>Live.</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5 }}>
                        {videoData.map((video, index) => (
                            <View style={styles.videoContainer} key={video._id || index}>
                                <WebView style={styles.webview} javaScriptEnabled={true} domStorageEnabled={true} source={{ uri: video.live_link }} />
                            </View>
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>

            {/* ── Offer Info Modal ── */}
            <Modal
                visible={offerModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setOfferModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setOfferModalVisible(false)}
                >
                    <TouchableOpacity activeOpacity={1} style={[styles.modalCard, { backgroundColor: colors.card }]}>
                        <View style={{ alignItems: 'center', marginBottom: 15 }}>
                            <View style={styles.modalIconWrap}>
                                <Image
                                    style={{ height: 40, width: 40, tintColor: COLORS.primary, resizeMode: 'contain' }}
                                    source={activeOffer?.image}
                                />
                            </View>
                        </View>
                        <Text style={[FONTS.fontMedium, { fontSize: 18, color: colors.title, textAlign: 'center', marginBottom: 10 }]}>
                            {activeOffer?.popupTitle}
                        </Text>
                        <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.text, textAlign: 'center', lineHeight: 20, opacity: .8 }]}>
                            {activeOffer?.popupDesc}
                        </Text>
                        <TouchableOpacity
                            style={styles.modalCloseBtn}
                            onPress={() => setOfferModalVisible(false)}
                        >
                            <Text style={[FONTS.fontMedium, { fontSize: 15, color: COLORS.white }]}>Got it</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <BottomSheet2 ref={moresheet2} />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    videoContainer: {
        width: 200,
        height: 120,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 10,
    },
    webview: {
        flex: 1,
        borderRadius: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    modalCard: {
        width: '100%',
        borderRadius: 16,
        padding: 20,
    },
    modalIconWrap: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,107,107,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCloseBtn: {
        marginTop: 18,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
});