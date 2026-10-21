import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Button } from './Button';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionTitle,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="sm"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING['2xl'],
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.base,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  description: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  button: {
    marginTop: SPACING.base,
  },
});
