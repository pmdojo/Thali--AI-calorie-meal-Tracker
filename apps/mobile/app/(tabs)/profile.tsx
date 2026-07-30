import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Icon, IconName } from '../../src/components/Icon';
import { Pill } from '../../src/components/Pill';
import { Screen } from '../../src/components/Screen';
import { useStore } from '../../src/store';

export default function Profile() {
  const { profile, budget, reset } = useStore();

  return (
    <Screen bg="parchment">
      <View style={{ gap: 4 }}>
        <Text style={[t.captionBold, { color: colors.textMuted }]}>You</Text>
        <Text style={[t.h1, { color: colors.text }]}>Your Thali plan</Text>
      </View>

      {profile && budget && (
        <View style={styles.avatarCard}>
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>R</Text>
          </View>
          <Text style={styles.name}>{profile.sex === 'female' ? 'She' : 'He'} · {profile.age}y</Text>
          <Text style={styles.sub}>
            {profile.heightCm}cm · {profile.weightKg}kg · {profile.activity.replace('_', ' ')}
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
            <View style={styles.gradPill}>
              <Icon name="target" size={13} color="#fff" strokeWidth={2.4} />
              <Text style={styles.gradPillText}>{profile.goal.toUpperCase()}</Text>
            </View>
            <View style={styles.gradPill}>
              <Icon name="leaf" size={13} color="#fff" strokeWidth={2.4} />
              <Text style={styles.gradPillText}>{profile.dietary.replace('_', ' ').toUpperCase()}</Text>
            </View>
          </View>
        </View>
      )}

      {budget && (
        <Card padding="lg" elevation="card">
          <Text style={[t.captionBold, { color: colors.textMuted }]}>Daily plan</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <Text style={[t.display, { color: colors.text }]}>{budget.kcal}</Text>
            <Text style={[t.bodyBold, { color: colors.textMuted }]}>kcal / day</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
            <MacroLabel label="Protein" value={budget.macros.proteinG} color={colors.protein} />
            <MacroLabel label="Carbs"   value={budget.macros.carbsG}   color={colors.carbs} />
            <MacroLabel label="Fat"     value={budget.macros.fatG}     color={colors.fat} />
          </View>
          <Text style={[t.caption, { color: colors.textMuted, marginTop: spacing.md }]}>
            {budget.weeklyRateKgPerWeek !== 0
              ? `Sustainable pace: ${Math.abs(budget.weeklyRateKgPerWeek)} kg / week ${budget.weeklyRateKgPerWeek < 0 ? 'lost' : 'gained'}.`
              : 'Maintenance — same weight, week after week.'}
          </Text>
        </Card>
      )}

      <View style={{ gap: spacing.sm }}>
        <SettingsRow icon="bell"     title="Notifications" subtitle="Meal reminders + weekly summary" />
        <SettingsRow icon="scale"    title="Units"         subtitle="Metric (kg, cm)" />
        <SettingsRow icon="activity" title="Health integrations" subtitle="Apple Health · Google Fit" />
        <SettingsRow icon="sparkles" title="AI settings"   subtitle="Vision model · confidence threshold" />
      </View>

      <Card tone="peach" padding="lg" style={{ gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Icon name="award" size={20} color={colors.accent} strokeWidth={2.2} />
          <Text style={[t.h3, { color: colors.text }]}>Free portfolio build</Text>
        </View>
        <Text style={[t.body, { color: colors.textMuted }]}>
          Running in mock recognition mode — no API keys required. All the flag logic + swaps are real.
        </Text>
        <Pill label="v0.2 · Redesigned" icon="sparkles" tone="accent" />
      </Card>

      <Button
        label="Reset (start over)"
        variant="ghost"
        onPress={() =>
          Alert.alert('Reset everything?', 'This wipes your profile and all logs on this device.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: () => { reset(); router.replace('/onboarding/welcome'); } },
          ])
        }
      />
    </Screen>
  );
}

function MacroLabel({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
        <Text style={[t.tiny, { color: colors.textMuted, textTransform: 'uppercase' }]}>{label}</Text>
      </View>
      <Text style={[t.h3, { color: colors.text }]}>{value}g</Text>
    </View>
  );
}

function SettingsRow({ icon, title, subtitle, onPress }: { icon: IconName; title: string; subtitle: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.row, shadow.card]}>
        <View style={styles.rowIcon}>
          <Icon name={icon} size={18} color={colors.text} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[t.bodyBold, { color: colors.text }]}>{title}</Text>
          <Text style={[t.caption, { color: colors.textMuted }]}>{subtitle}</Text>
        </View>
        <Icon name="chevronR" size={18} color={colors.textFaint} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatarCard: {
    borderRadius: radii.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
    ...shadow.brandGlow,
  },
  avatarCircle: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarLetter: { color: '#fff', fontSize: 34, fontWeight: '800' },
  name: { color: '#fff', ...t.h2, textTransform: 'capitalize' },
  sub:  { color: 'rgba(255,255,255,0.85)', ...t.body },
  gradPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.3)', borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.pill,
  },
  gradPillText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg, borderRadius: radii.xl, backgroundColor: colors.surface,
  },
  rowIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
});
