import React from 'react';
import { View, useColorScheme, StyleSheet } from 'react-native';
import { SignIn } from '@clerk/react';
import { Colors } from '../../constants/theme';
import { Txt } from '../../components/ui/Typography';

export default function LoginScreen() {
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'dark'];

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <View style={styles.brand}>
        <Txt variant="displayLarge" color={C.primary}>M.I.S.S.L.E. OS</Txt>
        <Txt variant="bodyMedium" color={C.textMuted} style={{ marginTop: 4 }}>
          Personal operating system
        </Txt>
      </View>
      <SignIn afterSignInUrl="/" afterSignUpUrl="/" signUpUrl="/(auth)/login" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32 },
  brand: { alignItems: 'center', gap: 4 },
});
