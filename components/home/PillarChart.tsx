import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import { Card } from '../ui/Card';
import { Txt } from '../ui/Typography';
import { Divider } from '../ui/Divider';
import { Colors, Spacing } from '../../constants/theme';
import type { PillarScores } from '../../constants/types';

const PILLARS: { key: keyof PillarScores; label: string }[] = [
  { key: 'presence_score', label: 'Presence' },
  { key: 'mind_score', label: 'Mind' },
  { key: 'body_score', label: 'Body' },
  { key: 'craft_score', label: 'Craft' },
  { key: 'overall_score', label: 'Overall' },
];

interface PillarChartProps {
  latest: PillarScores | null;
}

export function PillarChart({ latest }: PillarChartProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];

  const chartW = 320;
  const chartH = 140;
  const barW = 44;
  const gap = 12;
  const maxScore = Math.max(
    10,
    ...PILLARS.map(p => latest ? (latest[p.key] as number ?? 0) : 0)
  );
  const totalBars = PILLARS.length;
  const startX = (chartW - (totalBars * (barW + gap) - gap)) / 2;

  return (
    <Card>
      <Txt variant="headingMedium">Pillar Scores</Txt>
      <Divider spacing={Spacing.sm} />
      <Svg width={chartW} height={chartH} style={styles.chart}>
        {PILLARS.map((p, i) => {
          const score = latest ? (latest[p.key] as number ?? 0) : 0;
          const barH = Math.max(4, (score / maxScore) * (chartH - 40));
          const x = startX + i * (barW + gap);
          const y = chartH - 24 - barH;
          const isOverall = p.key === 'overall_score';
          const fill = isOverall ? C.accent : C.primary;
          return (
            <React.Fragment key={p.key}>
              <Rect x={x} y={y} width={barW} height={barH} fill={fill} rx={2} />
              <SvgText
                x={x + barW / 2}
                y={chartH - 26}
                textAnchor="middle"
                fontSize={9}
                fill={C.textMuted}
                fontFamily="Inter_400Regular"
              >
                {score.toFixed(1)}
              </SvgText>
              <SvgText
                x={x + barW / 2}
                y={chartH - 8}
                textAnchor="middle"
                fontSize={9}
                fill={C.textMuted}
                fontFamily="Inter_500Medium"
              >
                {p.label}
              </SvgText>
            </React.Fragment>
          );
        })}
        <Line x1={startX - 4} y1={chartH - 24} x2={chartW - startX + 4} y2={chartH - 24} stroke={C.border} strokeWidth={0.5} />
      </Svg>
    </Card>
  );
}

const styles = StyleSheet.create({
  chart: { alignSelf: 'center', marginTop: Spacing.sm },
});
