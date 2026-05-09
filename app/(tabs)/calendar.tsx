import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Modal, Pressable, useColorScheme, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Divider } from '../../components/ui/Divider';
import { useAuth } from '../../hooks/useAuth';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { useGarmin } from '../../hooks/useGarmin';
import { Colors, Spacing, CalendarTagColors } from '../../constants/theme';
import { CALENDAR_TAGS, type CalendarTag, type CalendarEvent } from '../../constants/types';
import { format } from 'date-fns';

export default function CalendarScreen() {
  const { userId } = useAuth();
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const { events, create, remove, eventsForDate } = useCalendarEvents(userId);

  const [selected, setSelected] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<{
    title: string; start_time: string; end_time: string; tag: CalendarTag; notes: string;
  }>({ title: '', start_time: '', end_time: '', tag: 'Personal', notes: '' });

  const dayEvents = eventsForDate(selected);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    for (const e of events) {
      const color = CalendarTagColors[e.tag as CalendarTag] ?? C.primary;
      if (!marks[e.date]) {
        marks[e.date] = { dots: [], marked: true };
      }
      marks[e.date].dots.push({ color });
    }
    if (selected) {
      marks[selected] = { ...(marks[selected] ?? {}), selected: true, selectedColor: C.primary };
    }
    return marks;
  }, [events, selected, C.primary]);

  const saveEvent = async () => {
    if (!form.title) return;
    await create({
      title: form.title,
      date: selected,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      tag: form.tag,
      notes: form.notes || null,
    });
    setForm({ title: '', start_time: '', end_time: '', tag: 'Personal', notes: '' });
    setShowModal(false);
  };

  const calTheme = {
    backgroundColor: C.background,
    calendarBackground: C.background,
    textSectionTitleColor: C.textMuted,
    selectedDayBackgroundColor: C.primary,
    selectedDayTextColor: '#fff',
    todayTextColor: C.accent,
    dayTextColor: C.text,
    textDisabledColor: C.border,
    dotColor: C.primary,
    selectedDotColor: '#fff',
    arrowColor: C.primary,
    monthTextColor: C.text,
    indicatorColor: C.primary,
    textDayFontFamily: 'Inter_400Regular',
    textMonthFontFamily: 'EBGaramond_600SemiBold',
    textDayHeaderFontFamily: 'Inter_500Medium',
  };

  return (
    <Screen scrollable={false} padded={false}>
      <View style={[styles.header, { paddingHorizontal: Spacing.md, paddingTop: Spacing.md }]}>
        <Txt variant="displaySmall">Calendar</Txt>
        <Button label="+ Event" onPress={() => setShowModal(true)} variant="ghost" />
      </View>

      <Calendar
        theme={calTheme}
        onDayPress={day => setSelected(day.dateString)}
        markedDates={markedDates}
        markingType="multi-dot"
        style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border }}
      />

      {/* Tag Legend */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.legendScroll}
        contentContainerStyle={styles.legend}>
        {CALENDAR_TAGS.map(tag => (
          <View key={tag} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: CalendarTagColors[tag] === '#F5F0E8' ? C.border : CalendarTagColors[tag] }]} />
            <Txt variant="labelSmall" color={C.textMuted}>{tag}</Txt>
          </View>
        ))}
      </ScrollView>

      {/* Events for selected day */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: Spacing.md }}>
        <Txt variant="headingSmall" style={{ marginBottom: Spacing.sm }}>
          {format(new Date(selected + 'T00:00:00'), 'MMMM d, yyyy')}
        </Txt>
        {dayEvents.length === 0 ? (
          <Txt variant="bodyMedium" color={C.textMuted}>No events. Tap + Event to add.</Txt>
        ) : (
          dayEvents.map(event => (
            <Pressable key={event.id} onLongPress={() => event.id && remove(event.id)}>
              <Card style={[styles.eventCard, { borderLeftColor: CalendarTagColors[event.tag as CalendarTag] ?? C.primary, borderLeftWidth: 3 }]}>
                <View style={styles.eventHeader}>
                  <Txt variant="bodyMedium" style={{ flex: 1 }}>{event.title}</Txt>
                  <Txt variant="labelSmall" color={C.textMuted}>{event.tag}</Txt>
                </View>
                {(event.start_time || event.end_time) && (
                  <Txt variant="bodySmall" color={C.textMuted}>
                    {event.start_time ?? ''}{event.start_time && event.end_time ? ' – ' : ''}{event.end_time ?? ''}
                  </Txt>
                )}
                {event.notes && <Txt variant="bodySmall" color={C.textMuted}>{event.notes}</Txt>}
              </Card>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Add Event Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: '#00000080' }]}>
          <View style={[styles.modalContent, { backgroundColor: C.background }]}>
            <Txt variant="headingMedium" style={{ marginBottom: Spacing.md }}>
              New Event — {format(new Date(selected + 'T00:00:00'), 'MMM d')}
            </Txt>
            <Input label="Title" value={form.title} onChangeText={v => setForm(p => ({ ...p, title: v }))} />
            <View style={styles.timeRow}>
              <Input label="Start Time" value={form.start_time} onChangeText={v => setForm(p => ({ ...p, start_time: v }))} placeholder="09:00" style={{ flex: 1 }} />
              <Input label="End Time" value={form.end_time} onChangeText={v => setForm(p => ({ ...p, end_time: v }))} placeholder="10:00" style={{ flex: 1 }} />
            </View>
            <Txt variant="labelSmall" color={C.textMuted} style={{ marginTop: Spacing.sm }}>Tag</Txt>
            <View style={styles.tagRow}>
              {CALENDAR_TAGS.map(tag => (
                <Pressable key={tag} onPress={() => setForm(p => ({ ...p, tag }))}
                  style={[styles.tagBtn, {
                    borderColor: form.tag === tag ? CalendarTagColors[tag] : C.border,
                    backgroundColor: form.tag === tag ? CalendarTagColors[tag] + '33' : 'transparent',
                  }]}>
                  <Txt variant="labelSmall" color={form.tag === tag ? C.text : C.textMuted}>{tag}</Txt>
                </Pressable>
              ))}
            </View>
            <Input label="Notes" value={form.notes} onChangeText={v => setForm(p => ({ ...p, notes: v }))} multiline style={{ marginTop: Spacing.sm }} />
            <View style={styles.modalBtns}>
              <Button label="Cancel" onPress={() => setShowModal(false)} variant="secondary" />
              <Button label="Save" onPress={saveEvent} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  legendScroll: { maxHeight: 32 },
  legend: { flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.md, alignItems: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  eventCard: { marginBottom: Spacing.sm, gap: 4 },
  eventHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: Spacing.xl, gap: Spacing.sm },
  modalBtns: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, justifyContent: 'flex-end' },
  timeRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tagBtn: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 2 },
});
