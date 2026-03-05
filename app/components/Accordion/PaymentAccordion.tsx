import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from '@react-navigation/native';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import Accordion from 'react-native-collapsible/Accordion';
import { useDispatch } from 'react-redux';

type Props = {}

const PaymentAccordion = ({}: Props) => {

    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const dispatch = useDispatch();

    const [activeSections, setActiveSections] = useState<number[]>([]);

    const SECTIONS = [
        {
            icon: IMAGES.dollar,
            title: 'Cash on Delivery',
            type: 'COD',
            content: 'Pay with cash upon delivery.',
        },
        {
            icon: IMAGES.payment,
            title: 'Pay Now (UPI / Credit / Debit Card)',
            type: 'ONLINE',
            content: 'Secure payment via Razorpay.',
        },
    ];

    const handlePaymentSelect = (type: string) => {
        dispatch({
            type: "SET_PAYMENT_METHOD",
            payload: type
        });
    };

    const AccordionHeader = (item: any, index: number, isActive: boolean) => {

        return (
            <TouchableOpacity
                onPress={() => {
                    setActiveSections([index]);
                    handlePaymentSelect(item.type); // ✅ Dispatch here
                }}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 15
                }}
            >
                <Image
                    style={{
                        height: 20,
                        width: 20,
                        resizeMode: 'contain',
                        tintColor: COLORS.primary,
                        marginRight: 10,
                    }}
                    source={item.icon}
                />

                <Text style={[FONTS.fontMedium, {
                    fontSize: 14,
                    color: colors.title,
                    flex: 1
                }]}>
                    {item.title}
                </Text>

                {/* Radio UI */}
                <View
                    style={{
                        backgroundColor: COLORS.primaryLight,
                        width: 24,
                        height: 24,
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View style={[{
                        width: 14,
                        height: 14,
                        backgroundColor: COLORS.primaryLight,
                        borderRadius: 50
                    }, isActive && {
                        backgroundColor: COLORS.primary
                    }]} />
                </View>
            </TouchableOpacity>
        )
    }

    const AccordionBody = (item: any) => {
        return (
            <View style={{
                borderTopWidth: 1,
                borderTopColor: '#CCCCCC',
                paddingVertical: 15,
                paddingHorizontal: 15
            }}>
                <Text style={{
                    ...FONTS.fontRegular,
                    fontSize: 13,
                    color: colors.title,
                }}>
                    {item.content}
                </Text>
            </View>
        )
    }

    return (
        <Accordion
            sections={SECTIONS}
            activeSections={activeSections}
            renderHeader={AccordionHeader}
            renderContent={AccordionBody}
            onChange={(sections: any) => {
                setActiveSections(sections);
            }}
            touchableComponent={TouchableOpacity}
            duration={300}
            sectionContainerStyle={{
                marginBottom: 15,
                backgroundColor: theme.dark
                    ? 'rgba(255,255,255,.1)'
                    : colors.card
            }}
        />
    );
}

export default PaymentAccordion;
