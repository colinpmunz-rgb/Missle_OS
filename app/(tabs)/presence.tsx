import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, useColorScheme } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Divider } from '../../components/ui/Divider';
import { useFinances } from '../../hooks/useFinances';
import { useBrandOperations } from '../../hooks/useBrandOperations';
import { useDailyLog } from '../../hooks/useDailyLog';
import { Colors, Spacing } from '../../constants/theme';
import { format } from 'date-fns';
import type { BrandOperation } from '../../constants/types';

const PIPELINE_STAGES: BrandOperation['pipeline_stage'][] = ['idea', 'in_progress', 'scheduled', 'published'];
const STAGE_LABELS: Record<string, string> = { idea: 'Idea', in_progress: 'In Progress', scheduled: 'Scheduled', published: 'Published' };

export default function PresenceScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const { entries, monthlyTotals, create: createFinance, remove: removeFinance } = useFinances();
  const { items, create: createBrand, remove: removeBrand, byStage } = useBrandOperations();
  const { log } = useDailyLog();

  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [financeForm, setFinanceForm] = useState({ amount: '', category: '', type: 'expense' as 'income' | 'expense', notes: '' });
  const [brandForm, setBrandForm] = useState({ title: '', pipeline_stage: 'idea' as BrandOperation['pipeline_stage'], notes: '' });

  const totals = monthlyTotals();

  const saveFinance = async () => {
    if (!financeForm.amount) return;
    await createFinance({ date: format(new Date(), 'yyyy-MM-dd'), amount: parseFloat(financeForm.amount) as any, category: financeForm.category || 'Uncategorized', type: financeForm.type, notes: financeForm.notes || null });
    setFinanceForm({ amount: '', category: '', type: 'expense', notes: '' });
    setShowFinanceModal(false);
  };

  const saveBrand = async () => {
    if (!brandForm.title) return;
    await createBrand(brandForm);
    setBrandForm({ title: '', pipeline_stage: 'idea', notes: '' });
    setShowBrandModal(false);
  };

  return (
    <Screen>
      <Txt variant="displaySmall" style={{ marginBottom: Spacing.md }}>Presence</Txt>

      <Card style={{ marginBottom: Spacing.md }}>
        <View style={styles.sectionHeader}>
          <Txt variant="headingMedium">Finances</Txt>
          <Button label="+ Entry" onPress={() => setShowFinanceModal(true)} variant="ghost" />
        </View>
        <Divider spacing={Spacing.sm} />
        <View style={styles.totalsRow}>
          {[['Income', totals.income, C.success], ['Expenses', totals.expenses, C.error], ['Net', totals.net, totals.net >= 0 ? C.success : C.error]].map(([label, val, color]) => (
            <View key={label as string} style={styles.totalItem}>
              <Txt variant="labelSmall" color={C.textMuted}>{label as string}</Txt>
              <Txt variant="headingSmall" color={color as string}>${(val as number).toFixed(2)}</Txt>
            </View>
          ))}
        </View>
        <Divider spacing={Spacing.sm} />
        {entries.slice(0, 6).map(e => (
          <Pressable key={e.id} onLongPress={() => e.id && removeFinance(e.id)} style={styles.financeRow}>
            <View style={{ flex: 1 }}>
              <Txt variant="bodyMedium">{e.category}</Txt>
              <Txt variant="bodySmall" color={C.textMuted}>{e.date}{e.notes ? ` · ${e.notes}` : ''}</Txt>
            </View>
            <Txt variant="bodyMedium" color={e.type === 'income' ? C.success : C.error}>
              {e.type === 'income' ? '+' : '-'}${Math.abs(Number(e.amount)).toFixed(2)}
            </Txt>
          </Pressable>
        ))}
        {entries.length === 0 && <Txt variant="bodySmall" color={C.textMuted} style={{ paddingVertical: Spacing.sm }}>No entries yet.</Txt>}
      </Card>

      <Card style={{ marginBottom: Spacing.md }}>
        <View style={styles.sectionHeader}>
          <Txt variant="headingMedium">Brand Operations</Txt>
          <Button label="+ Item" onPress={() => setShowBrandModal(true)} variant="ghost" />
        </View>
        <Divider spacing={Spacing.sm} />
        <View style={styles.boardRow}>
          {PIPELINE_STAGES.map(stage => {
            const staged = byStage(stage);
            return (
              <View key={stage} style={styles.boardCol}>
                <Txt variant="labelSmall" color={C.textMuted} style={{ marginBottom: 6 }}>{STAGE_LABELS[stage!]}</Txt>
                {staged.map(item => (
                  <Pressable key={item.id} onLongPress={() => item.id && removeBrand(item.id)}
                    style={[styles.boardCard, { backgroundColor: C.background, borderColor: C.border }]}>
                    <Txt variant="bodySmall" numberOfLines={2}>{item.title}</Txt>
                  </Pressable>
                ))}
                {staged.length === 0 && <View style={[styles.boardCard, { backgroundColor: C.background, borderColor: C.border, opacity: 0.3 }]}><Txt variant="labelSmall" color={C.textMuted}>—</Txt></View>}
              </View>
            );
          })}
        </View>
      </Card>

      <Card style={{ marginBottom: Spacing.md }}>
        <Txt variant="headingMedium">Screen Habits</Txt>
        <Divider spacing={Spacing.sm} />
        <View>
          <Txt variant="labelSmall" color={C.textMuted}>Doom Scroll Today</Txt>
          <Txt variant="headingSmall" color={log?.no_doom_scroll ? C.success : C.error}>
            {log?.no_doom_scroll ? 'Clean' : 'Violated'}
          </Txt>
        </View>
      </Card>

      <Modal visible={showFinanceModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: '#00000080' }]}>
          <View style={[styles.modalContent, { backgroundColor: C.background }]}>
            <Txt variant="headingMedium" style={{ marginBottom: Spacing.md }}>Log Finance Entry</Txt>
            <Input label="Amount ($)" value={financeForm.amount} onChangeText={v => setFinanceForm(p => ({ ...p, amount: v }))} keyboardType="decimal-pad" />
            <Input label="Category" value={financeForm.category} onChangeText={v => setFinanceForm(p => ({ ...p, category: v }))} style={{ marginTop: Spacing.sm }} />
            <View style={styles.typeRow}>
              {(['income', 'expense'] as const).map(t => (
                <Pressable key={t} onPress={() => setFinanceForm(p => ({ ...p, type: t }))}
                  style={[styles.typeBtn, { borderColor: financeForm.type === t ? C.primary : C.border, backgroundColor: financeForm.type === t ? C.primary : 'transparent' }]}>
                  <Txt variant="labelMedium" color={financeForm.type === t ? '#fff' : C.text}>{t}</Txt>
                </Pressable>
              ))}
            </View>
            <Input label="Notes" value={financeForm.notes} onChangeText={v => setFinanceForm(p => ({ ...p, notes: v }))} style={{ marginTop: Spacing.sm }} />
            <View style={styles.modalBtns}>
              <Button label="Cancel" onPress={() => setShowFinanceModal(false)} variant="secondary" />
              <Button label="Save" onPress={saveFinance} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showBrandModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: '#00000080' }]}>
          <View style={[styles.modalContent, { backgroundColor: C.background }]}>
            <Txt variant="headingMedium" style={{ marginBottom: Spacing.md }}>Add Brand Item</Txt>
            <Input label="Title" value={brandForm.title} onChangeText={v => setBrandForm(p => ({ ...p, title: v }))} />
            <Txt variant="labelSmall" color={C.textMuted} style={{ marginTop: Spacing.sm }}>Stage</Txt>
            <View style={styles.stageRow}>
              {PIPELINE_STAGES.map(s => (
                <Pressable key={s} onPress={() => setBrandForm(p => ({ ...p, pipeline_stage: s }))}
                  style={[styles.typeBtn, { borderColor: brandForm.pipeline_stage === s ? C.primary : C.border, backgroundColor: brandForm.pipeline_stage === s ? C.primary : 'transparent' }]}>
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
  totalsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: Spacing.sm },
  totalItem: { alignItems: 'center', gap: 2 },
  financeRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: Spacing.sm },
  boardRow: { flexDirection: 'row', gap: 8 },
  boardCol: { flex: 1 },
  boardCard: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 2, padding: 6, marginBottom: 6 },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: Spacing.xl, gap: Spacing.sm },
  modalBtns: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, justifyContent: 'flex-end' },
  typeRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  stageRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  typeBtn: { paddingHorizontal: Spacing.sm, paddingVertical: 6, borderWidth: 1, borderRadius: 2 },
});
