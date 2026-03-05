import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../layout/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import FeatherIcon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { setselectedUser } from '../../redux/reducer/User';

const API_BASE_URL = 'https://api.fizzyfuzz.in';

const EditProfile = () => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user.selectedUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setMobile(user.mobile?.toString() || '');
      const defaultAddress =
        user.address_details?.find((a: any) => a.selected)?.address_line1 || '';
      setAddress(defaultAddress);
      setAvatar(user.avatar || null);
    }
  }, [user]);

  /* ================= IMAGE PICKER ================= */
  const pickAvatar = async () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.7,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        setAvatar(response.assets[0].uri || null);
      }
    });
  };

  /* ================= SAVE PROFILE ================= */
  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name is required');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('AccessToken');
      if (!token) {
        Alert.alert('Error', 'Access token not found, please login again');
        setLoading(false);
        return;
      }

      // ✅ Use local variables to capture latest state
      const updatedName = name.trim();
      const updatedAddress = address.trim();
      const updatedAvatar = avatar;

      const formData = new FormData();
      formData.append('name', updatedName);
      formData.append('address', updatedAddress || '');
      if (updatedAvatar && !updatedAvatar.startsWith('http')) {
        formData.append('avatar', {
          uri: updatedAvatar,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        } as any);
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/user/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response)

      Alert.alert('Success', 'Profile updated successfully');
    //   dispatch(setselectedUser(response.data.user));
    } catch (error: any) {
      console.log('Update Profile Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Edit Profile" leftIcon="back" titleRight />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* ================= PROFILE AVATAR ================= */}
        <View
          style={[
            GlobalStyleSheet.container,
            {
              backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card,
              paddingVertical: 20,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <View>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                  height: 90,
                  width: 90,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {avatar ? (
                  <Image style={{ height: 90, width: 90 }} source={{ uri: avatar }} />
                ) : (
                  <Image style={{ height: 82, width: 82 }} source={IMAGES.small6} />
                )}
              </View>

              <TouchableOpacity
                onPress={pickAvatar}
                style={{
                  height: 42,
                  width: 42,
                  borderRadius: 40,
                  backgroundColor: colors.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: 0,
                  left: 60,
                }}
              >
                <FeatherIcon name="edit-3" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View>
              <Text style={[FONTS.fontMedium, { fontSize: 24, color: colors.title }]}>
                {name || 'N/A'}
              </Text>
              <Text style={[FONTS.fontMedium, { fontSize: 13, color: COLORS.primary }]}>
                Profile Settings
              </Text>
            </View>
          </View>
        </View>

        {/* ================= FORM FIELDS ================= */}
        <View
          style={[
            GlobalStyleSheet.container,
            {
              backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card,
              marginTop: 10,
              paddingVertical: 10,
            },
          ]}
        >
          <View style={{ marginBottom: 15 }}>
            <Text style={{ ...FONTS.fontMedium, fontSize: 13, color: COLORS.primary }}>
              Your Name
            </Text>
            <Input
              inputBorder
              value={name}
              onChangeText={(text) => setName(text)}
              style={{ borderColor: COLORS.primary, paddingLeft: 0 }}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ ...FONTS.fontMedium, fontSize: 13, color: COLORS.primary }}>
              Mobile Number
            </Text>
            <Input
              inputBorder
              value={mobile}
              editable={false}
              style={{ borderColor: COLORS.primaryLight, paddingLeft: 0 }}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ ...FONTS.fontMedium, fontSize: 13, color: COLORS.primary }}>
              Email
            </Text>
            <Input
              inputBorder
              value={email}
              editable={false}
              style={{ borderColor: COLORS.primaryLight, paddingLeft: 0 }}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={{ ...FONTS.fontMedium, fontSize: 13, color: COLORS.primary }}>
              Address
            </Text>
            <Input
              inputBorder
              value={address}
              placeholder="Enter Address"
              onChangeText={(text) => setAddress(text)}
              style={{ borderColor: COLORS.primaryLight, paddingLeft: 0 }}
            />
          </View>
        </View>
      </ScrollView>

      {/* ================= FOOTER BUTTON ================= */}
      <View style={[GlobalStyleSheet.container, { paddingHorizontal: 0, paddingBottom: 0 }]}>
        <View
          style={{
            height: 88,
            width: '100%',
            backgroundColor: theme.dark ? 'rgba(255,255,255,.1)' : colors.card,
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}
        >
          <Button
            title={loading ? 'Updating...' : 'Update Profile'}
            color={COLORS.secondary}
            text={COLORS.title}
            disabled={loading}
            onPress={onSave}
          />
          {loading && (
            <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 10 }} />
          )}
        </View>
      </View>
    </View>
  );
};

export default EditProfile;
