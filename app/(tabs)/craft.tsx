import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, useColorScheme } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Divider } from '../../components/ui/Divider';
import { useGoals } from '../../hooks/useGoals';
import { useBrandOperations } from '../../hooks/useBrandOperations';
import { Colors, Spacing } from '../../constants/theme';
import type { BrandOperation } from '../../constants/types';
import { format } from 'date-fns';

const PIPELINE_STAGES: BrandOperation['pipeline_stage'][] = ['idea', 'in_progress', 'scheduled', 'published'];
const STAGE_LABELS: Record<string, string> = { idea: 'Idea', in_progress: 'In Progress', scheduled: 'Scheduled', published: 'Published' };

export default function CraftScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const { goals, create: createGoal, update: updateGoal, remove: removeGoal } = useGoals('craft');
  const { create: createBrand, remove: removeBrand, byStage } = useBrandOperations();

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ title: '', deadline: '' });

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [brandForm, setBrandForm] = useState({ title: '', pipeline_stage: 'idea' as BrandOperation['pipeline_stage'], notes: '' });

  const saveGoal = async () => {
    if (!goalForm.title) return;
    await createGoal({ title: goalForm.title, pillar: 'craft', deadline: goalForm.deadline || null, milestones: [], completed: false });
    setGoalForm({ title: '', deadline: '' });
    setShowGoalModal(false);
  };

  const saveBrand = async () => {
    if (!brandForm.title) return;
    await createBrand(brandForm);
    setBrandForm({ title: '', pipeline_stage: 'idea', notes: '' });
    setShowBrandModal(false);
  };

  return (
    <Screen>
      <Txt variant="displaySmall" style={{ marginBottom: Spacing.md }}>Craft</Txt>

      {/* Coltbrook Capital Operations */}
      <Card style={{ marginBottom: Spacing.md }}>
        <View style={styles.sectionHeader}>
          <Txt variant="headingMedium">Coltbrook Capital Ops</Txt>
          <Button label="+ Item" onPress={() => setShowBrandModal(true)} variant="ghost" />
        </View>
        <Divider spacing={Spacing.sm} />
        <View style={styles.boardRow}>
          {PIPELINE_STAGES.map(stage => {
            const staged = byStage(stage);
            return (
              <View key={stage} style={styles.boardCol}>
                <Txt variant="labelSmall" color={C.textMuted} style={{ marginBottom: 6 }}>
                  {STAGE_LABELS[stage!]}
                </Txt>
                {staged.map(item => (
                  <Pressable key={item.id} onLongPress={() => item.id && removeBrand(item.id)}
                    style={[styles.boardCard, { backgroundColor: C.background, borderColor: C.border }]}>
                    <Txt variant="bodySmall" numberOfLines={2}>{item.title}</Txt>
                    {item.notes && <Txt variant="labelSmall" color={C.textMuted} numberOfLines={1}>{item.notes}</Txt>}
                  </Pressable>
                ))}
                {staged.length === 0 && (
                  <View style={[styles.boardCard, { backgroundColor: C.background, borderColor: C.border, opacity: 0.3 }]}>
                    <Txt variant="labelSmall" color={C.textMuted}>—</Txt>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </Card>

      {/* Craft Goals */}
      <Card style={{ marginBottom: Spacing.md }}>
        <View style={styles.sectionHeader}>
          <Txt variant="headingMedium">Craft Goals</Txt>
          <Button label="+ Goal" onPress={() => setShowGoalModal(true)} variant="ghost" />
        </View>
        <Divider spacing={Spacing.sm} />
        {goals.length === 0 ? (
          <Txt variant="bodySmall" color={C.textMuted} style={{ paddingVertical: Spacing.sm }}>
            No active craft goals. Tap + Goal to add.
          </Txt>
        ) : (
          goals.map(goal => (
            <Pressable key={goal.id} onLongPress={() => goal.id && removeGoal(goal.id)}
              style={[styles.goalRow, { borderBottomColor: C.border }]}>
              <View style={{ flex: 1 }}>
                <Txt variant="bodyMedium">{goal.title}</Txt>
                {goal.deadline && (
                  <Txt variant="bodySmall" color={C.textMuted}>
                    Due {format(new Date(goal.deadline), 'MMM d, yyyy')}
                  </Txt>
                )}
                {goal.milestones.length > 0 && (
                  <Txt variant="labelSmall" color={C.textMuted}>
                    {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} milestones
                  </Txt>
                )}
              </View>
              <Pressable onPress={() => goal.id && updateGoal(goal.id, { completed: true })}
                style={[styles.completeBtn, { borderColor: C.primary }]}>
                <Txt variant="labelSmall" color={C.primary}>Done</Txt>
              </Pressable>
            </Pressable>
          ))
        )}
      </Card>

      {/* Goal Modal */}
      <Modal visible={showGoalModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: '#00000080' }]}>
          <View style={[styles.modalContent, { backgroundColor: C.background }]}>
            <Txt variant="headingMedium" style={{ marginBottom: Spacing.md }}>New Craft Goal</Txt>
            <Input label="Goal Title" value={goalForm.title} onChangeText={v => setGoalForm(p => ({ ...p, title: v }))} />
            <Input label="Deadline (YYYY-MM-DD)" value={goalForm.deadline} onChangeText={v => setGoalForm(p => ({ ...p, deadline: v }))} style={{ marginTop: Spacing.sm }} placeholder="optional" />
            <View style={styles.modalBtns}>
              <Button label="Cancel" onPress={() => setShowGoalModal(false)} variant="secondary" />
              <Button label="Save" onPress={saveGoal} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Brand Item Modal */}
      <Modal visible={showBrandModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: '#00000080' }]}>
          <View style={[styles.modalContent, { backgroundColor: C.background }]}>
            <Txt variant="headingMedium" style={{ marginBottom: Spacing.md }}>Add Task / Pipeline Item</Txt>
            <Input label="Title" value={brandForm.title} onChangeText={v => setBrandForm(p => ({ ...p, title: v }))} />
            <Txt variant="labelSmall" color={C.textMuted} style={{ marginTop: Spacing.sm }}>Stage</Txt>
            <View style={styles.stageRow}>
              {PIPELINE_STAGES.map(s => (
                <Pressable key={s} onPress={() => setBrandForm(p => ({ ...p, pipeline_stage: s }))}
                  style={[styles.stageBtn, {
                    borderColor: brandForm.pipeline_stage === s ? C.primary : C.border,
                    backgroundColor: brandForm.pipeline_stage === s ? C.primary : 'transparent',
                  }]}>
                  <Txt variant="labelSmall" color={brandForm.pipeline_stage === s ? '#fff' : C.text}>{STAGE_LABELS[s!]}</Txt>
                </Pressable>
              ))}
            </View>
            <Input label="Notes" value={brandForm.notes} onChangeText={v => setBrandForm(p => ({ ...p, notes: v }))} multiline style={{ marginTop: Spacing.sm }} />
            <View style={styles.modalBtns}>
              <Button label="Cancel" onPress={() => setShowBrandModal(false)} variant="secondary" />
              <Button label="Save" onPress={saveBrand} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: Spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  boardRow: { flexDirection: 'row', gap: 8 },
  boardCol: { flex: 1 },
  boardCard: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 2, padding: 6, marginBottom: 6, gap: 2 },
  goalRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, gap: Spacing.sm },
  completeBtn: { paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderRadius: 2 },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: Spacing.xl, gap: Spacing.sm },
  modalBtns: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, justifyContent: 'flex-end' },
  stageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  stageBtn: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 2 },
});
