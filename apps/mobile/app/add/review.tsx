import { router, useLocalSearchParams } from 'expo-router';
import { MotiView } from 'moti';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  estimateMeal,
  evaluateFlag,
  suggestAlternative,
  type MealComponent,
} from '@thali/shared';
import { colors, gradients, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Card, HeroCard } from '../../src/components/Card';
import { Icon } from '../../src/components/Icon';
import { Pill } from '../../src/components/Pill';
import { Screen } from '../../src/components/Screen';
import { remainingKcalToday, useStore, type MealType } from '../../src/store';

export default function Review() {
  const params = useLocalSearchParams<{
    mealType: MealType;
    payload: string;
    source?: 'manual' | 'photo';
    unresolved?: string;
    mock?: '0' | '1';
  }>();
  const budget = useStore((s) => s.budget);
  const logs   = useStore((s) => s.logs);
  const addMeal = useStore((s) => s.addMeal);
  const remaining = remainingKcalToday(budget, logs);

  const [components] = useState<MealComponent[]>(() => {
    try { return JSON.parse(params.payload ?? '[]'); } catch { return []; }
  });

  const estimate = useMemo(() => estimateMeal(components), [components]);
  const flag = useMemo(() => evaluateFlag(estimate, remaining), [estimate, remaining]);
  const alt = useMemo(
    () => (flag.flagged ? suggestAlternative(components, estimate.kcal.mid) : null),
    [flag.flagged, components, estimate.kcal.mid],
  );

  const [flagOpen, setFlagOpen] = useState(flag.flagged);

  const commit = (which: 'original' | 'alternative') => {
    const finalComponents = which === 'alternative' && alt ? alt.components : components;
    addMeal({
      mealType: (params.mealType as MealType) ?? 'snack',
      components: finalComponents,
      source: params.source ?? 'manual',
    });
    router.replace('/(tabs)');
  };

  const unresolved = (params.unresolved ?? '').split('|').filter(Boolean);
  const budgetPct = remaining > 0 ? Math.min(1, estimate.kcal.mid / remaining) : 1;

  return (
    <>
      <Screen bg="parchment" scroll={true}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Icon name="arrowLeft" size={20} color={colors.text} />
          </Pressable>
          <Text style={[t.h3, { color: colors.text }]}>Review</Text>
          <View style={{ width: 40 }} />
        </View>

        {params.source === 'photo' && (
          <Card tone="lavender" padding="md" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Icon name="camera" size={16} color={colors.brand} />
            <View style={{ flex: 1 }}>
              <Text style={[t.captionBold, { color: colors.text }]}>
                From photo · {params.mock === '1' ? 'mock recognition' : 'AI recognition'}
              </Text>
              {unresolved.length > 0 && (
                <Text style={[t.tiny, { color: colors.textMuted, marginTop: 2 }]}>
                  Couldn't match: {unresolved.join(', ')} — add manually if needed
                </Text>
              )}
            </View>
          </Card>
        )}

        {/* Hero estimate */}
        <HeroCard gradient={flag.flagged ? gradients.peach : gradients.brand} style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Icon name="sparkles" size={14} color="#fff" strokeWidth={2.4} />
            <Text style={styles.heroTag}>Estimate</Text>
          </View>
          <Text style={styles.heroNumber}>
            {estimate.kcal.low}<Text style={styles.heroNumberDim}>–</Text>{estimate.kcal.high}
            <Text style={styles.heroUnit}>  kcal</Text>
          </Text>
          <Text style={styles.heroSub}>Ranges, not point estimates. Wider band = lower confidence.</Text>
          <View style={styles.macroRow}>
            <MacroBadge label="Protein" value={`${Math.round(estimate.protein.mid)}g`} />
            <MacroBadge label="Carbs" value={`${Math.round(estimate.carbs.mid)}g`} />
            <MacroBadge label="Fat" value={`${Math.round(estimate.fat.mid)}g`} />
            <MacroBadge label="Fiber" value={`${Math.round(estimate.fiber?.mid ?? 0)}g`} />
          </View>
        </HeroCard>

        {/* Budget context */}
        <Card padding="lg">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <Text style={[t.captionBold, { color: colors.textMuted }]}>Against today's budget</Text>
            <Text style={[t.captionBold, { color: flag.flagged ? colors.accent : colors.success }]}>
              {Math.round(flag.budgetShare * 100)}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <MotiView
              from={{ width: '0%' }}
              animate={{ width: `${budgetPct * 100}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              style={StyleSheet.absoluteFillObject}
            >
              <LinearGradient
                colors={flag.flagged ? gradients.peach : gradients.brand}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />
            </MotiView>
          </View>
          <Text style={[t.caption, { color: colors.textMuted, marginTop: spacing.sm }]}>
            {estimate.kcal.mid} of {remaining} kcal left in your day.
          </Text>
        </Card>

        {/* Component list */}
        <Card padding="lg" style={{ gap: spacing.sm }}>
          <Text style={[t.h3, { color: colors.text }]}>What's on the plate</Text>
          {components.map((c, i) => (
            <View key={i} style={styles.compRow}>
              <View style={styles.compDot} />
              <Text style={[t.body, { color: colors.text, textTransform: 'capitalize' }]}>
                {c.dishId.replace(/_/g, ' ')}
              </Text>
              <View style={{ flex: 1 }} />
              <Pill label={c.portion} tone="neutral" />
            </View>
          ))}
        </Card>

        <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <Button
            label="Log this meal"
            icon={<Icon name="check" size={18} color="#fff" strokeWidth={2.4} />}
            onPress={() => (flag.flagged ? setFlagOpen(true) : commit('original'))}
          />
          <Button label="Back to edit" variant="ghost" onPress={() => router.back()} />
        </View>
      </Screen>

      <FlagModal
        open={flagOpen}
        onClose={() => setFlagOpen(false)}
        currentKcalMid={estimate.kcal.mid}
        remaining={remaining}
        reasons={flag.reasons}
        alt={alt}
        onLogAnyway={() => { setFlagOpen(false); commit('original'); }}
        onSwap={() => { setFlagOpen(false); commit('alternative'); }}
      />
    </>
  );
}

function MacroBadge({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.macroBadge}>
      <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: '700', letterSpacing: 0.4 }}>{label.toUpperCase()}</Text>
      <Text style={{ color: '#fff', ...t.bodyBold }}>{value}</Text>
    </View>
  );
}

function FlagModal({
  open, onClose, reasons, currentKcalMid, remaining, alt, onLogAnyway, onSwap,
}: {
  open: boolean;
  onClose: () => void;
  reasons: string[];
  currentKcalMid: number;
  remaining: number;
  alt: ReturnType<typeof suggestAlternative>;
  onLogAnyway: () => void;
  onSwap: () => void;
}) {
  const reasonCopy = reasons.includes('exceeds_budget_share')
    ? `This meal is ~${Math.round((currentKcalMid / remaining) * 100)}% of what's left in your day.`
    : reasons.includes('low_confidence')
      ? "We're not fully sure on portion sizes here."
      : 'The estimate has a wide range.';

  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <MotiView
          from={{ translateY: 400, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 22, stiffness: 240 }}
          style={styles.sheet}
        >
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View style={styles.heroIcon}>
              <Icon name="sparkles" size={20} color={colors.accent} strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[t.h2, { color: colors.text }]}>Heads up</Text>
              <Text style={[t.body, { color: colors.textMuted }]}>{reasonCopy}</Text>
            </View>
          </View>

          {alt ? (
            <View style={styles.altCard}>
              <LinearGradient
                colors={['#F5F1FB', '#FDECDE']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Icon name="swap" size={14} color={colors.brandDeep} strokeWidth={2.4} />
                <Text style={[t.tiny, { color: colors.brandDeep, textTransform: 'uppercase' }]}>One swap</Text>
              </View>
              <Text style={[t.h3, { color: colors.text, marginTop: 4 }]}>{alt.description}</Text>
              <Text style={[t.caption, { color: colors.textMuted, marginTop: 4 }]}>{alt.reason}</Text>
              <View style={styles.savedRow}>
                <View style={styles.savedPill}>
                  <Icon name="check" size={12} color="#fff" strokeWidth={2.4} />
                  <Text style={{ color: '#fff', ...t.captionBold }}>Saves ≈ {alt.savedKcal} kcal</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={[t.caption, { color: colors.textMuted }]}>
              No lighter swap in the library for this plate.
            </Text>
          )}

          <View style={{ gap: spacing.sm }}>
            {alt && (
              <Button
                label={`Swap → ${alt.description}`}
                icon={<Icon name="swap" size={16} color="#fff" strokeWidth={2.4} />}
                onPress={onSwap}
              />
            )}
            <Button label="Log anyway" variant="ghost" onPress={onLogAnyway} />
          </View>
        </MotiView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  heroTag: { color: 'rgba(255,255,255,0.85)', ...t.tiny, textTransform: 'uppercase' },
  heroNumber: { color: '#fff', fontSize: 56, fontWeight: '800', letterSpacing: -2 },
  heroNumberDim: { color: 'rgba(255,255,255,0.55)' },
  heroUnit: { color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: '600' },
  heroSub: { color: 'rgba(255,255,255,0.75)', ...t.caption },
  macroRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  macroBadge: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radii.md, padding: spacing.sm,
    alignItems: 'flex-start', gap: 4,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  compRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: 6,
  },
  compDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand },
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xxl,
    borderTopRightRadius: radii.xxl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
    ...shadow.floating,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  heroIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.accentTint,
    alignItems: 'center', justifyContent: 'center',
  },
  altCard: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  savedRow: { flexDirection: 'row', marginTop: spacing.sm },
  savedPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.success,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: radii.pill,
  },
});
