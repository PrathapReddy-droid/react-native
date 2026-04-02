// screens/Coupons/Coupons.tsx

import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS } from '../../constants/theme';
import { useSelector } from 'react-redux';
import FeatherIcon from 'react-native-vector-icons/Feather';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FilterType = 'ALL' | 'CREDIT' | 'DEBIT';

type Transaction = {
  _id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  reason: string;
  orderId: string;
  createdAt: string;
};

const Coupons = () => {

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  // ── Exact Redux shape from your store ────────────────────────────────────
  const user = useSelector((state: any) => state.user?.selectedUser);

  const balance: number             = user?.wallet?.balance ?? 0;
  const transactions: Transaction[] = user?.wallet?.transactions ?? [];
  const userName: string            = user?.name ?? 'User';

  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalCredit = transactions
    .filter(t => t.type === 'CREDIT')
    .reduce((s, t) => s + t.amount, 0);

  const totalDebit = transactions
    .filter(t => t.type === 'DEBIT')
    .reduce((s, t) => s + t.amount, 0);

  const totalTxns = transactions.length;

  // ── Filter + sort newest first ────────────────────────────────────────────
  const filtered = transactions
    .filter(t => activeFilter === 'ALL' || t.type === activeFilter)
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  // ── Group by date ─────────────────────────────────────────────────────────
  const grouped: { [date: string]: Transaction[] } = {};
  filtered.forEach(t => {
    const key = formatDate(t.createdAt);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header title="My Wallet" leftIcon="back" titleRight />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>

        {/* ── Balance Card ───────────────────────────────────────────────── */}
        <View style={{
          marginHorizontal: 15,
          marginTop: 20,
          borderRadius: 24,
          backgroundColor: COLORS.primary,
          padding: 22,
        }}>

          {/* Greeting + icon */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={[FONTS.fontRegular, { fontSize: 13, color: 'rgba(255,255,255,0.70)', marginBottom: 4 }]}>
                Hello, {userName} 👋
              </Text>
              <Text style={[FONTS.fontRegular, { fontSize: 13, color: 'rgba(255,255,255,0.70)', marginBottom: 6 }]}>
                Available Balance
              </Text>
              <Text style={[FONTS.fontMedium, { fontSize: 40, color: '#fff', letterSpacing: 0.5 }]}>
                ₹{balance}
              </Text>
            </View>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderRadius: 50,
              height: 52, width: 52,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <FeatherIcon name="credit-card" size={24} color="#fff" />
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.18)', marginVertical: 18 }} />

          {/* 3-stat row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

            {/* Credits */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 4 }}>
                  <FeatherIcon name="arrow-down-left" size={12} color="#fff" />
                </View>
                <Text style={[FONTS.fontRegular, { fontSize: 11, color: 'rgba(255,255,255,0.7)' }]}>Credits</Text>
              </View>
              <Text style={[FONTS.fontMedium, { fontSize: 16, color: '#fff' }]}>₹{totalCredit}</Text>
            </View>

            <View style={{ width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' }} />

            {/* Debits */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 4 }}>
                  <FeatherIcon name="arrow-up-right" size={12} color="#fff" />
                </View>
                <Text style={[FONTS.fontRegular, { fontSize: 11, color: 'rgba(255,255,255,0.7)' }]}>Debits</Text>
              </View>
              <Text style={[FONTS.fontMedium, { fontSize: 16, color: '#fff' }]}>₹{totalDebit}</Text>
            </View>

            <View style={{ width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' }} />

            {/* Total transactions */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 4 }}>
                  <FeatherIcon name="list" size={12} color="#fff" />
                </View>
                <Text style={[FONTS.fontRegular, { fontSize: 11, color: 'rgba(255,255,255,0.7)' }]}>Total</Text>
              </View>
              <Text style={[FONTS.fontMedium, { fontSize: 16, color: '#fff' }]}>{totalTxns}</Text>
            </View>

          </View>
        </View>

        {/* ── Transactions ───────────────────────────────────────────────── */}
        <View style={[GlobalStyleSheet.container, { marginTop: 24 }]}>

          <Text style={[FONTS.fontMedium, { fontSize: 17, color: colors.title, marginBottom: 14 }]}>
            Transactions
          </Text>

          {/* Filter pill tabs */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: theme.dark ? 'rgba(255,255,255,0.08)' : '#F4F4F8',
            borderRadius: 30,
            padding: 4,
            marginBottom: 22,
          }}>
            {(['ALL', 'CREDIT', 'DEBIT'] as FilterType[]).map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setActiveFilter(f);
                }}
                activeOpacity={0.8}
                style={{
                  flex: 1,
                  paddingVertical: 9,
                  borderRadius: 26,
                  alignItems: 'center',
                  backgroundColor:
                    activeFilter === f
                      ? f === 'DEBIT'   ? COLORS.danger
                      : f === 'CREDIT'  ? COLORS.success
                      : COLORS.primary
                      : 'transparent',
                }}
              >
                <Text style={[FONTS.fontMedium, {
                  fontSize: 13,
                  color: activeFilter === f
                    ? '#fff'
                    : theme.dark ? 'rgba(255,255,255,0.45)' : '#999',
                }]}>
                  {f === 'ALL'    ? `All (${totalTxns})`
                  : f === 'CREDIT' ? `Credit (${transactions.filter(t => t.type === 'CREDIT').length})`
                  : `Debit (${transactions.filter(t => t.type === 'DEBIT').length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Grouped transaction list */}
          {Object.keys(grouped).length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
              <FeatherIcon name="inbox" size={48} color={colors.title} style={{ opacity: 0.15 }} />
              <Text style={[FONTS.fontRegular, { color: colors.title, opacity: 0.4, fontSize: 14 }]}>
                No transactions found
              </Text>
            </View>
          ) : (
            Object.entries(grouped).map(([date, txns]) => (
              <View key={date} style={{ marginBottom: 16 }}>

                {/* Date label */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Text style={[FONTS.fontMedium, { fontSize: 12, color: colors.title, opacity: 0.4 }]}>
                    {date}
                  </Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: COLORS.primaryLight }} />
                </View>

                {/* Cards */}
                {txns.map((txn, idx) => (
                  <View
                    key={txn._id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: theme.dark ? 'rgba(255,255,255,0.07)' : colors.card,
                      borderRadius: 16,
                      padding: 14,
                      marginBottom: idx < txns.length - 1 ? 8 : 0,
                      gap: 14,
                    }}
                  >
                    {/* Icon bubble */}
                    <View style={{
                      height: 46, width: 46,
                      borderRadius: 23,
                      alignItems: 'center', justifyContent: 'center',
                      backgroundColor: txn.type === 'CREDIT'
                        ? 'rgba(39,174,96,0.12)'
                        : 'rgba(231,76,60,0.12)',
                    }}>
                      <FeatherIcon
                        name={txn.type === 'CREDIT' ? 'arrow-down-left' : 'arrow-up-right'}
                        size={19}
                        color={txn.type === 'CREDIT' ? COLORS.success : COLORS.danger}
                      />
                    </View>

                    {/* Middle: reason + orderId + time */}
                    <View style={{ flex: 1 }}>
                      <Text style={[FONTS.fontMedium, { fontSize: 13, color: colors.title }]} numberOfLines={1}>
                        {txn.reason}
                      </Text>
                      <Text style={[FONTS.fontRegular, {
                        fontSize: 11, color: colors.title, opacity: 0.45, marginTop: 2,
                      }]} numberOfLines={1}>
                        {txn.orderId}
                      </Text>
                      <Text style={[FONTS.fontRegular, {
                        fontSize: 10, color: colors.title, opacity: 0.3, marginTop: 2,
                      }]}>
                        {formatTime(txn.createdAt)}
                      </Text>
                    </View>

                    {/* CREDIT / DEBIT badge + amount */}
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <Text style={[FONTS.fontMedium, {
                        fontSize: 15,
                        color: txn.type === 'CREDIT' ? COLORS.success : COLORS.danger,
                      }]}>
                        {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount}
                      </Text>
                      <View style={{
                        paddingHorizontal: 7, paddingVertical: 2,
                        borderRadius: 20,
                        backgroundColor: txn.type === 'CREDIT'
                          ? 'rgba(39,174,96,0.10)'
                          : 'rgba(231,76,60,0.10)',
                      }}>
                        <Text style={[FONTS.fontRegular, {
                          fontSize: 10,
                          color: txn.type === 'CREDIT' ? COLORS.success : COLORS.danger,
                        }]}>
                          {txn.type}
                        </Text>
                      </View>
                    </View>

                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Coupons;