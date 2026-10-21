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
  ArrowRightLeft,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Check,
  MapPin,
  Calendar,
} from 'lucide-react-native';
import { matchService } from '../../services/matchService';
import { useAuthStore } from '../../store/authStore';
import { ScoreMeter } from '../../components/matching/ScoreMeter';
import { AIReasoningCard } from '../../components/matching/AIReasoningCard';
import { OwnershipVerificationModal } from '../../components/matching/OwnershipVerificationModal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Match } from '../../types/match';
import { LostItem, FoundItem } from '../../types/item';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { formatDistance, formatDate } from '../../utils/formatters';

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const [match, setMatch] = useState<Match | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      matchService.getMatchById(id).then((m) => setMatch(m));
    }
  }, [id]);

  if (!match) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading match analysis...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const lostItem = match.lostItemId as LostItem;
  const foundItem = match.foundItemId as FoundItem;

  const isOwner =
    typeof match.lostUserId === 'object'
      ? match.lostUserId._id === user?._id
      : match.lostUserId === user?._id;

  const handleAccept = async () => {
    try {
      setActionLoading(true);
      const updated = await matchService.acceptMatch(match._id);
      setMatch(updated);
      Alert.alert(
        'Match Accepted',
        'You have accepted this potential match. You can now chat securely and arrange item return.',
        [
          {
            text: 'Open Chat',
            onPress: () => router.push(`/chat/chat-${match._id}` as any),
          },
          { text: 'Stay Here', style: 'cancel' },
        ]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not accept match');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    Alert.alert(
      'Not Your Item?',
      'Rejecting this match will dismiss it and let the system know this item is not a match.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject Match',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            const updated = await matchService.rejectMatch(match._id);
            setMatch(updated);
            setActionLoading(false);
          },
        },
      ]
    );
  };

  const handleVerificationSubmit = async (answer: string) => {
    const updated = await matchService.submitVerification(match._id, answer);
    setMatch(updated);
    Alert.alert(
      'Ownership Proof Submitted',
      'The finder has been notified to verify your submitted identifying feature against the item.'
    );
  };

  const handleMarkReturned = async () => {
    Alert.alert(
      'Confirm Item Returned',
      'Have you successfully handed over / received this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Item Returned',
          onPress: async () => {
            setActionLoading(true);
            const updated = await matchService.confirmReturned(match._id, {
              handoverCompleted: true,
            });
            setMatch(updated);
            setActionLoading(false);
            Alert.alert(
              'Item Returned!',
              'Congratulations! The item has been marked as safely returned.'
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Confidence Box */}
        <View style={styles.topScoreBanner}>
          <ScoreMeter score={match.matchScore} size="lg" />
          <View style={styles.scoreTextWrapper}>
            <Text style={styles.scoreHeadline}>High Potential Match</Text>
            <Text style={styles.scoreSubheadline}>
              Computed by local Ollama vision model combining visual features, location, and timestamps.
            </Text>
          </View>
        </View>

        {/* Side-by-Side Comparison */}
        <View style={styles.comparisonContainer}>
          <Text style={styles.sectionTitle}>Visual Comparison</Text>

          <View style={styles.photosRow}>
            {/* Lost Item Photo */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.photoCol}
              onPress={() => router.push(`/lost/${lostItem?._id}` as any)}
            >
              <View style={styles.photoWrapper}>
                <Image
                  source={{
                    uri:
                      lostItem?.images?.[0] ||
                      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
                  }}
                  style={styles.photo}
                />
                <View style={[styles.photoTag, { backgroundColor: COLORS.lost }]}>
                  <Text style={styles.photoTagText}>Your Lost Item</Text>
                </View>
              </View>
              <Text style={styles.photoTitle} numberOfLines={1}>
                {lostItem?.title}
              </Text>
              <Text style={styles.photoMeta}>
                📍 {lostItem?.lostLocation?.approximateArea || 'Campus'}
              </Text>
            </TouchableOpacity>

            <View style={styles.swapIconWrapper}>
              <ArrowRightLeft size={18} color={COLORS.primary} />
            </View>

            {/* Found Item Photo */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.photoCol}
              onPress={() => router.push(`/found/${foundItem?._id}` as any)}
            >
              <View style={styles.photoWrapper}>
                <Image
                  source={{
                    uri:
                      foundItem?.images?.[0] ||
                      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
                  }}
                  style={styles.photo}
                />
                <View style={[styles.photoTag, { backgroundColor: COLORS.found }]}>
                  <Text style={styles.photoTagText}>Reported Found</Text>
                </View>
              </View>
              <Text style={styles.photoTitle} numberOfLines={1}>
                {foundItem?.title}
              </Text>
              <Text style={styles.photoMeta}>
                📍 {foundItem?.foundLocation?.approximateArea || 'Campus'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Reasoning Analysis Breakdown */}
        <AIReasoningCard
          breakdown={match.similarityBreakdown}
          reasons={match.aiReasoning}
        />

        {/* Ownership Verification Box */}
        <View style={styles.verificationCard}>
          <View style={styles.verificationHeader}>
            <ShieldCheck size={20} color={COLORS.primary} />
            <Text style={styles.verificationTitle}>Ownership Verification</Text>
          </View>

          <Text style={styles.verificationDesc}>
            Verify secret details not visible publicly (e.g. lockscreen photo, inside sticker, serial code) to confirm true ownership before meeting.
          </Text>

          {match.verificationStatus === 'PASSED' ? (
            <View style={styles.statusPassedBox}>
              <CheckCircle2 size={18} color={COLORS.foundDark} />
              <Text style={styles.statusPassedText}>
                Ownership Proof Submitted & Verified
              </Text>
            </View>
          ) : (
            <Button
              title={isOwner ? 'Submit Private Identifying Proof' : 'Verify Owner Proof'}
              variant="outline"
              icon={<ShieldCheck size={18} color={COLORS.primary} />}
              onPress={() => setShowVerifyModal(true)}
              style={{ marginTop: SPACING.sm }}
            />
          )}
        </View>

        {/* Primary Action Buttons */}
        <View style={styles.actionsSection}>
          {match.status === 'RETURNED' ? (
            <View style={styles.returnedBanner}>
              <CheckCircle2 size={24} color={COLORS.found} />
              <Text style={styles.returnedText}>
                This item was confirmed returned successfully!
              </Text>
            </View>
          ) : (
            <>
              {match.status === 'POTENTIAL' && (
                <View style={styles.buttonRow}>
                  <Button
                    title="Not My Item"
                    variant="secondary"
                    onPress={handleReject}
                    loading={actionLoading}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Accept Match"
                    variant="primary"
                    onPress={handleAccept}
                    loading={actionLoading}
                    style={{ flex: 1 }}
                  />
                </View>
              )}

              <Button
                title={isOwner ? 'Chat with Finder' : 'Chat with Owner'}
                variant="primary"
                size="lg"
                icon={<MessageSquare size={18} color={COLORS.white} />}
                onPress={() => router.push(`/chat/chat-${match._id}` as any)}
                style={{ marginTop: 12 }}
              />

              <Button
                title="Mark Item Returned Successfully"
                variant="success"
                icon={<Check size={18} color={COLORS.white} />}
                onPress={handleMarkReturned}
                loading={actionLoading}
                style={{ marginTop: 12 }}
              />
            </>
          )}
        </View>
      </ScrollView>

      <OwnershipVerificationModal
        visible={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onSubmit={handleVerificationSubmit}
        isOwner={isOwner}
        itemTitle={lostItem?.title || 'Reported Item'}
      />
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
    padding: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
  topScoreBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
    gap: 16,
    ...SHADOWS.sm,
  },
  scoreTextWrapper: {
    flex: 1,
  },
  scoreHeadline: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: 2,
  },
  scoreSubheadline: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  comparisonContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photoCol: {
    flex: 1,
  },
  photoWrapper: {
    height: 140,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceSubtle,
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  photoTagText: {
    ...TYPOGRAPHY.small,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.white,
  },
  photoTitle: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.text,
    marginTop: 6,
  },
  photoMeta: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  swapIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  verificationCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  verificationTitle: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  verificationDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  statusPassedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.foundLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: 8,
    marginTop: 6,
  },
  statusPassedText: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.foundDark,
  },
  actionsSection: {
    marginTop: SPACING.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  returnedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.foundLight,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    gap: 8,
  },
  returnedText: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.foundDark,
  },
});
