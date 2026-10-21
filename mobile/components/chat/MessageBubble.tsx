import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';
import { ChatMessage } from '../../types/chat';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { formatDate } from '../../utils/formatters';

interface MessageBubbleProps {
  message: ChatMessage;
  isMyMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMyMessage,
}) => {
  return (
    <View
      style={[
        styles.container,
        isMyMessage ? styles.myContainer : styles.theirContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMyMessage ? styles.myBubble : styles.theirBubble,
        ]}
      >
        {!isMyMessage && (
          <Text style={styles.senderName}>
            {message.senderName || (message as any).sender?.name || 'User'}
          </Text>
        )}

        {message.imageUri && (
          <Image
            source={{ uri: message.imageUri }}
            style={styles.attachedImage}
            resizeMode="cover"
          />
        )}

        <Text
          style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.theirMessageText,
          ]}
        >
          {message.content || (message as any).text || ''}
        </Text>

        <View style={styles.metaRow}>
          <Text
            style={[
              styles.timeText,
              isMyMessage ? styles.myTimeText : styles.theirTimeText,
            ]}
          >
            {formatDate(message.createdAt)}
          </Text>

          {isMyMessage && (
            <View style={styles.statusIcon}>
              {message.isRead ? (
                <CheckCheck size={13} color={COLORS.primaryLight} />
              ) : (
                <Check size={13} color={COLORS.primaryLight} />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
  },
  myContainer: {
    justifyContent: 'flex-end',
  },
  theirContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
  },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  theirBubble: {
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 2,
  },
  senderName: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  attachedImage: {
    width: 200,
    height: 140,
    borderRadius: RADIUS.md,
    marginBottom: 6,
  },
  messageText: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: COLORS.white,
  },
  theirMessageText: {
    color: COLORS.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timeText: {
    ...TYPOGRAPHY.small,
    fontSize: 10,
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  theirTimeText: {
    color: COLORS.textMuted,
  },
  statusIcon: {
    marginLeft: 2,
  },
});
