import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export const LoadingSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.content}>
        <View style={styles.badgePlaceholder} />
        <View style={styles.titlePlaceholder} />
        <View style={styles.linePlaceholder} />
        <View style={styles.metaRow}>
          <View style={styles.metaItem} />
          <View style={styles.metaItem} />
        </View>
      </View>
    </View>
  );
};

export const SkeletonFeed: React.FC = () => {
  return (
    <View style={styles.feed}>
      <LoadingSkeleton />
      <LoadingSkeleton />
      <LoadingSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  feed: {
    padding: SPACING.base,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 160,
    backgroundColor: COLORS.surfaceSubtle,
  },
  content: {
    padding: SPACING.base,
  },
  badgePlaceholder: {
    width: 70,
    height: 18,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    marginBottom: SPACING.sm,
  },
  titlePlaceholder: {
    width: '80%',
    height: 20,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSubtle,
    marginBottom: SPACING.sm,
  },
  linePlaceholder: {
    width: '95%',
    height: 14,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSubtle,
    marginBottom: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    width: '40%',
    height: 14,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSubtle,
  },
});
