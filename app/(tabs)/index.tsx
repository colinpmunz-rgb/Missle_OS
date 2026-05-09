import React from 'react';
import { View, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { useAuth } from '@clerk/expo';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Typography';
import { DailyChecklist } from '../../components/home/DailyChecklist';
import { PillarChart } from '../../components/home/PillarChart';
import { GoalTracker } from '../../components/home/GoalTracker';
import { WordCard } from '../../components/home/WordCard';
import { BodyBattery } from '../../components/home/BodyBattery';
import { HydrationRing } from '../../components/home/HydrationRing';
import { useDailyLog } from '../../hooks/useDailyLog';
import { usePillarScores } from '../../hooks/usePillarScores';
import { useGarmin } from '../../hooks/useGarmin';
import { useNutrition } from '../../hooks/useNutrition';
import { useWordOfDay } from '../../hooks/useWordOfDay';
import { useGoals } from '../../hooks/useGoals';
import { Spacing } from '../../constants/theme';

const HYDRATION_TARGET = 100;

export default function HomeScreen() {
  const { log, loading, toggle } = useDailyLog();
  const { latest } = usePillarScores();
  const { data: garmin } = useGarmin();
  const { data: nutrition } = useNutrition();
  const { today: word } = useWordOfDay();
  const { goals } = useGoals();

  return (
    <Screen>
      <View style={styles.dateRow}>
        <Txt variant="displaySmall">Home</Txt>
        <Txt variant="bodyMedium" style={{ opacity: 0.5 }}>
          {format(new Date(), 'EEEE, MMMM d')}
        </Txt>
      </View>

      <DailyChecklist log={log} loading={loading} onToggle={toggle} />

      <View style={styles.snapRow}>
        <BodyBattery garmin={garmin} />
        <HydrationRing oz={Number(nutrition?.hydration_oz ?? 0)} target={HYDRATION_TARGET} />
      </View>

      <PillarChart latest={latest} />

      <WordCard word={word} />

      <GoalTracker goals={goals} />

      <View style={{ height: Spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  dateRow: { marginBottom: Spacing.md, gap: 2 },
  snapRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, marginBottom: Spacing.md },
});
