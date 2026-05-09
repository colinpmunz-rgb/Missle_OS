import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView, useColorScheme } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Divider } from '../../components/ui/Divider';
import { Toggle } from '../../components/ui/Toggle';
import { useAuth } from '../../hooks/useAuth';
import { useGarmin } from '../../hooks/useGarmin';
import { useNutrition } from '../../hooks/useNutrition';
import { useExerciseLog } from '../../hooks/useExerciseLog';
import { Colors, Spacing } from '../../constants/theme';
import { SUPPLEMENTS } from '../../constants/types';
import { format } from 'date-fns';

const HYDRATION_TARGET = 100;

function recoveryLabel(score: number): string {
  if (score >= 75) return 'Optimal';
  if (score >= 55) return 'Good';
  if (score >= 35) return 'Fair';
  return 'Poor';
}

function recoveryColor(score: number, C: any): string {
  if (score >= 75) return C.success;
  if (score >= 55) return C.accent;
  if (score >= 35) return C.warning;
  return C.error;
}

export default function BodyScreen() {
  const { userId } = useAuth();
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const { data: garmin, save: saveGarmin } = useGarmin(userId);
  const { data: nutrition, save: saveNutrition, addHydration } = useNutrition(userId);
  const { todayLog, save: saveExercise } = useExerciseLog(userId);

  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  const [sleepForm, setSleepForm] = useState({
    sleep_score: garmin?.sleep_score?.toString() ?? '',
    sleep_percent: garmin?.sleep_percent?.toString() ?? '',
    sleep_debt: garmin?.sleep_debt?.toString() ?? '',
    body_battery: garmin?.body_battery?.toString() ?? '',
    hrv: garmin?.hrv?.toString() ?? '',
  });

  const [nutritionForm, setNutritionForm] = useState({
    calories: nutrition?.calories?.toString() ?? '',
    protein_g: nutrition?.protein_g?.toString() ?? '',
    carbs_g: nutrition?.carbs_g?.toString() ?? '',
    fat_g: nutrition?.fat_g?.toString() ?? '',
    supplements: nutrition?.supplements ?? [] as string[],
  });

  const [exerciseForm, setExerciseForm] = useState({
    planned_session: todayLog?.planned_session ?? '',
    actual_session: todayLog?.actual_session ?? '',
    sleep_adjusted_recommendation: todayLog?.sleep_adjusted_recommendation ?? '',
    notes: todayLog?.notes ?? '',
  });

  const recoveryScore = garmin?.sleep_score && garmin?.body_battery
    ? (garmin.sleep_score + garmin.body_battery) / 2
    : null;

  const saveSleep = async () => {
    await saveGarmin({
      sleep_score: sleepForm.sleep_score ? parseInt(sleepForm.sleep_score) : undefined,
      sleep_percent: sleepForm.sleep_percent ? parseFloat(sleepForm.sleep_percent) : undefined,
      sleep_debt: sleepForm.sleep_debt ? parseFloat(sleepForm.sleep_debt) : undefined,
      body_battery: sleepForm.body_battery ? parseInt(sleepForm.body_battery) : undefined,
      hrv: sleepForm.hrv ? parseInt(sleepForm.hrv) : undefined,
    });
    setShowSleepModal(false);
  };

  const saveNutritionData = async () => {
    await saveNutrition({
      calories: nutritionForm.calories ? parseInt(nutritionForm.calories) : undefined,
      protein_g: nutritionForm.protein_g ? parseFloat(nutritionForm.protein_g) : undefined,
      carbs_g: nutritionForm.carbs_g ? parseFloat(nutritionForm.carbs_g) : undefined,
      fat_g: nutritionForm.fat_g ? parseFloat(nutritionForm.fat_g) : undefined,
      supplements: nutritionForm.supplements,
    });
    setShowNutritionModal(false);
  };

  const saveExerciseData = async () => {
    await saveExercise({
      ...exerciseForm,
      recovery_score: recoveryScore ?? undefined,
    });
    setShowExerciseModal(false);
  };

  const toggleSupplement = (sup: string) => {
    setNutritionForm(p => ({
      ...p,
      supplements: p.supplements.includes(sup)
        ? p.supplements.filter(s => s !== sup)
        : [...p.supplements, sup],
    }));
  };

  return (
    <Screen>
      <Txt variant="displaySmall" style={{ marginBottom: Spacing.md }}>Body</Txt>

      {/* Sleep Data */}
      <Card style={{ marginBottom: Spacing.md }}>
        <View style={styles.sectionHeader}>
          <Txt variant="headingMedium">Sleep (Garmin)</Txt>
          <Button label="Log" onPress={() => {
            setSleepForm({
              sleep_score: garmin?.sleep_score?.toString() ?? '',
              sleep_percent: garmin?.sleep_percent?.toString() ?? '',
              sleep_debt: garmin?.sleep_debt?.toString() ?? '',
              body_battery: garmin?.body_battery?.toString() ?? '',
              hrv: garmin?.hrv?.toString() ?? '',
            });
            setShowSleepModal(true);
          }} variant="ghost" />
        </View>
        <Divider spacing={Spacing.sm} />
        <View style={styles.statsGrid}>
          <StatCell label="Sleep Score" value={garmin?.sleep_score?.toString()} unit="/100" />
          <StatCell label="Sleep %" value={garmin?.sleep_percent?.toString()} unit="%" />
          <StatCell label="Sleep Debt" value={garmin?.sleep_debt?.toString()} unit="hr" />
          <StatCell label="HRV" value={garmin?.hrv?.toString()} unit="ms" />
        </View>
      </Card>

      {/* Recovery Score */}
      <Card style={{ marginBottom: Spacing.md }}>
        <Txt variant="headingMedium">Recovery Score</Txt>
        <Divider spacing={Spacing.sm} />
        {recoveryScore !== null ? (
          <View style={styles.recoveryRow}>
            <Txt variant="displayMedium" color={recoveryColor(recoveryScore, C)}>
              {recoveryScore.toFixed(0)}
            </Txt>
            <View style={{ marginLeft: Spacing.sm }}>
              <Txt variant="headingSmall" color={recoveryColor(recoveryScore, C)}>
                {recoveryLabel(recoveryScore)}
              </Txt>
              <Txt variant="bodySmall" color={C.textMuted}>(sleep + battery) / 2</Txt>
            </View>
          </View>
        ) : (
          <Txt variant="bodyMedium" color={C.textMuted}>Log sleep data above to calculate.</Txt>
        )}
      </Card>

      {/* Nutrition */}
      <Card style={{ marginBottom: Spacing.md }}>
        <View style={styles.sectionHeader}>
          <Txt variant="headingMedium">Nutrition</Txt>
          <Button label="Log" onPress={() => {
            setNutritionForm({
              calories: nutrition?.calories?.toString() ?? '',
              protein_g: nutrition?.protein_g?.toString() ?? '',
              carbs_g: nutrition?.carbs_g?.toString() ?? '',
              fat_g: nutrition?.fat_g?.toString() ?? '',
              supplements: nutrition?.supplements ?? [],
            });
            setShowNutritionModal(true);
          }} variant="ghost" />
        </View>
        <Divider spacing={Spacing.sm} />
        <View style={styles.statsGrid}>
          <StatCell label="Calories" value={nutrition?.calories?.toString()} unit="kcal" />
          <StatCell label="Protein" value={nutrition?.protein_g?.toString()} unit="g" />
          <StatCell label="Carbs" value={nutrition?.carbs_g?.toString()} unit="g" />
          <StatCell label="Fat" value={nutrition?.fat_g?.toString()} unit="g" />
        </View>
        {nutrition?.supplements && nutrition.supplements.length > 0 && (
          <View style={styles.supplRow}>
            <Txt variant="labelSmall" color={C.textMuted}>Supplements: </Txt>
            <Txt variant="bodySmall">{nutrition.supplements.join(', ')}</Txt>
          </View>
        )}
      </Card>

      {/* Hydration */}
      <Card style={{ marginBottom: Spacing.md }}>
        <Txt variant="headingMedium">Hydration</Txt>
        <Divider spacing={Spacing.sm} />
        <View style={styles.hydrationRow}>
          <Txt variant="displaySmall" color={C.primary}>{nutrition?.hydration_oz ?? 0}oz</Txt>
          <Txt variant="bodyMedium" color={C.textMuted}> / {HYDRATION_TARGET}oz</Txt>
        </View>
        <View style={styles.hydrationBtns}>
          {[8, 16, 24, 32].map(oz => (
            <Pressable key={oz} onPress={() => addHydration(oz)}
              style={[styles.hydBtn, { borderColor: C.primary }]}>
              <Txt variant="labelSmall" color={C.primary}>+{oz}oz</Txt>
            </Pressable>
          ))}
        </View>
      </Card>

      {/* Exercise Log */}
      <Card style={{ marginBottom: Spacing.md }}>
        <View style={styles.sectionHeader}>
          <Txt variant="headingMedium">Exercise</Txt>
          <Button label="Log" onPress={() => {
            setExerciseForm({
              planned_session: todayLog?.planned_session ?? '',
              actual_session: todayLog?.actual_session ?? '',
              sleep_adjusted_recommendation: todayLog?.sleep_adjusted_recommendation ?? '',
              notes: todayLog?.notes ?? '',
            });
            setShowExerciseModal(true);
          }} variant="ghost" />
        </View>
        <Divider spacing={Spacing.sm} />
        {todayLog ? (
          <View style={{ gap: 8 }}>
            {todayLog.planned_session && <Txt variant="bodySmall" color={C.textMuted}>Planned: {todayLog.planned_session}</Txt>}
            {todayLog.actual_session && <Txt variant="bodySmall">Completed: {todayLog.actual_session}</Txt>}
            {todayLog.sleep_adjusted_recommendation && (
              <Txt variant="bodySmall" color={C.accent}>Rec: {todayLog.sleep_adjusted_recommendation}</Txt>
            )}
            {todayLog.notes && <Txt variant="bodySmall" color={C.textMuted}>Notes: {todayLog.notes}</Txt>}
          </View>
        ) : (
          <Txt variant="bodyMedium" color={C.textMuted}>No exercise logged today.</Txt>
        )}
      </Card>

      {/* Sleep Modal */}
      <Modal visible={showSleepModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: '#00000080' }]}>
          <View style={[styles.modalContent, { backgroundColor: C.background }]}>
            <Txt variant="headingMedium" style={{ marginBottom: Spacing.md }}>Log Sleep Data</Txt>
            <Input label="Sleep Score (0-100)" value={sleepForm.sleep_score} onChangeText={v => setSleepForm(p => ({ ...p, sleep_score: v }))} keyboardType="number-pad" />
            <Input label="Sleep %" value={sleepForm.sleep_percent} onChangeText={v => setSleepForm(p => ({ ...p, sleep_percent: v }))} keyboardType="decimal-pad" style={{ marginTop: Spacing.sm }} />
            <Input label="Sleep Debt (hours)" value={sleepForm.sleep_debt} onChangeText={v => setSleepForm(p => ({ ...p, sleep_debt: v }))} keyboardType="decimal-pad" style={{ marginTop: Spacing.sm }} />
            <Input label="Body Battery (0-100)" value={sleepForm.body_battery} onChangeText={v => setSleepForm(p => ({ ...p, body_battery: v }))} keyboardType="number-pad" style={{ marginTop: Spacing.sm }} />
            <Input label="HRV (ms)" value={sleepForm.hrv} onChangeText={v => setSleepForm(p => ({ ...p, hrv: v }))} keyboardType="number-pad" style={{ marginTop: Spacing.sm }} />
            <View style={styles.modalBtns}>
              <Button label="Cancel" onPress={() => setShowSleepModal(false)} variant="secondary" />
              <Button label="Save" onPress={saveSleep} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Nutrition Modal */}
      <Modal visible={showNutritionModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: '#00000080' }]}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ justifyContent: 'flex-end', flexGrow: 1 }}>
            <View style={[styles.modalContent, { backgroundColor: C.background }]}>
              <Txt variant="headingMedium" style={{ marginBottom: Spacing.md }}>Log Nutrition</Txt>
              <Input label="Calories" value={nutritionForm.calories} onChangeText={v => setNutritionForm(p => ({ ...p, calories: v }))} keyboardType="number-pad" />
              <Input label="Protein (g)" value={nutritionForm.protein_g} onChangeText={v => setNutritionForm(p => ({ ...p, protein_g: v }))} keyboardType="decimal-pad" style={{ marginTop: Spacing.sm }} />
              <Input label="Carbs (g)" value={nutritionForm.carbs_g} onChangeText={v => setNutritionForm(p => ({ ...p, carbs_g: v }))} keyboardType="decimal-pad" style={{ marginTop: Spacing.sm }} />
              <Input label="Fat (g)" value={nutritionForm.fat_g} onChangeText={v => setNutritionForm(p => ({ ...p, fat_g: v }))} keyboardType="decimal-pad" style={{ marginTop: Spacing.sm }} />
              <Txt variant="labelSmall" color={C.textMuted} style={{ marginTop: Spacing.md }}>Supplements</Txt>
              <View style={styles.suppGrid}>
                {SUPPLEMENTS.map(s => (
                  <Pressable key={s} onPress={() => toggleSupplement(s)}
                    style={[styles.suppBtn, {
                      borderColor: nutritionForm.supplements.includes(s) ? C.primary : C.border,
                      backgroundColor: nutritionForm.supplements.includes(s) ? C.primary + '22' : 'transparent',
                    }]}>
                    <Txt variant="labelSmall" color={nutritionForm.supplements.includes(s) ? C.primary : C.text}>{s}</Txt>
                  </Pressable>
                ))}
              </View>
              <View style={styles.modalBtns}>
                <Button label="Cancel" onPress={() => setShowNutritionModal(false)} variant="secondary" />
                <Button label="Save" onPress={saveNutritionData} />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Exercise Modal */}
      <Modal visible={showExerciseModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: '#00000080' }]}>
          <View style={[styles.modalContent, { backgroundColor: C.background }]}>
            <Txt variant="headingMedium" style={{ marginBottom: Spacing.md }}>Log Exercise</Txt>
            <Input label="Planned Session" value={exerciseForm.planned_session} onChangeText={v => setExerciseForm(p => ({ ...p, planned_session: v }))} multiline />
            <Input label="Actual Session Completed" value={exerciseForm.actual_session} onChangeText={v => setExerciseForm(p => ({ ...p, actual_session: v }))} multiline style={{ marginTop: Spacing.sm }} />
            <Input label="Sleep-Adjusted Recommendation" value={exerciseForm.sleep_adjusted_recommendation} onChangeText={v => setExerciseForm(p => ({ ...p, sleep_adjusted_recommendation: v }))} multiline style={{ marginTop: Spacing.sm }} />
            <Input label="Notes" value={exerciseForm.notes} onChangeText={v => setExerciseForm(p => ({ ...p, notes: v }))} multiline style={{ marginTop: Spacing.sm }} />
            <View style={styles.modalBtns}>
              <Button label="Cancel" onPress={() => setShowExerciseModal(false)} variant="secondary" />
              <Button label="Save" onPress={saveExerciseData} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: Spacing.xl }} />
    </Screen>
  );
}

function StatCell({ label, value, unit }: { label: string; value?: string | null; unit: string }) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  return (
    <View style={statStyles.cell}>
      <Txt variant="labelSmall" color={C.textMuted}>{label}</Txt>
      <Txt variant="headingSmall" color={value ? C.text : C.textMuted}>
        {value ? `${value}${unit}` : '—'}
      </Txt>
    </View>
  );
}

const statStyles = StyleSheet.create({
  cell: { flex: 1, alignItems: 'center', gap: 2 },
});

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: Spacing.sm },
  recoveryRow: { flexDirection: 'row', alignItems: 'center' },
  supplRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 4 },
  hydrationRow: { flexDirection: 'row', alignItems: 'flex-end' },
  hydrationBtns: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, flexWrap: 'wrap' },
  hydBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderRadius: 2 },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: Spacing.xl, gap: Spacing.sm },
  modalBtns: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, justifyContent: 'flex-end' },
  suppGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  suppBtn: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 2 },
});
