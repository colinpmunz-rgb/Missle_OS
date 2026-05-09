import React from 'react';
import { StyleSheet, View, ActivityIndicator, useColorScheme } from 'react-native';
import { Card } from '../ui/Card';
import { Toggle } from '../ui/Toggle';
import { Txt } from '../ui/Typography';
import { Divider } from '../ui/Divider';
import { Colors, Spacing } from '../../constants/theme';
import type { DailyLog } from '../../constants/types';
import { CHECKLIST_LABELS } from '../../constants/types';

type ChecklistField = keyof Pick<DailyLog,
  'bedtime_checklist' | 'exercise' | 'no_porn' | 'little_things' | 'hydration' | 'no_doom_scroll'
>;

const FIELDS: ChecklistField[] = [
  'bedtime_checklist',
  'exercise',
  'no_porn',
  'little_things',
  'hydration',
  'no_doom_scroll',
];

interface DailyChecklistProps {
  log: DailyLog | null;
  loading: boolean;
  onToggle: (field: ChecklistField) => void;
}

export function DailyChecklist({ log, loading, onToggle }: DailyChecklistProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];

  const completed = log ? FIELDS.filter(f => log[f]).length : 0;

  return (
    <Card>
      <View style={styles.header}>
        <Txt variant="headingMedium">Daily Checklist</Txt>
        {!loading && (
          <Txt variant="labelMedium" color={C.textMuted}>
            {completed}/{FIELDS.length}
          </Txt>
        )}
      </View>
      <Divider spacing={Spacing.sm} />
      {loading ? (
        <ActivityIndicator color={C.primary} style={{ paddingVertical: Spacing.lg }} />
      ) : (
        FIELDS.map((field, i) => (
          <React.Fragment key={field}>
            <Toggle
              label={CHECKLIST_LABELS[field]}
              value={log?.[field] ?? false}
              onPress={() => onToggle(field)}
            />
            {i < FIELDS.length - 1 && <View style={[styles.sep, { backgroundColor: C.border }]} />}
          </React.Fragment>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 0,
  },
});
