import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, useColorScheme } from 'react-native';
import { useAuth } from '@clerk/expo';
import { Screen } from '../../components/ui/Screen';
import { Txt } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Divider } from '../../components/ui/Divider';
import { useSchool } from '../../hooks/useSchool';
import { Colors, Spacing } from '../../constants/theme';
import type { SchoolCourse, Assignment } from '../../constants/types';

function gradeToGPA(pct: number): number {
  if (pct >= 93) return 4.0; if (pct >= 90) return 3.7; if (pct >= 87) return 3.3;
  if (pct >= 83) return 3.0; if (pct >= 80) return 2.7; if (pct >= 77) return 2.3;
  if (pct >= 73) return 2.0; if (pct >= 70) return 1.7; if (pct >= 67) return 1.3;
  if (pct >= 63) return 1.0; if (pct >= 60) return 0.7; return 0.0;
}

export default function MiscScreen() {
  const { signOut } = useAuth();
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const { courses, create, update, remove, calculateGPA } = useSchool();

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState({ course_name: '', credit_hours: '', current_grade: '', target_grade: '', semester: '' });
  const [assignForm, setAssignForm] = useState({ name: '', due_date: '', grade_received: '', weight: '' });
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const gpa = calculateGPA();

  const saveCourse = async () => {
    if (!courseForm.course_name) return;
    await create({ course_name: courseForm.course_name, credit_hours: parseInt(courseForm.credit_hours) || 3, current_grade: courseForm.current_grade ? parseFloat(courseForm.current_grade) as any : null, target_grade: courseForm.target_grade ? parseFloat(courseForm.target_grade) as any : 93 as any, semester: courseForm.semester || null, assignments: [] });
    setCourseForm({ course_name: '', credit_hours: '', current_grade: '', target_grade: '', semester: '' });
    setShowCourseModal(false);
  };

  const addAssignment = async (courseId: string) => {
    if (!assignForm.name) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    const assignment: Assignment = { id: Date.now().toString(), name: assignForm.name, due_date: assignForm.due_date || null, grade_received: assignForm.grade_received ? parseFloat(assignForm.grade_received) : null, weight: assignForm.weight ? parseFloat(assignForm.weight) : null, completed: false };
    await update(courseId, { assignments: [...course.assignments, assignment] });
    setAssignForm({ name: '', due_date: '', grade_received: '', weight: '' });
    setShowAssignmentModal(null);
  };

  const neededForA = (course: SchoolCourse): string => {
    const done = course.assignments.filter(a => a.grade_received !== null);
    const totalWeight = done.reduce((s, a) => s + (a.weight ?? 0), 0);
    if (totalWeight >= 100) return '—';
    const points = done.reduce((s, a) => s + ((a.grade_received ?? 0) * (a.weight ?? 0) / 100), 0);
    const needed = ((93 - points) / (100 - totalWeight)) * 100;
    return needed > 100 ? 'Not achievable' : needed <= 0 ? '✓ Secured' : `${needed.toFixed(1)}%`;
  };

  return (
    <Screen>
      <Txt variant="displaySmall" style={{ marginBottom: Spacing.md }}>Misc</Txt>

      <Card style={{ marginBottom: Spacing.md }}>
        <Txt variant="headingMedium">GPA Calculator</Txt>
        <Divider spacing={Spacing.sm} />
        <View style={styles.gpaRow}>
          {[['Current GPA', gpa.toFixed(2), gpa >= 3.7 ? C.success : gpa >= 3.0 ? C.warning : C.error], ['Target', '4.00', C.accent], ['Courses', courses.length.toString(), C.text]].map(([label, val, color]) => (
            <View key={label as string} style={styles.gpaBlock}>
              <Txt variant="labelSmall" color={C.textMuted}>{label as string}</Txt>
              <Txt variant="displayMedium" color={color as string}>{val as string}</Txt>
            </View>
          ))}
        </View>
      </Card>

      <Card style={{ marginBottom: Spacing.md }}>
        <View style={styles.sectionHeader}>
          <Txt variant="headingMedium">School</Txt>
          <Button label="+ Course" onPress={() => setShowCourseModal(true)} variant="ghost" />
        </View>
        <Divider spacing={Spacing.sm} />
        {courses.length === 0 ? (
          <Txt variant="bodySmall" color={C.textMuted} style={{ paddingVertical: Spacing.sm }}>No courses. Tap + Course.</Txt>
        ) : (
          courses.map(course => {
            const expanded = expandedCourse === course.id;
            return (
              <View key={course.id}>
                <Pressable onPress={() => setExpandedCourse(expanded ? null : course.id ?? null)} onLongPress={() => course.id && remove(course.id)}
                  style={[styles.courseRow, { borderBottomColor: C.border }]}>
                  <View style={{ flex: 1 }}>
                    <Txt variant="bodyMedium">{course.course_name}</Txt>
                    <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: 2 }}>
                      <Txt variant="labelSmall" color={C.textMuted}>{course.credit_hours}cr</Txt>
                      {course.semester && <Txt variant="labelSmall" color={C.textMuted}>{course.semester}</Txt>}
                      {course.current_grade && <Txt variant="labelSmall" color={C.textMuted}>{Number(course.current_grade).toFixed(1)}% ({gradeToGPA(Number(course.current_grade)).toFixed(2)})</Txt>}
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 2 }}>
                    <Txt variant="labelSmall" color={C.textMuted}>4.0 needs: {neededForA(course)}</Txt>
                    <Txt variant="labelSmall" color={C.textMuted}>{expanded ? '▲' : '▼'}</Txt>
                  </View>
                </Pressable>
                {expanded && (
                  <View style={[styles.assignmentSection, { backgroundColor: C.surface }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                      <Txt variant="labelSmall" color={C.textMuted}>Assignments ({course.assignments.length})</Txt>
                      <Pressable onPress={() => { setShowAssignmentModal(course.id ?? null); setAssignForm({ name: '', due_date: '', grade_received: '', weight: '' }); }}>
                        <Txt variant="labelSmall" color={C.primary}>+ Add</Txt>
                      </Pressable>
                    </View>
                    {course.assignments.map(a => (
                      <View key={a.id} style={[styles.assignRow, { borderBottomColor: C.border }]}>
                        <View style={{ flex: 1 }}>
                          <Txt variant="bodySmall">{a.name}</Txt>
                          {a.due_date && <Txt variant="labelSmall" color={C.textMuted}>Due: {a.due_date}</Txt>}
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          {a.grade_received !== null && <Txt variant="bodySmall" color={C.primary}>{a.grade_received}%</Txt>}
                          {a.weight !== null && <Txt variant="labelSmall" color={C.textMuted}>{a.weight}% weight</Txt>}
                        </View>
                      </View>
                    ))}
                    {course.assignments.length === 0 && <Txt variant="bodySmall" color={C.textMuted} style={{ padding: 8 }}>No assignments yet.</Txt>}
                  </View>
                )}
              </View>
            );
          })
        )}
      </Card>

      <Card style={{ marginBottom: Spacing.md }}>
        <Txt variant="headingMedium">Settings</Txt>
        <Divider spacing={Spacing.sm} />
        <Txt variant="bodySmall" color={C.textMuted} style={{ marginBottom: Spacing.md }}>Account and preferences.</Txt>
        <Button label="Sign Out" onPress={() => signOut()} variant="secondary" />
      </Card>

      <Modal visible={showCourseModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: '#00000080' }]}>
          <View style={[styles.modalContent, { backgroundColor: C.background }]}>
            <Txt variant="headingMedium" style={{ marginBottom: Spacing.md }}>Add Course</Txt>
            <Input label="Course Name" value={courseForm.course_name} onChangeText={v => setCourseForm(p => ({ ...p, course_name: v }))} />
            <Input label="Credit Hours" value={courseForm.credit_hours} onChangeText={v => setCourseForm(p => ({ ...p, credit_hours: v }))} keyboardType="number-pad" style={{ marginTop: Spacing.sm }} />
            <Input label="Current Grade (%)" value={courseForm.current_grade} onChangeText={v => setCourseForm(p => ({ ...p, current_grade: v }))} keyboardType="decimal-pad" style={{ marginTop: Spacing.sm }} />
            <Input label="Target Grade (%)" value={courseForm.target_grade} onChangeText={v => setCourseForm(p => ({ ...p, target_grade: v }))} keyboardType="decimal-pad" style={{ marginTop: Spacing.sm }} placeholder="93" />
            <Input label="Semester" value={courseForm.semester} onChangeText={v => setCourseForm(p => ({ ...p, semester: v }))} style={{ marginTop: Spacing.sm }} placeholder="Spring 2026" />
            <View style={styles.modalBtns}>
              <Button label="Cancel" onPress={() => setShowCourseModal(false)} variant="secondary" />
              <Button label="Save" onPress={saveCourse} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!showAssignmentModal} transparent animationType="slide">
        <View style={[styles.overlay, { backgroundColor: '#00000080' }]}>
          <View style={[styles.modalContent, { backgroundColor: C.background }]}>
            <Txt variant="headingMedium" style={{ marginBottom: Spacing.md }}>Add Assignment</Txt>
            <Input label="Name" value={assignForm.name} onChangeText={v => setAssignForm(p => ({ ...p, name: v }))} />
            <Input label="Due Date" value={assignForm.due_date} onChangeText={v => setAssignForm(p => ({ ...p, due_date: v }))} style={{ marginTop: Spacing.sm }} placeholder="YYYY-MM-DD" />
            <Input label="Grade Received (%)" value={assignForm.grade_received} onChangeText={v => setAssignForm(p => ({ ...p, grade_received: v }))} keyboardType="decimal-pad" style={{ marginTop: Spacing.sm }} />
            <Input label="Weight (%)" value={assignForm.weight} onChangeText={v => setAssignForm(p => ({ ...p, weight: v }))} keyboardType="decimal-pad" style={{ marginTop: Spacing.sm }} />
            <View style={styles.modalBtns}>
              <Button label="Cancel" onPress={() => setShowAssignmentModal(null)} variant="secondary" />
              <Button label="Save" onPress={() => showAssignmentModal && addAssignment(showAssignmentModal)} />
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
  gpaRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: Spacing.sm },
  gpaBlock: { alignItems: 'center', gap: 4 },
  courseRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: Spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, gap: Spacing.sm },
  assignmentSection: { paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm },
  assignRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 6, borderBottomWidth: StyleSheet.hairlineWidth, gap: Spacing.sm },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: Spacing.xl, gap: Spacing.sm },
  modalBtns: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, justifyContent: 'flex-end' },
});
