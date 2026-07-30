import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, gradients, radii, shadow, type as t } from '@thali/ui-tokens';

// Horizontal week strip with today highlighted in a coral pill.
export function DateStrip({ selected, onSelect }: { selected?: Date; onSelect?: (d: Date) => void }) {
  const today = new Date();
  const sel = selected ?? today;
  const days = [-3, -2, -1, 0, 1, 2, 3].map((off) => {
    const d = new Date(today);
    d.setDate(today.getDate() + off);
    return d;
  });

  return (
    <View style={styles.row}>
      {days.map((d, i) => {
        const isSel = d.toDateString() === sel.toDateString();
        const wd = d.toLocaleDateString('en', { weekday: 'short' });
        return (
          <Pressable key={i} onPress={() => onSelect?.(d)} style={{ flex: 1 }}>
            <MotiView
              from={{ opacity: 0, translateY: 6 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: i * 40 }}
              style={[styles.cell, isSel && shadow.accentGlow]}
            >
              {isSel ? (
                <View style={styles.pill}>
                  <LinearGradient colors={gradients.peach} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
                  <Text style={[styles.wd, { color: 'rgba(255,255,255,0.9)' }]}>{wd}</Text>
                  <Text style={[styles.num, { color: '#fff' }]}>{d.getDate()}</Text>
                </View>
              ) : (
                <View style={styles.plain}>
                  <Text style={styles.wd}>{wd}</Text>
                  <Text style={styles.num}>{d.getDate()}</Text>
                </View>
              )}
            </MotiView>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  cell: { alignItems: 'center', borderRadius: radii.pill },
  pill: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6, borderRadius: radii.pill, overflow: 'hidden', width: '100%' },
  plain: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6, width: '100%' },
  wd: { ...t.tiny, color: colors.textFaint, fontWeight: '700' },
  num: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 3 },
});
