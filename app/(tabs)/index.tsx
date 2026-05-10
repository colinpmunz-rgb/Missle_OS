import React from 'react';
import { View, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { DayRing } from '../../components/home/DayRing';
import { TodoList } from '../../components/home/TodoList';
import { DailyChecklist } from '../../components/home/DailyChecklist';
import { PillarChart } from '../../components/home/PillarChart';
import { WordCard } from '../../components/home/WordCard';
import { BodyBattery } from '../../components/home/BodyBattery';
import { HydrationRing } from '../../components/home/HydrationRing';
import { useDailyLog } from '../../hooks/useDailyLog';
import { usePillarScores } from '../../hooks/usePillarScores';
import { useGarmin } from '../../hooks/useGarmin';
import { useNutrition } from '../../hooks/useNutrition';
import { useWordOfDay } from '../../hooks/useWordOfDay';
import { Spacing } from '../../constants/theme';

const HYDRATION_TARGET = 100;

export default function HomeScreen() {
  const { log, loading, toggle } = useDailyLog();
  const { latest } = usePillarScores();
  const { data: garmin } = useGarmin();
  const { data: nutrition } = useNutrition();
  const { today: word } = useWordOfDay();

  return (
    <Screen>
      <Card glass style={{ marginBottom: Spacing.md }}>
        <DayRing />
      </Card>

      <TodoList />

      <View style={{ height: Spacing.md }} />

      <Card glass style={{ marginBottom: Spacing.md }}>
        <Txt variant="labelSmall" style={{ letterSpacing: 2, marginBottom: Spacing.sm }}>
          {format(new Date(), 'EEEE, MMMM d').toUpperCase()}
        </Txt>
        <DailyChecklist log={log} loading={loading} onToggle={toggle} />
      </Card>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Card glass>
            <BodyBattery garmin={garmin} />
          </Card>
        </View>
        <View style={{ flex: 1 }}>
          <Card glass>
            <HydrationRing oz={Number(nutrition?.hydration_oz ?? 0)} target={HYDRATION_TARGET} />
          </Card>
        </View>
      </View>

      <View style={{ height: Spacing.md }} />
      <Card glass style={{ marginBottom: Spacing.md }}>
        <PillarChart latest={latest} />
      </Card>

      <WordCard word={word} />

      <View style={{ height: Spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
});
