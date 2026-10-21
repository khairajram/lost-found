import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressTrack}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <React.Fragment key={index}>
              {/* Connector line between steps */}
              {index > 0 && (
                <View
                  style={[
                    styles.connector,
                    stepNum <= currentStep ? styles.connectorActive : styles.connectorInactive,
                  ]}
                />
              )}

              {/* Step Circle */}
              <View
                style={[
                  styles.circle,
                  isActive && styles.circleActive,
                  isCompleted && styles.circleCompleted,
                ]}
              >
                {isCompleted ? (
                  <Check size={12} color={COLORS.white} strokeWidth={3} />
                ) : (
                  <Text
                    style={[
                      styles.circleText,
                      isActive && styles.circleTextActive,
                    ]}
                  >
                    {stepNum}
                  </Text>
                )}
              </View>
            </React.Fragment>
          );
        })}
      </View>

      <Text style={styles.currentStepLabel}>
        Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1] || ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  progressTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  connector: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  connectorActive: {
    backgroundColor: COLORS.primary,
  },
  connectorInactive: {
    backgroundColor: COLORS.border,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  circleCompleted: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  circleText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  circleTextActive: {
    color: COLORS.primary,
  },
  currentStepLabel: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.text,
    textAlign: 'center',
  },
});
