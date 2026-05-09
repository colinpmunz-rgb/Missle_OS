import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Card } from '../ui/Card';
import { Txt } from '../ui/Typography';
import { Divider } from '../ui/Divider';
import { Colors, Spacing } from '../../constants/theme';
import type { Goal } from '../../constants/types';
import { format } from 'date-fns';

interface GoalTrackerProps {
  goals: Goal[];
}

const PILLAR_COLORS: Record<string, string> = {
  presence: '#7C3AED',
  mind: '#2563EB',
  body: '#16A34A',
  craft: '#2D5A3A',
};

export function GoalTracker({ goals }: GoalTrackerProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];

  const active = goals.filter(g => !g.completed).slice(0, 8);

  return (
    <Card>
      <Txt variant="headingMedium">Active Goals</Txt>
      <Divider spacing={Spacing.sm} />
      {active.length === 0 ? (
        <Txt variant="bodySmall" color={C.textMuted} style={{ paddingVertical: Spacing.sm }}>
          No active goals. Add goals from the Craft or Body tabs.
        </Txt>
      ) : (
        active.map(goal => {
          const done = goal.milestones?.filter(m => m.completed).length ?? 0;
          const total = goal.milestones?.length ?? 0;
          const progress = total > 0 ? done / total : 0;
          return (
            <View key={goal.id} style={styles.row}>
              <View style={styles.left}>
                <View style={styles.titleRow}>
                  {goal.pillar && (
                    <View style={[styles.pill, { backgroundColor: PILLAR_COLORS[goal.pillar] + '22', borderColor: PILLAR_COLORS[goal.pillar] + '55' }]}>
                      <Txt variant="labelSmall" color={PILLAR_COLORS[goal.pillar] ?? C.primary}>
                        {goal.pillar}
                      </Txt>
                    </View>
                  )}
                  <Txt variant="bodyMedium" numberOfLines={1} style={{ flex: 1 }}>
                    {goal.title}
                  </Txt>
                </View>
                {goal.deadline && (
                  <Txt variant="bodySmall" color={C.textMuted}>
                    Due {format(new Date(goal.deadline), 'MMM d, yyyy')}
                  </Txt>
                )}
                {total > 0 && (
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: C.primary }]} />
                  </View>
                )}
              </View>
              {total > 0 && (
                <Txt variant="labelSmall" color={C.textMuted}>{done}/{total}</Txt>
              )}
            </View>
          );
        })
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#00000011',
  },
  left: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
  },
  progressBg: {
    height: 3,
    backgroundColor: '#00000011',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
