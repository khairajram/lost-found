import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Trash2,
} from 'lucide-react-native';
import { itemsService } from '../../services/itemsService';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { FoundItem } from '../../types/item';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { formatFullDate } from '../../utils/formatters';

export default function FoundItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const [item, setItem] = useState<FoundItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      itemsService.getFoundItemById(id).then((data) => setItem(data));
    }
  }, [id]);

  if (!item) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading found item...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOwner =
    typeof item.userId === 'object'
      ? item.userId._id === user?._id
      : item.userId === user?._id;

  const handleDelete = () => {
    Alert.alert('Delete Found Report', 'Are you sure you want to remove this report?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await itemsService.deleteFoundItem(item._id);
          router.replace('/(tabs)/home');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.images[activeImageIndex] || item.images[0] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.imageBadge}>
            <Badge label="FOUND ITEM" variant="success" />
          </View>
        </View>

        {item.images.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbScroll}>
            {item.images.map((uri, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setActiveImageIndex(idx)}
                style={[
                  styles.thumbWrapper,
                  activeImageIndex === idx && styles.thumbWrapperActive,
                ]}
              >
                <Image source={{ uri }} style={styles.thumbImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text style={styles.category}>{item.category.toUpperCase()}</Text>
            <Badge label={item.status} variant={item.status === 'ACTIVE' ? 'success' : 'neutral'} />
          </View>

          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.specsCard}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Color</Text>
              <Text style={styles.specValue}>{item.color}</Text>
            </View>
            {item.brand && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Brand</Text>
                <Text style={styles.specValue}>{item.brand}</Text>
              </View>
            )}
            {item.model && (
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Model</Text>
                <Text style={styles.specValue}>{item.model}</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Finder's Description</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>

          {item.distinctiveFeatures && item.distinctiveFeatures.length > 0 && (
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Visible Marks & Characteristics</Text>
              <View style={styles.featuresWrap}>
                {item.distinctiveFeatures.map((feat, idx) => (
                  <View key={idx} style={styles.featureChip}>
                    <Text style={styles.featureChipText}>• {feat}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.locationSection}>
            <View style={styles.metaRow}>
              <MapPin size={18} color={COLORS.found} />
              <View>
                <Text style={styles.metaTitle}>Found Location</Text>
                <Text style={styles.metaSubtitle}>
                  {item.foundLocation?.approximateArea || 'Campus Area'}, {item.foundLocation?.city}
                </Text>
              </View>
            </View>

            <View style={[styles.metaRow, { marginTop: 12 }]}>
              <Calendar size={18} color={COLORS.textSecondary} />
              <View>
                <Text style={styles.metaTitle}>Found On</Text>
                <Text style={styles.metaSubtitle}>{formatFullDate(item.foundDate)}</Text>
              </View>
            </View>
          </View>

          {item.aiAnalysis && (
            <View style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <Sparkles size={18} color={COLORS.ai} />
                <Text style={styles.aiTitle}>AI Vision Insights</Text>
              </View>
              <Text style={styles.aiDescription}>{item.aiDescription}</Text>
            </View>
          )}

          <View style={styles.actions}>
            {isOwner ? (
              <>
                <Button
                  title="Check Matches for This Item"
                  variant="primary"
                  size="lg"
                  icon={<Sparkles size={18} color={COLORS.white} />}
                  onPress={() => router.push('/(tabs)/matches')}
                  style={{ marginBottom: 12 }}
                />
                <Button
                  title="Remove Found Listing"
                  variant="secondary"
                  icon={<Trash2 size={18} color={COLORS.lost} />}
                  onPress={handleDelete}
                  textStyle={{ color: COLORS.lost }}
                />
              </>
            ) : (
              <Button
                title="Is This Yours? Verify & Claim"
                variant="primary"
                size="lg"
                icon={<ShieldCheck size={18} color={COLORS.white} />}
                onPress={() => router.push('/(tabs)/matches')}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  scrollContent: {
    paddingBottom: SPACING['3xl'],
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: COLORS.surfaceSubtle,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
  },
  thumbScroll: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  thumbWrapper: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbWrapperActive: {
    borderColor: COLORS.found,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  body: {
    padding: SPACING.base,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.foundDark,
    letterSpacing: 0.5,
  },
  title: {
    ...TYPOGRAPHY.h1,
    fontSize: 22,
    color: COLORS.text,
    marginBottom: SPACING.base,
  },
  specsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
    gap: 16,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  specValue: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.text,
    marginTop: 2,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 6,
  },
  descriptionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.base,
  },
  featuresSection: {
    marginBottom: SPACING.base,
  },
  featuresWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureChipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  locationSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  metaTitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  metaSubtitle: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.text,
  },
  aiCard: {
    backgroundColor: COLORS.aiLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: SPACING.xl,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aiTitle: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.aiDark,
  },
  aiDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  actions: {
    marginTop: SPACING.sm,
  },
});
