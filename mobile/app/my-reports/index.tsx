import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, HelpCircle, CheckCircle2 } from 'lucide-react-native';
import { itemsService } from '../../services/itemsService';
import { useAuthStore } from '../../store/authStore';
import { ItemCard } from '../../components/items/ItemCard';
import { EmptyState } from '../../components/common/EmptyState';
import { LostItem, FoundItem } from '../../types/item';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { useFocusEffect } from 'expo-router';

type SubTab = 'LOST' | 'FOUND';

export default function MyReportsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<SubTab>('LOST');
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [lost, found] = await Promise.all([
        itemsService.getLostItems(),
        itemsService.getFoundItems(),
      ]);
      setLostItems(lost);
      setFoundItems(found);
    } catch (e) {
      console.warn('My reports load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const currentItems: (LostItem | FoundItem)[] = activeTab === 'LOST' ? lostItems : foundItems;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Subtabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'LOST' && styles.tabActive]}
            onPress={() => setActiveTab('LOST')}
          >
            <HelpCircle
              size={16}
              color={activeTab === 'LOST' ? COLORS.lost : COLORS.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'LOST' && styles.tabTextActive]}>
              My Lost Items ({lostItems.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'FOUND' && styles.tabActive]}
            onPress={() => setActiveTab('FOUND')}
          >
            <CheckCircle2
              size={16}
              color={activeTab === 'FOUND' ? COLORS.found : COLORS.textMuted}
            />
            <Text style={[styles.tabText, activeTab === 'FOUND' && styles.tabTextActive]}>
              My Found Items ({foundItems.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <FlatList
          data={currentItems}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              type={activeTab}
              onPress={() =>
                router.push(
                  (activeTab === 'LOST' ? `/lost/${item._id}` : `/found/${item._id}`) as any
                )
              }
            />
          )}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                title={activeTab === 'LOST' ? 'No lost reports yet' : 'No found reports yet'}
                description={
                  activeTab === 'LOST'
                    ? 'Have you lost an item? Create a report to let local AI match it against found property.'
                    : 'Found an item on campus? Help someone recover it by posting a report.'
                }
                actionTitle={activeTab === 'LOST' ? 'Report Lost Item' : 'Report Found Item'}
                onAction={() =>
                  router.push(activeTab === 'LOST' ? '/lost/create' : '/found/create')
                }
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
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.base,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.text,
  },
  listContent: {
    padding: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
});
