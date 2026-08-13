import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import { COLORS, FONTS } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import ProductRating from '../../screens/Category/ProductRating';

type Props = {
    title: string;
    id: string;
    quantity: string;
    price: string;
    image?: any;

    delevery: string;

    offer?: any;
    brand?: any;
    discount?: any;

    trackorder?: boolean;
    completed?: boolean;
    EditReview?: boolean;

    delivered?: boolean;

    onPress?: () => void;
    onPress2?: () => void;
    onPress3?: () => void;
    onPress4?: () => void;
    onPressReturn?: () => void;
};

const Cardstyle2 = ({
    title,
    id,
    quantity,
    price,
    image,
    delevery,
    offer,
    brand,
    discount,
    trackorder,
    completed,
    delivered,
    onPress,
    onPress2,
    onPress3,
    onPress4,
    onPressReturn,
}: Props) => {

    const theme = useTheme();

    const { colors }: { colors: any } = theme;

    // ---------------------------------------------------------
    // STATUS
    // ---------------------------------------------------------

    const getStatus = () => {

        if (delivered) {
            return {
                text: 'Delivered',
                icon: 'check-circle',
                color: '#16A34A',
                background: '#DCFCE7',
            };
        }

        if (completed) {
            return {
                text: 'Completed',
                icon: 'check-circle',
                color: '#16A34A',
                background: '#DCFCE7',
            };
        }

        return {
            text: 'In Transit',
            icon: 'truck',
            color: COLORS.primary,
            background: COLORS.primaryLight,
        };
    };

    const status = getStatus();

    // ---------------------------------------------------------
    // IMAGE FALLBACK
    // ---------------------------------------------------------

    const hasImage =
        image &&
        typeof image === 'string' &&
        image.length > 0;

    // ---------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,

                    borderColor: theme.dark
                        ? 'rgba(255,255,255,0.08)'
                        : '#E8E8E8',

                    shadowColor: theme.dark
                        ? '#000'
                        : '#000',
                },
            ]}
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <View style={styles.header}>

                <View style={styles.headerLeft}>

                    {/* STATUS */}

                    <View
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor:
                                    status.background,
                            },
                        ]}
                    >

                        <FeatherIcon
                            name={status.icon}
                            size={13}
                            color={status.color}
                        />

                        <Text
                            style={[
                                styles.statusText,
                                {
                                    color: status.color,
                                },
                            ]}
                        >
                            {status.text}
                        </Text>

                    </View>

                    {/* DELIVERY */}

                    <Text
                        style={[
                            styles.deliveryText,
                            {
                                color: colors.text,
                            },
                        ]}
                    >
                        {delevery}
                    </Text>

                </View>

                {/* ARROW */}

                <TouchableOpacity
                    onPress={onPress}
                    activeOpacity={0.7}
                    style={styles.arrowButton}
                >
                    <FeatherIcon
                        name="chevron-right"
                        size={18}
                        color={colors.text}
                    />
                </TouchableOpacity>

            </View>

            {/* ================================================= */}
            {/* PRODUCT */}
            {/* ================================================= */}

            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={styles.productSection}
            >

                {/* IMAGE */}

                <View
                    style={[
                        styles.imageBox,
                        {
                            backgroundColor: theme.dark
                                ? 'rgba(255,255,255,0.05)'
                                : '#F7F7F7',
                        },
                    ]}
                >

                    {hasImage ? (
                        <Image
                            source={{
                                uri: image,
                            }}
                            style={styles.productImage}
                        />
                    ) : (
                        <FeatherIcon
                            name="image"
                            size={30}
                            color={colors.text}
                        />
                    )}

                </View>

                {/* DETAILS */}

                <View style={styles.productDetails}>

                    {/* BRAND */}

                    {brand ? (
                        <Text
                            numberOfLines={1}
                            style={[
                                FONTS.fontMedium,
                                styles.brand,
                                {
                                    color: COLORS.primary,
                                },
                            ]}
                        >
                            {brand}
                        </Text>
                    ) : null}

                    {/* TITLE */}

                    <Text
                        numberOfLines={2}
                        style={[
                            FONTS.fontMedium,
                            styles.title,
                            {
                                color: colors.title,
                            },
                        ]}
                    >
                        {title}
                    </Text>

                    {/* PRICE */}

                    <View style={styles.priceRow}>

                        <Text
                            style={[
                                FONTS.fontMedium,
                                styles.price,
                                {
                                    color: colors.title,
                                },
                            ]}
                        >
                            {price}
                        </Text>

                        {discount ? (
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.discount,
                                    {
                                        color: colors.text,
                                    },
                                ]}
                            >
                                {discount}
                            </Text>
                        ) : null}

                        {offer ? (
                            <View style={styles.offerBadge}>

                                <Text
                                    style={styles.offerText}
                                >
                                    {offer}
                                </Text>

                            </View>
                        ) : null}

                    </View>

                    {/* RATING */}

                    <View style={styles.ratingContainer}>
                        <ProductRating
                            productId={id}
                        />
                    </View>

                </View>

            </TouchableOpacity>

            {/* ================================================= */}
            {/* DIVIDER */}
            {/* ================================================= */}

            <View
                style={[
                    styles.divider,
                    {
                        backgroundColor:
                            theme.dark
                                ? 'rgba(255,255,255,0.08)'
                                : '#EEEEEE',
                    },
                ]}
            />

            {/* ================================================= */}
            {/* ACTIONS */}
            {/* ================================================= */}

            <View style={styles.actions}>

                {/* ================================================= */}
                {/* LEFT */}
                {/* ================================================= */}

                {trackorder ? (

                    <TouchableOpacity
                        onPress={onPress2}
                        activeOpacity={0.7}
                        style={styles.actionButton}
                    >

                        <View
                            style={[
                                styles.actionIcon,
                                {
                                    backgroundColor:
                                        theme.dark
                                            ? 'rgba(255,255,255,0.08)'
                                            : '#EEF4FF',
                                },
                            ]}
                        >

                            <FeatherIcon
                                name="truck"
                                size={15}
                                color={COLORS.primary}
                            />

                        </View>

                        <Text
                            style={[
                                styles.actionText,
                                {
                                    color: colors.title,
                                },
                            ]}
                        >
                            Track Order
                        </Text>

                    </TouchableOpacity>

                ) : completed ? (

                    <TouchableOpacity
                        onPress={onPress3}
                        activeOpacity={0.7}
                        style={styles.actionButton}
                    >

                        <View
                            style={[
                                styles.actionIcon,
                                {
                                    backgroundColor:
                                        theme.dark
                                            ? 'rgba(255,172,95,0.12)'
                                            : '#FFF7ED',
                                },
                            ]}
                        >

                            <FeatherIcon
                                name="star"
                                size={15}
                                color="#F59E0B"
                            />

                        </View>

                        <Text
                            style={[
                                styles.actionText,
                                {
                                    color: colors.title,
                                },
                            ]}
                        >
                            Write Review
                        </Text>

                    </TouchableOpacity>

                ) : (

                    <View style={styles.actionButton}>

                        <View
                            style={[
                                styles.actionIcon,
                                {
                                    backgroundColor:
                                        theme.dark
                                            ? 'rgba(255,255,255,0.08)'
                                            : '#F5F5F5',
                                },
                            ]}
                        >

                            <FeatherIcon
                                name="package"
                                size={15}
                                color={colors.text}
                            />

                        </View>

                        <Text
                            style={[
                                styles.quantityText,
                                {
                                    color: colors.text,
                                },
                            ]}
                        >
                            Qty: {quantity}
                        </Text>

                    </View>
                )}

                {/* ================================================= */}
                {/* RIGHT */}
                {/* ================================================= */}

                {delivered ? (

                    <TouchableOpacity
                        onPress={onPressReturn}
                        activeOpacity={0.7}
                        style={[
                            styles.actionButton,
                            styles.rightAction,
                        ]}
                    >

                        <View
                            style={[
                                styles.actionIcon,
                                {
                                    backgroundColor:
                                        theme.dark
                                            ? 'rgba(245,158,11,0.12)'
                                            : '#FFF7ED',
                                },
                            ]}
                        >

                            <FeatherIcon
                                name="rotate-ccw"
                                size={15}
                                color="#F59E0B"
                            />

                        </View>

                        <Text
                            style={[
                                styles.actionText,
                                {
                                    color: '#F59E0B',
                                },
                            ]}
                        >
                            Return Order
                        </Text>

                    </TouchableOpacity>

                ) : trackorder ? (

                    <TouchableOpacity
                        onPress={onPress4}
                        activeOpacity={0.7}
                        style={[
                            styles.actionButton,
                            styles.rightAction,
                        ]}
                    >

                        <View
                            style={[
                                styles.actionIcon,
                                {
                                    backgroundColor:
                                        theme.dark
                                            ? 'rgba(239,68,68,0.12)'
                                            : '#FEF2F2',
                                },
                            ]}
                        >

                            <FeatherIcon
                                name="x"
                                size={15}
                                color={COLORS.danger}
                            />

                        </View>

                        <Text
                            style={[
                                styles.actionText,
                                {
                                    color: COLORS.danger,
                                },
                            ]}
                        >
                            Cancel Order
                        </Text>

                    </TouchableOpacity>

                ) : (

                    <TouchableOpacity
                        onPress={onPress3}
                        activeOpacity={0.7}
                        style={[
                            styles.actionButton,
                            styles.rightAction,
                        ]}
                    >

                        <View
                            style={[
                                styles.actionIcon,
                                {
                                    backgroundColor:
                                        theme.dark
                                            ? 'rgba(255,172,95,0.12)'
                                            : '#FFF7ED',
                                },
                            ]}
                        >

                            <FeatherIcon
                                name="star"
                                size={15}
                                color="#F59E0B"
                            />

                        </View>

                        <Text
                            style={[
                                styles.actionText,
                                {
                                    color: colors.title,
                                },
                            ]}
                        >
                            Write Review
                        </Text>

                    </TouchableOpacity>
                )}

            </View>

        </View>
    );
};

