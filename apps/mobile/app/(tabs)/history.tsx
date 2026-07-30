import { MotiView } from 'moti';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, type as t } from '@thali/ui-tokens';
import { Card } from '../../src/components/Card';
import { Icon } from '../../src/components/Icon';
import { Pill } from '../../src/components/Pill';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { Sparkline } from '../../src/components/Sparkline';
import { StatTile } from '../../src/components/StatTile';
import { dailyStatusForRange, streakSummary, useStore } from '../../src/store';

const STATUS_GRADIENT: Record<string, [string, string]> = {
  none:          ['#F3EEE4', '#E5DFD3'],
  under:         ['#C9DFF7', '#8DB6E8'],
  ok:            ['#B7E1C7', '#2FA679'],
  slightly_over: ['#F8E1B0', '#E5A72B'],
  over:          ['#F4C8C6', '#DC5350'],
};

const STATUS_LABEL: Record<string, string> = {
  none: 'Nothing logged',
  under: 'Under target',
  ok: 'Within budget',
  slightly_over: 'Slightly over',
  over: 'Over budget',
};

export default function History() {
  const { budget, logs } = useStore();
  const days28 = dailyStatusForRange(logs, budget, 28);
  const days7  = dailyStatusForRange(logs, budget, 7);
  const streak = streakSummary(logs, 7);

  const avgKcal = Math.round(days7.filter((d) => d.kcal > 0).reduce((s, d) => s + d.kcal, 0) / Math.max(1, days7.filter((d) => d.kcal > 0).length));
  const daysHit = days28.filter((d) => d.status === 'ok').length;

  return (
    <Screen bg="parchment">
      <View style={{ gap: 4 }}>
        <Text style={[t.captionBold, { color: colors.textMuted }]}>Your rhythm</Text>
        <Text style={[t.h1, { color: colors.text }]}>Momentum, not perfection.</Text>
      </View>

      {/* Streak headline */}
      <Card tone="glassStrong" padding="lg" elevation="cardHover">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={[t.caption, { color: colors.textMuted }]}>This week</Text>
            <Text style={[t.display, { color: colors.text }]}>{streak.logged}<Text style={[t.h2, { color: colors.textMuted }]}> / {streak.total}</Text></Text>
            <Text style={[t.body, { color: colors.textMuted }]}>days logged</Text>
          </View>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="flame" size={28} color={colors.accent} strokeWidth={2.2} />
          </View>
        </View>
      </Card>

      {/* Stats */}
      <View style={styles.grid}>
        <StatTile label="Avg. daily" value={avgKcal || 0} unit="kcal" icon="chart" tint="lavender" style={styles.gridItem} />
        <StatTile label="Days on target" value={daysHit} unit="/ 28" icon="target" tint="mint" style={styles.gridItem} />
      </View>

      {/* Weekly chart */}
      <SectionHeader title="Last 7 days" />
      <Card padding="lg">
        <Sparkline
          data={days7.map((d) => d.kcal || (budget?.kcal ?? 0) * 0.15)}
          goal={budget?.kcal ?? 2000}
          labels={days7.map((d) => new Date(d.date).toLocaleDateString('en', { weekday: 'narrow' }))}
          width={310}
          height={140}
        />
      </Card>

      {/* Heatmap */}
      <SectionHeader title="Last 28 days" />
      <Card padding="lg" style={{ gap: spacing.md }}>
        <View style={styles.heatmap}>
          {days28.map((d, i) => (
            <MotiView
              key={d.date}
              from={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 300, delay: i * 15 }}
              style={styles.cellWrap}
            >
              <View
                style={[
                  styles.cell,
                  { backgroundColor: STATUS_GRADIENT[d.status][1] + (d.status === 'none' ? '55' : 'ff') },
                ]}
              />
              <Text style={[t.tiny, { color: colors.textFaint }]}>{new Date(d.date).getDate()}</Text>
            </MotiView>
          ))}
        </View>

        <View style={styles.legend}>
          {(['ok', 'slightly_over', 'over', 'none'] as const).map((k) => (
            <View key={k} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: STATUS_GRADIENT[k][1] }]} />
              <Text style={[t.caption, { color: colors.textMuted }]}>{STATUS_LABEL[k]}</Text>
            </View>
          ))}
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Pill label="Weekly view" icon="filter" tone="brand" />
        <Pill label="Export CSV" icon="chart" tone="neutral" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: spacing.md },
  gridItem: { flex: 1 },
  heatmap: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'flex-start',
  },
  cellWrap: { alignItems: 'center', gap: 3, width: 34 },
  cell: { width: 28, height: 28, borderRadius: radii.sm },
  legend: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 3 },
});
