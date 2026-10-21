import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, ShieldCheck, Sparkles } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { chatService } from '../../services/chatService';
import { EmptyState } from '../../components/common/EmptyState';
import { ChatConversation } from '../../types/chat';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { formatDate } from '../../utils/formatters';
import { useFocusEffect } from 'expo-router';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await chatService.getConversations(user._id);
      setConversations(data);
    } catch (err) {
      console.warn('Messages load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [user?._id])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Safety Header */}
        <View style={styles.privacyHeader}>
          <ShieldCheck size={16} color={COLORS.foundDark} />
          <Text style={styles.privacyText}>
            End-to-end coordinated chat. Personal phone numbers remain protected.
          </Text>
        </View>

        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => {
            const lastMsg = item.lastMessage;
            return (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => router.push(`/chat/${item._id}` as any)}
                style={styles.convCard}
              >
                {/* User Avatar */}
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{
                      uri:
                        item.otherUser.profileImage ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
                    }}
                    style={styles.avatar}
                  />
                  <View style={styles.onlineDot} />
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                  <View style={styles.rowTop}>
                    <Text style={styles.userName}>{item.otherUser.name}</Text>
                    {lastMsg && (
                      <Text style={styles.timestamp}>
                        {formatDate(lastMsg.createdAt)}
                      </Text>
                    )}
                  </View>

                  {/* Match Context Pill */}
                  <View style={styles.itemContext}>
                    <Sparkles size={11} color={COLORS.ai} />
                    <Text style={styles.contextText} numberOfLines={1}>
                      {item.itemSummary.title} ({item.itemSummary.matchScore}% Match)
                    </Text>
                  </View>

                  {/* Message Snippet */}
                  <Text style={styles.messageSnippet} numberOfLines={1}>
                    {lastMsg ? lastMsg.content : 'No messages yet'}
                  </Text>
                </View>

                {/* Item Thumbnail */}
                {item.itemSummary.lostImage && (
                  <Image
                    source={{ uri: item.itemSummary.lostImage }}
                    style={styles.itemThumb}
                  />
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                icon={<MessageSquare size={32} color={COLORS.textMuted} />}
                title="No conversations yet"
                description="When you or someone else connects regarding a potential item match, conversations appear here."
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
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.foundLight,
    paddingVertical: 8,
    paddingHorizontal: SPACING.base,
    gap: 8,
  },
  privacyText: {
    ...TYPOGRAPHY.small,
    fontSize: 11,
    color: COLORS.foundDark,
    flex: 1,
  },
  listContent: {
    padding: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceSubtle,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.found,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  cardContent: {
    flex: 1,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    ...TYPOGRAPHY.h3,
    fontSize: 15,
    color: COLORS.text,
  },
  timestamp: {
    ...TYPOGRAPHY.small,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  itemContext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  contextText: {
    ...TYPOGRAPHY.small,
    color: COLORS.aiDark,
    fontWeight: '600',
  },
  messageSnippet: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  itemThumb: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
