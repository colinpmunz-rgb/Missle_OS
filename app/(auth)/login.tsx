import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSignIn, useSignUp } from '@clerk/expo';
import { Colors, Spacing } from '../../constants/theme';
import { Txt } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function LoginScreen() {
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'dark'];

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!signInLoaded || !email || !password) { setError('Email and password required.'); return; }
    setLoading(true); setError('');
    try {
      const result = await signIn.create({ identifier: email.trim(), password });
      if (result.status === 'complete') {
        await setActiveSignIn({ session: result.createdSessionId });
      } else {
        setError('Sign in incomplete. Check your credentials.');
      }
    } catch (e: any) {
      setError(e.errors?.[0]?.message ?? e.message ?? 'Sign in failed.');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!signUpLoaded || !email || !password) { setError('Email and password required.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError('');
    try {
      const result = await signUp.create({ emailAddress: email.trim(), password });
      if (result.status === 'complete') {
        await setActiveSignUp({ session: result.createdSessionId });
      } else {
        setError('Check your email to verify your account, then sign in.');
      }
    } catch (e: any) {
      setError(e.errors?.[0]?.message ?? e.message ?? 'Sign up failed.');
    }
    setLoading(false);
  };

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next); setError(''); setPassword(''); setConfirm('');
  };

  const isDark = scheme === 'dark';
  const activeTab = { borderBottomColor: C.primary, borderBottomWidth: 2 };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: C.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.inner}>
        <View style={styles.header}>
          <Txt variant="displayLarge" color={C.primary}>M.I.S.S.L.E. OS</Txt>
          <Txt variant="bodyMedium" color={C.textMuted} style={{ marginTop: 4 }}>
            Personal operating system
          </Txt>
        </View>

        {/* Mode toggle */}
        <View style={[styles.tabs, { borderBottomColor: C.border }]}>
          <Pressable
            onPress={() => switchMode('signin')}
            style={[styles.tab, mode === 'signin' && activeTab]}
          >
            <Txt variant="labelLarge" color={mode === 'signin' ? C.primary : C.textMuted}>
              Sign In
            </Txt>
          </Pressable>
          <Pressable
            onPress={() => switchMode('signup')}
            style={[styles.tab, mode === 'signup' && activeTab]}
          >
            <Txt variant="labelLarge" color={mode === 'signup' ? C.primary : C.textMuted}>
              Create Account
            </Txt>
          </Pressable>
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
            autoComplete={mode === 'signup' ? 'new-password' : 'password'}
            returnKeyType={mode === 'signup' ? 'next' : 'done'}
            onSubmitEditing={mode === 'signin' ? handleSignIn : undefined}
            placeholder="••••••••"
            style={{ marginTop: Spacing.sm }}
          />
          {mode === 'signup' && (
            <Input
              label="Confirm Password"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
              placeholder="••••••••"
              error={error}
              style={{ marginTop: Spacing.sm }}
            />
          )}
          {mode === 'signin' && error ? (
            <Txt variant="bodySmall" color={C.error} style={{ marginTop: 4 }}>{error}</Txt>
          ) : null}
          <Button
            label={mode === 'signin' ? 'Sign In' : 'Create Account'}
            onPress={mode === 'signin' ? handleSignIn : handleSignUp}
            loading={loading}
            fullWidth
            style={{ marginTop: Spacing.md }}
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
  tabs: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, gap: 0 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  form: {},
});
