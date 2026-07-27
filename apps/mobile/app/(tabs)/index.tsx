import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, type } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { MacroChips } from '../../src/components/MacroChips';
import { Ring } from '../../src/components/Ring';
import { Screen } from '../../src/components/Screen';
import {
  streakSummary,
  todaysKcal,
  todaysLogs,
  todaysMacros,
  useStore,
} from '../../src/store';

const MEAL_LABEL: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export default function Home() {
  const { budget, logs } = useStore();
  const consumed = todaysKcal(logs);
  const remaining = budget ? budget.kcal - consumed : 0;
  const progress = budget ? consumed / budget.kcal : 0;
  const macros = todaysMacros(logs);
  const streak = streakSummary(logs);
  const meals = todaysLogs(logs);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ ...type.caption, color: colors.textMuted }}>Today</Text>
          <Text style={{ ...type.title, color: colors.text }}>How am I doing?</Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={{ ...type.caption, color: colors.accent }}>
            🔥 {streak.logged} of last {streak.total}
          </Text>
        </View>
      </View>

      <Card style={{ alignItems: 'center', gap: spacing.md }}>
        <Ring progress={progress} overshoot={progress > 1}>
          <Text style={{ ...type.display, color: colors.text }}>{Math.round(remaining)}</Text>
          <Text style={{ ...type.caption, color: colors.textMuted }}>kcal remaining</Text>
        </Ring>
        <Text style={{ ...type.caption, color: colors.textMuted }}>
          {Math.round(consumed)} of {budget?.kcal ?? 0} kcal
        </Text>
      </Card>

      <MacroChips
        items={[
          { label: 'Protein', value: macros.protein, goal: budget?.macros.proteinG, color: colors.protein },
          { label: 'Carbs',   value: macros.carbs,   goal: budget?.macros.carbsG,   color: colors.carbs },
          { label: 'Fat',     value: macros.fat,     goal: budget?.macros.fatG,     color: colors.fat },
        ]}
      />

      <Button label="+  Log a meal" onPress={() => router.push('/(tabs)/log')} />

      <View style={{ gap: spacing.sm }}>
        <Text style={{ ...type.heading, color: colors.text }}>Today's meals</Text>
        {meals.length === 0 ? (
          <Card tone="alt">
            <Text style={{ ...type.body, color: colors.textMuted }}>
              Nothing logged yet. Tap “Log a meal” to add your first — takes about 15 seconds.
            </Text>
          </Card>
        ) : (
          meals.map((m) => (
            <Card key={m.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ ...type.bodyBold, color: colors.text }}>{MEAL_LABEL[m.mealType]}</Text>
                <Text style={{ ...type.bodyBold, color: colors.brand }}>
                  {m.estimate.kcal.low}–{m.estimate.kcal.high} kcal
                </Text>
              </View>
              <Text style={{ ...type.caption, color: colors.textMuted }}>
                {m.components.map((c) => c.dishId.replace(/_/g, ' ')).join(' · ')}
              </Text>
            </Card>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  streakPill: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
});
