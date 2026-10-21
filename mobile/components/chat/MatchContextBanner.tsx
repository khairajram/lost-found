import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { Badge } from '../common/Badge';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { MatchStatus } from '../../types/match';

interface MatchContextBannerProps {
  title: string;
  matchScore: number;
  matchStatus: MatchStatus;
  lostImage?: string;
  foundImage?: string;
  onViewMatch: () => void;
}

export const MatchContextBanner: React.FC<MatchContextBannerProps> = ({
  title,
  matchScore,
  matchStatus,
  lostImage,
  foundImage,
  onViewMatch,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onViewMatch}
      style={styles.container}
    >
      <View style={styles.imagePair}>
        {lostImage && (
          <Image source={{ uri: lostImage }} style={[styles.thumb, styles.thumbLost]} />
        )}
        {foundImage && (
          <Image source={{ uri: foundImage }} style={[styles.thumb, styles.thumbFound]} />
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <View style={styles.aiTag}>
            <Sparkles size={11} color={COLORS.ai} />
            <Text style={styles.aiTagText}>{matchScore}% Match</Text>
          </View>
          <Badge label={matchStatus.replace(/_/g, ' ')} size="sm" variant="ai" />
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <ArrowRight size={18} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  imagePair: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  thumbLost: {
    zIndex: 2,
  },
  thumbFound: {
    marginLeft: -12,
    zIndex: 1,
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.aiLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
    gap: 3,
  },
  aiTagText: {
    ...TYPOGRAPHY.small,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.aiDark,
  },
  title: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.text,
  },
});
