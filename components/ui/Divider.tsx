import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';

interface DividerProps { spacing?: number }

export function Divider({ spacing = Spacing.md }: DividerProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  return <View style={[styles.line, { backgroundColor: C.border, marginVertical: spacing }]} />;
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, width: '100%' },
});
