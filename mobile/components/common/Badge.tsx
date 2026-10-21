import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'ai' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  size = 'md',
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: COLORS.primaryLight, text: COLORS.primaryDark };
      case 'success':
        return { bg: COLORS.foundLight, text: COLORS.foundDark };
      case 'danger':
        return { bg: COLORS.lostLight, text: COLORS.lostDark };
      case 'warning':
        return { bg: COLORS.warningLight, text: '#B45309' };
      case 'ai':
        return { bg: COLORS.aiLight, text: COLORS.aiDark };
      case 'info':
        return { bg: '#E0F2FE', text: '#0369A1' };
      case 'neutral':
      default:
        return { bg: COLORS.surfaceSubtle, text: COLORS.textSecondary };
    }
  };

  const { bg, text } = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg },
        size === 'sm' && styles.badgeSm,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.text, { color: text }, size === 'sm' && styles.textSm]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    ...TYPOGRAPHY.small,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 10,
  },
});
