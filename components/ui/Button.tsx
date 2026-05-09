import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { Txt } from './Typography';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, style, fullWidth }: ButtonProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];

  const bg = {
    primary: C.primary,
    secondary: C.surface,
    ghost: 'transparent',
  }[variant];

  const textColor = {
    primary: '#fff',
    secondary: C.text,
    ghost: C.primary,
  }[variant];

  const borderColor = {
    primary: C.primary,
    secondary: C.border,
    ghost: 'transparent',
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderColor },
        fullWidth && styles.full,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Txt variant="labelLarge" color={textColor}>{label}</Txt>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  full: { alignSelf: 'stretch' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
});
