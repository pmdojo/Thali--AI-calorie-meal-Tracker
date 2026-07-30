import { router } from 'expo-router';
import { MotiView } from 'moti';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Card } from '../../src/components/Card';
import { DateStrip } from '../../src/components/DateStrip';
import { Icon, IconName } from '../../src/components/Icon';
import { MacroPill } from '../../src/components/MacroPill';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { SemiGauge } from '../../src/components/SemiGauge';
import {
  streakSummary,
  todaysKcal,
  todaysLogs,
  todaysMacros,
  useStore,
} from '../../src/store';

const MEAL_META: Record<string, { emoji: string; grad: [string, string]; label: string }> = {
  breakfast: { emoji: '🍳', grad: ['#FDECDE', '#FBCFB5'], label: 'Breakfast' },
  lunch:     { emoji: '🥗', grad: ['#EAF7EF', '#CBEBD8'], label: 'Lunch' },
  dinner:    { emoji: '🍛', grad: ['#F5F1FB', '#E3D9FA'], label: 'Dinner' },
  snack:     { emoji: '🍪', grad: ['#FBF1DD', '#F2D8A5'], label: 'Snack' },
};

export default function Home() {
  const { budget, logs } = useStore();
  const consumed = todaysKcal(logs);
  const remaining = Math.max(0, (budget?.kcal ?? 0) - consumed);
  const fraction = budget ? remaining / budget.kcal : 0;
  const macros = todaysMacros(logs);
  const streak = streakSummary(logs);
  const meals = todaysLogs(logs).sort((a, b) => a.loggedAt.localeCompare(b.loggedAt));

  const dateLabel = new Date().toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Screen bg="parchment">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
            <Text style={styles.avatarLetter}>R</Text>
          </View>
          <View>
            <Text style={[t.h3, { color: colors.text }]}>Hey there 👋</Text>
            <Text style={[t.caption, { color: colors.textMuted }]}>{dateLabel}</Text>
          </View>
        </View>
        <View style={styles.headerBtns}>
          <IconBtn icon="history" onPress={() => router.push('/(tabs)/history')} />
          <IconBtn icon="bell" />
        </View>
      </View>

      {/* Date strip */}
      <DateStrip />

      {/* Calories Left gauge card */}
      <Card padding="lg" elevation="cardHover" radius="xxl">
        <View style={styles.cardHead}>
          <Text style={[t.h3, { color: colors.text }]}>Calories Left</Text>
          <Pressable><Icon name="moreHoriz" size={20} color={colors.textFaint} /></Pressable>
        </View>
        <View style={{ alignItems: 'center', marginTop: spacing.sm }}>
          <SemiGauge value={remaining} unit="Kcal" fraction={fraction} size={250} />
        </View>
      </Card>

      {/* Macro pills */}
      <View style={styles.macros}>
        <MacroPill tone="carbs"   label="Carbs"   value={macros.carbs}   goal={budget?.macros.carbsG ?? 0}   index={0} />
        <MacroPill tone="protein" label="Protein" value={macros.protein} goal={budget?.macros.proteinG ?? 0} index={1} />
        <MacroPill tone="fat"     label="Fat"     value={macros.fat}     goal={budget?.macros.fatG ?? 0}     index={2} />
      </View>

      {/* AI insight — kept as a slim on-brand touch */}
      <Pressable onPress={() => router.push('/(tabs)/log')}>
        <View style={styles.insight}>
          <LinearGradient colors={['#1D1A3D', '#3F2F7A', '#7A5AF8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
          <View style={styles.insightIcon}><Icon name="sparkles" size={16} color="#fff" strokeWidth={2.4} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.insightTag}>AI COACH</Text>
            <Text style={styles.insightBody} numberOfLines={2}>
              {remaining < 300
                ? "You're close to your limit — keep the next meal light."
                : `You've logged ${streak.logged} of the last ${streak.total} days. Snap your next meal to stay on track.`}
            </Text>
          </View>
          <Icon name="chevronR" size={18} color="rgba(255,255,255,0.7)" />
        </View>
      </Pressable>

      {/* Meals */}
      <SectionHeader title="Today's meals" action={meals.length ? 'View all' : undefined} onAction={() => router.push('/(tabs)/history')} />
      {meals.length === 0 ? (
        <Pressable onPress={() => router.push('/add/camera')}>
          <Card tone="lavender" padding="lg" style={{ alignItems: 'center', gap: spacing.sm }}>
            <View style={styles.emptyIcon}><Icon name="camera" size={22} color={colors.brand} /></View>
            <Text style={[t.bodyBold, { color: colors.text }]}>No meals yet</Text>
            <Text style={[t.caption, { color: colors.textMuted, textAlign: 'center' }]}>
              Tap the + below to scan your first plate.
            </Text>
          </Card>
        </Pressable>
      ) : (
        <View style={styles.mealGrid}>
          {meals.slice(0, 4).map((m, i) => {
            const meta = MEAL_META[m.mealType];
            return (
              <MotiView
                key={m.id}
                from={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 340, delay: i * 70 }}
                style={styles.mealTile}
              >
                <LinearGradient colors={meta.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
                <Text style={styles.mealEmoji}>{meta.emoji}</Text>
                <View style={styles.mealInfo}>
                  <Text style={[t.captionBold, { color: colors.text }]}>{meta.label}</Text>
                  <Text style={[t.tiny, { color: colors.textMuted }]}>{m.estimate.kcal.low}–{m.estimate.kcal.high} kcal</Text>
                </View>
              </MotiView>
            );
          })}
        </View>
      )}

      <View style={{ height: spacing.xxl }} />
    </Screen>
  );
}

function IconBtn({ icon, onPress }: { icon: IconName; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.iconBtn}>
      <Icon name={icon} size={18} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 46, height: 46, borderRadius: 23, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', ...shadow.brandGlow,
  },
  avatarLetter: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerBtns: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  macros: { flexDirection: 'row', gap: spacing.sm },
  insight: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    borderRadius: radii.xl, padding: spacing.lg, overflow: 'hidden',
    ...shadow.brandGlow,
  },
  insightIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center',
  },
  insightTag: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: 'rgba(255,255,255,0.8)' },
  insightBody: { ...t.caption, color: '#fff', marginTop: 2 },
  emptyIcon: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: colors.brandTint,
    alignItems: 'center', justifyContent: 'center',
  },
  mealGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  mealTile: {
    width: '47.5%', flexGrow: 1, height: 120,
    borderRadius: radii.xl, overflow: 'hidden', padding: spacing.md,
    justifyContent: 'space-between', ...shadow.card,
  },
  mealEmoji: { fontSize: 34 },
  mealInfo: { gap: 1 },
});
