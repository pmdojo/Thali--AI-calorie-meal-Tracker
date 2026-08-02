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

  useEffect(() => {
    // If hydration already finished before this effect ran, onFinishHydration
    // would never fire — so check up front and only subscribe otherwise.
    // persist always resolves hydration (even on a storage error), so no timeout
    // is needed; a timeout here would risk redirecting to onboarding with a
    // stale `done=false` while the store is still loading on a cold start.
    if (useStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  if (!hydrated) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  return <Redirect href={done ? '/(tabs)' : '/onboarding/welcome'} />;
}
