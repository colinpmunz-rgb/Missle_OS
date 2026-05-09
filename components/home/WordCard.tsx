import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Card } from '../ui/Card';
import { Txt } from '../ui/Typography';
import { Colors, Spacing } from '../../constants/theme';
import type { WordOfDay } from '../../constants/types';

interface WordCardProps {
  word: WordOfDay | null;
}

export function WordCard({ word }: WordCardProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];

  return (
    <Card style={styles.card}>
      <Txt variant="labelMedium" color={C.textMuted} style={styles.label}>Word of the Day</Txt>
      {word?.word ? (
        <View style={styles.content}>
          <Txt variant="displaySmall" color={C.primary}>{word.word}</Txt>
          {word.part_of_speech && (
            <Txt variant="bodySmall" color={C.textMuted} style={styles.pos}>
              {word.part_of_speech}
            </Txt>
          )}
          {word.definition && (
            <Txt variant="bodyMedium" style={styles.def}>{word.definition}</Txt>
          )}
        </View>
      ) : (
        <Txt variant="bodyMedium" color={C.textMuted} style={{ marginTop: 6 }}>
          No word set today. Add from the Mind tab.
        </Txt>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {},
  label: { marginBottom: 4 },
  content: { gap: 4 },
  pos: { fontStyle: 'italic' },
  def: { marginTop: 4 },
});
