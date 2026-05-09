import React from 'react';
import { View, StyleSheet, ViewStyle, useColorScheme } from 'react-native';
import { Colors, Spacing, Radius } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

export function Card({ children, style, padded = true }: CardProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  return (
    <View style={[
      styles.card,
      { backgroundColor: C.surface, borderColor: C.border },
      padded && styles.padded,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  padded: {
    padding: Spacing.md,
  },
});
