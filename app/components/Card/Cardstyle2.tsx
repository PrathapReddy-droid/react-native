import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';
import LikeBtn from '../LikeBtn';
import CheckoutItems from '../CheckoutItems';
import { IMAGES } from '../../constants/Images';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import ProductRating from '../../screens/Category/ProductRating';

type Props = {
    title : string;
    id:string;
    quantity:string;
    price : string;
    image ?: any;
    delevery : string;
    removelikebtn?: any;
    offer?:any,
    btntitle?:string,
    brand?:any,
    discount?:any,
    closebtn?:any,
    trackorder?:any,
    completed?:any,
    EditReview?:any,
    removebottom?:any,
    delivered?:boolean,       // ← NEW: marks order as delivered
    onPress ?: (e : any) => void,
    onPress2 ?: (e : any) => void,
    onPress3 ?: (e : any) => void,
    onPress4 ?: (e : any) => void,
    onPressReturn ?: () => void, // ← NEW: return order handler
}

const Cardstyle2 = ({
    id, quantity, title, price, image, delevery, removelikebtn, offer, btntitle,
    onPress, brand, discount, closebtn, trackorder, completed, EditReview,
    onPress2, removebottom, onPress3, onPress4,
    delivered, onPressReturn,
}: Props) => {
    console.log(trackorder, "-------")
    const theme = useTheme();
    const { colors } : {colors : any} = theme;

  return (
    <View 
        style={{
            marginTop: 0,
            paddingHorizontal: 15,
            paddingVertical: 10,
            paddingBottom: 0,
            backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card,
        }}
    >
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.5}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 0,
                justifyContent: 'center',
                borderBottomWidth: removebottom ? 0 : 1,
                borderBottomColor: COLORS.primaryLight,
                paddingBottom: 10,
                marginHorizontal: -15,
            }}
        >
            <Image
                style={{ height: undefined, width: SIZES.width / 2.9, aspectRatio: 1 / 1., resizeMode: 'contain' }}
                source={{ uri: image }}
            />
            <View style={{ flex: 1 }}>
                <Text style={[FONTS.fontMedium, { fontSize: 12, color: COLORS.primary, paddingRight: 30 }]}>{brand}</Text>
                <Text numberOfLines={1} style={[FONTS.fontMedium, { fontSize: 13, color: colors.title, marginTop: 5, paddingRight: 10 }]}>{title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 5 }}>
                    <Text style={[FONTS.fontMedium, { fontSize: 14, color: colors.title }]}>{price}</Text>
                    <Text style={[FONTS.fontJostLight, { fontSize: 12, color: colors.title, textDecorationLine: 'line-through', opacity: .6 }]}>{discount}</Text>
                    <Text style={[FONTS.fontRegular, { fontSize: 12, color: COLORS.danger }]}>{offer}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 }}>
              <ProductRating productId={id} />

                </View>
                {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 }}>
                    <Image
                        style={{ height: 14, width: 14 }}
                        source={IMAGES.leftarrow}
                    /> */}
                    {/* <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.text }]}>14 Days return available</Text> */}
                {/* </View> */}
            </View>
            {closebtn ?
                <TouchableOpacity
                    onPress={onPress4}
                    style={{ position: 'absolute', right: 10, top: 5 }}
                >
                    <FeatherIcon size={20} color={colors.title} name={'x'} />
                </TouchableOpacity>
                : null
            }
        </TouchableOpacity>

        {removebottom ? null :
            <View style={{ height: 40, width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>

                {/* LEFT: Track Order / Completed / Quantity */}
                {trackorder ?
                    <TouchableOpacity onPress={onPress2} activeOpacity={0.5} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 0 }}>
                        <FeatherIcon size={14} color={COLORS.primary} name={'truck'} />
                        <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.text }]}>Track Order</Text>
                    </TouchableOpacity>
                    : completed ?
                        <TouchableOpacity activeOpacity={0.5} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 0 }}>
                            <Image style={{ height: 16, width: 16, resizeMode: 'contain' }} source={IMAGES.check4} />
                            <Text style={[FONTS.fontRegular, { fontSize: 14, color: COLORS.success }]}>Completed</Text>
                        </TouchableOpacity>
                        :
                        <View>
                            <CheckoutItems productId={id} quantity={quantity} />
                        </View>
                }

                <View style={{ width: 1, height: 40, backgroundColor: COLORS.primaryLight }} />

                {/* MIDDLE: Write Review / Edit Review */}
                {trackorder ?
                    <TouchableOpacity onPress={onPress3} activeOpacity={0.5} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 0 }}>
                        <Image style={{ height: 16, width: 16, resizeMode: 'contain', tintColor: colors.text }} source={IMAGES.Star4} />
                        <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.text }]}>Write Review</Text>
                    </TouchableOpacity>
                    : EditReview ?
                        <TouchableOpacity onPress={onPress3} activeOpacity={0.5} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 0 }}>
                            <Image style={{ height: 16, width: 16, resizeMode: 'contain', tintColor: '#FFAC5F' }} source={IMAGES.Star4} />
                            <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.title }]}>4.5 <Text style={{ color: COLORS.primary, textDecorationLine: 'underline' }}>Edit Review</Text></Text>
                        </TouchableOpacity>
                        : completed ?
                            <TouchableOpacity onPress={onPress3} activeOpacity={0.5} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 0 }}>
                                <Image style={{ height: 16, width: 16, resizeMode: 'contain', tintColor: '#FFAC5F' }} source={IMAGES.Star4} />
                                <Text style={[FONTS.fontRegular, { fontSize: 14, color: colors.title }]}>Write Review</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={onPress4} activeOpacity={0.5} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 0 }}>
                            </TouchableOpacity>
                }

                <View style={{ width: 1, height: 40, backgroundColor: COLORS.primaryLight }} />

                {/* RIGHT: Return Order (delivered) / Cancel Order / Remove */}
                {delivered ? (
                    // ✅ Order delivered → show Return Order
                    <TouchableOpacity
                        onPress={onPressReturn}
                        activeOpacity={0.5}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                    >
                        <FeatherIcon name="rotate-ccw" size={15} color="#FFA500" />
                        <Text style={[FONTS.fontMedium, { fontSize: 14, color: '#FFA500' }]}>
                            Return Order
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={onPress4}
                        activeOpacity={0.5}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
                    >
                        {trackorder ? (
                            <>
                                <FeatherIcon name="x-circle" size={16} color={COLORS.danger} />
                                <Text style={[FONTS.fontMedium, { fontSize: 14, color: COLORS.danger }]}>Cancel Order</Text>
                            </>
                        ) : (
                            <>
                                <Image style={{ height: 16, width: 16, resizeMode: 'contain', tintColor: COLORS.danger }} source={IMAGES.delete} />
                                <Text style={[FONTS.fontMedium, { fontSize: 14, color: COLORS.danger }]}>Remove</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}

            </View>
        }
    </View>
  )
}

export default Cardstyle2