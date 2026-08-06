import React, { useRef, useEffect } from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParamList';
import { StatusBar, View, Platform } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import ChooseLanguage from '../screens/Auth/ChooseLanguage';
import SignUp from '../screens/Auth/SignUp';
import SingIn from '../screens/Auth/SingIn';
import OTPAuthentication from '../screens/Auth/OTPAuthentication';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import VerifyOtp from '../screens/Auth/VerifyOtp';
import BottomNavigation from './BottomNavigation';
import DrawerNavigation from './DrawerNavigation';
import Search from '../screens/Search/Search';
import Notification from '../screens/Notification/Notification';
import DeleveryAddress from '../screens/Payment/DeleveryAddress';
import AddDeleveryAddress from '../screens/Payment/AddDeleveryAddress';
import Payment from '../screens/Payment/Payment';
import Addcard from '../screens/Payment/Addcard';
import Checkout from '../screens/Payment/Checkout';
import Myorder from '../screens/Myorder/Myorder';
import Trackorder from '../screens/Myorder/Trackorder';
import Writereview from '../screens/Myorder/Writereview';
import Products from '../screens/Category/Products';
import ProductsDetails from '../screens/Category/ProductsDetails';
import Coupons from '../screens/Profile/Coupons';
import EditProfile from '../screens/Profile/EditProfile';
import Language from '../screens/Language/Language';
import Questions from '../screens/Profile/Questions';
import Components from '../screens/Components/Components';
import Chat from '../screens/Chat/Chat';
import Singlechat from '../screens/Chat/Singlechat';
import Call from '../screens/Chat/Call';
import AccordionScreen from '../screens/Components/Accordion';
import BottomSheet from '../screens/Components/BottomSheet';
import ModalBox from '../screens/Components/ModalBox';
import Buttons from '../screens/Components/Buttons';
import Badges from '../screens/Components/Badges';
import Charts from '../screens/Components/Charts';
import Headers from '../screens/Components/Headers';
import Footers from '../screens/Components/Footers';
import TabStyle1 from '../components/Footers/FooterStyle1';
import TabStyle2 from '../components/Footers/FooterStyle2';
import TabStyle3 from '../components/Footers/FooterStyle3';
import TabStyle4 from '../components/Footers/FooterStyle4';
import ListScreen from '../screens/Components/lists';
import Pricings from '../screens/Components/Pricings';
import DividerElements from '../screens/Components/DividerElements';
import Snackbars from '../screens/Components/Snackbars';
import Socials from '../screens/Components/Socials';
import SwipeableScreen from '../screens/Components/Swipeable';
import Tabs from '../screens/Components/Tabs';
import Tables from '../screens/Components/Tables';
import Toggles from '../screens/Components/Toggles';
import Demo from '../screens/Home/Demo';
import Inputs from '../screens/Components/Inputs';
import Home from '../screens/Home/Home';
import Wishlist from '../screens/Wishlist/Wishlist';
import MyCart from '../screens/MyCart/MyCart';
import Profile from '../screens/Profile/Profile';
import AuthLoading from '../screens/Auth/AuthLoading';
import MapAddressPicker from '../components/MapAddress/MapAddressPicker';
import VerifyEmail from '../screens/Utils/VerifyEmail';
import AuthModal from '../screens/Payment/AuthModel';
import { setHandler } from '../Api/AuthEvents';

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const navigation = useNavigation();
  const authModalRef = useRef<{ open: () => void; close: () => void }>(null);

  useEffect(() => {
    setHandler(
      () => authModalRef.current?.open(),
      (screen: string, params?: object) =>
        navigation.navigate(screen as never, params as never)
    );
    return () => {
      setHandler(() => { }, () => { });
    };
  }, [navigation]);

  return (
    <View style={{ width: '100%', flex: 1 }}>
      {Platform.OS === 'android' && (
        <StatusBar
          backgroundColor={colors.card}
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
        />
      )}
      <Stack.Navigator
        initialRouteName="AuthLoading"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="Demo" component={Demo} />
        <Stack.Screen name="ChooseLanguage" component={ChooseLanguage} />
        <Stack.Screen name="MapAddressPicker" component={MapAddressPicker} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="AuthLoading" component={AuthLoading} />
        <Stack.Screen name="SingIn" component={SingIn} />
        <Stack.Screen name="OTPAuthentication" component={OTPAuthentication} />

        {/* New: forgot-password + OTP verification flow */}
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />

        <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Wishlist" component={Wishlist} />
        <Stack.Screen name="MyCart" component={MyCart} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="DeleveryAddress" component={DeleveryAddress} />
        <Stack.Screen name="AddDeleveryAddress" component={AddDeleveryAddress} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Addcard" component={Addcard} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="Myorder" component={Myorder} />
        <Stack.Screen name="Trackorder" component={Trackorder} />
        <Stack.Screen name="Writereview" component={Writereview} />
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen name="ProductsDetails" component={ProductsDetails} />
        <Stack.Screen name="Coupons" component={Coupons} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Language" component={Language} />
        <Stack.Screen name="Questions" component={Questions} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Singlechat" component={Singlechat} />
        <Stack.Screen name="Call" component={Call} />
        <Stack.Screen name="Components" component={Components} />
        <Stack.Screen name="Accordion" component={AccordionScreen} />
        <Stack.Screen name="BottomSheet" component={BottomSheet} />
        <Stack.Screen name="ModalBox" component={ModalBox} />
        <Stack.Screen name="Buttons" component={Buttons} />
        <Stack.Screen name="Badges" component={Badges} />
        <Stack.Screen name="Charts" component={Charts} />
        <Stack.Screen name="Headers" component={Headers} />
        <Stack.Screen name="Footers" component={Footers} />
        <Stack.Screen name="TabStyle1" component={TabStyle1} />
        <Stack.Screen name="TabStyle2" component={TabStyle2} />
        <Stack.Screen name="TabStyle3" component={TabStyle3} />
        <Stack.Screen name="TabStyle4" component={TabStyle4} />
        <Stack.Screen name="Inputs" component={Inputs} />
        <Stack.Screen name="lists" component={ListScreen} />
        <Stack.Screen name="Pricings" component={Pricings} />
        <Stack.Screen name="DividerElements" component={DividerElements} />
        <Stack.Screen name="Snackbars" component={Snackbars} />
        <Stack.Screen name="Socials" component={Socials} />
        <Stack.Screen name="Swipeable" component={SwipeableScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Tables" component={Tables} />
        <Stack.Screen name="Toggles" component={Toggles} />
      </Stack.Navigator>

      {/* ✅ Inside NavigationContainer tree — no useNavigation needed inside modal */}
      <AuthModal ref={authModalRef} />
    </View>
  );
};

export default StackNavigator;