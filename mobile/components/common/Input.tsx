import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureTextEntry,
  containerStyle,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          Boolean(error) && styles.inputError,
          rest.multiline && styles.inputMultiline,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, rest.multiline && styles.textMultiline, style]}
          placeholderTextColor={COLORS.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...rest}
        />

        {isPassword ? (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <EyeOff size={18} color={COLORS.textSecondary} />
            ) : (
              <Eye size={18} color={COLORS.textSecondary} />
            )}
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.captionSemibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  inputMultiline: {
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    minHeight: 90,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  textMultiline: {
    textAlignVertical: 'top',
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.danger,
    marginTop: SPACING.xs,
  },
  helperText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
