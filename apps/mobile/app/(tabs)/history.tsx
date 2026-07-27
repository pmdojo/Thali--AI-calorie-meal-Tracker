import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, type } from '@thali/ui-tokens';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { dailyStatusForRange, streakSummary, useStore } from '../../src/store';

const STATUS_COLOR: Record<string, string> = {
  none: colors.surfaceAlt,
  under: colors.info,
  ok: colors.success,
  slightly_over: colors.warning,
  over: colors.danger,
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
  const days = dailyStatusForRange(logs, budget, 14);
  const streak = streakSummary(logs, 7);

  return (
    <Screen>
      <Text style={{ ...type.title, color: colors.text }}>This fortnight</Text>
      <Text style={{ ...type.body, color: colors.textMuted }}>
        You've logged {streak.logged} of the last {streak.total} days. That's what moves the needle, not perfection.
      </Text>

      <Card tone="alt" style={{ gap: spacing.sm }}>
        <Text style={{ ...type.heading, color: colors.text }}>14-day heatmap</Text>
        <View style={styles.grid}>
          {days.map((d) => (
            <View key={d.date} style={{ alignItems: 'center', gap: 4 }}>
              <View style={[styles.cell, { backgroundColor: STATUS_COLOR[d.status] }]} />
              <Text style={{ ...type.caption, color: colors.textMuted, fontSize: 10 }}>
                {new Date(d.date).getDate()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.legendRow}>
          {(['ok', 'slightly_over', 'over', 'none'] as const).map((k) => (
            <View key={k} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: STATUS_COLOR[k] }]} />
              <Text style={{ ...type.caption, color: colors.textMuted }}>{STATUS_LABEL[k]}</Text>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm,
  },
  cell: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 3 },
});
