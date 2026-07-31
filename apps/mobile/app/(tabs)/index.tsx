import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { DonutChart } from '../../src/components/DonutChart';
import { Icon, IconName } from '../../src/components/Icon';
import { Mascot } from '../../src/components/Kawaii';
import { Screen } from '../../src/components/Screen';
import { todaysKcal, todaysLogs, useStore, type MealType } from '../../src/store';

const MEALS: Array<{ id: MealType; label: string; emoji: string; bg: string; badge: string }> = [
  { id: 'breakfast', label: 'Breakfast', emoji: '🍳', bg: '#E7F0FF', badge: '#D3E4FF' },
  { id: 'lunch',     label: 'Lunch',     emoji: '🥗', bg: '#E4F6FF', badge: '#CFEEFC' },
  { id: 'dinner',    label: 'Dinner',    emoji: '🍛', bg: '#EDEBFF', badge: '#DED9FB' },
  { id: 'snack',     label: 'Snack',     emoji: '🥨', bg: '#EAF1FF', badge: '#D8E3FB' },
];

const TABS = ['Meals', 'Activity', 'Water'] as const;

export default function Home() {
  const { budget, logs } = useStore();
  const consumed = todaysKcal(logs);
  const planned = budget?.kcal ?? 0;
  const left = Math.max(0, planned - consumed);
  const meals = todaysLogs(logs);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Meals');

  const kcalFor = (m: MealType) =>
    Math.round(meals.filter((x) => x.mealType === m).reduce((s, x) => s + x.estimate.kcal.mid, 0));

  const today = new Date();

  return (
    <Screen bgColor="#EDF4FB" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Mascot size={50} />
          <View>
            <Text style={[t.caption, { color: colors.textMuted }]}>Hello,</Text>
            <Text style={[t.h2, { color: colors.text }]}>there 👋</Text>
          </View>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateNum}>{today.getDate()}</Text>
          <Text style={styles.dateMon}>{today.toLocaleDateString('en', { month: 'short' })}</Text>
        </View>
      </View>

      {/* Plan / Left + donut */}
      <View style={{ alignItems: 'center', marginTop: spacing.sm }}>
        <View style={styles.planRow}>
          <View>
            <Text style={[t.caption, { color: colors.textMuted }]}>Plan</Text>
            <Text style={[t.h2, { color: colors.text }]}>{planned.toLocaleString()} <Text style={styles.kcalUnit}>kcal</Text></Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[t.caption, { color: colors.textMuted }]}>Left</Text>
            <Text style={[t.h2, { color: colors.brand }]}>{left.toLocaleString()} <Text style={[styles.kcalUnit, { color: colors.brandDeep }]}>kcal</Text></Text>
          </View>
        </View>
        <DonutChart consumed={consumed} budget={planned || 1} size={248} />
        <Text style={[t.caption, { color: colors.textMuted, marginTop: -6 }]}>
          {Math.round(consumed).toLocaleString()} kcal eaten today
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tb) => {
          const active = tab === tb;
          return (
            <Pressable key={tb} onPress={() => setTab(tb)}>
              <Text style={[styles.tab, active ? styles.tabActive : styles.tabIdle]}>{tb}</Text>
              {active && <View style={styles.tabDot} />}
            </Pressable>
          );
        })}
      </View>

      {/* Content */}
      {tab === 'Meals' ? (
        <View style={styles.mealGrid}>
          {MEALS.map((m, i) => (
            <MotiView
              key={m.id}
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 320, delay: i * 70 }}
              style={[styles.mealCard, { backgroundColor: m.bg }, shadow.card]}
            >
              <View style={styles.mealTop}>
                <View style={[styles.mealBadge, { backgroundColor: m.badge }]}>
                  <Text style={{ fontSize: 16 }}>{m.emoji}</Text>
                </View>
                <Text style={[t.captionBold, { color: colors.text }]}>{kcalFor(m.id)} kcal</Text>
              </View>
              <View style={styles.mealBottom}>
                <Text style={[t.bodyBold, { color: colors.text }]}>{m.label}</Text>
                <Pressable onPress={() => router.push('/add/camera')} style={styles.plusBtn}>
                  <Icon name="plus" size={16} color="#fff" strokeWidth={2.6} />
                </Pressable>
              </View>
            </MotiView>
          ))}
        </View>
      ) : (
        <View style={styles.placeholder}>
          <View style={styles.phIcon}>
            <Icon name={tab === 'Activity' ? 'activity' : 'droplets'} size={24} color={colors.brand} />
          </View>
          <Text style={[t.bodyBold, { color: colors.text }]}>{tab} coming soon</Text>
          <Text style={[t.caption, { color: colors.textMuted, textAlign: 'center' }]}>
            {tab === 'Activity' ? 'Steps & workouts will fold into your daily budget.' : 'Water tracking is on the roadmap.'}
          </Text>
        </View>
      )}

      <View style={{ height: spacing.xxl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateBadge: {
    backgroundColor: colors.surface, borderRadius: radii.lg,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    alignItems: 'center', ...shadow.card, minWidth: 54,
  },
  dateNum: { fontFamily: 'Manrope_800ExtraBold', fontSize: 20, color: colors.text, lineHeight: 22 },
  dateMon: { ...t.tiny, color: colors.textMuted, textTransform: 'uppercase' },

  planRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: spacing.sm, marginBottom: -spacing.sm, zIndex: 2 },
  kcalUnit: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },

  tabs: { flexDirection: 'row', gap: spacing.xl, paddingHorizontal: spacing.sm, alignItems: 'center' },
  tab: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 22, letterSpacing: -0.4 },
  tabActive: { color: colors.text },
  tabIdle: { color: colors.textFaint },
  tabDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brand, alignSelf: 'center', marginTop: 4 },

  mealGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  mealCard: { width: '47.5%', flexGrow: 1, borderRadius: radii.xl, padding: spacing.lg, gap: spacing.lg, minHeight: 116, justifyContent: 'space-between' },
  mealTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mealBadge: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  mealBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  plusBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', ...shadow.brandGlow },

  placeholder: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl },
  phIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.brandTint, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
});
