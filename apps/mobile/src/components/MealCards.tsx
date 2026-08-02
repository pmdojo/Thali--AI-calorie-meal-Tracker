import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { getDish } from '@thali/shared';
import { colors, fonts, radii, spacing } from '@thali/ui-tokens';
import { Food3D } from './Food3D';
import { Icon } from './Icon';
import type { MealLog, MealType } from '../store';

// Fixed daily slots, each a distinct warm hue (no blue — stays on-brand with
// the terracotta / cream system). The 3D food emoji hovers over the top edge.
type Slot = {
  type: MealType;
  label: string;
  grad: readonly [string, string];
  share: number; // fraction of the day's budget this slot typically holds
};

const SLOTS: readonly Slot[] = [
  { type: 'breakfast', label: 'Breakfast', grad: ['#F4B183', '#E8895A'], share: 0.25 },
  { type: 'lunch',     label: 'Lunch',     grad: ['#E7A15C', '#C26E2E'], share: 0.35 },
  { type: 'dinner',    label: 'Dinner',    grad: ['#D68E5A', '#A15E38'], share: 0.30 },
  { type: 'snack',     label: 'Snack',     grad: ['#ECAF82', '#D98357'], share: 0.10 },
] as const;

function dishName(id: string): string {
  return getDish(id)?.name ?? id.replace(/_/g, ' ');
}

interface MealCardsProps {
  meals: MealLog[];
  budgetKcal: number;
  onAdd: (type: MealType) => void;
  onOpen: (meal: MealLog) => void;
}

export function MealCards({ meals, budgetKcal, onAdd, onOpen }: MealCardsProps) {
  const { width } = useWindowDimensions();

  // Responsive card sizing: ~2 cards + a peek on phones, larger on tablets/web,
  // always clamped so the layout never breaks on tiny or huge screens.
  const gutter = spacing.xl; // matches Screen's horizontal padding
  const cardW = Math.max(150, Math.min(210, (width - gutter * 2) * 0.52));
  const cardH = Math.round(cardW * 1.52);
  const emojiSize = Math.round(cardW * 0.58); // the 3D illustration

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      // Full-bleed: cancel the Screen padding, re-apply it as scroll inset so
      // the first/last cards align to the page edges and the rest peek.
      style={{ marginHorizontal: -gutter }}
      contentContainerStyle={{
        paddingHorizontal: gutter,
        paddingTop: emojiSize * 0.62,   // room for the hovering food
        paddingBottom: spacing.sm,
        gap: spacing.md,
      }}
    >
      {SLOTS.map((slot, i) => {
        const slotMeals = meals.filter((m) => m.mealType === slot.type);
        const filled = slotMeals.length > 0;

        const kcal = Math.round(slotMeals.reduce((s, m) => s + m.estimate.kcal.mid, 0));
        const ingredients = Array.from(
          new Set(slotMeals.flatMap((m) => m.components.map((c) => dishName(c.dishId)))),
        );
        const recommend = Math.max(0, Math.round((budgetKcal * slot.share) / 10) * 10);

        return (
          <MealCard
            key={slot.type}
            slot={slot}
            index={i}
            width={cardW}
            height={cardH}
            emojiSize={emojiSize}
            filled={filled}
            kcal={kcal}
            ingredients={ingredients}
            recommend={recommend}
            onPress={() => (filled ? onOpen(slotMeals[0]) : onAdd(slot.type))}
          />
        );
      })}
    </ScrollView>
  );
}

interface MealCardProps {
  slot: Slot;
  index: number;
  width: number;
  height: number;
  emojiSize: number;
  filled: boolean;
  kcal: number;
  ingredients: string[];
  recommend: number;
  onPress: () => void;
}

function MealCard({
  slot, index, width, height, emojiSize, filled, kcal, ingredients, recommend, onPress,
}: MealCardProps) {
  const ingredientText = ingredients.slice(0, 3).join(', ');

  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 420, delay: index * 90 }}
    >
      <Pressable onPress={onPress} style={{ width }}>
        {({ pressed }) => (
          <MotiView
            animate={{ scale: pressed ? 0.97 : 1 }}
            transition={{ type: 'timing', duration: 120 }}
          >
            {/* the gradient card body */}
            <LinearGradient
              colors={filled ? slot.grad : ['#F3E7D5', '#ECDCC4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.card,
                { width, height, borderRadius: radii.xl },
                filled ? styles.cardShadow : styles.cardShadowEmpty,
              ]}
            >
              <View style={{ height: emojiSize * 0.42 }} />

              <Text
                style={[
                  styles.label,
                  { color: filled ? '#FFFFFF' : colors.text },
                ]}
                numberOfLines={1}
              >
                {slot.label}
              </Text>

              {filled ? (
                <Text style={styles.ingredients} numberOfLines={3}>
                  {ingredientText}
                </Text>
              ) : (
                <Text style={styles.recommend} numberOfLines={2}>
                  Recommend{'\n'}~{recommend} kcal
                </Text>
              )}

              <View style={{ flex: 1 }} />

              {filled ? (
                <View style={styles.kcalRow}>
                  <Text style={styles.kcal}>{kcal.toLocaleString()}</Text>
                  <Text style={styles.kcalUnit}>kcal</Text>
                </View>
              ) : (
                <View style={styles.addBtn}>
                  <Icon name="plus" size={22} color={colors.brandDeep} strokeWidth={2.6} />
                </View>
              )}
            </LinearGradient>

            {/* the 3D food, hovering above the top edge with a soft float */}
            <MotiView
              from={{ translateY: 0 }}
              animate={{ translateY: -6 }}
              transition={{ type: 'timing', duration: 2200, loop: true, repeatReverse: true, delay: index * 260 }}
              pointerEvents="none"
              style={[styles.foodWrap, { top: -emojiSize * 0.58, left: width * 0.5 - emojiSize * 0.5 }]}
            >
              <Food3D type={slot.type} size={emojiSize} />
            </MotiView>
          </MotiView>
        )}
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    overflow: 'visible',
  },
  cardShadow: {
    shadowColor: '#8A4A24',
    shadowOpacity: 0.32,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  cardShadowEmpty: {
    shadowColor: '#3C3020',
    shadowOpacity: 0.10,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 19,
    letterSpacing: -0.3,
  },
  ingredients: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 6,
  },
  recommend: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 6,
  },
  kcalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  kcal: {
    fontFamily: fonts.numX,
    fontSize: 30,
    letterSpacing: -1,
    color: '#FFFFFF',
  },
  kcalUnit: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3C3020',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  foodWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
  },
});
