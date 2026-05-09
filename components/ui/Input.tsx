import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, useColorScheme } from 'react-native';
import { Colors, Fonts, Radius, Spacing } from '../../constants/theme';
import { Txt } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];

  return (
    <View style={styles.wrapper}>
      {label && (
        <Txt variant="labelMedium" color={C.textMuted} style={styles.label}>
          {label}
        </Txt>
      )}
      <TextInput
        style={[
          styles.input,
          {
            color: C.text,
            backgroundColor: C.surface,
            borderColor: error ? C.error : C.border,
          },
          style,
        ]}
        placeholderTextColor={C.textMuted}
        {...props}
      />
      {error && (
        <Txt variant="bodySmall" color={C.error} style={styles.error}>
          {error}
        </Txt>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 4 },
  label: { marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.sm + 2,
    fontFamily: Fonts.inter.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  error: { marginTop: 2 },
});
