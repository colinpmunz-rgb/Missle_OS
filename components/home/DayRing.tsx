import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { Colors, Fonts } from '../../constants/theme';

const RING = 180;
const SW = 10;
const R = (RING - SW) / 2;
const CIRC = 2 * Math.PI * R;
const AWAKE_START = 8 * 60;
const AWAKE_END = 24 * 60;
const AWAKE_DUR = AWAKE_END - AWAKE_START;

type Phase = 'PAST BEDTIME' | 'SLEEPING' | 'MORNING' | 'MIDDAY' | 'AFTERNOON' | 'EVENING' | 'BEDTIME';

const PHASE_COLORS: Record<Phase, string> = {
  'PAST BEDTIME': '#1E1E1E',
  SLEEPING:       '#252525',
  MORNING:        '#6B8FAB',
  MIDDAY:         '#8BAABB',
  AFTERNOON:      '#7A90A0',
  EVENING:        '#4A6070',
  BEDTIME:        '#2A3A48',
};

function getInfo(now: Date): {
  phase: Phase; progress: number; clock: string;
  remaining: string; showPct: boolean; pct: number;
} {
  const h = now.getHours();
  const m = now.getMinutes();
  const total = h * 60 + m;
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  const clock = `${h12}:${String(m).padStart(2, '0')} ${ampm}`;

  let phase: Phase;
  let progress: number;
  let showPct = true;

  if (total < 6 * 60) {
    phase = 'PAST BEDTIME'; progress = 1; showPct = false;
  } else if (total < AWAKE_START) {
    phase = 'SLEEPING'; progress = 0; showPct = false;
  } else {
    progress = Math.min(1, (total - AWAKE_START) / AWAKE_DUR);
    if (total < 11 * 60)      phase = 'MORNING';
    else if (total < 14 * 60) phase = 'MIDDAY';
    else if (total < 18 * 60) phase = 'AFTERNOON';
    else if (total < 21 * 60) phase = 'EVENING';
    else                       phase = 'BEDTIME';
  }

  const minsLeft = AWAKE_END - total;
  let remaining = '';
  if (minsLeft > 0 && showPct) {
    const hl = Math.floor(minsLeft / 60);
    const ml = minsLeft % 60;
    remaining = hl > 0 ? `${hl}h ${ml}m remaining` : `${ml}m remaining`;
  }

  return { phase, progress, clock, remaining, showPct, pct: Math.round(progress * 100) };
}

export function DayRing() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'dark'];
  const isDark = scheme === 'dark';
  const [info, setInfo] = useState(() => getInfo(new Date()));

  useEffect(() => {
    const t = setInterval(() => setInfo(getInfo(new Date())), 60000);
    return () => clearInterval(t);
  }, []);

  const phaseColor = PHASE_COLORS[info.phase];
  const trackColor = isDark ? 'rgba(255,255,255,0.07)' : '#D8D3C8';
  const offset = CIRC * (1 - info.progress);

  return (
    <View style={styles.row}>
      <Svg width={RING} height={RING}>
        <Circle cx={RING / 2} cy={RING / 2} r={R} stroke={trackColor} strokeWidth={SW} fill="none" />
        {info.progress > 0 && (
          <Circle
            cx={RING / 2} cy={RING / 2} r={R}
            stroke={phaseColor} strokeWidth={SW} fill="none"
            strokeDasharray={CIRC} strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90, ${RING / 2}, ${RING / 2})`}
          />
        )}
        <SvgText x={RING / 2} y={RING / 2 - 4} textAnchor="middle"
          fontSize={15} fontFamily={Fonts.inter.medium} fill={C.text}>
          {info.clock}
        </SvgText>
        <SvgText x={RING / 2} y={RING / 2 + 16} textAnchor="middle"
          fontSize={11} fontFamily={Fonts.inter.regular} fill={C.textMuted}>
          {info.showPct ? `${info.pct}%` : '—'}
        </SvgText>
      </Svg>

      <View style={styles.col}>
        <Text style={[styles.osLabel, { color: phaseColor }]}>M.I.S.S.L.E. OS</Text>
        <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#D4CFC3' }]} />
        <Text style={[styles.phase, { color: C.text }]}>{info.phase}</Text>
        {!!info.remaining && (
          <Text style={[styles.sub, { color: C.textMuted }]}>{info.remaining}</Text>
        )}
        <Text style={[styles.sub, { color: C.textMuted }]}>8 AM — 12 AM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  col: { flex: 1, gap: 5 },
  osLabel: { fontSize: 10, fontFamily: Fonts.inter.semiBold, letterSpacing: 2.5 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
  phase: { fontSize: 20, fontFamily: Fonts.inter.bold, letterSpacing: 0.5 },
  sub: { fontSize: 12, fontFamily: Fonts.inter.regular },
});
