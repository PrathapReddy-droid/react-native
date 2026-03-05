import React from 'react';
import { Pressable } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../constants/theme';
import { useTheme } from '@react-navigation/native';

type Props = {
  onPress: () => void;
  isLiked: boolean;
};

const LikeBtn = ({ onPress, isLiked }: Props) => {
  const { colors } = useTheme();

  return (
    <Pressable
      accessible
      accessibilityLabel="Like Button"
      accessibilityHint="Add or remove from wishlist"
      onPress={onPress}
      style={{
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FontAwesome
        size={16}
        name="heart"
        color={isLiked ? COLORS.danger : colors.text}
      />
    </Pressable>
  );
};

export default LikeBtn;
