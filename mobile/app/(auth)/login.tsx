import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Mail, Lock, UserCheck } from 'lucide-react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuthStore } from '../../store/authStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, switchDemoUser, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('password123');
  const [formError, setFormError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setFormError('Please fill in both email and password.');
      return;
    }
    setFormError(null);
    clearError();

    try {
      await login({ email, password });
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setFormError(err.message || 'Login failed. Check your credentials.');
    }
  };

  const handleDemoSwitch = async (role: 'userA' | 'userB') => {
    clearError();
    await switchDemoUser(role);
    router.replace('/(tabs)/home');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Branding Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Sparkles size={36} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>Find & Lost</Text>
          <Text style={styles.tagline}>Intelligent AI Item Recovery</Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to manage and track your item reports</Text>

          {(formError || error) && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{formError || error}</Text>
            </View>
          )}

          <Input
            label="Email Address"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (formError) setFormError(null);
            }}
            leftIcon={<Mail size={18} color={COLORS.textSecondary} />}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (formError) setFormError(null);
            }}
            leftIcon={<Lock size={18} color={COLORS.textSecondary} />}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotBtnText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            variant="primary"
            size="lg"
            style={styles.submitBtn}
          />

          {/* Quick Demo Switcher */}
          <View style={styles.demoSection}>
            <View style={styles.demoHeader}>
              <UserCheck size={16} color={COLORS.primary} />
              <Text style={styles.demoTitle}>One-Tap Demo Switcher</Text>
            </View>
            <Text style={styles.demoSubtitle}>
              Test matching immediately as either the item loser or the finder:
            </Text>

            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleDemoSwitch('userA')}
                style={[styles.demoBtn, styles.demoBtnA]}
              >
                <Text style={styles.demoBtnRole}>User A (Alex)</Text>
                <Text style={styles.demoBtnDesc}>Lost Samsung S23</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleDemoSwitch('userB')}
                style={[styles.demoBtn, styles.demoBtnB]}
              >
                <Text style={styles.demoBtnRole}>User B (Sarah)</Text>
                <Text style={styles.demoBtnDesc}>Found Samsung S23</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Link */}
          <View style={styles.registerFooter}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  tagline: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  errorBanner: {
    backgroundColor: COLORS.lostLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  errorBannerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.lostDark,
    fontWeight: '500',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  forgotBtnText: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.primary,
  },
  submitBtn: {
    marginBottom: SPACING.lg,
  },
  demoSection: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  demoTitle: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.primary,
  },
  demoSubtitle: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  demoBtnA: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  demoBtnB: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  demoBtnRole: {
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    color: COLORS.text,
  },
  demoBtnDesc: {
    ...TYPOGRAPHY.small,
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  registerFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  registerLink: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.primary,
  },
});
