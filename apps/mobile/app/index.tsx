import { Redirect } from 'expo-router';
import { useStore } from '../src/store';

export default function Index() {
  const done = useStore((s) => s.onboardingDone);
  return <Redirect href={done ? '/(tabs)' : '/onboarding/welcome'} />;
}
