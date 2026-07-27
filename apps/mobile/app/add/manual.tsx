import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, type } from '@thali/ui-tokens';
import { allDishes, estimateMeal, type MealComponent, type Portion } from '@thali/shared';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Choice, Field } from '../../src/components/Field';
import { Screen } from '../../src/components/Screen';
import type { MealType } from '../../src/store';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_LABEL: Record<MealType, string> = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };

function inferMealType(): MealType {
  const h = new Date().getHours();
  if (h < 11) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h < 21) return 'dinner';
  return 'snack';
}

export default function Manual() {
  const [mealType, setMealType] = useState<MealType>(inferMealType());
  const [query, setQuery] = useState('');
  const [components, setComponents] = useState<MealComponent[]>([]);

  const dishes = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = allDishes();
    if (!q) return all.slice(0, 30);
    return all.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 30);
  }, [query]);

  const estimate = useMemo(() => estimateMeal(components), [components]);

  const addComponent = (dishId: string) => {
    setComponents((cs) => [...cs, { dishId, portion: 'medium', confidence: 1 }]);
  };
  const setPortion = (i: number, portion: Portion) => {
    setComponents((cs) => cs.map((c, idx) => idx === i ? { ...c, portion } : c));
  };
  const remove = (i: number) => setComponents((cs) => cs.filter((_, idx) => idx !== i));

  return (
    <Screen>
      <Text style={{ ...type.title, color: colors.text }}>Log a meal</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {MEAL_TYPES.map((t) => (
          <Choice key={t} label={MEAL_LABEL[t]} selected={mealType === t} onPress={() => setMealType(t)} />
        ))}
      </View>

      {components.length > 0 && (
        <Card style={{ gap: spacing.sm }}>
          <Text style={{ ...type.heading, color: colors.text }}>On the plate</Text>
          {components.map((c, i) => (
            <View key={i} style={styles.compRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.body, color: colors.text }}>
                  {c.dishId.replace(/_/g, ' ')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                  {(['small', 'medium', 'large'] as Portion[]).map((p) => (
                    <Pressable key={p} onPress={() => setPortion(i, p)}>
                      <Text style={[styles.portion, c.portion === p && styles.portionOn]}>{p}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <Pressable onPress={() => remove(i)}>
                <Text style={{ ...type.body, color: colors.danger }}>Remove</Text>
              </Pressable>
            </View>
          ))}
          <Text style={{ ...type.bodyBold, color: colors.brand, marginTop: spacing.sm }}>
            {estimate.kcal.low}–{estimate.kcal.high} kcal · P {estimate.protein.mid}g · C {estimate.carbs.mid}g · F {estimate.fat.mid}g
          </Text>
        </Card>
      )}

      <Field label="Search dishes" value={query} onChangeText={setQuery} placeholder="dal, roti, paneer…" />

      <View style={{ flex: 1, minHeight: 300 }}>
        <FlatList
          data={dishes}
          keyExtractor={(d) => d.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable onPress={() => addComponent(item.id)} style={styles.dishRow}>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.body, color: colors.text }}>{item.name}</Text>
                <Text style={{ ...type.caption, color: colors.textMuted }}>
                  {item.kcalPer100g} kcal / 100g · {item.category}
                </Text>
              </View>
              <Text style={{ ...type.bodyBold, color: colors.brand }}>+ add</Text>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
        />
      </View>

      <Button
        label={components.length ? `Review ${components.length} item${components.length > 1 ? 's' : ''}` : 'Add at least one dish'}
        disabled={components.length === 0}
        onPress={() =>
          router.push({
            pathname: '/add/review',
            params: { mealType, payload: JSON.stringify(components) },
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  compRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  portion: {
    ...type.caption,
    color: colors.textMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  portionOn: {
    color: '#fff',
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  dishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
});
