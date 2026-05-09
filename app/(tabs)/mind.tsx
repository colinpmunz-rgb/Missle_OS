import React, { useState } from 'react';
import { View, StyleSheet, Modal, useColorScheme } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Divider } from '../../components/ui/Divider';
import { useWordOfDay } from '../../hooks/useWordOfDay';
import { useSchool } from '../../hooks/useSchool';
import { Colors, Spacing } from '../../constants/theme';
import Svg, { Line, Text as SvgText } from 'react-native-svg';

export default function MindScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const { today: word, history, save: saveWord } = useWordOfDay();
  const { courses, calculateGPA } = useSchool();

  const [showWordModal, setShowWordModal] = useState(false);
  const [wordForm, setWordForm] = useState({ word: '', definition: '', etymology: '', part_of_speech: '', example_sentence: '' });
  const [search, setSearch] = useState('');

  const gpa = calculateGPA();

  const saveWordEntry = async () => {
    if (!wordForm.word) return;
    await saveWord(wordForm);
    setWordForm({ word: '', definition: '', etymology: '', part_of_speech: '', example_sentence: '' });
    setShowWordModal(false);
  };

  const filteredHistory = history.filter(w => !search || w.word?.toLowerCase().includes(search.toLowerCase()));
  const sparkW = 280, sparkH = 60;

  return (
    <Screen>
      <Txt variant="displaySmall" style={{ marginBottom: Spacing.md }}>Mind</Txt>

      <Card style={{ marginBottom: Spacing.md }}>
        <View style={styles.sectionHeader}>
          <Txt variant="headingMedium">Word of the Day</Txt>
          <Button label={word ? 'Edit' : '+ Add'} onPress={() => {
            if (word) setWordForm({ word: word.word ?? '', definition: word.definition ?? '', etymology: word.etymology ?? '', part_of_speech: word.part_of_speech ?? '', example_sentence: word.example_sentence ?? '' });
            setShowWordModal(true);
          }} variant="ghost" />
        </View>
        <Divider spacing={Spacing.sm} />
        {word?.word ? (
          <View style={{ gap: 6 }}>
            <Txt variant="displayMedium" color={C.primary}>{word.word}</Txt>
            {word.part_of_speech && <Txt variant="bodySmall" color={C.textMuted} style={{ fontStyle: 'italic' }}>{word.part_of_speech}</Txt>}
            {word.etymology && <Txt variant="bodySmall" color={C.textMuted}>Origin: {word.etymology}</Txt>}
            {word.definition && <Txt variant="bodyMedium" style={{ marginTop: 4 }}>{word.definition}</Txt>}
            {word.example_sentence && (
              <View style={[styles.exampleBox, { backgroundColor: C.surface, borderLeftColor: C.primary }]}>
                <Txt variant="bodySmall" color={C.textMuted} style={{ fontStyle: 'italic' }}>"{word.example_sentence}"</Txt>
              </View>
            )}
          </View>
        ) : (
          <Txt variant="bodyMedium" color={C.textMuted} style={{ paddingVertical: Spacing.sm }}>No word set today. Tap + Add.</Txt>
        )}
      </Card>

      <Card style={{ marginBottom: Spacing.md }}>
        <Txt variant="headingMedium">Current GPA</Txt>
        <Divider spacing={Spacing.sm} />
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <Txt variant="displayMedium" color={gpa >= 3.7 ? C.success : gpa >= 3.0 ? C.warning : C.error}>{gpa.toFixed(2)}</Txt>
          <Txt variant="bodyMedium" color={C.textMuted}> / 4.00</Txt>
        </View>
        <Svg width={sparkW} height={sparkH} style={{ marginTop: Spacing.sm }}>
          <Line x1={0} y1={sparkH * (1 - 4.0 / 4.0)} x2={sparkW} y2={sparkH * (1 - 4.0 / 4.0)} stroke={C.accent} strokeDasharray="4 3" strokeWidth={1} />
          <Line x1={0} y1={sparkH * (1 - gpa / 4.0)} x2={sparkW} y2={sparkH * (1 - gpa / 4.0)} stroke={C.primary} strokeWidth={2} />
          <SvgText x={sparkW - 32} y={sparkH * (1 - 4.0 / 4.0) - 4} fontSize={9} fill={C.textMuted} fontFamily="Inter_400Regular">Target</SvgText>
        </Svg>
      </Card>

      <Card style={{ marginBottom: Spacing.md }}>
        <Txt variant="headingMedium">Vernacular Log</Txt>
        <Divider spacing={Spacing.sm} />
        <Input placeholder="Search words..." value={search} onChangeText={setSearch} style={{ marginBottom: Spacing.sm }} />
        {filteredHistory.length === 0 ? (
          <Txt variant="bodySmall" color={C.textMuted} style={{ paddingVertical: Spacing.sm }}>No words logged yet.</Txt>
        ) : (
          filteredHistory.slice(0, 20).map(w => (
            <View key={w.id} style={[styles.historyRow, { borderBottomColor: C.border }]}>
              <View style={{ flex: 1 }}>
                <Txt variant="bodyMedium" color={C.primary}>{w.word}</Txt>
                <Txt variant="bodySmall" color={C.textMuted} numberOfLines={1}>{w.definition}</Txt>
              </View>
              <Txt variant="labelSmall" color={C.textMuted}>{w.date}</Txt>
            </View>
          ))
        )}
      </Card>

      <Modal visible={showWordModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: '#00000080' }]}>
          <View style={[styles.modalContent, { backgroundColor: C.background }]}>
            <Txt variant="headingMedium" style={{ marginBottom: Spacing.md }}>Log Word</Txt>
            <Input label="Word" value={wordForm.word} onChangeText={v => setWordForm(p => ({ ...p, word: v }))} />
            <Input label="Part of Speech" value={wordForm.part_of_speech} onChangeText={v => setWordForm(p => ({ ...p, part_of_speech: v }))} style={{ marginTop: Spacing.sm }} placeholder="noun, verb, adj..." />
            <Input label="Definition" value={wordForm.definition} onChangeText={v => setWordForm(p => ({ ...p, definition: v }))} style={{ marginTop: Spacing.sm }} multiline />
            <Input label="Etymology" value={wordForm.etymology} onChangeText={v => setWordForm(p => ({ ...p, etymology: v }))} style={{ marginTop: Spacing.sm }} />
            <Input label="Example Sentence" value={wordForm.example_sentence} onChangeText={v => setWordForm(p => ({ ...p, example_sentence: v }))} style={{ marginTop: Spacing.sm }} multiline />
            <View style={styles.modalBtns}>
              <Button label="Cancel" onPress={() => setShowWordModal(false)} variant="secondary" />
              <Button label="Save" onPress={saveWordEntry} />
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
  exampleBox: { borderLeftWidth: 3, paddingLeft: Spacing.sm, paddingVertical: 4, marginTop: 8 },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, gap: Spacing.sm },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: Spacing.xl, gap: Spacing.sm, maxHeight: '90%' },
  modalBtns: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, justifyContent: 'flex-end' },
});
