import { router } from 'expo-router';
import { MotiView } from 'moti';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, type as t } from '@thali/ui-tokens';
import { Icon } from './Icon';

interface Props {
  step: number;       // 1-based
  total: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function StepHeader({ step, total, title, subtitle, onBack }: Props) {
  const pct = (step / total) * 100;
  return (
    <View style={{ gap: spacing.lg }}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack ?? (() => router.back())} style={styles.back}>
          <Icon name="arrowLeft" size={18} color={colors.text} />
        </Pressable>
        <Text style={[t.captionBold, { color: colors.textMuted }]}>Step {step} of {total}</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.track}>
        <MotiView
          from={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          style={styles.fill}
        />
      </View>

      <View style={{ gap: 4 }}>
        <Text style={[t.h1, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[t.bodyLg, { color: colors.textMuted }]}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  track: {
    height: 6, borderRadius: 3,
    backgroundColor: colors.surfaceAlt, overflow: 'hidden',
  },
  fill: {
    height: '100%', borderRadius: 3,
    backgroundColor: colors.brand,
  },
});
