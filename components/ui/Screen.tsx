import React from 'react';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
}

export function Screen({ children, scrollable = true, padded = true }: ScreenProps) {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const bg = { backgroundColor: C.background };

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safe, bg]}>
        <ScrollView
          style={bg}
          contentContainerStyle={[styles.scroll, padded && styles.padded]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, bg]}>
      <View style={[styles.fill, bg, padded && styles.padded]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  fill: { flex: 1 },
  scroll: { flexGrow: 1 },
  padded: { padding: Spacing.md },
});
