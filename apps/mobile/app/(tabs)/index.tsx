import { router } from 'expo-router';
import { MotiView } from 'moti';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type as t } from '@thali/ui-tokens';
import { AICoachCard } from '../../src/components/AICoachCard';
import { Card } from '../../src/components/Card';
import { FAB } from '../../src/components/FAB';
import { HabitCard } from '../../src/components/HabitCard';
import { HeroRing } from '../../src/components/HeroRing';
import { Icon } from '../../src/components/Icon';
import { Mascot, StickerTag } from '../../src/components/Kawaii';
import { MealRow } from '../../src/components/MealRow';
import { Pill } from '../../src/components/Pill';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { Sparkline } from '../../src/components/Sparkline';
import { StatTile } from '../../src/components/StatTile';
import { StreakBadge } from '../../src/components/StreakBadge';
import {
  dailyStatusForRange,
  streakSummary,
  todaysKcal,
  todaysLogs,
  todaysMacros,
  useStore,
} from '../../src/store';

function greetingParts() {
  const h = new Date().getHours();
  if (h < 5)  return { hi: 'Still up?',       icon: 'moon' as const };
  if (h < 12) return { hi: 'Good morning',    icon: 'sunrise' as const };
  if (h < 17) return { hi: 'Good afternoon',  icon: 'sun' as const };
  if (h < 21) return { hi: 'Good evening',    icon: 'sunset' as const };
  return         { hi: 'Good night',        icon: 'moon' as const };
}

function coachMessage(remaining: number, proteinConsumed: number, proteinGoal: number, streakLogged: number, streakTotal: number) {
  if (remaining < 200) return {
    headline: "You're right at the edge.",
    body:     `Only ${remaining} kcal left today. Keep the next meal light — a curd + kachumber plate lands around 180.`,
  };
  if (proteinConsumed < proteinGoal * 0.5) return {
    headline: `You're ${Math.max(0, proteinGoal - proteinConsumed)}g short on protein.`,
    body:     "A bowl of dal + paneer bhurji will get you there without breaking your kcal budget.",
  };
  if (streakLogged === streakTotal) return {
    headline: 'Every day this week — nice.',
    body:     "Consistency is what actually moves weight. You're locked in.",
  };
  return {
    headline: `You've logged ${streakLogged} of the last ${streakTotal} days.`,
    body:     "That's what moves the needle — not perfection. Snap dinner tonight and you're 1 closer.",
  };
}

