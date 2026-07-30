import { router, Tabs } from 'expo-router';
import { MotiView } from 'moti';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadow, spacing } from '@thali/ui-tokens';
import { Icon, IconName } from '../../src/components/Icon';

function TabIcon({ icon, focused }: { icon: IconName; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 44, height: 44 }}>
      {focused && (
        <MotiView
          from={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 260 }}
          style={styles.pillBg}
        >
          <LinearGradient colors={['rgba(122,90,248,0.15)', 'rgba(242,107,58,0.12)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
        </MotiView>
      )}
      <Icon name={icon} size={22} color={focused ? colors.brand : colors.textFaint} strokeWidth={focused ? 2.2 : 1.8} />
    </View>
  );
}

// Center scan FAB (the reference's elevated "+")
function ScanFab() {
  return (
    <View pointerEvents="box-none" style={styles.fabWrap}>
      <Pressable onPress={() => router.push('/add/camera')}>
        <MotiView
          from={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 16, stiffness: 220 }}
          style={[styles.fab, shadow.brandGlow]}
        >
          <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
          <Icon name="plus" size={28} color="#fff" strokeWidth={2.6} />
        </MotiView>
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.bar,
          tabBarBackground: () => (
            <LinearGradient colors={['rgba(255,255,255,0.96)', 'rgba(255,255,255,0.88)']} style={StyleSheet.absoluteFillObject} />
          ),
          tabBarItemStyle: { paddingTop: 10 },
        }}
      >
        <Tabs.Screen name="index"   options={{ tabBarIcon: ({ focused }) => <TabIcon icon="home"     focused={focused} /> }} />
        <Tabs.Screen name="history" options={{ tabBarIcon: ({ focused }) => <TabIcon icon="chart"    focused={focused} /> }} />
        <Tabs.Screen name="log"     options={{ tabBarIcon: ({ focused }) => <TabIcon icon="utensils" focused={focused} /> }} />
        <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <TabIcon icon="settings" focused={focused} /> }} />
      </Tabs>
      <ScanFab />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing.lg, right: spacing.lg, bottom: spacing.lg,
    height: 68, borderRadius: radii.pill,
    borderTopWidth: 0, borderWidth: 1, borderColor: colors.glassBorder,
    ...shadow.floating, elevation: 12,
  },
  pillBg: { ...StyleSheet.absoluteFillObject, borderRadius: 22, margin: 4, overflow: 'hidden' },
  fabWrap: { position: 'absolute', bottom: 54, left: 0, right: 0, alignItems: 'center', zIndex: 30 },
  fab: {
    width: 62, height: 62, borderRadius: 31,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    borderWidth: 4, borderColor: colors.bg,
  },
});
