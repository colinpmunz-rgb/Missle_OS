import React from 'react';
import { Platform, ScrollView, StyleSheet, View, useColorScheme } from 'react-native';
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
  const isDark = scheme === 'dark';

  const bg = { backgroundColor: C.background };

  const webOverlay = Platform.OS === 'web' && isDark ? ({
    backgroundImage: [
      'radial-gradient(ellipse 110% 45% at 50% 0%, rgba(224,118,88,0.13) 0%, transparent 60%)',
      'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.035\'/%3E%3C/svg%3E")',
    ].join(', '),
  } as any) : {};

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safe, bg]}>
        <ScrollView
          style={[bg, webOverlay]}
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
      <View style={[styles.fill, bg, webOverlay, padded && styles.padded]}>
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
