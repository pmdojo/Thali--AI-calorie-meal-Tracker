import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { allDishes, estimateMeal, type MealComponent, type Portion } from '@thali/shared';
import { colors, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Icon } from '../../src/components/Icon';
import { Pill } from '../../src/components/Pill';
import { Screen } from '../../src/components/Screen';
import type { MealType } from '../../src/store';

const MEAL_TYPES: Array<{ id: MealType; label: string; icon: import('../../src/components/Icon').IconName }> = [
  { id: 'breakfast', label: 'Breakfast', icon: 'sunrise' },
  { id: 'lunch',     label: 'Lunch',     icon: 'sun' },
  { id: 'dinner',    label: 'Dinner',    icon: 'moon' },
  { id: 'snack',     label: 'Snack',     icon: 'cookie' },
];

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

  const addComponent = (dishId: string) => setComponents((cs) => [...cs, { dishId, portion: 'medium', confidence: 1 }]);
  const setPortion = (i: number, portion: Portion) => setComponents((cs) => cs.map((c, idx) => idx === i ? { ...c, portion } : c));
  const remove = (i: number) => setComponents((cs) => cs.filter((_, idx) => idx !== i));

  const footer = components.length > 0 && (
    <Button
      label={`Review ${components.length} item${components.length > 1 ? 's' : ''}`}
      icon={<Icon name="arrowR" size={16} color="#fff" strokeWidth={2.4} />}
      onPress={() =>
        router.push({
          pathname: '/add/review',
          params: { mealType, payload: JSON.stringify(components) },
        })
      }
    />
  );

  return (
    <Screen bg="parchment" scroll={false} footer={footer}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Icon name="arrowLeft" size={20} color={colors.text} />
        </Pressable>
        <Text style={[t.h3, { color: colors.text }]}>Add manually</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Meal type chips */}
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {MEAL_TYPES.map((m) => (
          <Pressable key={m.id} onPress={() => setMealType(m.id)} style={{ flex: 1 }}>
            <View style={[styles.mealChip, mealType === m.id && styles.mealChipOn]}>
              <Icon name={m.icon} size={16} color={mealType === m.id ? '#fff' : colors.text} strokeWidth={2.2} />
              <Text style={[t.caption, { color: mealType === m.id ? '#fff' : colors.text, fontWeight: '600' }]}>{m.label}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Plate summary */}
      {components.length > 0 && (
        <MotiView from={{ opacity: 0, translateY: -8 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300 }}>
          <Card tone="glassStrong" padding="lg" elevation="cardHover">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
              <Text style={[t.h3, { color: colors.text }]}>On the plate</Text>
              <Pill label={`${components.length} item${components.length > 1 ? 's' : ''}`} tone="brand" />
            </View>
            <View style={{ gap: spacing.sm }}>
              {components.map((c, i) => (
                <View key={i} style={styles.compRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[t.bodyBold, { color: colors.text, textTransform: 'capitalize' }]}>
                      {c.dishId.replace(/_/g, ' ')}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                      {(['small', 'medium', 'large'] as Portion[]).map((p) => (
                        <Pressable key={p} onPress={() => setPortion(i, p)}>
                          <View style={[styles.portion, c.portion === p && styles.portionOn]}>
                            <Text style={[t.tiny, { color: c.portion === p ? '#fff' : colors.textMuted, textTransform: 'capitalize' }]}>{p}</Text>
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <Pressable onPress={() => remove(i)} style={styles.removeBtn}>
                    <Icon name="trash" size={16} color={colors.danger} />
                  </Pressable>
                </View>
              ))}
            </View>
            <View style={styles.estimate}>
              <View>
                <Text style={[t.caption, { color: colors.textMuted }]}>Estimate</Text>
                <Text style={[t.h2, { color: colors.text }]}>{estimate.kcal.low}–{estimate.kcal.high}<Text style={[t.caption, { color: colors.textMuted }]}> kcal</Text></Text>
              </View>
              <Text style={[t.caption, { color: colors.textMuted }]}>
                P {Math.round(estimate.protein.mid)}g · C {Math.round(estimate.carbs.mid)}g · F {Math.round(estimate.fat.mid)}g
              </Text>
            </View>
          </Card>
        </MotiView>
      )}

      {/* Search */}
      <View style={styles.searchWrap}>
        <Icon name="search" size={18} color={colors.textMuted} />
        <View style={{ flex: 1 }}>
          <Text style={[t.caption, { color: colors.textMuted }]}>Search the dish library</Text>
        </View>
      </View>
      <View style={styles.searchInput}>
        <Icon name="search" size={16} color={colors.textFaint} />
        <View style={{ flex: 1 }}>
          <SearchField value={query} onChange={setQuery} />
        </View>
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Icon name="x" size={16} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Dish list */}
      <FlatList
        data={dishes}
        keyExtractor={(d) => `${d.id}-${d.name}`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200, gap: spacing.sm }}
        renderItem={({ item, index }) => (
          <MotiView
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 200, delay: index * 10 }}
          >
            <Pressable onPress={() => addComponent(item.id)}>
              <View style={[styles.dishRow, shadow.card]}>
                <View style={styles.dishIcon}>
                  <Icon name={item.category === 'grain' ? 'sunrise' : item.category === 'protein' ? 'utensils' : item.category === 'legume' ? 'soup' : item.category === 'sweet' ? 'cookie' : 'leaf'} size={18} color={colors.brand} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[t.bodyBold, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[t.caption, { color: colors.textMuted, textTransform: 'capitalize' }]}>
                    {item.kcalPer100g} kcal / 100g · {item.category}
                  </Text>
                </View>
                <View style={styles.addPill}>
                  <Icon name="plus" size={14} color={colors.brand} strokeWidth={2.6} />
                </View>
              </View>
            </Pressable>
          </MotiView>
        )}
      />
    </Screen>
  );
}

function SearchField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { TextInput } = require('react-native');
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="Try “dal”, “roti”, “paneer”"
      placeholderTextColor={colors.textFaint}
      style={{ color: colors.text, fontSize: 15, paddingVertical: 0 }}
    />
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  mealChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  mealChipOn: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
    ...shadow.brandGlow,
  },
  compRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  portion: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  portionOn: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  removeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  estimate: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    marginTop: spacing.md, paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.divider,
  },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: -8 },
  searchInput: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  dishRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.md, borderRadius: radii.xl,
    backgroundColor: colors.surface,
  },
  dishIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.brandTint,
    alignItems: 'center', justifyContent: 'center',
  },
  addPill: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.brandTint,
    alignItems: 'center', justifyContent: 'center',
  },
});
