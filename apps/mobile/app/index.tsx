import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useStore } from '../src/store';
import { colors } from '@thali/ui-tokens';

export default function Index() {
  const done = useStore((s) => s.onboardingDone);
  // Persisted state hydrates asynchronously (AsyncStorage). Hold the redirect
  // until it lands, so returning users aren't flashed the onboarding welcome.
  const [hydrated, setHydrated] = useState(() => useStore.persist.hasHydrated());
  useEffect(() => useStore.persist.onFinishHydration(() => setHydrated(true)), []);

  if (!hydrated) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  return <Redirect href={done ? '/(tabs)' : '/onboarding/welcome'} />;
}
