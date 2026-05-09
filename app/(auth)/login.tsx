import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSignIn } from '@clerk/expo';
import { Colors, Spacing } from '../../constants/theme';
import { Txt } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'light'];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!isLoaded || !email || !password) {
      setError('Email and password required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signIn.create({ identifier: email.trim(), password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      } else {
        setError('Sign in incomplete. Check your credentials.');
      }
    } catch (e: any) {
      setError(e.errors?.[0]?.message ?? e.message ?? 'Sign in failed.');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: C.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.inner}>
        <View style={styles.header}>
          <Txt variant="displayLarge" color={C.primary}>Missile OS</Txt>
          <Txt variant="bodyMedium" color={C.textMuted} style={{ marginTop: 6 }}>
            Personal operating system
          </Txt>
        </View>
        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            placeholder="••••••••"
            error={error}
          />
          <Button
            label="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={{ marginTop: Spacing.sm }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.xl },
  header: { gap: 4 },
  form: { gap: Spacing.md },
});
