import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '@thali/ui-tokens';

export interface PillBar {
  label: string;
  value: number;    // 0..1 (fraction of the chart height)
  color: string;    // fill colour
  track: string;    // track (empty) colour
  dotColor: string; // marker dot colour
}

// A row of rounded "pill" bars, each with a marker dot at its value — the
// signature of the Activity inspo. Fills spring up on mount.
export function PillChart({
  bars, height = 210, yTicks, goalRatio,
}: {
  bars: PillBar[];
  height?: number;
  yTicks?: string[];        // top → bottom
  goalRatio?: number;       // 0..1, draws a dashed goal line
}) {
  const barW = 26;
  const dot = 20;
  return (
    <View style={{ flexDirection: 'row' }}>
      {yTicks && yTicks.length > 0 && (
        <View style={{ height, justifyContent: 'space-between', marginRight: spacing.sm, paddingVertical: 2 }}>
          {yTicks.map((tk, i) => <Text key={i} style={styles.tick}>{tk}</Text>)}
        </View>
      )}

      <View style={{ flex: 1 }}>
        {/* bars area */}
        <View style={{ height, position: 'relative' }}>
          {typeof goalRatio === 'number' && (
            <View style={[styles.goalLine, { bottom: Math.min(1, Math.max(0, goalRatio)) * height }]} />
          )}
          <View style={styles.row}>
            {bars.map((b, i) => {
              const v = Math.min(1, Math.max(0, b.value));
              const fillH = Math.max(barW, v * height);
              return (
                <View key={i} style={styles.col}>
                  <View style={{ height, width: barW, justifyContent: 'flex-end' }}>
                    <View style={[styles.track, { width: barW, height, borderRadius: barW / 2, backgroundColor: b.track }]} />
                    <MotiView
                      from={{ height: barW }}
                      animate={{ height: fillH }}
                      transition={{ type: 'spring', damping: 18, stiffness: 140, delay: 120 + i * 70 }}
                      style={{ width: barW, borderRadius: barW / 2, backgroundColor: b.color }}
                    />
                    <MotiView
                      from={{ bottom: barW - dot / 2 }}
                      animate={{ bottom: fillH - dot / 2 - 3 }}
                      transition={{ type: 'spring', damping: 18, stiffness: 140, delay: 120 + i * 70 }}
                      style={[styles.dot, { width: dot, height: dot, borderRadius: dot / 2, backgroundColor: b.dotColor }]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* labels — flex columns match the bar columns exactly, room for 3 letters */}
        <View style={[styles.row, { marginTop: spacing.sm }]}>
          {bars.map((b, i) => (
            <View key={i} style={styles.col}>
              <Text numberOfLines={1} style={styles.label}>{b.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  col: { flex: 1, alignItems: 'center' },
  track: { position: 'absolute', bottom: 0 },
  dot: {
    position: 'absolute',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#3C3020', shadowOpacity: 0.18, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  goalLine: {
    position: 'absolute', left: 0, right: 0, height: 0,
    borderTopWidth: 1.5, borderColor: 'rgba(58,46,29,0.18)', borderStyle: 'dashed',
  },
  tick: { fontFamily: fonts.medium, fontSize: 11, color: colors.textFaint },
  label: { fontFamily: fonts.semibold, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
});
