import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ArrowRightLeft, Sparkles, MapPin, Calendar } from 'lucide-react-native';
import { Match } from '../../types/match';
import { LostItem, FoundItem } from '../../types/item';
import { ScoreMeter } from './ScoreMeter';
import { Badge } from '../common/Badge';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { formatDate } from '../../utils/formatters';

interface MatchCardProps {
  match: Match;
  onPress: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onPress }) => {
  const lostItem = match.lostItemId as LostItem;
  const foundItem = match.foundItemId as FoundItem;

  const lostImg = lostItem?.images?.[0] || 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400';
  const foundImg = foundItem?.images?.[0] || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400';

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
      case 'RETURNED':
        return 'success';
      case 'REJECTED':
      case 'CLOSED':
        return 'danger';
      case 'RETURN_IN_PROGRESS':
        return 'warning';
      case 'POTENTIAL':
      default:
        return 'ai';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.container}
    >
      {/* Top Header: Status & Score */}
      <View style={styles.topHeader}>
        <Badge
          label={match.status.replace(/_/g, ' ')}
          variant={getStatusVariant(match.status)}
          size="sm"
        />
        <ScoreMeter score={match.matchScore} size="sm" />
      </View>

      {/* Side-by-Side Photos */}
      <View style={styles.comparisonRow}>
        <View style={styles.imageColumn}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: lostImg }} style={styles.image} resizeMode="cover" />
            <View style={[styles.photoTag, { backgroundColor: COLORS.lost }]}>
              <Text style={styles.photoTagText}>Reported Lost</Text>
            </View>
          </View>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {lostItem?.title || 'Lost Item'}
          </Text>
        </View>

        <View style={styles.vsBadge}>
          <ArrowRightLeft size={16} color={COLORS.primary} />
        </View>

        <View style={styles.imageColumn}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: foundImg }} style={styles.image} resizeMode="cover" />
            <View style={[styles.photoTag, { backgroundColor: COLORS.found }]}>
              <Text style={styles.photoTagText}>Found Report</Text>
            </View>
          </View>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {foundItem?.title || 'Found Item'}
          </Text>
        </View>
      </View>

      {/* AI Key Reason Preview */}
      {match.aiReasoning && match.aiReasoning.length > 0 && (
        <View style={styles.reasonBox}>
          <Sparkles size={14} color={COLORS.ai} style={{ marginTop: 2 }} />
          <Text style={styles.reasonText} numberOfLines={2}>
            {match.aiReasoning[0]}
          </Text>
        </View>
      )}

      {/* Footer Info */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <MapPin size={12} color={COLORS.textMuted} />
          <Text style={styles.footerText}>
            {lostItem?.lostLocation?.approximateArea || 'Nearby'}
          </Text>
        </View>
        <View style={styles.footerItem}>
          <Calendar size={12} color={COLORS.textMuted} />
          <Text style={styles.footerText}>Matched {formatDate(match.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  imageColumn: {
    flex: 1,
  },
  imageWrapper: {
    height: 100,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceSubtle,
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  photoTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  photoTagText: {
    ...TYPOGRAPHY.small,
    fontSize: 9,
    color: COLORS.white,
    fontWeight: '700',
  },
  itemTitle: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.text,
    marginTop: 4,
  },
  vsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  reasonBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.aiLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: 6,
    marginBottom: SPACING.sm,
  },
  reasonText: {
    ...TYPOGRAPHY.small,
    color: COLORS.aiDark,
    flex: 1,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
});
