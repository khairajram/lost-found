import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react-native';
import { SimilarityBreakdown } from '../../types/match';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface AIReasoningCardProps {
  breakdown: SimilarityBreakdown;
  reasons: string[];
}

interface SignalBarProps {
  label: string;
  value: number;
}

const SignalBar: React.FC<SignalBarProps> = ({ label, value }) => {
  const getBarColor = (val: number) => {
    if (val >= 85) return COLORS.found;
    if (val >= 70) return COLORS.primary;
    if (val >= 50) return COLORS.warning;
    return COLORS.textMuted;
  };

  const barColor = getBarColor(value);

  return (
    <View style={styles.signalRow}>
      <View style={styles.signalLabelRow}>
        <Text style={styles.signalLabel}>{label}</Text>
        <Text style={[styles.signalValue, { color: barColor }]}>{value}%</Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${value}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
};

export const AIReasoningCard: React.FC<AIReasoningCardProps> = ({
  breakdown,
  reasons,
}) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Sparkles size={18} color={COLORS.ai} />
        </View>
        <Text style={styles.headerTitle}>AI Matching Analysis</Text>
      </View>

      {/* Similarity Breakdown Bars */}
      <View style={styles.signalsContainer}>
        <Text style={styles.sectionSubtitle}>Signals Breakdown</Text>
        <SignalBar label="Visual Similarity" value={breakdown.visualSimilarity} />
        <SignalBar label="Category Similarity" value={breakdown.categorySimilarity} />
        <SignalBar label="Color Similarity" value={breakdown.colorSimilarity} />
        <SignalBar label="Brand & Model" value={breakdown.brandSimilarity} />
        <SignalBar label="Location Proximity" value={breakdown.locationSimilarity} />
        <SignalBar label="Date Proximity" value={breakdown.dateSimilarity} />
        <SignalBar label="Description Similarity" value={breakdown.descriptionSimilarity} />
      </View>

      {/* Reasoning Bullets */}
      <View style={styles.reasonsContainer}>
        <Text style={styles.sectionSubtitle}>Why AI flagged this potential match:</Text>
        {reasons.map((reason, index) => (
          <View key={index} style={styles.reasonRow}>
            <CheckCircle2 size={16} color={COLORS.primary} style={styles.reasonIcon} />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ))}
      </View>

      {/* Safety Notice */}
      <View style={styles.safetyNotice}>
        <ShieldAlert size={16} color="#B45309" style={styles.safetyIcon} />
        <Text style={styles.safetyText}>
          AI-generated matches are intelligent suggestions and may be incorrect. Always verify ownership using details that are not publicly visible before handing over an item.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
    marginBottom: SPACING.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: 8,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.aiLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  signalsContainer: {
    marginBottom: SPACING.base,
    backgroundColor: COLORS.surfaceSubtle,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  sectionSubtitle: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  signalRow: {
    marginBottom: 8,
  },
  signalLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  signalLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  signalValue: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  reasonsContainer: {
    marginBottom: SPACING.base,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reasonIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  reasonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text,
    flex: 1,
    lineHeight: 18,
  },
  safetyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warningLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  safetyIcon: {
    marginTop: 2,
  },
  safetyText: {
    ...TYPOGRAPHY.small,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
});
