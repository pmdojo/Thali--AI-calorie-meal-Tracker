import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';

export default function Welcome() {
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingTop: spacing.xxxl }}>
        <View style={{ gap: spacing.md }}>
          <Text style={styles.mark}>Thali</Text>
          <Text style={styles.headline}>The nutrition coach that speaks your food.</Text>
          <Text style={styles.sub}>
            Calibrated on home-cooked, mixed plates — dal, sabzi, roti — not just plated Western meals.
            One better choice at a time, not a lecture.
          </Text>
        </View>
        <View style={{ gap: spacing.md, paddingBottom: spacing.xl }}>
          <Button label="Set up my plan" onPress={() => router.push('/onboarding/basics')} />
          <Text style={styles.footnote}>Takes about a minute. No sign-up needed to try.</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mark: { ...type.display, color: colors.brand },
  headline: { ...type.title, color: colors.text },
  sub: { ...type.body, color: colors.textMuted },
  footnote: { ...type.caption, color: colors.textMuted, textAlign: 'center' },
});
