import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { IMAGES } from '../constants/Images';
import { COLORS, FONTS } from '../constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import ThemeBtn from '../components/ThemeBtn';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserFromStorage } from '../redux/reducer/userStorage';
import { clearUser, hydrateUser } from '../redux/reducer/User';

const MenuItems = [
    {
        icon: IMAGES.home,
        name: "Home",
        navigate: "DrawerNavigation",
    },
    {
        icon: IMAGES.producta,
        name: "Products",
        navigate: "Products",
    },

    {
        icon: IMAGES.star,
        name: "Review",
        navigate: "Writereview",
    },
    {
        icon: IMAGES.heart2,
        name: "Wishlist",
        navigate: "Wishlist",
    },
    {
        icon: IMAGES.order,
        name: "My Orders",
        navigate: 'Myorder',
    },
    {
        icon: IMAGES.shopping,
        name: "My Cart",
        navigate: 'MyCart',
    },
    // {
    //     icon: IMAGES.chat,
    //     name: "Chat List",
    //     navigate: 'Chat',
    // },
    {
        icon: IMAGES.user3,
        name: "Profile",
        navigate: "Profile",
    },
    {
        icon: IMAGES.logout,
        name: "Logout",
        navigate: 'Logout',
    },
]

const DrawerMenu = () => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  // ✅ ONLY Redux user
  const user = useSelector((state: any) => state.user.selectedUser);

  console.log(user, '================ USER');

  // ✅ Hydrate user if redux is empty
  useEffect(() => {
    const hydrate = async () => {
      if (!user) {
        const storedUser = await getUserFromStorage();
        if (storedUser) {
          dispatch(hydrateUser(storedUser));
        }
      }
    };

    hydrate();
  }, [user, dispatch]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('AccessToken');
    await AsyncStorage.removeItem('USER_DATA'); // important
    dispatch(clearUser());

    navigation.reset({
      index: 0,
      routes: [{ name: 'ChooseLanguage' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.dark ? COLORS.title : colors.card,
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: COLORS.primaryLight,
            paddingBottom: 20,
            paddingTop: 10,
            marginHorizontal: -15,
            paddingHorizontal: 15,
          }}
        >
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : IMAGES.user3
            }
            style={{
              height: 60,
              width: 60,
              borderRadius: 10,
              marginRight: 10,
            }}
          />

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={[FONTS.fontSemiBold, { color: colors.title, fontSize: 18 }]}
            >
              {user?.name || 'Guest'}
            </Text>

            {user?.email && (
              <Text
                style={[FONTS.fontRegular, { color: COLORS.primary, fontSize: 15 }]}
              >
                {user.email}
              </Text>
            )}

            {user?.mobile && (
              <Text
                style={[FONTS.fontRegular, { color: COLORS.primary, fontSize: 15 }]}
              >
                {user.mobile}
              </Text>
            )}
          </View>

          <View style={{ position: 'absolute', right: 10, top: 0 }}>
            <ThemeBtn />
          </View>
        </View>

        {/* MENU ITEMS */}
        <View style={{ flex: 1, paddingVertical: 15 }}>
          {MenuItems.map((data: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (data.navigate === 'Logout') {
                  handleLogout();
                } else {
                  navigation.navigate(data.navigate);
                }
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderWidth: 1,
                    borderColor: COLORS.primaryLight,
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={data.icon}
                    style={{
                      height: 18,
                      width: 18,
                      tintColor: COLORS.primary,
                      resizeMode: 'contain',
                    }}
                  />
                </View>

                <Text style={[FONTS.fontRegular, { color: colors.title, fontSize: 16 }]}>
                  {data.name}
                </Text>
              </View>

              <FeatherIcon size={20} color={colors.title} name="chevron-right" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DrawerMenu;