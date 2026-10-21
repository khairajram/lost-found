import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Search,
  Bell,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { itemsService } from '../../services/itemsService';
import { matchService } from '../../services/matchService';
import { MatchCard } from '../../components/matching/MatchCard';
import { ItemCard } from '../../components/items/ItemCard';
import { Badge } from '../../components/common/Badge';
import { LostItem, FoundItem } from '../../types/item';
import { Match } from '../../types/match';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [refreshing, setRefreshing] = useState(false);
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [nearbyItems, setNearbyItems] = useState<(LostItem | FoundItem)[]>([]);
  const [stats, setStats] = useState({ lostCount: 2, foundCount: 1, matchCount: 1 });

  const loadDashboardData = async () => {
    try {
      const [matches, lostItems, foundItems] = await Promise.all([
        matchService.getMatches('POTENTIAL'),
        itemsService.getLostItems(),
        itemsService.getFoundItems(),
      ]);

      setRecentMatches(matches);
      // Combine some nearby lost and found items
      const combined = [...lostItems.slice(0, 2), ...foundItems.slice(0, 2)];
      setNearbyItems(combined);
      setStats({
        lostCount: lostItems.length,
        foundCount: foundItems.length,
        matchCount: matches.length,
      });
    } catch (e) {
      console.warn('Dashboard load error:', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Top App Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri:
                  user?.profileImage ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Hello, {user?.name || 'Explorer'} 👋</Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color={COLORS.textMuted} />
                <Text style={styles.locationText}>
                  {user?.location?.city || 'San Francisco, CA'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/matches')}
            style={styles.iconButton}
          >
            <Bell size={20} color={COLORS.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Top Potential Match Alert Banner */}
        {recentMatches.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push(`/matches/${recentMatches[0]._id}` as any)}
            style={styles.alertBanner}
          >
            <View style={styles.alertIcon}>
              <Sparkles size={20} color={COLORS.white} />
            </View>
            <View style={styles.alertContent}>
              <View style={styles.alertBadgeRow}>
                <Text style={styles.alertTitle}>Potential Match Found!</Text>
                <View style={styles.scorePill}>
                  <Text style={styles.scorePillText}>
                    {recentMatches[0].matchScore}% Match
                  </Text>
                </View>
              </View>
              <Text style={styles.alertDesc} numberOfLines={2}>
                Local AI identified high visual & metadata similarity for your reported item.
              </Text>
            </View>
            <ArrowRight size={18} color={COLORS.aiDark} />
          </TouchableOpacity>
        )}

        {/* Primary Action Buttons: Lost vs Found */}
        <Text style={styles.sectionHeader}>What would you like to do?</Text>
        <View style={styles.actionCardsRow}>
          {/* I Lost Something Card */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/lost/create')}
            style={[styles.actionCard, styles.lostCard]}
          >
            <View style={[styles.actionIconBg, { backgroundColor: COLORS.lostLight }]}>
              <HelpCircle size={28} color={COLORS.lost} />
            </View>
            <Text style={styles.actionCardTitle}>I Lost Something</Text>
            <Text style={styles.actionCardSubtitle}>
              Upload photos & details. Local AI scans for found matches.
            </Text>
            <View style={styles.actionCardFooter}>
              <Text style={[styles.actionCardBtnText, { color: COLORS.lostDark }]}>
                Report Lost →
              </Text>
            </View>
          </TouchableOpacity>

          {/* I Found Something Card */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/found/create')}
            style={[styles.actionCard, styles.foundCard]}
          >
            <View style={[styles.actionIconBg, { backgroundColor: COLORS.foundLight }]}>
              <CheckCircle2 size={28} color={COLORS.found} />
            </View>
            <Text style={styles.actionCardTitle}>I Found Something</Text>
            <Text style={styles.actionCardSubtitle}>
              Help return an item to its owner using vision comparison.
            </Text>
            <View style={styles.actionCardFooter}>
              <Text style={[styles.actionCardBtnText, { color: COLORS.foundDark }]}>
                Report Found →
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Local AI Engine Status Badge */}
        <View style={styles.aiStatusBanner}>
          <ShieldCheck size={16} color={COLORS.ai} />
          <Text style={styles.aiStatusText}>
            Local Ollama Vision Engine active • Private on-device matching
          </Text>
        </View>

        {/* Quick Stats Overview */}
        <View style={styles.statsCard}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push('/my-reports')}
          >
            <Text style={styles.statNumber}>{stats.lostCount}</Text>
            <Text style={styles.statLabel}>Lost Reports</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push('/my-reports')}
          >
            <Text style={styles.statNumber}>{stats.foundCount}</Text>
            <Text style={styles.statLabel}>Found Reports</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.push('/(tabs)/matches')}
          >
            <Text style={[styles.statNumber, { color: COLORS.ai }]}>
              {stats.matchCount}
            </Text>
            <Text style={styles.statLabel}>AI Matches</Text>
          </TouchableOpacity>
        </View>

        {/* AI Potential Matches Feed */}
        {recentMatches.length > 0 && (
          <View style={styles.feedSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>High-Confidence Matches</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/matches')}>
                <Text style={styles.seeAllText}>See all ({recentMatches.length})</Text>
              </TouchableOpacity>
            </View>

            {recentMatches.map((match) => (
              <MatchCard
                key={match._id}
                match={match}
                onPress={() => router.push(`/matches/${match._id}` as any)}
              />
            ))}
          </View>
        )}

        {/* Nearby Reports Section */}
        <View style={styles.feedSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Campus Reports</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAllText}>Explore</Text>
            </TouchableOpacity>
          </View>

          {nearbyItems.map((item) => {
            const isLost = 'lostDate' in item;
            return (
              <ItemCard
                key={item._id}
                item={item}
                type={isLost ? 'LOST' : 'FOUND'}
                onPress={() =>
                  router.push((isLost ? `/lost/${item._id}` : `/found/${item._id}`) as any)
                }
              />
            );
          })}
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
  scrollContent: {
    padding: SPACING.base,
    paddingTop: Platform.OS === 'android' ? SPACING.xl : SPACING.sm,
    paddingBottom: SPACING['3xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  greeting: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lost,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.aiLight,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.base,
    gap: 12,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.ai,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  alertTitle: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.aiDark,
  },
  scorePill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  scorePillText: {
    ...TYPOGRAPHY.small,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.aiDark,
  },
  alertDesc: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  sectionHeader: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  actionCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: SPACING.base,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  lostCard: {
    borderTopWidth: 4,
    borderTopColor: COLORS.lost,
  },
  foundCard: {
    borderTopWidth: 4,
    borderTopColor: COLORS.found,
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  actionCardTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  actionCardSubtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: SPACING.md,
    minHeight: 32,
  },
  actionCardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  actionCardBtnText: {
    ...TYPOGRAPHY.captionSemibold,
  },
  aiStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingHorizontal: SPACING.md,
    gap: 6,
    marginBottom: SPACING.base,
  },
  aiStatusText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  statLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.border,
    alignSelf: 'center',
  },
  feedSection: {
    marginBottom: SPACING.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  seeAllText: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.primary,
  },
});
