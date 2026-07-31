import { Tabs } from 'expo-router';
import { MotiView } from 'moti';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@thali/ui-tokens';
import { Icon, IconName } from '../../src/components/Icon';

// Dark floating pill nav (reference). Active tab = white icon in a soft circle.
function TabIcon({ icon, focused }: { icon: IconName; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 46, height: 46 }}>
      {focused && (
        <MotiView
          from={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 260 }}
          style={styles.activePill}
        />
      )}
      <Icon name={icon} size={22} color={focused ? '#FFFFFF' : 'rgba(255,255,255,0.5)'} strokeWidth={focused ? 2.3 : 1.9} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.bar,
        tabBarItemStyle: { paddingTop: 10 },
      }}
    >
      <Tabs.Screen name="index"   options={{ tabBarIcon: ({ focused }) => <TabIcon icon="home"     focused={focused} /> }} />
      <Tabs.Screen name="log"     options={{ tabBarIcon: ({ focused }) => <TabIcon icon="utensils" focused={focused} /> }} />
      <Tabs.Screen name="history" options={{ tabBarIcon: ({ focused }) => <TabIcon icon="history"  focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <TabIcon icon="user"     focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: spacing.xxl, right: spacing.xxl, bottom: spacing.xl,
    height: 64, borderRadius: 999,
    borderTopWidth: 0, borderWidth: 0,
    backgroundColor: '#16202E',
    shadowColor: '#0C1522', shadowOpacity: 0.35, shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 }, elevation: 14,
  },
  activePill: {
    ...StyleSheet.absoluteFillObject,
    margin: 5, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
});
