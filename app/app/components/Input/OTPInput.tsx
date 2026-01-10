import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import { useTheme } from "@react-navigation/native";

type props = {
    code: string,
    setCode: (code: string) => void,
    maximumLength: number,
    setIsPinReady: (ready: boolean) => void,
}

const OTPInput = ({ code, setCode, maximumLength, setIsPinReady }: props) => {
    
    const boxArray = new Array(maximumLength).fill(0);
    const inputRef = useRef<any>();

    const theme = useTheme();
    const { colors }: { colors: any } = theme;

    // Notify parent when OTP length matches max length
    useEffect(() => {
        setIsPinReady(code.length === maximumLength);
    }, [code]);

    const boxDigit = (_: any, index: number) => {
        const emptyInput = "";
        const digit = code[index] || emptyInput;

        const isCurrentDigit = index === code.length;
        const isLastDigit = index === maximumLength - 1;
        const isCodeFull = code.length === maximumLength;

        const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

        return (
            <View key={index} style={[styles.SplitBoxes, isDigitFocused ? styles.SplitBoxesFocused : null]}>
                <Text style={[FONTS.fontJostLight, styles.SplitBoxText, { color: colors.title }]}>{digit}</Text>
            </View>
        );
    };

    const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

    const handleOnPress = () => {
        setIsInputBoxFocused(true);
        inputRef.current.focus();
    };

    const handleOnBlur = () => {
        setIsInputBoxFocused(false);
    };

    return (
        <View style={styles.OTPInputContainer}>
            <TouchableOpacity style={styles.SplitOTPBoxesContainer} onPress={handleOnPress}>
                {boxArray.map(boxDigit)}
            </TouchableOpacity>
            <TextInput
                style={styles.TextInputHidden}
                value={code}
                onChangeText={setCode}
                maxLength={maximumLength}
                ref={inputRef}
                onFocus={handleOnPress}
                onBlur={handleOnBlur}
                keyboardType={'number-pad'}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    OTPInputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    TextInputHidden: {
        position: 'absolute',
        opacity: 0
    },
    SplitOTPBoxesContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingTop: 20,
        gap: 10,
    },
    SplitBoxes: {
        borderColor: COLORS.primaryLight,
        borderWidth: 0,
        borderBottomWidth: 2,
        minWidth: 48,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    SplitBoxText: {
        fontSize: 28,
        textAlign: 'center',
        color: '#000'
    },
    SplitBoxesFocused: {
        borderColor: COLORS.primary,
    }
});

export default OTPInput;
