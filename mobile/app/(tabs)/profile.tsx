import React from 'react';
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
import { useRouter } from 'expo-router';
import {
  ShieldCheck,
  FileText,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
  ArrowRightLeft,
  Bell,
  CheckCircle,
} from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, switchDemoUser } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleSwitchDemo = async () => {
    const isCurrentlyUserA = user?.email === 'alex@example.com';
    const target = isCurrentlyUserA ? 'userB' : 'userA';
    await switchDemoUser(target);
    Alert.alert(
      'Switched Demo User',
      `Switched to ${target === 'userA' ? 'Alex Rivera (Lost Samsung Phone)' : 'Sarah Chen (Found Samsung Phone)'}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <Image
            source={{
              uri:
                user?.profileImage ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
            }}
            style={styles.avatar}
          />
          <View style={styles.userMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user?.name || 'Explorer'}</Text>
              {user?.isVerified && (
                <ShieldCheck size={18} color={COLORS.primary} style={{ marginLeft: 4 }} />
              )}
            </View>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userArea}>
              {user?.location?.approximateArea || 'San Francisco, CA'}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>2</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: COLORS.found }]}>1</Text>
            <Text style={styles.statLabel}>Reunited</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statVal, { color: COLORS.ai }]}>1</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
        </View>

        {/* Demo Quick Switch Card */}
        <View style={styles.demoBanner}>
          <View style={styles.demoBannerContent}>
            <Text style={styles.demoBannerTitle}>Active Persona: {user?.name}</Text>
            <Text style={styles.demoBannerDesc}>
              {user?.email === 'alex@example.com'
                ? 'Role: Owner who lost Samsung Galaxy S23'
                : 'Role: Finder who found Samsung Galaxy phone'}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSwitchDemo}
            style={styles.switchBtn}
          >
            <ArrowRightLeft size={16} color={COLORS.primary} />
            <Text style={styles.switchBtnText}>Switch</Text>
          </TouchableOpacity>
        </View>

        {/* Actions Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuHeader}>Management</Text>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/my-reports')}
          >
            <View style={[styles.menuIconBg, { backgroundColor: COLORS.primaryLight }]}>
              <FileText size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.menuLabel}>My Reports (Lost & Found)</Text>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/matches')}
          >
            <View style={[styles.menuIconBg, { backgroundColor: COLORS.aiLight }]}>
              <CheckCircle size={18} color={COLORS.ai} />
            </View>
            <Text style={styles.menuLabel}>AI Match History</Text>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <Text style={styles.menuHeader}>Preferences & Safety</Text>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/settings/privacy')}
          >
            <View style={[styles.menuIconBg, { backgroundColor: COLORS.foundLight }]}>
              <Shield size={18} color={COLORS.foundDark} />
            </View>
            <Text style={styles.menuLabel}>Privacy & Geolocation Safety</Text>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => router.push('/settings')}
          >
            <View style={[styles.menuIconBg, { backgroundColor: COLORS.surfaceSubtle }]}>
              <Settings size={18} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.menuLabel}>App Settings & Notifications</Text>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={[styles.menuIconBg, { backgroundColor: COLORS.lostLight }]}>
              <LogOut size={18} color={COLORS.lost} />
            </View>
            <Text style={[styles.menuLabel, { color: COLORS.lost }]}>Sign Out</Text>
            <ChevronRight size={18} color={COLORS.lost} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    gap: 16,
    ...SHADOWS.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  userMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
    color: COLORS.text,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  userArea: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  statLabel: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.border,
    alignSelf: 'center',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  demoBannerContent: {
    flex: 1,
    marginRight: 12,
  },
  demoBannerTitle: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.primaryDark,
  },
  demoBannerDesc: {
    ...TYPOGRAPHY.small,
    color: COLORS.primary,
    marginTop: 2,
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    gap: 6,
  },
  switchBtnText: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    color: COLORS.primary,
  },
  menuSection: {
    marginBottom: SPACING.xl,
  },
  menuHeader: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    gap: 12,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    ...TYPOGRAPHY.bodyMedium,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  logoutItem: {
    marginTop: SPACING.md,
    borderColor: COLORS.lostLight,
  },
});
