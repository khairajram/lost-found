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
import { Sparkles, User as UserIcon, Mail, Phone, Lock, ArrowLeft } from 'lucide-react-native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuthStore } from '../../store/authStore';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setValidationError('Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    setValidationError(null);
    clearError();

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
      });
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setValidationError(err.message || 'Registration failed.');
    }
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={COLORS.text} />
          <Text style={styles.backBtnText}>Back to login</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join Find & Lost to report lost items or reunite people with their belongings
          </Text>
        </View>

        <View style={styles.card}>
          {(validationError || error) && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{validationError || error}</Text>
            </View>
          )}

          <Input
            label="Full Name *"
            placeholder="Alex Rivera"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (validationError) setValidationError(null);
            }}
            leftIcon={<UserIcon size={18} color={COLORS.textSecondary} />}
          />

          <Input
            label="Email Address *"
            placeholder="alex@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (validationError) setValidationError(null);
            }}
            leftIcon={<Mail size={18} color={COLORS.textSecondary} />}
          />

          <Input
            label="Phone Number (Optional)"
            placeholder="+1 (555) 000-0000"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            helperText="Kept private by default. Only used for verified urgent contact."
            leftIcon={<Phone size={18} color={COLORS.textSecondary} />}
          />

          <Input
            label="Password *"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (validationError) setValidationError(null);
            }}
            leftIcon={<Lock size={18} color={COLORS.textSecondary} />}
          />

          <Input
            label="Confirm Password *"
            placeholder="••••••••"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (validationError) setValidationError(null);
            }}
            leftIcon={<Lock size={18} color={COLORS.textSecondary} />}
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            variant="primary"
            size="lg"
            style={styles.submitBtn}
          />

          <View style={styles.loginFooter}>
            <Text style={styles.loginText}>Already registered? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
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
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  submitBtn: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  loginFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  loginLink: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.primary,
  },
});