export default function Home() {
  const { profile, budget, logs } = useStore();
  const consumed = todaysKcal(logs);
  const remaining = Math.max(0, (budget?.kcal ?? 0) - consumed);
  const progress = budget ? consumed / budget.kcal : 0;
  const macros = todaysMacros(logs);
  const streak = streakSummary(logs);
  const meals = todaysLogs(logs).sort((a, b) => a.loggedAt.localeCompare(b.loggedAt));

  const week = dailyStatusForRange(logs, budget, 7);
  const dayLabels = week.map((d) => new Date(d.date).toLocaleDateString('en', { weekday: 'narrow' }));

  const g = greetingParts();
  const coach = coachMessage(remaining, macros.protein, budget?.macros.proteinG ?? 100, streak.logged, streak.total);

  const firstName = 'there'; // profile has no name field; keep flexible

  return (
    <>
      <Screen bg="parchment">
        {/* ─── Greeting bar ───────────────────────────────────────── */}
        <View style={styles.topRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 }}>
            <Mascot size={48} />
            <View style={{ flex: 1, gap: 3 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name={g.icon} size={15} color={colors.textMuted} strokeWidth={2} />
                <Text style={[t.captionBold, { color: colors.textMuted }]}>{g.hi}</Text>
              </View>
              <Text style={[t.h2, { color: colors.text }]}>How's today going?</Text>
            </View>
          </View>
          <Pressable style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
            <Icon name="user" size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* ─── Hero ring + streak on top ───────────────────────────── */}
        <View>
          <StickerTag label="On track!" tone="yellow" rotate={-9} style={{ position: 'absolute', top: -12, right: 18, zIndex: 20 }} />
          <StickerTag label="Nice 🎉" tone="pink" rotate={8} style={{ position: 'absolute', top: 96, left: -6, zIndex: 20 }} />
        <Card tone="glassStrong" padding="lg" elevation="cardHover" radius="xxl" style={{ alignItems: 'center', gap: spacing.md }}>
          <View style={styles.streakRow}>
            <StreakBadge count={streak.logged} label={`of ${streak.total} days`} />
            <Pill label="On track" icon="check" tone="success" />
          </View>

          <HeroRing
            progress={progress}
            consumed={consumed}
            remaining={remaining}
            budget={budget?.kcal ?? 0}
          />

          <View style={styles.miniStats}>
            <MiniStat icon="flame" label="Consumed" value={`${Math.round(consumed)}`} color={colors.accent} />
            <View style={styles.miniDivider} />
            <MiniStat icon="target" label="Budget"   value={`${budget?.kcal ?? 0}`} color={colors.brand} />
            <View style={styles.miniDivider} />
            <MiniStat icon="trending" label="Pace"   value={`${budget?.weeklyRateKgPerWeek ?? 0} kg/wk`} color={colors.success} />
          </View>
        </Card>
        </View>

        {/* ─── AI Coach ────────────────────────────────────────────── */}
        <AICoachCard
          headline={coach.headline}
          body={coach.body}
          ctaLabel="Ask the coach"
          onCta={() => router.push('/(tabs)/log')}
        />

        {/* ─── Progress cards (macros) ─────────────────────────────── */}
        <SectionHeader title="Today's progress" />
        <View style={styles.grid}>
          <StatTile
            label="Protein"
            value={Math.round(macros.protein)}
            unit={`/ ${budget?.macros.proteinG ?? 0}g`}
            icon="activity"
            tint="lavender"
            progress={macros.protein / Math.max(1, budget?.macros.proteinG ?? 1)}
            style={styles.gridItem}
          />
          <StatTile
            label="Carbs"
            value={Math.round(macros.carbs)}
            unit={`/ ${budget?.macros.carbsG ?? 0}g`}
            icon="zap"
            tint="gold"
            progress={macros.carbs / Math.max(1, budget?.macros.carbsG ?? 1)}
            style={styles.gridItem}
          />
          <StatTile
            label="Fat"
            value={Math.round(macros.fat)}
            unit={`/ ${budget?.macros.fatG ?? 0}g`}
            icon="droplets"
            tint="peach"
            progress={macros.fat / Math.max(1, budget?.macros.fatG ?? 1)}
            style={styles.gridItem}
          />
          <StatTile
            label="Water"
            value="1.4"
            unit="/ 2.5 L"
            icon="droplets"
            tint="sky"
            progress={0.56}
            style={styles.gridItem}
          />
        </View>

        {/* ─── Weekly trend chart ──────────────────────────────────── */}
        <SectionHeader title="Last 7 days" action="See all" onAction={() => router.push('/(tabs)/history')} />
        <Card padding="lg" elevation="card">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <View>
              <Text style={[t.caption, { color: colors.textMuted }]}>Weekly average</Text>
              <Text style={[t.h2, { color: colors.text }]}>{Math.round(week.reduce((s, d) => s + d.kcal, 0) / 7)} kcal</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[t.caption, { color: colors.textMuted }]}>Goal</Text>
              <Text style={[t.h2, { color: colors.brand }]}>{budget?.kcal ?? 0} kcal</Text>
            </View>
          </View>
          <Sparkline
            data={week.map((d) => d.kcal || (budget?.kcal ?? 0) * 0.15)}
            goal={budget?.kcal ?? 0}
            labels={dayLabels}
            width={310}
            height={140}
          />
        </Card>

        {/* ─── Today's meals ───────────────────────────────────────── */}
        <SectionHeader title="Today's meals" action={meals.length ? 'Add another' : undefined} onAction={() => router.push('/(tabs)/log')} />
        {meals.length === 0 ? (
          <Card tone="lavender" padding="lg" style={{ alignItems: 'center', gap: spacing.sm }}>
            <View style={styles.emptyIcon}>
              <Icon name="utensils" size={24} color={colors.brand} />
            </View>
            <Text style={[t.bodyBold, { color: colors.text }]}>Nothing logged yet.</Text>
            <Text style={[t.caption, { color: colors.textMuted, textAlign: 'center' }]}>
              Tap the scan button below to snap your first plate — takes about 15 seconds.
            </Text>
          </Card>
        ) : (
          <View style={{ gap: spacing.sm }}>
            {meals.map((m, i) => (
              <MealRow
                key={m.id}
                index={i}
                mealType={m.mealType}
                items={m.components.map((c) => c.dishId)}
                kcalLow={m.estimate.kcal.low}
                kcalHigh={m.estimate.kcal.high}
                confidence={m.estimate.overallConfidence}
                time={new Date(m.loggedAt).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}
                wasSwapped={(m as { tookAlternative?: boolean }).tookAlternative}
              />
            ))}
          </View>
        )}

        {/* ─── Healthy habits ──────────────────────────────────────── */}
        <SectionHeader title="Healthy habits" action="Customize" />
        <View style={{ gap: spacing.sm }}>
          <HabitCard
            title="Hit protein floor"
            subtitle="1.6 g / kg keeps lean mass"
            icon="activity"
            tint="lavender"
            count={`${Math.round((macros.protein / Math.max(1, budget?.macros.proteinG ?? 1)) * 100)}%`}
            streak={4}
          />
          <HabitCard
            title="Drink water"
            subtitle="8 glasses today"
            icon="droplets"
            tint="sky"
            count="5 / 8"
            streak={12}
          />
          <HabitCard
            title="Home-cooked meals"
            subtitle="Better calibration = better accuracy"
            icon="leaf"
            tint="mint"
            count="3 today"
            streak={6}
          />
          <HabitCard
            title="Move after dinner"
            subtitle="10-min walk lowers glucose spike"
            icon="heart"
            tint="peach"
            count="Not yet"
          />
        </View>

        <View style={{ height: spacing.xxl }} />
      </Screen>

      <FAB icon="scan" label="Scan meal" onPress={() => router.push('/add/camera')} bottom={104} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
function MiniStat({ icon, label, value, color }: { icon: import('../../src/components/Icon').IconName; label: string; value: string; color: string }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 6 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
      style={{ flex: 1, alignItems: 'center', gap: 4 }}
    >
      <Icon name={icon} size={14} color={color} strokeWidth={2.2} />
      <Text style={[t.caption, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[t.bodyBold, { color: colors.text }]}>{value}</Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
    ...({} as object),
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  miniStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  miniDivider: {
    width: 1, height: 32,
    backgroundColor: colors.divider,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    width: '47%',
    flexGrow: 1,
  },
  emptyIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.brandTint,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xs,
  },
});
