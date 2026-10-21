import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.md,
    };

    // Size
    switch (size) {
      case 'sm':
        base.paddingVertical = SPACING.sm;
        base.paddingHorizontal = SPACING.md;
        break;
      case 'lg':
        base.paddingVertical = SPACING.base;
        base.paddingHorizontal = SPACING.xl;
        break;
      case 'md':
      default:
        base.paddingVertical = SPACING.md;
        base.paddingHorizontal = SPACING.lg;
        break;
    }

    // Variant
    switch (variant) {
      case 'secondary':
        base.backgroundColor = COLORS.surfaceSubtle;
        base.borderWidth = 1;
        base.borderColor = COLORS.border;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1.5;
        base.borderColor = COLORS.primary;
        break;
      case 'danger':
        base.backgroundColor = COLORS.danger;
        break;
      case 'success':
        base.backgroundColor = COLORS.success;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'primary':
      default:
        base.backgroundColor = COLORS.primary;
        break;
    }

    if (disabled || loading) {
      base.opacity = 0.6;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    let color = COLORS.white;
    if (variant === 'secondary') color = COLORS.text;
    if (variant === 'outline' || variant === 'ghost') color = COLORS.primary;

    let fontSize = 15;
    if (size === 'sm') fontSize = 13;
    if (size === 'lg') fontSize = 17;

    return {
      color,
      fontSize,
      fontWeight: '600',
      marginLeft: icon ? SPACING.sm : 0,
    };
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'outline' ? COLORS.primary : COLORS.white}
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
