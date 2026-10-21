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
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={COLORS.text} />
          <Text style={styles.backBtnText}>Back to login</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          {submitted ? (
            <View style={styles.successWrapper}>
              <CheckCircle2 size={48} color={COLORS.found} />
              <Text style={styles.successTitle}>Reset Email Sent</Text>
              <Text style={styles.successDesc}>
                We've sent password reset instructions to{' '}
                <Text style={{ fontWeight: '700' }}>{email}</Text>. Please check your inbox.
              </Text>
              <Button
                title="Return to Sign In"
                onPress={() => router.replace('/(auth)/login')}
                variant="primary"
                style={{ marginTop: SPACING.lg, width: '100%' }}
              />
            </View>
          ) : (
            <>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              <Input
                label="Email Address"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Mail size={18} color={COLORS.textSecondary} />}
              />

              <Button
                title="Send Reset Link"
                onPress={handleSubmit}
                loading={loading}
                variant="primary"
                size="lg"
                style={{ marginTop: SPACING.md }}
              />
            </>
          )}
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
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    justifyContent: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: 6,
  },
  backBtnText: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.text,
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
    lineHeight: 18,
  },
  successWrapper: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  successTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  successDesc: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
