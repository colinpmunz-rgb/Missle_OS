import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import * as Updates from 'expo-updates';
import { Colors, Spacing } from '../../constants/theme';
import { Txt } from './Typography';

export function UpdateBanner() {
  const [available, setAvailable] = useState(false);
  const [applying, setApplying] = useState(false);
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];

  useEffect(() => {
    (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setAvailable(true);
        }
      } catch {
        // dev mode or no updates
      }
    })();
  }, []);

  if (!available) return null;

  const apply = async () => {
    setApplying(true);
    await Updates.reloadAsync();
  };

  return (
    <Pressable onPress={apply} style={[styles.banner, { backgroundColor: C.primary }]}>
      <Txt variant="labelMedium" color="#fff">
        {applying ? 'Applying update...' : 'Update available — tap to apply'}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
});
