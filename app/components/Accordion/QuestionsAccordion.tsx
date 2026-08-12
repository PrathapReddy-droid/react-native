import { View, Text, TouchableOpacity, Linking } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Accordion from 'react-native-collapsible/Accordion';

const APP_NAME = "YourApp"; // TODO: replace with your actual app name
const SUPPORT_EMAIL = "support@yourapp.com"; // TODO: replace with your real support email

const QuestionsAccordion = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const [activeSections, setActiveSections] = useState([0]);
    const setSections = (sections:any) => {
        setActiveSections(
            sections.includes(undefined) ? [] : sections
        );
    };

    const SECTIONS = [
        {
            title: 'How do I place an order?',
            content: `Browse products, add items to your cart or wishlist, then proceed to checkout. Select your delivery address and preferred payment method, review your order summary, and confirm to place it.`,
        },
        {
            title: 'What payment methods do you accept?',
            content: `We accept Visa, Mastercard, RuPay, UPI, Net Banking, and select digital wallets. All payments are processed securely and your card details are never stored on our servers.`,
        },
        {
            title: 'How can I track my order?',
            content: `Once your order ships, go to "My Orders" in your account to see real-time status updates. You'll also receive notifications as your order moves from processing to delivery.`,
        },
        {
            title: 'What is your return and refund policy?',
            content: `Items can be returned within 7 days of delivery if unused and in original packaging. Once we receive and inspect the return, refunds are processed to your original payment method within 5-7 business days.`,
        },
        {
            title: 'Can I cancel or change my order after placing it?',
            content: `You can cancel or edit an order from "My Orders" as long as it hasn't been shipped yet. Once it's out for delivery, cancellation may no longer be possible.`,
        },
        {
            title: 'How do I use the wishlist?',
            content: `Tap the heart icon on any product to save it to your wishlist. You can revisit your wishlist anytime from your profile to move items into your cart when you're ready to buy.`,
        },
        {
            title: 'How can I contact customer support?',
            content: `Our support team is available 24/7. Reach us anytime at ${SUPPORT_EMAIL}, or use the in-app chat from your profile menu for the fastest response.`,
        },
    ];

    const AccordionHeader = (item:any, _:any, isActive:any) => {

        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 15
            }}>
                <Text style={[FONTS.fontMedium, { fontSize: 14, color: colors.title, flex: 1 }]}>{item.title}</Text>
                <FeatherIcon size={24} color={colors.title} name={isActive ? "chevron-up" : "chevron-down"} />
            </View>
        )
    }

    const AccordionBody = (item:any, _:any, isActive:any) => {
        return (
            <View style={{
                borderTopWidth: 1,
                borderTopColor: colors.border,
                paddingVertical: 10,
                paddingHorizontal: 15
            }}>
                <Text style={[FONTS.fontSm, { color: colors.text, lineHeight: 20 }]}>{item.content}</Text>

                {item.title === 'How can I contact customer support?' && (
                    <TouchableOpacity onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} style={{ marginTop: 8 }}>
                        <Text style={[FONTS.fontMedium, { fontSize: 13, color: COLORS.primary }]}>Email Support →</Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    return (
        <>
            <Accordion
                sections={SECTIONS}
                duration={300}
                sectionContainerStyle={{
                    marginBottom: 10,
                    borderRadius: 10,
                    backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card
                }}
                activeSections={activeSections}
                onChange={setSections}
                touchableComponent={TouchableOpacity}
                renderHeader={AccordionHeader}
                renderContent={AccordionBody}
            />
        </>
    );
}

export default QuestionsAccordion