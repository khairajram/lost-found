import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { ShieldCheck, X, AlertCircle } from 'lucide-react-native';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface OwnershipVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (answer: string) => Promise<void>;
  isOwner: boolean;
  itemTitle: string;
}

export const OwnershipVerificationModal: React.FC<OwnershipVerificationModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isOwner,
  itemTitle,
}) => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!answer.trim() || answer.trim().length < 3) {
      setError('Please provide specific identifying details (at least 3 characters).');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(answer.trim());
      setAnswer('');
      onClose();
    } catch (e: any) {
      setError(e.message || 'Verification submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconWrapper}>
                <ShieldCheck size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.title}>Verify Ownership</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.itemTarget}>Item: {itemTitle}</Text>

            <View style={styles.infoBox}>
              <AlertCircle size={16} color={COLORS.primary} style={{ marginTop: 2 }} />
              <Text style={styles.infoText}>
                {isOwner
                  ? 'Describe details only the true owner would know (e.g. lockscreen wallpaper, engraving, inside contents, serial suffix). This is not shown on the public report.'
                  : 'Confirm the private characteristics provided by the claimant against the physical item in your possession.'}
              </Text>
            </View>

            <Input
              label={isOwner ? 'Private Identifying Features' : 'Verification Notes'}
              placeholder={
                isOwner
                  ? 'e.g. Lockscreen has a golden retriever photo, small orange sticker inside case...'
                  : 'e.g. Confirmed sticker matches description...'
              }
              value={answer}
              onChangeText={(text) => {
                setAnswer(text);
                if (error) setError(null);
              }}
              multiline
              numberOfLines={4}
              error={error || undefined}
            />

            <View style={styles.actions}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={onClose}
                style={styles.cancelBtn}
              />
              <Button
                title={isOwner ? 'Submit Verification' : 'Confirm Match'}
                variant="primary"
                loading={loading}
                onPress={handleConfirm}
                style={styles.submitBtn}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  closeBtn: {
    padding: 4,
  },
  itemTarget: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSubtle,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    gap: 8,
    marginBottom: SPACING.base,
  },
  infoText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  cancelBtn: {
    flex: 1,
  },
  submitBtn: {
    flex: 2,
  },
});
