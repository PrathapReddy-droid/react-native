import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { View, Text,Image, TouchableOpacity, Share, SectionList } from 'react-native'
import Header from '../../layout/Header';
import { IMAGES } from '../../constants/Images';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Swiper from 'react-native-swiper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { ScrollView } from 'react-native-gesture-handler';
import Cardstyle1 from '../../components/Card/Cardstyle1';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/reducer/cartReducer';
import { addTowishList } from '../../redux/reducer/wishListReducer';
import { productList, productreview } from '../../Api/Product';
import { useRoute } from '@react-navigation/native';




const ItemImages = [IMAGES.product12, IMAGES.product13, IMAGES.product14, IMAGES.product15];
const renderStars = (rating) => {
  return [...Array(5)].map((_, i) => (
    <FeatherIcon
      key={i}
      name="star"
      size={14}
      color={i < Number(rating) ? COLORS.warning : COLORS.primaryLight}
      style={{ marginRight: 2 }}
    />
  ));
};

const SelectData =[
    {
        title:"Color",
        text:"Blue",
    },
    {
        title:"Storage",
        text:"128GB Storage",
    },
    {
        title:"RAM",
        text:"6GB RAM",
    },
    {
        title:"Size",
        text:"Medium",
    },
]

const offerData = [
    {
        image:IMAGES.deliverytruck,
        title:"Free Shipping",
        text:"For all orders over $99",
    },
    {
        image:IMAGES.check3,
        title:"Secure Payment",
        text:"We ensure secure payment",
    },
    {
        image:IMAGES.savemoney,
        title:"Money Back Guarantee",
        text:"Any back within 30 days",
    },
    {
        image:IMAGES.technicalsupport,
        title:"Customer Support",
        text:"Call or email us 24/7",
    },
    {
        image:IMAGES.wallet2,
        title:"Flexible Payment",
        text:"Pay with Multiple Credit Card",
    },
]

const ListwithiconData = [
    {
        title: 'GENERAL',
        data: [
            {
                title: "Country of Origin",
                text: 'China'
            },
            {
                title: "Sim Type",
                text: 'Dual Sim, GSM+GSM'
            },
            {
                title: "Dual Sim",
                text: 'Yes'
            },
            {
                title: "Sim Size",
                text: 'Nano + eSIM'
            },
            {
                title: "Device Type",
                text: 'Smartphone'
            },
            {
                title: "Release Date",
                text: 'September 07, 2022'
            },
        ],
    },
    {
        title: 'DESIGN',
        data: [
            {
                title: "Dimensions",
                text: '71.5 x 146.7 x 7.8 mm'
            },
            {
                title: "Weight",
                text: '172 g'
            },
            {
                title: "Colors",
                text: 'Blue, Purple, Yellow, Midnight'
            },
        ],
    },
    {
        title: 'DISPLAY',
        data: [
            {
                title: "Type",
                text: 'Color OLED Screen (16M Colors)'
            },
            {
                title: "Touch",
                text: 'Yes'
            },
            {
                title: "Size",
                text: '6.1inches, 1170x2532pixels'
            },
            {
                title: "Aspect Ratio",
                text: '19.5:9'
            },
            {
                title: "PPI",
                text: '~ 460PPI'
            },
            {
                title: "Glass Type",
                text: 'Ceramic Shield Front, Glass Back'
            },
            {
                title: "Features",
                text: 'HDR Display'
            },
            {
                title: "Notch",
                text: 'Yes, Small Notch'
            },
        ],
    },
];

// const card2Data =[
//     {
//         id:"20",
//         image:IMAGES.item1,
//         title:"APPLE iPhone 14 (Bluetooth)",
//         price:"$199",
//         discount:"$112",
//         offer:"70% OFF",
//         brand:"Apple",
//         color:false,
//         //hascolor:false
//     },
//     {
//         id:"21",
//         image:IMAGES.item2,
//         title:"APPLE iPhone 11 (Bluetooth)",
//         price:"$149",
//         discount:"$114",
//         offer:"50% OFF",
//         brand:"Apple",
//         color:false,
//        // hascolor:true
//     },
//     {
//         id:"22",
//         image:IMAGES.item1,
//         title:"APPLE iPhone 13 (Bluetooth)",
//         price:"$299",
//         discount:"$116",
//         offer:"70% OFF",
//         color:false,
//         brand:"Apple",
//         //hascolor:true
//     },
//     {
//         id:"23",
//         image:IMAGES.item2,
//         title:"APPLE iPhone 15 (Bluetooth)",
//         price:"$99",
//         discount:"$118",
//         offer:"70% OFF",
//         color:true,
//         brand:"Apple",
//         //hascolor:false
//     },
// ]

type ProductsDetailsScreenProps = StackScreenProps<RootStackParamList, 'ProductsDetails'>;

