import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'elevated',
}) => {
  const containerStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'flat' && styles.flat,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={containerStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.md,
  },
  elevated: {
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flat: {
    backgroundColor: COLORS.surfaceSubtle,
  },
});
