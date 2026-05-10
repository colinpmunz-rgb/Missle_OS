import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, useColorScheme,
} from 'react-native';
import { Colors, Fonts, Spacing } from '../../constants/theme';
import { useTodoList, Goal } from '../../hooks/useTodoList';

const ORANGE = '#E07658';
const GREEN = '#4a9e68';

function SegBar({ done, total }: { done: number; total: number }) {
  if (total === 0) return null;
  return (
    <View style={{ flexDirection: 'row', gap: 3, marginVertical: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          backgroundColor: i < done ? ORANGE : 'rgba(255,255,255,0.1)',
        }} />
      ))}
    </View>
  );
}

function GoalRow({
  goal, index, total, isToday, locked,
  onToggle, onEdit, onDelete, onMove,
}: {
  goal: Goal; index: number; total: number; isToday: boolean; locked?: boolean;
  onToggle?: () => void; onEdit: (t: string) => void;
  onDelete: () => void; onMove: (d: -1 | 1) => void;
}) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'dark'];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goal.text);

  const commit = () => { if (draft.trim()) onEdit(draft.trim()); setEditing(false); };

  return (
    <View style={[styles.row, { borderBottomColor: 'rgba(255,255,255,0.05)' }]}>
      <Pressable
        onPress={locked ? undefined : onToggle}
        style={[styles.check,
          { borderColor: goal.completed ? ORANGE : 'rgba(255,255,255,0.2)' },
          goal.completed && { backgroundColor: ORANGE },
        ]}
      >
        {locked && !goal.completed
          ? <Text style={{ fontSize: 7, color: 'rgba(255,255,255,0.25)' }}>🔒</Text>
          : goal.completed
          ? <Text style={{ fontSize: 9, color: '#fff' }}>✓</Text>
          : null}
      </Pressable>

      <Pressable onPress={() => setEditing(true)} style={{ flex: 1 }}>
        {editing ? (
          <TextInput
            value={draft} onChangeText={setDraft}
            onBlur={commit} onSubmitEditing={commit}
            autoFocus
            style={[styles.goalText, { color: C.text }]}
          />
        ) : (
          <Text style={[
            styles.goalText,
            { color: goal.completed ? C.textMuted : C.text },
            goal.completed && { textDecorationLine: 'line-through' },
          ]}>
            {goal.text}
          </Text>
        )}
      </Pressable>

      <View style={{ flexDirection: 'row', gap: 2 }}>
        {index > 0 && (
          <Pressable onPress={() => onMove(-1)} style={styles.ctrl}>
            <Text style={styles.ctrlTxt}>↑</Text>
          </Pressable>
        )}
        {index < total - 1 && (
          <Pressable onPress={() => onMove(1)} style={styles.ctrl}>
            <Text style={styles.ctrlTxt}>↓</Text>
          </Pressable>
        )}
        <Pressable onPress={onDelete} style={styles.ctrl}>
          <Text style={[styles.ctrlTxt, { color: '#b44' }]}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function TodoList() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'dark'];
  const {
    todayGoals, tomorrowGoals,
    streak, completed, total, allDone,
    addTodayGoal, toggleGoal, editGoal, deleteGoal, moveGoal,
    pushRemaining, addTomorrowGoal,
  } = useTodoList();

  const [newToday, setNewToday] = useState('');
  const [newTmrw, setNewTmrw] = useState('');
  const [expandToday, setExpandToday] = useState(false);
  const [expandTmrw, setExpandTmrw] = useState(false);

  const submitToday = () => { if (newToday.trim()) { addTodayGoal(newToday); setNewToday(''); } };
  const submitTmrw = () => { if (newTmrw.trim()) { addTomorrowGoal(newTmrw); setNewTmrw(''); } };

  const visToday = expandToday ? todayGoals : todayGoals.slice(0, 5);
  const visTmrw = expandTmrw ? tomorrowGoals : tomorrowGoals.slice(0, 5);
  const locked = new Date().getHours() < 6;

  return (
    <View style={{ gap: Spacing.md }}>
      {/* TODAY */}
      <View style={[styles.card, {
        borderColor: 'rgba(255,255,255,0.07)',
        backgroundColor: allDone ? 'rgba(74,158,104,0.12)' : 'rgba(255,255,255,0.04)',
      }]}>
        <View style={styles.hdr}>
          <Text style={[styles.eyebrow, { color: C.textMuted }]}>To Do List</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {streak > 0 && (
              <View style={[styles.pill, { backgroundColor: ORANGE }]}>
                <Text style={styles.pillTxt}>🔥 {streak}</Text>
              </View>
            )}
            <Text style={[styles.counter, { color: allDone ? GREEN : C.text }]}>
              {allDone ? 'all done — solid day' : `${completed} / ${total}`}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { color: C.text }]}>TODAY</Text>
        <SegBar done={completed} total={total} />

        {visToday.map((g, i) => (
          <GoalRow key={g.id} goal={g} index={i} total={todayGoals.length} isToday
            onToggle={() => toggleGoal(g.id)}
            onEdit={t => editGoal(g.id, t, true)}
            onDelete={() => deleteGoal(g.id, true)}
            onMove={d => moveGoal(g.id, d, true)}
          />
        ))}

        {todayGoals.length > 5 && (
          <Pressable onPress={() => setExpandToday(!expandToday)} style={{ paddingTop: 6 }}>
            <Text style={{ color: ORANGE, fontSize: 12, fontFamily: Fonts.inter.medium }}>
              {expandToday ? '▲ Show less' : `▼ ${todayGoals.length - 5} more`}
            </Text>
          </Pressable>
        )}

        <View style={styles.addRow}>
          <TextInput
            value={newToday} onChangeText={setNewToday} onSubmitEditing={submitToday}
            placeholder="Add a goal..." placeholderTextColor={C.textMuted}
            returnKeyType="done"
            style={[styles.addInput, { color: C.text, borderBottomColor: 'rgba(255,255,255,0.1)' }]}
          />
          <Pressable onPress={submitToday}><Text style={{ color: ORANGE, fontSize: 20 }}>+</Text></Pressable>
        </View>

        {!allDone && todayGoals.some(g => !g.completed) && (
          <Pressable onPress={pushRemaining}
            style={[styles.pushBtn, { borderColor: 'rgba(255,255,255,0.08)' }]}>
            <Text style={{ color: C.textMuted, fontSize: 12, fontFamily: Fonts.inter.medium }}>
              ⚡ Push remaining to tomorrow
            </Text>
          </Pressable>
        )}
      </View>

      {/* PLAN TOMORROW */}
      <View style={[styles.card, {
        borderColor: 'rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(255,255,255,0.02)',
      }]}>
        <Text style={[styles.eyebrow, { color: C.textMuted }]}>To Do List</Text>
        <Text style={[styles.title, { color: C.textMuted }]}>PLAN TOMORROW</Text>

        {visTmrw.map((g, i) => (
          <GoalRow key={g.id} goal={g} index={i} total={tomorrowGoals.length}
            isToday={false} locked={locked}
            onEdit={t => editGoal(g.id, t, false)}
            onDelete={() => deleteGoal(g.id, false)}
            onMove={d => moveGoal(g.id, d, false)}
          />
        ))}

        {tomorrowGoals.length > 5 && (
          <Pressable onPress={() => setExpandTmrw(!expandTmrw)} style={{ paddingTop: 6 }}>
            <Text style={{ color: C.textMuted, fontSize: 12 }}>
              {expandTmrw ? '▲ Show less' : `▼ ${tomorrowGoals.length - 5} more`}
            </Text>
          </Pressable>
        )}

        <View style={styles.addRow}>
          <TextInput
            value={newTmrw} onChangeText={setNewTmrw} onSubmitEditing={submitTmrw}
            placeholder="Plan for tomorrow..." placeholderTextColor={C.textMuted}
            returnKeyType="done"
            style={[styles.addInput, { color: C.text, borderBottomColor: 'rgba(255,255,255,0.08)' }]}
          />
          <Pressable onPress={submitTmrw}><Text style={{ color: C.textMuted, fontSize: 20 }}>+</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, padding: 16, gap: 2 },
  hdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { fontSize: 10, fontFamily: Fonts.inter.semiBold, letterSpacing: 2 },
  title: { fontSize: 22, fontFamily: Fonts.garamond.bold, marginTop: 2, marginBottom: 2 },
  counter: { fontSize: 13, fontFamily: Fonts.inter.medium },
  pill: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  pillTxt: { fontSize: 11, fontFamily: Fonts.inter.semiBold, color: '#fff' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, gap: 10,
  },
  check: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  goalText: { fontSize: 14, fontFamily: Fonts.inter.regular },
  ctrl: { padding: 4 },
  ctrlTxt: { fontSize: 12, color: 'rgba(255,255,255,0.35)' },
  addRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  addInput: { flex: 1, fontSize: 14, fontFamily: Fonts.inter.regular, borderBottomWidth: 1, paddingVertical: 4 },
  pushBtn: { borderWidth: 1, borderRadius: 6, padding: 8, alignItems: 'center', marginTop: 6 },
});