const styles = StyleSheet.create({

    // =========================================================
    // CARD
    // =========================================================

    card: {
        marginHorizontal: 15,
        marginBottom: 14,

        borderRadius: 16,
        borderWidth: 1,

        overflow: 'hidden',

        shadowOffset: {
            width: 0,
            height: 3,
        },

        shadowOpacity: 0.08,
        shadowRadius: 8,

        elevation: 3,
    },

    // =========================================================
    // HEADER
    // =========================================================

    header: {
        minHeight: 48,

        paddingHorizontal: 14,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: 10,
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: 5,

        paddingHorizontal: 9,
        paddingVertical: 5,

        borderRadius: 20,
    },

    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },

    deliveryText: {
        fontSize: 11,
        opacity: 0.65,
    },

    arrowButton: {
        width: 30,
        height: 30,

        borderRadius: 15,

        alignItems: 'center',
        justifyContent: 'center',
    },

    // =========================================================
    // PRODUCT
    // =========================================================

    productSection: {
        flexDirection: 'row',

        paddingHorizontal: 14,
        paddingBottom: 14,
    },

    imageBox: {
        width: 105,
        height: 105,

        borderRadius: 13,

        alignItems: 'center',
        justifyContent: 'center',

        overflow: 'hidden',
    },

    productImage: {
        width: '92%',
        height: '92%',

        resizeMode: 'contain',
    },

    productDetails: {
        flex: 1,

        marginLeft: 13,

        paddingTop: 2,
    },

    brand: {
        fontSize: 11,

        marginBottom: 4,
    },

    title: {
        fontSize: 14,

        lineHeight: 19,

        paddingRight: 5,
    },

    priceRow: {
        flexDirection: 'row',

        alignItems: 'center',

        flexWrap: 'wrap',

        gap: 7,

        marginTop: 7,
    },

    price: {
        fontSize: 15,
    },

    discount: {
        fontSize: 11,

        textDecorationLine: 'line-through',

        opacity: 0.55,
    },

    offerBadge: {
        paddingHorizontal: 6,
        paddingVertical: 3,

        borderRadius: 5,

        backgroundColor: '#FEF2F2',
    },

    offerText: {
        fontSize: 10,

        color: COLORS.danger,

        fontWeight: '600',
    },

    ratingContainer: {
        marginTop: 5,

        flexDirection: 'row',

        alignItems: 'center',
    },

    // =========================================================
    // DIVIDER
    // =========================================================

    divider: {
        height: 1,

        marginHorizontal: 14,
    },

    // =========================================================
    // ACTIONS
    // =========================================================

    actions: {
        minHeight: 56,

        paddingHorizontal: 14,

        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'space-between',
    },

    actionButton: {
        flexDirection: 'row',

        alignItems: 'center',

        gap: 7,

        minWidth: 110,
    },

    rightAction: {
        justifyContent: 'flex-end',
    },

    actionIcon: {
        width: 30,
        height: 30,

        borderRadius: 15,

        alignItems: 'center',
        justifyContent: 'center',
    },

    actionText: {
        fontSize: 12,

        fontWeight: '600',
    },

    quantityText: {
        fontSize: 12,

        fontWeight: '500',
    },

});

export default Cardstyle2;