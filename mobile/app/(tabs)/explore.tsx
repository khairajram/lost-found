import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X, SlidersHorizontal, PackageSearch } from 'lucide-react-native';
import { itemsService } from '../../services/itemsService';
import { ItemCard } from '../../components/items/ItemCard';
import { CategoryPills } from '../../components/items/CategoryPills';
import { EmptyState } from '../../components/common/EmptyState';
import { LostItem, FoundItem } from '../../types/item';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useFocusEffect } from 'expo-router';

type ReportTab = 'ALL' | 'LOST' | 'FOUND';

export default function ExploreScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ReportTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<(LostItem | FoundItem)[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [lost, found] = await Promise.all([
        itemsService.getLostItems({
          search: searchQuery,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
        }),
        itemsService.getFoundItems({
          search: searchQuery,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
        }),
      ]);

      if (activeTab === 'LOST') {
        setItems(lost);
      } else if (activeTab === 'FOUND') {
        setItems(found);
      } else {
        // Interleave lost and found items
        const merged: (LostItem | FoundItem)[] = [];
        const maxLen = Math.max(lost.length, found.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < lost.length) merged.push(lost[i]);
          if (i < found.length) merged.push(found[i]);
        }
        setItems(merged);
      }
    } catch (err) {
      console.warn('Explore fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [activeTab, selectedCategory, searchQuery])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by brand, color, description..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Segmented Control Tabs */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'ALL' && styles.tabItemActive]}
            onPress={() => setActiveTab('ALL')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'ALL' && styles.tabTextActive]}>
              All Reports
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'LOST' && styles.tabItemActive]}
            onPress={() => setActiveTab('LOST')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'LOST' && styles.tabTextActive]}>
              Lost Items
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'FOUND' && styles.tabItemActive]}
            onPress={() => setActiveTab('FOUND')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'FOUND' && styles.tabTextActive]}>
              Found Items
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Pills Filter */}
        <View style={styles.categoriesWrapper}>
          <CategoryPills
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </View>

        {/* Results List */}
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => {
            const isLost = 'lostDate' in item;
            return (
              <ItemCard
                item={item}
                type={isLost ? 'LOST' : 'FOUND'}
                onPress={() =>
                  router.push((isLost ? `/lost/${item._id}` : `/found/${item._id}`) as any)
                }
              />
            );
          }}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                icon={<PackageSearch size={32} color={COLORS.textMuted} />}
                title="No reports match your filters"
                description="Try clearing your search query or selecting a different category."
                actionTitle="Reset Filters"
                onAction={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
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
  searchSection: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.text,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  categoriesWrapper: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listContent: {
    padding: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
});
