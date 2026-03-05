import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { FONTS } from '../constants/theme';
import { decrementQuantity } from '../redux/reducer/cartReducer';
import { incrementQuantity } from '../redux/reducer/cartReducer';

const CheckoutItems = ({ productId, quantity }: any) => {
    const dispatch = useDispatch();
    const { colors }: any = useTheme();

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={() => dispatch(decrementQuantity(productId))}
                style={{
                    height: 30,
                    width: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <FeatherIcon size={20} color={colors.text} name="minus" />
            </TouchableOpacity>

            <Text
                style={{
                    ...FONTS.fontRegular,
                    fontSize: 14,
                    color: colors.title,
                    width: 50,
                    textAlign: 'center',
                }}
            >
                {quantity}
            </Text>

            <TouchableOpacity
                onPress={() => dispatch(incrementQuantity(productId))}
                style={{
                    height: 30,
                    width: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <FeatherIcon size={20} color={colors.text} name="plus" />
            </TouchableOpacity>
        </View>
    );
};

export default CheckoutItems;
