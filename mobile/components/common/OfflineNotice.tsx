import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface OfflineNoticeProps {
  isOffline?: boolean;
}

export const OfflineNotice: React.FC<OfflineNoticeProps> = ({ isOffline = false }) => {
  if (!isOffline) return null;

  return (
    <View style={styles.container}>
      <WifiOff size={16} color={COLORS.white} />
      <Text style={styles.text}>Offline Mode: Changes saved locally and will sync when reconnected</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  text: {
    ...TYPOGRAPHY.small,
    color: COLORS.white,
    fontWeight: '500',
  },
});
