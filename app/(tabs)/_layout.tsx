import React from 'react';
import { Platform, StyleSheet, View, Pressable, useColorScheme } from 'react-native';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing } from '../../constants/theme';
import { Txt } from '../../components/ui/Typography';

const TABS = [
  { name: 'index', label: 'Home', icon: 'home-outline' as const, route: '/(tabs)/' },
  { name: 'presence', label: 'Presence', icon: 'eye-outline' as const, route: '/(tabs)/presence' },
  { name: 'mind', label: 'Mind', icon: 'book-outline' as const, route: '/(tabs)/mind' },
  { name: 'body', label: 'Body', icon: 'fitness-outline' as const, route: '/(tabs)/body' },
  { name: 'craft', label: 'Craft', icon: 'hammer-outline' as const, route: '/(tabs)/craft' },
  { name: 'calendar', label: 'Calendar', icon: 'calendar-outline' as const, route: '/(tabs)/calendar' },
  { name: 'misc', label: 'Misc', icon: 'apps-outline' as const, route: '/(tabs)/misc' },
];

function WebTopNav() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={[styles.webNav, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
      <Txt variant="headingMedium" color={C.primary} style={styles.logo}>Missile OS</Txt>
      <View style={styles.webTabs}>
        {TABS.map(tab => {
          const active = tab.name === 'index'
            ? pathname === '/' || pathname === '/(tabs)/' || pathname === '/(tabs)'
            : pathname.includes(`/${tab.name}`);
          return (
            <Pressable
              key={tab.name}
              onPress={() => router.push(tab.route as any)}
              style={[styles.webTab, active && { borderBottomColor: C.primary, borderBottomWidth: 2 }]}
            >
              <Txt
                variant="labelLarge"
                color={active ? C.primary : C.textMuted}
                style={{ fontFamily: Fonts.inter.medium }}
              >
                {tab.label}
              </Txt>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];

  const screenOptions = ({ route }: { route: { name: string } }) => {
    const tab = TABS.find(t => t.name === route.name);
    return {
      headerShown: false,
      tabBarActiveTintColor: C.primary,
      tabBarInactiveTintColor: C.textMuted,
      tabBarStyle: Platform.OS === 'web'
        ? { display: 'none' as const }
        : { backgroundColor: C.surface, borderTopColor: C.border, paddingBottom: 4 },
      tabBarLabelStyle: { fontFamily: Fonts.inter.medium, fontSize: 10 },
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name={tab?.icon ?? 'apps-outline'} size={size} color={color} />
      ),
    };
  };

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: C.background }}>
        <WebTopNav />
        <Tabs screenOptions={screenOptions}>
          <Tabs.Screen name="index" options={{ title: 'Home' }} />
          <Tabs.Screen name="presence" options={{ title: 'Presence' }} />
          <Tabs.Screen name="mind" options={{ title: 'Mind' }} />
          <Tabs.Screen name="body" options={{ title: 'Body' }} />
          <Tabs.Screen name="craft" options={{ title: 'Craft' }} />
          <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
          <Tabs.Screen name="misc" options={{ title: 'Misc' }} />
        </Tabs>
      </View>
    );
  }

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="presence" options={{ title: 'Presence' }} />
      <Tabs.Screen name="mind" options={{ title: 'Mind' }} />
      <Tabs.Screen name="body" options={{ title: 'Body' }} />
      <Tabs.Screen name="craft" options={{ title: 'Craft' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Calendar' }} />
      <Tabs.Screen name="misc" options={{ title: 'Misc' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  webNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 56,
    gap: Spacing.xl,
  },
  logo: { minWidth: 120 },
  webTabs: {
    flexDirection: 'row',
    flex: 1,
    height: '100%',
  },
  webTab: {
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
    height: '100%',
  },
});
