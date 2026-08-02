import { MotiView } from 'moti';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Card } from '../../src/components/Card';
import { Icon, IconName } from '../../src/components/Icon';
import { PillChart, type PillBar } from '../../src/components/PillChart';
import { ProgressRing } from '../../src/components/ProgressRing';
import { Screen } from '../../src/components/Screen';
import { SegmentedToggle } from '../../src/components/SegmentedToggle';
import {
  dailyStatusForRange, streakSummary, todaysLogs, todaysMacros, useStore,
} from '../../src/store';

// Two-tone data language — terracotta (protein / on-track) + berry (carbs / over).
const PROTEIN = { c: '#DD8A46', deep: '#C26E2E', track: '#F7E4CE', tint: '#FBEEDD' };
const CARBS   = { c: '#BE4B63', deep: '#9E3350', track: '#F1D6DC', tint: '#F8E7EB' };
const INK = '#3A2E1D';

type Range = 'Day' | 'Weekly' | 'Monthly';
const RANGES: readonly Range[] = ['Day', 'Weekly', 'Monthly'] as const;

const fmtK = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${Math.round(n)}`);
const dayBack = (i: number) => { const d = new Date(); d.setDate(d.getDate() - i); return d; };

export default function Activity() {
  const { budget, logs } = useStore();
  const [range, setRange] = useState<Range>('Weekly');
  const goalKcal = budget?.kcal ?? 2000;
  const proteinGoalG = budget?.macros.proteinG ?? 100;
  const carbsGoalG = budget?.macros.carbsG ?? 200;

  const { bars, goalRatio, yTicks, proteinKcal, carbsKcal, proteinPct, carbsPct } = useMemo(() => {
    const days = range === 'Day' ? 1 : range === 'Weekly' ? 7 : 30;

    // macro totals for the ring cards
    let pg = 0, cg = 0;
    for (let i = 0; i < days; i++) { const m = todaysMacros(logs, dayBack(i)); pg += m.protein; cg += m.carbs; }
    const proteinKcal = Math.round(pg * 4);
    const carbsKcal = Math.round(cg * 4);
    const proteinPct = pg / Math.max(1, proteinGoalG * days);
    const carbsPct = cg / Math.max(1, carbsGoalG * days);

    // bars
    let raw: { label: string; kcal: number }[] = [];
    if (range === 'Day') {
      const today = todaysLogs(logs);
      raw = (['breakfast', 'lunch', 'dinner', 'snack'] as const).map((tp) => ({
        label: tp[0].toUpperCase(),
        kcal: today.filter((m) => m.mealType === tp).reduce((s, m) => s + m.estimate.kcal.mid, 0),
      }));
    } else if (range === 'Weekly') {
      const d7 = dailyStatusForRange(logs, budget, 7);
      raw = d7.map((d) => ({ label: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }).slice(0, 3), kcal: d.kcal }));
    } else {
      const d28 = dailyStatusForRange(logs, budget, 28);
      raw = [0, 1, 2, 3].map((w) => {
        const slice = d28.slice(w * 7, w * 7 + 7);
        const avg = slice.reduce((s, d) => s + d.kcal, 0) / 7;
        return { label: `W${w + 1}`, kcal: Math.round(avg) };
      });
    }

    const maxKcal = Math.max(...raw.map((r) => r.kcal), 0);
    const goalRef = range === 'Day' ? maxKcal || goalKcal * 0.4 : goalKcal;
    const scale = Math.max(maxKcal, goalRef) * 1.25 || 1;

    const bars: PillBar[] = raw.map((r) => {
      const over = range !== 'Day' && r.kcal > goalKcal * 1.05;
      return {
        label: r.label,
        value: r.kcal > 0 ? Math.max(0.16, r.kcal / scale) : 0.1,
        color: over ? CARBS.c : PROTEIN.c,
        track: over ? CARBS.track : PROTEIN.track,
        dotColor: over ? '#FFFFFF' : INK,
      };
    });

    const yTicks = [`${fmtK(scale)}`, `${fmtK(scale * 0.5)}`, '0'];
    const goalRatio = range === 'Day' ? undefined : goalKcal / scale;
    return { bars, goalRatio, yTicks, proteinKcal, carbsKcal, proteinPct, carbsPct };
  }, [range, logs, budget, goalKcal, proteinGoalG, carbsGoalG]);

  // ── microrewards ────────────────────────────────────────────────────────
  const streak = streakSummary(logs, 7);
  const d7 = dailyStatusForRange(logs, budget, 7);
  const daysOnBudget = d7.filter((d) => d.status === 'ok').length;
  const todayProtein = todaysMacros(logs).protein;

  const challenges: ChallengeData[] = [
    {
      icon: 'award', tint: PROTEIN, title: 'One step closer',
      done: streak.logged >= 5, progress: `${streak.logged}/5 days`, reward: `${streak.logged * 90} kcal`,
    },
    {
      icon: 'activity', tint: CARBS, title: 'Protein floor',
      done: todayProtein >= proteinGoalG, progress: `${Math.round(todayProtein)}/${proteinGoalG} g`, reward: 'Badge',
    },
    {
      icon: 'target', tint: PROTEIN, title: 'On-budget week',
      done: daysOnBudget >= 3, progress: `${daysOnBudget}/3 days`, reward: `${daysOnBudget * 50} kcal`,
    },
  ];

  return (
    <Screen bg="parchment">
      {/* header */}
      <View style={styles.header}>
        <View style={styles.hBtn}><Icon name="chart" size={20} color={colors.text} /></View>
        <Text style={[t.h1, { color: colors.text }]}>Activity</Text>
        <View style={styles.hBtn}><Icon name="filter" size={18} color={colors.text} /></View>
      </View>

      <SegmentedToggle options={RANGES} value={range} onChange={setRange} />

      {/* macro ring cards */}
      <View style={styles.ringRow}>
        <RingStat label="Protein" icon="activity" kcal={proteinKcal} pct={proteinPct} palette={PROTEIN} />
        <RingStat label="Carbs" icon="zap" kcal={carbsKcal} pct={carbsPct} palette={CARBS} />
      </View>

      {/* pill chart */}
      <Card padding="lg" elevation="cardHover" radius="xxl" style={{ gap: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[t.h2, { color: colors.text }]}>Overall progress</Text>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Legend color={PROTEIN.c} label="On track" />
            <Legend color={CARBS.c} label="Over" />
          </View>
        </View>
        <PillChart bars={bars} height={200} yTicks={yTicks} goalRatio={goalRatio} />
      </Card>

      {/* challenges */}
      <View style={styles.sectionHead}>
        <Text style={[t.h2, { color: colors.text }]}>Challenge</Text>
        <Pressable><Text style={[t.bodyBold, { color: colors.brand }]}>View all</Text></Pressable>
      </View>
      <View style={{ gap: spacing.sm }}>
        {challenges.map((c, i) => <ChallengeCard key={c.title} data={c} index={i} />)}
      </View>

      <View style={{ height: spacing.xl }} />
    </Screen>
  );
}

// ── ring stat card ──────────────────────────────────────────────────────────
function RingStat({
  label, icon, kcal, pct, palette,
}: { label: string; icon: IconName; kcal: number; pct: number; palette: typeof PROTEIN }) {
  return (
    <View style={[styles.ringCard, shadow.card]}>
      <View style={styles.ringTop}>
        <View style={[styles.ringIcon, { backgroundColor: palette.tint }]}>
          <Icon name={icon} size={16} color={palette.deep} strokeWidth={2.2} />
        </View>
        <Text style={[t.bodyBold, { color: colors.text }]}>{label}</Text>
        <View style={{ flex: 1 }} />
        <Icon name="trending" size={16} color={colors.textFaint} />
      </View>
      <View style={styles.ringBottom}>
        <View>
          <Text style={styles.ringKcal}>{kcal}<Text style={styles.ringUnit}> Kcal</Text></Text>
          <Text style={[t.caption, { color: colors.textMuted }]}>Eaten</Text>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ProgressRing progress={pct} size={58} thickness={8} color={palette.c} track={palette.track} />
          <Text style={styles.ringPct}>{Math.round(Math.min(1, pct) * 100)}%</Text>
        </View>
      </View>
    </View>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: color }} />
      <Text style={[t.caption, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

// ── challenge card ──────────────────────────────────────────────────────────
interface ChallengeData {
  icon: IconName; tint: typeof PROTEIN; title: string;
  done: boolean; progress: string; reward: string;
}
function ChallengeCard({ data, index }: { data: ChallengeData; index: number }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 360, delay: index * 80 }}
    >
      <Card padding="md" elevation="card" style={styles.chalCard}>
        <View style={[styles.chalIcon, { backgroundColor: data.tint.tint }]}>
          <Icon name={data.icon} size={22} color={data.tint.deep} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[t.bodyBold, { color: colors.text }]}>{data.title}</Text>
          {data.done
            ? <Text style={[t.captionBold, { color: colors.success }]}>Completed</Text>
            : <Text style={[t.caption, { color: colors.textMuted }]}>{data.progress}</Text>}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 3 }}>
          {data.done
            ? <View style={styles.rewardBadge}><Icon name="check" size={13} color="#fff" strokeWidth={3} /></View>
            : <Icon name="flame" size={20} color={data.tint.c} strokeWidth={2} />}
          <Text style={styles.rewardText}>{data.reward}</Text>
        </View>
      </Card>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  hBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
    ...shadow.card,
  },
  ringRow: { flexDirection: 'row', gap: spacing.md },
  ringCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radii.xl,
    padding: spacing.lg, gap: spacing.lg, borderWidth: 1, borderColor: colors.border,
  },
  ringTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ringIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  ringBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  ringKcal: { fontFamily: fonts.numX, fontSize: 26, color: colors.text, letterSpacing: -0.5 },
  ringUnit: { fontFamily: fonts.semibold, fontSize: 12, color: colors.textMuted },
  ringPct: { position: 'absolute', fontFamily: fonts.bold, fontSize: 12, color: colors.text },
  sectionHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  chalCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  chalIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  rewardBadge: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
  },
  rewardText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.textMuted },
});
