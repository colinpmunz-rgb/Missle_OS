import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Card } from '../ui/Card';
import { Txt } from '../ui/Typography';
import { Colors } from '../../constants/theme';

interface HydrationRingProps {
  oz: number;
  target: number;
}

const SIZE = 80;
const STROKE = 8;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export function HydrationRing({ oz, target }: HydrationRingProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const pct = Math.min(1, target > 0 ? oz / target : 0);
  const dash = pct * CIRC;
  const gap = CIRC - dash;

  return (
    <Card style={styles.card}>
      <Txt variant="labelMedium" color={C.textMuted}>Hydration</Txt>
      <View style={styles.ring}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            stroke={C.border} strokeWidth={STROKE} fill="none"
          />
          <Circle
            cx={SIZE / 2} cy={SIZE / 2} r={R}
            stroke={C.primary} strokeWidth={STROKE} fill="none"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={CIRC / 4}
            strokeLinecap="round"
          />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Txt variant="labelMedium">{oz}</Txt>
          <Txt variant="labelSmall" color={C.textMuted}>oz</Txt>
        </View>
      </View>
      <Txt variant="bodySmall" color={C.textMuted} style={{ textAlign: 'center' }}>
        goal {target}oz
      </Txt>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, alignItems: 'center' },
  ring: { position: 'relative', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  center: { position: 'absolute', alignItems: 'center' },
});
