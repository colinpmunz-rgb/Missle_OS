import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Card } from '../ui/Card';
import { Txt } from '../ui/Typography';
import { Colors } from '../../constants/theme';
import type { GarminData } from '../../constants/types';

interface BodyBatteryProps {
  garmin: GarminData | null;
}

function getBatteryColor(val: number): string {
  if (val >= 70) return '#2D5A3A';
  if (val >= 40) return '#B8860B';
  return '#C0392B';
}

export function BodyBattery({ garmin }: BodyBatteryProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const val = garmin?.body_battery ?? null;

  return (
    <Card style={styles.card}>
      <Txt variant="labelMedium" color={C.textMuted}>Body Battery</Txt>
      {val !== null ? (
        <View style={styles.row}>
          <Txt variant="displayLarge" color={getBatteryColor(val)}>{val}</Txt>
          <Txt variant="bodyMedium" color={C.textMuted} style={styles.unit}>/100</Txt>
        </View>
      ) : (
        <Txt variant="bodyMedium" color={C.textMuted} style={{ marginTop: 4 }}>
          Log in Body tab
        </Txt>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginTop: 4 },
  unit: { marginBottom: 6 },
});
