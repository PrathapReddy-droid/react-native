import React, { useEffect, useState } from 'react'
import { View, Text,  ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native';
import Header from '../../layout/Header';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { IMAGES } from '../../constants/Images';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { COLORS, FONTS } from '../../constants/theme';
import auth from '@react-native-firebase/auth';

const EditProfile = () => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const navigation = useNavigation<any>();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const user = auth().currentUser;
        if (user) {
            setUsername(user.displayName || '');
            setEmail(user.email || '');
            setPhoneNumber(user.phoneNumber || '');
        }
    }, []);

    const onSave = async () => {
        const user = auth().currentUser;
        if (user) {
            try {
                await user.updateProfile({
                    displayName: username,
                });
                Alert.alert('Success', 'Profile updated successfully!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(), // 👈 Go back after pressing OK
                    },
                ]);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        }
    };

    return (
       <View style={{backgroundColor:colors.background,flex:1}}>
           <Header
                title='Edit Profile'
                leftIcon='back'
                titleRight
           />
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={[GlobalStyleSheet.container, {backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card}]}>
                    <View style={{flexDirection:'row',alignItems:'center',gap:20}}>
                        <View style={{}}>
                            <View style={{ borderWidth: 2, borderColor:COLORS.primary, height: 90, width: 90, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    style={{ height: 82, width: 82, borderRadius: 50 }}
                                    source={IMAGES.small6}
                                />
                            </View>
                            <TouchableOpacity style={{ height: 42, width: 42, borderRadius: 40, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 0, left:60 }}>
                                <View style={{ height: 36, width: 36, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor:COLORS.primary }}>
                                    <Image
                                        style={{ height: 16, width: 16, resizeMode: 'contain', tintColor: COLORS.card }}
                                        source={IMAGES.write}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={[FONTS.fontMedium,{fontSize:24,color:colors.title}]}>{username || 'N/A'}</Text>
                            <Text style={[FONTS.fontMedium,{fontSize:13,color:COLORS.primary}]}>Last Visit : 17 Jan 2024</Text>
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,marginTop:10,paddingVertical:10}]}>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Text style={{ ...FONTS.fontMedium, fontSize: 13, color:COLORS.primary, }}>Your Name</Text>
                        <Input
                            inputBorder
                            defaultValue={username}
                            value={username}
                            onChangeText={setUsername}
                            style={{ borderColor: COLORS.primary, paddingLeft: 0 }}
                        />
                    </View>
                    {phoneNumber &&
                        <View style={{ marginBottom: 15 }}>
                            <Input
                                inputBorder
                                value={phoneNumber}
                                editable={false}
                                style={{ borderColor: COLORS.primaryLight, paddingLeft: 0}}
                                keyboardType="number-pad"
                            />
                        </View>
                    }
                    {email &&
                        <View style={{ marginBottom: 15 }}>
                            <Input
                                inputBorder
                                value={email}
                                editable={false}
                                style={{ borderColor: COLORS.primaryLight, paddingLeft: 0 }}
                            />
                        </View>
                    }
                    <View style={{ marginBottom: 15 }}>
                        <Input
                            inputBorder
                            placeholder='Location'
                            onChangeText={(value) => console.log(value)}
                            style={{borderColor:COLORS.primaryLight, paddingLeft:0}}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,paddingBottom:0}]}>
                <View style={{height:88,width:'100%',backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,justifyContent:'center',paddingHorizontal:15}}>
                    <Button
                        title='Update Profile'
                        color={COLORS.secondary}
                        text={ COLORS.title}
                        onPress={onSave}
                    />
                </View>
            </View> 
       </View>
    )
}

export default EditProfile