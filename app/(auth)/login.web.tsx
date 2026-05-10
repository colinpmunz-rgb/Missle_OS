import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSignIn, useSignUp, useSSO } from '@clerk/expo';
import { Colors, Fonts, Spacing } from '../../constants/theme';
import { Txt } from '../../components/ui/Typography';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function LoginScreen() {
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();
  const scheme = useColorScheme();
  const C = Colors[scheme ?? 'dark'];
  const isDark = scheme === 'dark';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle OAuth callback redirect
  useEffect(() => {
    if (!signInLoaded) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has('__clerk_status')) {
      setLoading(true);
      (signIn as any).handleRedirectCallback?.()
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [signInLoaded]);

  const handleSignIn = async () => {
    if (!signInLoaded || !email || !password) { setError('Email and password required.'); return; }
    setLoading(true); setError('');
    try {
      const result = await signIn!.create({ identifier: email.trim(), password });
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
      const result = await signUp!.create({ emailAddress: email.trim(), password });
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

  const handleOAuth = async (strategy: 'oauth_google' | 'oauth_microsoft') => {
    if (!signInLoaded) return;
    setLoading(true); setError('');
    try {
      const redirectUrl = `${window.location.origin}/(auth)/login`;
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      } as any);
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (e: any) {
      setError(e.errors?.[0]?.message ?? e.message ?? 'OAuth failed.');
    }
    setLoading(false);
  };

  const switchMode = (next: 'signin' | 'signup') => {
    setMode(next); setError(''); setPassword(''); setConfirm('');
  };

  const activeTab = { borderBottomColor: C.primary, borderBottomWidth: 2 };

  return (
    <View style={[styles.root, { backgroundColor: C.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.card}>
        <View style={styles.header}>
          <Txt variant="displayLarge" color={C.primary}>M.I.S.S.L.E. OS</Txt>
          <Txt variant="bodyMedium" color={C.textMuted} style={{ marginTop: 4 }}>
            Personal operating system
          </Txt>
        </View>

        {/* OAuth buttons */}
        <View style={styles.oauthRow}>
          <Pressable
            style={[styles.oauthBtn, { borderColor: C.border, backgroundColor: C.surface }]}
            onPress={() => handleOAuth('oauth_google')}
            disabled={loading}
          >
            <Txt variant="labelLarge" color={C.text}>G  Google</Txt>
          </Pressable>
          <Pressable
            style={[styles.oauthBtn, { borderColor: C.border, backgroundColor: C.surface }]}
            onPress={() => handleOAuth('oauth_microsoft')}
            disabled={loading}
          >
            <Txt variant="labelLarge" color={C.text}>⊞  Microsoft</Txt>
          </Pressable>
        </View>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
          <Txt variant="bodySmall" color={C.textMuted} style={{ marginHorizontal: 12 }}>or</Txt>
          <View style={[styles.dividerLine, { backgroundColor: C.border }]} />
        </View>

        {/* Mode toggle */}
        <View style={[styles.tabs, { borderBottomColor: C.border }]}>
          <Pressable onPress={() => switchMode('signin')} style={[styles.tab, mode === 'signin' && activeTab]}>
            <Txt variant="labelLarge" color={mode === 'signin' ? C.primary : C.textMuted}>Sign In</Txt>
          </Pressable>
          <Pressable onPress={() => switchMode('signup')} style={[styles.tab, mode === 'signup' && activeTab]}>
            <Txt variant="labelLarge" color={mode === 'signup' ? C.primary : C.textMuted}>Create Account</Txt>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 420, paddingHorizontal: Spacing.xl, gap: Spacing.lg },
  header: { alignItems: 'center', gap: 4, marginBottom: Spacing.sm },
  oauthRow: { flexDirection: 'row', gap: Spacing.sm },
  oauthBtn: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    borderRadius: 8, borderWidth: 1,
  },
  dividerRow: { flexDirection: 'row', alignItems: 'center' },
  dividerLine: { flex: 1, height: 1 },
  tabs: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, gap: 0 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  form: { gap: 0 },
});
