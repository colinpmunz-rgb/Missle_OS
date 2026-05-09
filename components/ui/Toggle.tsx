import React from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';
import { Txt } from './Typography';

interface ToggleProps {
  label: string;
  value: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export function Toggle({ label, value, onPress, disabled }: ToggleProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Txt variant="bodyMedium" style={{ flex: 1, color: value ? C.text : C.textMuted }}>
        {label}
      </Txt>
      <View style={[
        styles.box,
        { borderColor: value ? C.primary : C.border },
        value && { backgroundColor: C.primary },
      ]}>
        {value && <View style={styles.check} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  pressed: { opacity: 0.7 },
  box: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
});
