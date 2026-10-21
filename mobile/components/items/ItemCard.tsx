import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MapPin, Calendar, Sparkles } from 'lucide-react-native';
import { LostItem, FoundItem } from '../../types/item';
import { Badge } from '../common/Badge';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { formatDate } from '../../utils/formatters';

interface ItemCardProps {
  item: LostItem | FoundItem;
  type: 'LOST' | 'FOUND';
  onPress: () => void;
  showMatchBadge?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  type,
  onPress,
  showMatchBadge = false,
}) => {
  const isLost = type === 'LOST';
  const itemDate = isLost ? (item as LostItem).lostDate : (item as FoundItem).foundDate;
  const itemLocation = isLost ? (item as LostItem).lostLocation : (item as FoundItem).foundLocation;
  const imageUrl = item.images?.[0] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=60';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.container}
    >
      {/* Item Image */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        <View style={styles.typeBadgeWrapper}>
          <Badge
            label={isLost ? 'LOST' : 'FOUND'}
            variant={isLost ? 'danger' : 'success'}
            size="sm"
          />
        </View>
        {item.aiAnalysis && (
          <View style={styles.aiBadgeWrapper}>
            <Badge
              label="AI Analyzed"
              variant="ai"
              size="sm"
              icon={<Sparkles size={10} color={COLORS.aiDark} />}
            />
          </View>
        )}
      </View>

      {/* Item Info */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Metadata Footer */}
        <View style={styles.footer}>
          <View style={styles.metaItem}>
            <MapPin size={13} color={COLORS.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {itemLocation?.approximateArea || itemLocation?.city || 'Near campus'}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Calendar size={13} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{formatDate(itemDate)}</Text>
          </View>
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
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  imageWrapper: {
    height: 160,
    width: '100%',
    backgroundColor: COLORS.surfaceSubtle,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeBadgeWrapper: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
  },
  aiBadgeWrapper: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
  },
  content: {
    padding: SPACING.base,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryText: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  title: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '55%',
  },
  metaText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
});
