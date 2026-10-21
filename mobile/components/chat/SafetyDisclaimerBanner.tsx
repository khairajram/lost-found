import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export const SafetyDisclaimerBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <ShieldCheck size={16} color="#B45309" style={{ marginTop: 1 }} />
      <Text style={styles.text}>
        Safety Tip: Always arrange to meet in a well-lit, public place (e.g. campus security or library). Never transfer funds or share private passwords.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: 8,
    alignItems: 'flex-start',
  },
  text: {
    ...TYPOGRAPHY.small,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
});
