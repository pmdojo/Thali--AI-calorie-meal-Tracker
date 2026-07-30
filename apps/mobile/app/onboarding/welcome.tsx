import { router } from 'expo-router';
import { MotiView } from 'moti';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Icon } from '../../src/components/Icon';
import { Screen } from '../../src/components/Screen';

export default function Welcome() {
  return (
    <Screen bg="sunrise" padding="hero">
      <View style={{ flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl }}>
        {/* Hero illustration */}
        <View style={styles.heroWrap}>
          <MotiView
            from={{ opacity: 0, scale: 0.8, rotate: '-8deg' }}
            animate={{ opacity: 1, scale: 1, rotate: '0deg' }}
            transition={{ type: 'spring', damping: 14, stiffness: 140 }}
            style={styles.plate}
          >
            <LinearGradient colors={gradients.parchment} style={StyleSheet.absoluteFillObject} />
            <View style={styles.plateInner}>
              <LinearGradient
                colors={['#F5F1FB', '#FDECDE']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
            </View>

            {/* Floating condiment dots */}
            <MotiView from={{ translateY: 0 }} animate={{ translateY: -8 }} transition={{ type: 'timing', duration: 2400, loop: true, repeatReverse: true }} style={[styles.dot, { top: -14, left: 22, backgroundColor: colors.accent }]} />
            <MotiView from={{ translateY: 0 }} animate={{ translateY: -12 }} transition={{ type: 'timing', duration: 2600, loop: true, repeatReverse: true, delay: 300 }} style={[styles.dot, { bottom: -6, right: 6, backgroundColor: colors.brand }]} />
            <MotiView from={{ translateY: 0 }} animate={{ translateY: -6 }} transition={{ type: 'timing', duration: 2200, loop: true, repeatReverse: true, delay: 700 }} style={[styles.dot, { top: 6, right: -12, backgroundColor: colors.gold }]} />
          </MotiView>

          {/* Sparkle icon */}
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 400 }}
            style={styles.sparkleBadge}
          >
            <LinearGradient colors={gradients.brand} style={StyleSheet.absoluteFillObject} />
            <Icon name="sparkles" size={22} color="#fff" strokeWidth={2.4} />
          </MotiView>
        </View>

        {/* Copy */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={{ gap: spacing.md, marginTop: spacing.huge }}
        >
          <Text style={styles.wordmark}>THALI</Text>
          <Text style={styles.headline}>The nutrition coach{'\n'}that <Text style={{ color: colors.brand }}>speaks your food</Text>.</Text>
          <Text style={styles.sub}>
            Calibrated for mixed home-cooked plates — dal, sabzi, roti, biryani. One better choice at a time, not a lecture.
          </Text>
        </MotiView>

        <View style={{ flex: 1 }} />

        {/* Feature bullets */}
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 400 }}
          style={{ gap: spacing.sm, marginBottom: spacing.xl }}
        >
          <Feature icon="camera" text="Snap the plate. Get a calibrated range." />
          <Feature icon="target" text="Every meal placed against your goal." />
          <Feature icon="swap" text="One better swap when you're over — never a lecture." />
        </MotiView>

        {/* CTA */}
        <MotiView
          from={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 600 }}
          style={{ gap: spacing.sm, paddingBottom: spacing.xl }}
        >
          <Button
            label="Set up my plan"
            trailing={<Icon name="arrowR" size={18} color="#fff" strokeWidth={2.4} />}
            onPress={() => router.push('/onboarding/basics')}
          />
          <Text style={styles.footnote}>Takes about 60 seconds. No sign-up. No cost.</Text>
        </MotiView>
      </View>
    </Screen>
  );
}

function Feature({ icon, text }: { icon: import('../../src/components/Icon').IconName; text: string }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Icon name={icon} size={16} color={colors.brand} strokeWidth={2.2} />
      </View>
      <Text style={[t.body, { color: colors.textSoft, flex: 1 }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: { alignItems: 'center', justifyContent: 'center', height: 200, marginTop: spacing.xl },
  plate: {
    width: 172, height: 172, borderRadius: 86,
    borderWidth: 8, borderColor: '#fff',
    overflow: 'hidden',
    ...shadow.floating,
  },
  plateInner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 86,
    margin: 22,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    width: 20, height: 20, borderRadius: 10,
    ...shadow.card,
  },
  sparkleBadge: {
    position: 'absolute',
    bottom: -8, right: '35%',
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    ...shadow.brandGlow,
  },
  wordmark: { color: colors.brand, ...t.tiny, letterSpacing: 3, textTransform: 'uppercase' },
  headline: { ...t.displayXL, color: colors.text },
  sub: { ...t.bodyLg, color: colors.textMuted },
  feature: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.glassStrong,
    borderWidth: 1, borderColor: colors.glassBorder,
    ...shadow.card,
  },
  featureIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.brandTint,
    alignItems: 'center', justifyContent: 'center',
  },
  footnote: { ...t.caption, color: colors.textMuted, textAlign: 'center' },
});
