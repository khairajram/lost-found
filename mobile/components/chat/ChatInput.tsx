import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Send, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface ChatInputProps {
  onSendMessage: (text: string, imageUri?: string) => Promise<void>;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    const msgToSend = text.trim();
    setText('');
    try {
      setSending(true);
      await onSendMessage(msgToSend);
    } catch (err) {
      console.warn('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSending(true);
        await onSendMessage('Sent a photo', result.assets[0].uri);
        setSending(false);
      }
    } catch (err) {
      console.warn('Could not attach image:', err);
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePickImage}
        disabled={disabled || sending}
        style={styles.attachBtn}
        activeOpacity={0.7}
      >
        <ImageIcon size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor={COLORS.textMuted}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={1000}
        editable={!disabled && !sending}
      />

      <TouchableOpacity
        onPress={handleSend}
        disabled={!text.trim() || disabled || sending}
        style={[
          styles.sendBtn,
          (!text.trim() || disabled || sending) && styles.sendBtnDisabled,
        ]}
        activeOpacity={0.8}
      >
        {sending ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <Send size={18} color={COLORS.white} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceSubtle,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    maxHeight: 100,
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.text,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.5,
  },
});
