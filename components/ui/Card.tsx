import React from 'react';
import { Platform, View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  glass?: boolean;
}

export function Card({ children, style, padded = true, glass = false }: CardProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const isDark = scheme === 'dark';

  const glassWeb = Platform.OS === 'web' && isDark && glass ? ({
    backdropFilter: 'blur(24px) saturate(1.2)',
    boxShadow: '0 2px 32px rgba(0,0,0,0.45)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.07)',
  } as any) : {};

  return (
    <View style={[
      styles.card,
      { backgroundColor: C.surface, borderColor: C.border },
      padded && styles.padded,
      glassWeb,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  padded: {
    padding: Spacing.md,
  },
});
