import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, CheckCircle, Clock, ShieldCheck, XCircle } from 'lucide-react-native';
import { matchService } from '../../services/matchService';
import { MatchCard } from '../../components/matching/MatchCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Match, MatchStatus } from '../../types/match';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useFocusEffect } from 'expo-router';

const STATUS_FILTERS: { label: string; value: MatchStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Potential', value: 'POTENTIAL' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'In Progress', value: 'RETURN_IN_PROGRESS' },
  { label: 'Returned', value: 'RETURNED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function MatchesScreen() {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState<MatchStatus | 'ALL'>('ALL');
  const [matches, setMatches] = useState<Match[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await matchService.getMatches(
        selectedStatus !== 'ALL' ? selectedStatus : undefined
      );
      setMatches(data);
    } catch (err) {
      console.warn('Matches fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMatches();
    }, [selectedStatus])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Status Filter Horizontal Scroll */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            {STATUS_FILTERS.map((filter) => {
              const isActive = selectedStatus === filter.value;
              return (
                <TouchableOpacity
                  key={filter.value}
                  activeOpacity={0.7}
                  onPress={() => setSelectedStatus(filter.value)}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                >
                  <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* AI Explanatory Notice */}
        <View style={styles.noticeBar}>
          <Sparkles size={14} color={COLORS.ai} />
          <Text style={styles.noticeText}>
            Matches are scored by comparing vision embeddings, metadata, location, and timestamps.
          </Text>
        </View>

        {/* Matches Feed */}
        <FlatList
          data={matches}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              onPress={() => router.push(`/matches/${item._id}` as any)}
            />
          )}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                icon={<Sparkles size={32} color={COLORS.ai} />}
                title="No matches in this category"
                description="We continuously evaluate newly uploaded reports. When an item matching yours is detected, it will appear here."
              />
            ) : null
          }
        />
      </View>
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
  filterSection: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterContent: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    gap: 8,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: COLORS.ai,
    borderColor: COLORS.ai,
  },
  filterLabel: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.textSecondary,
  },
  filterLabelActive: {
    color: COLORS.white,
  },
  noticeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.aiLight,
    paddingVertical: 8,
    paddingHorizontal: SPACING.base,
    gap: 8,
  },
  noticeText: {
    ...TYPOGRAPHY.small,
    fontSize: 11,
    color: COLORS.aiDark,
    flex: 1,
  },
  listContent: {
    padding: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
});
