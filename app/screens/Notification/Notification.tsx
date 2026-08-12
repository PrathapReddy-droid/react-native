import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Image } from 'react-native'
import Header from '../../layout/Header';
import { IMAGES } from '../../constants/Images';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeBox from '../../components/SwipeBox';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';

// ── Notification type icons/colors by category ──────────────
const NOTIF_TYPES: any = {
    order: { icon: 'package', bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
    offer: { icon: 'tag', bg: 'rgba(255,107,107,0.12)', color: '#FF6B6B' },
    wishlist: { icon: 'heart', bg: 'rgba(236,72,153,0.12)', color: '#EC4899' },
    payment: { icon: 'credit-card', bg: 'rgba(34,197,94,0.12)', color: '#22C55E' },
    system: { icon: 'bell', bg: 'rgba(148,163,184,0.15)', color: '#64748B' },
}

const initialNotifications = [
    {
        id: '1',
        type: 'order',
        title: 'Order Shipped',
        message: 'Your order #10234 has shipped and is on its way.',
        time: '10 min ago',
        read: false,
    },
    {
        id: '2',
        type: 'offer',
        title: 'Flash Sale — 50% Off',
        message: 'Kitchen appliances are on sale for the next 24 hours.',
        time: '1 hr ago',
        read: false,
    },
    {
        id: '3',
        type: 'wishlist',
        title: 'Price Drop',
        message: 'An item in your wishlist just dropped in price.',
        time: '3 hrs ago',
        read: true,
    },
    {
        id: '4',
        type: 'payment',
        title: 'Payment Successful',
        message: 'Your payment of $149 for order #10231 was received.',
        time: 'Yesterday',
        read: true,
    },
    {
        id: '5',
        type: 'order',
        title: 'Order Delivered',
        message: 'Your order #10228 was delivered. Enjoy your purchase!',
        time: '2 days ago',
        read: true,
    },
    {
        id: '6',
        type: 'system',
        title: 'Welcome!',
        message: 'Thanks for joining. Explore deals tailored just for you.',
        time: '5 days ago',
        read: true,
    },
]

const Notification = () => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const navigation = useNavigation<any>();

    const [notifications, setNotifications] = useState<any[]>(initialNotifications);

    const deleteItem = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        const arr = [...notifications];
        arr.splice(index, 1);
        setNotifications(arr);
    };

    const clearAll = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setNotifications([]);
    };

    return (
        <View style={{ backgroundColor: theme.dark ? colors.background : colors.card, flex: 1 }}>
            <Header
                title={`Notifications${notifications.length > 0 ? ` (${notifications.length})` : ''}`}
                leftIcon='back'
            />

            {/* ── Clear All bar ── */}
            {notifications.length > 0 && (
                <View style={[GlobalStyleSheet.container, { paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: 'flex-end' }]}>
                    <TouchableOpacity onPress={clearAll} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <FeatherIcon name="trash-2" size={15} color={COLORS.primary} />
                        <Text style={[FONTS.fontMedium, { fontSize: 13, color: COLORS.primary }]}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            )}

            {notifications.length === 0 ? (
                // ── Empty state ──
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
                    <View style={{
                        height: 80, width: 80, borderRadius: 40,
                        backgroundColor: theme.dark ? 'rgba(255,255,255,.08)' : colors.background,
                        alignItems: 'center', justifyContent: 'center', marginBottom: 15,
                    }}>
                        <FeatherIcon name="bell-off" size={32} color={colors.text} />
                    </View>
                    <Text style={[FONTS.fontMedium, { fontSize: 16, color: colors.title, marginBottom: 5 }]}>No Notifications</Text>
                    <Text style={[FONTS.fontRegular, { fontSize: 13, color: colors.text, textAlign: 'center', opacity: .7 }]}>
                        You're all caught up. New updates will show up here.
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                    <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
                        <GestureHandlerRootView>
                            {notifications.map((data, index) => {
                                const meta = NOTIF_TYPES[data.type] || NOTIF_TYPES.system;
                                return (
                                    <SwipeBox
                                        key={data.id}
                                        data={data}
                                        colors={colors}
                                        handleDelete={() => deleteItem(index)}
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => {
                                                if (data.type === 'order') navigation.navigate('MyOrder');
                                                if (data.type === 'wishlist') navigation.navigate('Wishlist');
                                            }}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'flex-start',
                                                paddingHorizontal: 20,
                                                paddingVertical: 14,
                                                borderBottomWidth: 1,
                                                borderBottomColor: theme.dark ? 'rgba(255,255,255,.08)' : colors.border,
                                                backgroundColor: data.read ? 'transparent' : (theme.dark ? 'rgba(255,107,107,.06)' : '#FFF7F7'),
                                            }}
                                        >
                                            <View style={{
                                                height: 42, width: 42, borderRadius: 21,
                                                backgroundColor: meta.bg,
                                                alignItems: 'center', justifyContent: 'center',
                                                marginRight: 12,
                                            }}>
                                                <FeatherIcon name={meta.icon} size={19} color={meta.color} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                    <Text style={[FONTS.fontMedium, { fontSize: 14, color: colors.title, flex: 1 }]}>{data.title}</Text>
                                                    {!data.read && (
                                                        <View style={{ height: 7, width: 7, borderRadius: 4, backgroundColor: COLORS.primary }} />
                                                    )}
                                                </View>
                                                <Text style={[FONTS.fontRegular, { fontSize: 12.5, color: colors.text, opacity: .75, marginTop: 3, lineHeight: 17 }]}>
                                                    {data.message}
                                                </Text>
                                                <Text style={[FONTS.fontRegular, { fontSize: 11, color: colors.text, opacity: .5, marginTop: 5 }]}>
                                                    {data.time}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </SwipeBox>
                                )
                            })}
                        </GestureHandlerRootView>
                    </View>
                </ScrollView>
            )}
        </View>
    )
}

export default Notification