const ProductsDetails = ({ navigation }: ProductsDetailsScreenProps) => {
    const route = useRoute()
  const { product } = route?.params;
  const [showReviews, setShowReviews] = useState(false);
  const [card2Data,setcard2Data] = useState([])

  console.log(product)
    // const navagation = useNavigation();

    const [Select, setSelect] = useState(offerData[0]);
    const [review,setreview] = useState([])

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const onShare = async() => {
        try {
            const result = await Share.share({
                message:
                    'Share Product link here.',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error:any) {
            //alert(error.message);
        }
    };

    const dispatch = useDispatch();

    const addItemToCart = () => {
        dispatch(addToCart({
    product
        } as any ));
    }
    useEffect(()=>{
        productreview(product._id).then((data)=>{
            setreview(data)
            console.log(JSON.stringify(data),"====review")
        })
                    productList(product.catId).then((data)=>{
                    setcard2Data(data)
        
        
                })

    },[])

    const addItemToWishList = (data: any) => {
        dispatch(addTowishList(data));
        }

    return (
       <View style={{backgroundColor:colors.background,flex:1}}>
            <Header
                title='Product Details'
                leftIcon='back'
                rightIcon2={'cart'}
                rightIcon1={'search'}
            />
            <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:20}}>
                <View
                    style={{
                        width:'100%',
                        height: SIZES.height / 2.3,
                        paddingTop:40,
                        backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,
                        paddingBottom:30
                    }}
                >
                    <Swiper
                        loop={false}
                        paginationStyle={{
                            bottom: -20,
                        }}
                        dotStyle={{
                            height: 8,
                            width: 8,
                            backgroundColor:COLORS.primary,
                            opacity:.2
                        }}
                        activeDotStyle={{
                            height: 8,
                            width: 8,
                            backgroundColor: COLORS.primary,
                        }}
                    >
                        {product.images.map((data, index) => (
                            <View
                                key={index}
                            >
                                <Image
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        resizeMode:'contain'
                                    }}
source={{ uri: data }}
                                />
                            </View>
                        ))}
                    </Swiper>
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            paddingHorizontal: 0,
                            paddingLeft:10,
                            paddingVertical: 10,
                            flexDirection: 'row',
                            //alignItems:'center',
                            justifyContent:'space-between'
                        }}
                    >
                        <View style={{  }}>
                            <View
                                style={{
                                    marginTop:10,
                                    backgroundColor:COLORS.success,
                                    paddingHorizontal:5,
                                    paddingVertical:2
                                }}
                            >
                                <Text style={[FONTS.fontSemiBold,{fontSize:12,color:COLORS.card}]}>70% OFF</Text>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity
                                style={{
                                        height: 38,
                                        width: 38,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 8,
                                    }}
                                    onPress={onShare}
                            >
                                <FeatherIcon size={22} color={colors.text} name={'share-2'} />
                                {/* <FeatherIcon size={20} color={COLORS.white} name="share-2" /> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{padding:0}]}>
                    <View style={{height:45,backgroundColor:'#87E8FF',marginVertical:10,flexDirection:'row',alignItems:'center',width:'100%',justifyContent:'space-between',paddingLeft:15}}>
                        <View>
                            <Text style={[FONTS.fontRegular,{fontSize:15,color:COLORS.title}]} >You're saving<Text style={[FONTS.fontSemiBold,{color:'#07A3C5'}]}> {product.price - product.oldPrice} </Text>on this time</Text>
                        </View>
                        <View>
                            <Image
                                style={{height:45,resizeMode:'contain',marginRight:-35}}
                                source={IMAGES.background}
                            />
                            <Image
                                style={{position:'absolute',height:28,width:28,top:10,right:15}}
                                source={IMAGES.gift}
                            />
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card}]}>
                    <Text numberOfLines={1} style={[FONTS.fontMedium,{fontSize:18,color:colors.title,}]}>{product?.name}</Text>
                    <View style={{flexDirection:'row',alignItems:'center',gap:10,marginTop:2}}>
                        <Image
                            style={{height:14,width:74}}
                            source={IMAGES.star7}
                        />
<TouchableOpacity onPress={() => setShowReviews(true)}>
  <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.title,opacity:.5}]}>
    {review?.reviews?.length || 0} Reviews
  </Text>
</TouchableOpacity>

                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:2,gap:5}}>
                        <Text style={[FONTS.fontSemiBold,{fontSize:20,color:COLORS.success}]}>₹{product.price}</Text>
                        <Text style={[FONTS.fontMedium,{fontSize:20,color:colors.title,textDecorationLine:'line-through',opacity:.6}]}>₹{product.oldPrice}</Text>    
                        <Text style={[FONTS.fontMedium,{fontSize:14,color:COLORS.danger}]}>  {product.discount}% OFF</Text>    
<Text
  style={[
    FONTS.fontMedium,
    {
      fontSize: 15,
      color: product.countInStock > 0 ? COLORS.success : COLORS.error,
    },
  ]}
>
  {product.countInStock > 0
    ? `In Stock (${product.countInStock})`
    : 'Out of Stock'}
</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',gap:5,marginTop:10}}>
                        <Image
                            style={{height:14,width:14}}
                            source={IMAGES.leftarrow}
                        />
                        <Text style={[FONTS.fontRegular,{fontSize:15,color:colors.text}]}>14 Days return available</Text>
                        <Text style={[FONTS.fontSemiBold,{fontSize:15,color:COLORS.success}]}>  Free delivery</Text>
                    </View>
                </View>
                {/* <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,marginVertical:10,paddingBottom:0,paddingTop:10}]}>
                    <Text style={[FONTS.fontMedium,{fontSize:16,color:colors.title,paddingBottom:10}]}>Select Variant</Text>
                    <View style={{flexDirection:'row',flexWrap:'wrap',marginHorizontal:-15}}>
                        {SelectData.map((data:any,index) => {
                            return(
                                <TouchableOpacity key={index} 
                                    style={{
                                        paddingVertical:10,
                                        width:'100%',
                                        borderTopWidth:1,
                                        borderTopColor:COLORS.primaryLight,
                                        //marginHorizontal:-15,
                                        paddingHorizontal:15,
                                        flexDirection:'row',
                                        alignItems:'center',
                                        justifyContent:'space-between'
                                    }}
                                >
                                    <Text style={[FONTS.fontMedium,{fontSize:15,color:colors.title}]}>{data.title}:</Text>
                                    <View style={{flexDirection:'row',gap:5}}>
                                        <Text style={[FONTS.fontRegular,{fontSize:15,color:colors.text}]}>{data.text}</Text>
                                        <FeatherIcon size={20} color={COLORS.primary} name={'chevron-right'} />
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View> */}
                <View style={[GlobalStyleSheet.container,{paddingHorizontal:-15,paddingVertical:0,marginBottom:10}]}> 
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{paddingHorizontal:15}}
                    >
                        <View style={{flexDirection:'row',alignItems:'center',gap:15}}>
                            {offerData.map((data:any,index) => {
                                return(
                                    <TouchableOpacity
                                        key={index} 
                                        style={[{
                                            padding:10,
                                            backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,
                                            borderRadius:4
                                        },Select === data && {
                                            backgroundColor:COLORS.primary
                                        }]}
                                        onPress={() => setSelect(data)}
                                    >
                                        <View style={{alignItems:'center'}}>
                                            <Image
                                                style={{height:45,width:45,tintColor:Select === data ? COLORS.secondary :COLORS.primary}}
                                                source={data.image}
                                            />
                                            <View>
                                                <Text style={[FONTS.fontMedium,{fontSize:15,color:Select === data ? COLORS.white : colors.title,textAlign:'center'}]}>{data.title}</Text>
                                                <Text style={[FONTS.fontRegular,{fontSize:12,color:Select === data ? COLORS.white : colors.title,opacity:.7,textAlign:'center'}]}>{data.text}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
                {/* <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card}]}>
                    <View style={{}}>
                        <Text  style={[FONTS.fontMedium,{fontSize:16,color:colors.title}]}>Description:</Text>
                        <Text style={[FONTS.fontRegular,{fontSize:15,color:colors.text,lineHeight:20,marginTop:10,opacity:.8}]}>
                        Apple iPhone 14 price in India starts from ₹54,994. It is available at lowest price on Croma in India as on Feb 22, 2024. Take a look at Apple iPhone 14 detailed specifications and features.
                        </Text>
                    </View>
                </View> */}
                {/* <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,marginTop:10,marginBottom:10}]}>
                    <Text style={[FONTS.fontMedium,{fontSize:16,color:colors.title}]}>Apple iPhone 14 Full Specs</Text>
                </View> */}
                {/* <View style={[GlobalStyleSheet.container,{flex:1,paddingTop:0}]}>
                    <View style={{ marginHorizontal: -15, marginTop: 0, flex: 1 }}>
                        <SectionList
                            contentContainerStyle={{backgroundColor:colors.card,marginTop:-10}}
                            scrollEnabled={false}
                            sections={ListwithiconData}
                            keyExtractor={(item:any, index) => item + index}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    //onPress={() => navigation.navigate(item.navigate)}
                                    style={{
                                        flexDirection: 'row',
                                        paddingHorizontal:15,
                                        // height: 30,
                                        alignItems: 'center',
                                        paddingVertical: 5,
                                        //borderRadius: SIZES.radius,
                                        backgroundColor:colors.card,
                                        //marginVertical:5
                                    }}
                                >
                                    <View style={{width:'40%'}}>
                                        <Text style={{...FONTS.fontMedium,fontSize:14,color:colors.text,}}>{item.title}</Text>
                                    </View>
                                    <View>
                                        <Text style={{...FONTS.fontRegular,fontSize:14,color:colors.title}}>{item.text}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            renderSectionHeader={({ section:{ title } }) => (
                                <Text 
                                    style={{
                                        ...FONTS.fontRegular,
                                        fontSize: 13,
                                        color: COLORS.title,
                                        paddingLeft: 15,
                                        paddingVertical:5,
                                        backgroundColor:COLORS.primaryLight,
                                        //borderBottomWidth:1,
                                        //borderBottomColor:COLORS.primaryLight,
                                        marginTop:10,
                                        marginBottom:10
                                    }}
                                >{title}</Text>
                            )}
                        />
                    </View>
                </View> */}
                <View style={[GlobalStyleSheet.container,{paddingHorizontal:15,backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,borderBottomWidth:1,borderBottomColor:COLORS.primaryLight,paddingVertical:15,marginTop:-5}]}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={[FONTS.fontMedium,{fontSize:18,color:colors.title}]}>Similar Products</Text>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{padding:0,borderBottomWidth:1,borderBlockColor:COLORS.primaryLight}]}>
                    <ScrollView 
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            {card2Data?.map((data:any, index:any) => {
                                return (
                                    <View style={[{ marginBottom: 0, width: SIZES.width > SIZES.container ? SIZES.container / 3 : SIZES.width / 2.3 }]} key={index}>
                                        <Cardstyle1
                                            title={data.title}
                                            image={data.images[0]}
                                            price={data.price}
                                            offer={data.offer}
                                            color={data.color}
                                            brand={data.brand}
                                            discount={data.discount} 
                                            id={data.id}
                                            onPress3={() => addItemToWishList(data)}                                            
                                            onPress={() => navigation.navigate('ProductsDetails')}
                                        />
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container,{padding:0,}]}>
                <View 
                    style={{
                        flexDirection:'row',
                        width:'100%',
                        alignItems:'center',
                        justifyContent:'center'
                    }}
                >
                    <View style={{width:'50%'}}>
                        <Button
                            onPress={() => {addItemToCart(); navigation.navigate('MyCart')}}
                            title='Add To cart'
                            color={COLORS.white}
                            text={COLORS.primary}
                            style={{borderRadius:0}}
                        />
                    </View>
                    <View style={{width:'50%'}}>
                        <Button
                            title='Buy Now'
                            color={COLORS.secondary}
                            text={COLORS.title}
                            onPress={() =>{addItemToCart(); navigation.navigate('DeleveryAddress')}}
                            style={{borderRadius:0}}
                        />
                    </View>
                </View>
            </View>
            {showReviews && (
  <View
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        backgroundColor: colors.card,
        margin: 20,
        borderRadius: 8,
        padding: 15,
        maxHeight: '70%',
      }}
    >
      <Text style={[FONTS.fontMedium,{fontSize:18,color:colors.title}]}>
        Reviews
      </Text>

  <ScrollView style={{ marginTop: 10 }}>
  {review?.reviews?.length > 0 ? (
    review.reviews.map((item, index) => (
      <View
        key={index}
        style={{
          backgroundColor: theme.dark
            ? 'rgba(255,255,255,.05)'
            : COLORS.card,
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        {/* HEADER */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={
              item.image
                ? { uri: item.image }
                : IMAGES.user
            }
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              marginRight: 10,
            }}
          />

          <View style={{ flex: 1 }}>
            <Text
              style={[
                FONTS.fontSemiBold,
                { color: colors.title, fontSize: 14 },
              ]}
            >
              {item.userName || 'User'}
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 2 }}>
              {renderStars(item.rating)}
            </View>
          </View>
        </View>

        {/* REVIEW */}
        <Text
          style={[
            FONTS.fontRegular,
            {
              color: colors.text,
              fontSize: 14,
              marginTop: 8,
              lineHeight: 20,
            },
          ]}
        >
          {item.review}
        </Text>

        {/* DATE */}
        <Text
          style={{
            fontSize: 12,
            color: colors.text,
            opacity: 0.5,
            marginTop: 6,
          }}
        >
          {new Date(item.createdAt).toDateString()}
        </Text>
      </View>
    ))
  ) : (
    <Text style={{ color: colors.text }}>
      No reviews available
    </Text>
  )}
</ScrollView>


      <TouchableOpacity
        onPress={() => setShowReviews(false)}
        style={{ marginTop: 15, alignSelf: 'flex-end' }}
      >
        <Text style={{ color: COLORS.primary }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

       </View>
       
    )
}

export default ProductsDetails