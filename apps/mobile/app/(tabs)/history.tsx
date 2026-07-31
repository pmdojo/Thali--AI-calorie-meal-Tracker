import { MotiView } from 'moti';
import { StyleSheet, Text, View } from 'react-native';
import { estimateMeal, getDish } from '@thali/shared';
import { colors, radii, spacing, type as t } from '@thali/ui-tokens';
import { Card } from '../../src/components/Card';
import { Icon } from '../../src/components/Icon';
import { Pill } from '../../src/components/Pill';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { Sparkline } from '../../src/components/Sparkline';
import { StatTile } from '../../src/components/StatTile';
import { dailyStatusForRange, streakSummary, todaysLogs, useStore, type MealLog } from '../../src/store';

// Soft tile background + strong ring per budget status.
const STATUS_BG: Record<string, string> = {
  none: '#F1ECE2', under: '#E9F1FB', ok: '#EAF7EF', slightly_over: '#FBF1DD', over: '#F9E4E3',
};
const STATUS_RING: Record<string, string> = {
  none: 'transparent', under: '#8DB6E8', ok: '#2FA679', slightly_over: '#E5A72B', over: '#DC5350',
};
const STATUS_LABEL: Record<string, string> = {
  ok: 'Within budget', slightly_over: 'Slightly over', over: 'Over budget', none: 'Nothing logged',
};

// A representative emoji for a dish.
const ID_EMOJI: Record<string, string> = {
  paneer_butter: '🧀', paneer_bhurji: '🧀', palak_paneer: '🧀',
  chicken_curry: '🍗', butter_chicken: '🍗', biryani_chicken: '🍗',
  egg_bhurji: '🥚', samosa: '🥟', pakora: '🧆', gulab_jamun: '🍮',
  idli: '🍥', dosa_plain: '🥞', dosa_masala: '🥞', poha: '🍚', upma: '🍚',
  kachumber: '🥗', raita: '🥛', curd: '🥛', naan: '🫓',
};
const CAT_EMOJI: Record<string, string> = {
  grain: '🫓', rice: '🍚', legume: '🥣', protein: '🍛', sabzi: '🥗',
  snack: '🍪', sweet: '🍮', drink: '🥛', salad: '🥗',
};
function dishEmoji(dishId: string): string {
  if (ID_EMOJI[dishId]) return ID_EMOJI[dishId];
  const d = getDish(dishId);
  return (d && CAT_EMOJI[d.category]) || '🍽️';
}
// The emoji for a whole day = the highest-calorie dish logged that day.
function dayEmoji(dayLogs: MealLog[]): string | null {
  let best: string | null = null;
  let bestK = -1;
  for (const m of dayLogs) {
    for (const c of m.components) {
      const k = estimateMeal([c]).kcal.mid;
      if (k > bestK) { bestK = k; best = c.dishId; }
    }
  }
  return best ? dishEmoji(best) : null;
}

export default function History() {
  const { budget, logs } = useStore();
  const days28 = dailyStatusForRange(logs, budget, 28);
  const days7  = dailyStatusForRange(logs, budget, 7);
  const streak = streakSummary(logs, 7);

  const logged = days7.filter((d) => d.kcal > 0);
  const avgKcal = Math.round(logged.reduce((s, d) => s + d.kcal, 0) / Math.max(1, logged.length));
  const daysHit = days28.filter((d) => d.status === 'ok').length;

  return (
    <Screen bg="parchment">
      <View style={{ gap: 4 }}>
        <Text style={[t.captionBold, { color: colors.textMuted }]}>Your rhythm</Text>
        <Text style={[t.h1, { color: colors.text }]}>Momentum, not perfection.</Text>
      </View>

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

      <View style={styles.grid}>
        <StatTile label="Avg. daily" value={avgKcal || 0} unit="kcal" icon="chart" tint="lavender" style={styles.gridItem} />
        <StatTile label="Days on target" value={daysHit} unit="/ 28" icon="target" tint="mint" style={styles.gridItem} />
      </View>

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

      {/* Food calendar — each logged day shows what you ate */}
      <SectionHeader title="Your food calendar" />
      <Card padding="lg" style={{ gap: spacing.md }}>
        {/* weekday header */}
        <View style={styles.weekHeader}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, i) => (
            <Text key={i} style={styles.weekHeaderText}>{w}</Text>
          ))}
        </View>

        <View style={styles.calGrid}>
          {days28.map((d, i) => {
            const date = new Date(d.date);
            const emoji = dayEmoji(todaysLogs(logs, date));
            const isToday = i === days28.length - 1;
            return (
              <MotiView
                key={d.date}
                from={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 280, delay: i * 14 }}
                style={styles.cellWrap}
              >
                <View
                  style={[
                    styles.cell,
                    {
                      backgroundColor: STATUS_BG[d.status],
                      borderWidth: emoji ? 1.5 : isToday ? 1.5 : 0,
                      borderColor: emoji ? STATUS_RING[d.status] : isToday ? colors.brand : 'transparent',
                    },
                  ]}
                >
                  {emoji ? <Text style={styles.cellEmoji}>{emoji}</Text> : null}
                </View>
                <Text style={[styles.cellNum, isToday && { color: colors.brand, fontWeight: '800' }]}>{date.getDate()}</Text>
              </MotiView>
            );
          })}
        </View>

        <View style={styles.legend}>
          {(['ok', 'slightly_over', 'over', 'none'] as const).map((k) => (
            <View key={k} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: STATUS_RING[k] === 'transparent' ? colors.border : STATUS_RING[k] }]} />
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
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  weekHeaderText: { ...t.tiny, color: colors.textFaint, fontWeight: '700', width: `${100 / 7}%`, textAlign: 'center' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  cellWrap: { width: `${100 / 7}%`, alignItems: 'center', gap: 3, marginBottom: spacing.sm },
  cell: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cellEmoji: { fontSize: 20 },
  cellNum: { ...t.tiny, color: colors.textFaint },
  legend: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md,
    paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 3 },
});
