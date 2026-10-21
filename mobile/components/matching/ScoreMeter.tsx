import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { formatScore } from '../../utils/formatters';

interface ScoreMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const { percent, label, color, bgColor } = formatScore(score);

  const isLg = size === 'lg';
  const isSm = size === 'sm';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }, isSm && styles.containerSm, isLg && styles.containerLg]}>
      <Text style={[styles.percent, { color }, isSm && styles.percentSm, isLg && styles.percentLg]}>
        {percent}
      </Text>
      {showLabel && (
        <Text style={[styles.label, { color }, isSm && styles.labelSm, isLg && styles.labelLg]}>
          {label} Match
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
  },
  containerSm: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: RADIUS.sm,
  },
  containerLg: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: RADIUS.lg,
  },
  percent: {
    ...TYPOGRAPHY.h3,
    fontWeight: '800',
  },
  percentSm: {
    fontSize: 13,
    lineHeight: 16,
  },
  percentLg: {
    fontSize: 32,
    lineHeight: 38,
  },
  label: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    marginTop: 1,
  },
  labelSm: {
    fontSize: 9,
    lineHeight: 11,
  },
  labelLg: {
    fontSize: 13,
    lineHeight: 16,
  },
});
