import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MoreVertical, ShieldAlert, Flag, Ban } from 'lucide-react-native';
import { chatService } from '../../services/chatService';
import { matchService } from '../../services/matchService';
import { useAuthStore } from '../../store/authStore';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { MatchContextBanner } from '../../components/chat/MatchContextBanner';
import { SafetyDisclaimerBanner } from '../../components/chat/SafetyDisclaimerBanner';
import { ChatMessage } from '../../types/chat';
import { Match } from '../../types/match';
import { LostItem, FoundItem } from '../../types/item';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

const QUICK_PROMPTS = [
  'Does the case have a small orange sticker?',
  'Can we meet at the University Library front desk?',
  'What time works best for you today?',
  'I will bring my student ID to verify.',
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [match, setMatch] = useState<Match | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const cleanChatId = id || 'chat-match-301';
  const matchId = cleanChatId.replace('chat-', '');

  useEffect(() => {
    // Load match details
    matchService.getMatchById(matchId).then((m) => {
      if (m) setMatch(m);
    });

    // Load initial messages
    chatService.getMessages(cleanChatId).then((msgs) => {
      setMessages(msgs);
    });
  }, [cleanChatId, matchId]);

  const handleSendMessage = async (text: string, imageUri?: string) => {
    if (!user) return;
    const newMsg = await chatService.sendMessage(cleanChatId, text, user, imageUri);
    setMessages((prev) => [...prev, newMsg]);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Auto reply simulation after 1.5 seconds if sent by User A
    if (user.email === 'alex@example.com') {
      setIsTyping(true);
      setTimeout(async () => {
        setIsTyping(false);
        const reply = await chatService.sendMessage(
          cleanChatId,
          "Sounds great! I will have the phone with me at the Science Center front desk. See you then!",
          {
            _id: 'user-b-456',
            name: 'Sarah Chen',
            email: 'sarah@example.com',
            isVerified: true,
            createdAt: '',
            updatedAt: '',
          }
        );
        setMessages((prev) => [...prev, reply]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }, 2000);
    }
  };

  const handleMenuAction = () => {
    Alert.alert('Safety Actions', 'Select an action:', [
      {
        text: 'Report Suspicious User',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Report Filed', 'Thank you. Our moderation team will review this conversation.'),
      },
      {
        text: 'Block User',
        style: 'destructive',
        onPress: () => {
          Alert.alert('User Blocked', 'You will no longer receive messages from this user.');
          router.back();
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const lostItem = match?.lostItemId as LostItem | undefined;
  const foundItem = match?.foundItemId as FoundItem | undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.container}
      >
        {/* Match Context Header Banner */}
        {match && (
          <MatchContextBanner
            title={lostItem?.title || foundItem?.title || 'Matched Item'}
            matchScore={match.matchScore}
            matchStatus={match.status}
            lostImage={lostItem?.images?.[0]}
            foundImage={foundItem?.images?.[0]}
            onViewMatch={() => router.push(`/matches/${match._id}` as any)}
          />
        )}

        {/* Safety Tips Banner */}
        <SafetyDisclaimerBanner />

        {/* Message Feed */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isMyMessage={item.senderId === user?._id || item.senderId === (user as any)?.id}
            />
          )}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>Sarah is typing...</Text>
              </View>
            ) : null
          }
        />

        {/* Quick Suggestion Chips */}
        <View style={styles.quickPromptsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => handleSendMessage(prompt)}
                style={styles.quickChip}
              >
                <Text style={styles.quickChipText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Input Bar */}
        <ChatInput onSendMessage={handleSendMessage} />
      </KeyboardAvoidingView>
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
  listContent: {
    paddingVertical: SPACING.base,
  },
  typingIndicator: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 4,
  },
  typingText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  quickPromptsWrapper: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 6,
  },
  quickScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  quickChip: {
    backgroundColor: COLORS.surfaceSubtle,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickChipText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
});
