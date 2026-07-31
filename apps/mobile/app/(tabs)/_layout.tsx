import { Tabs } from 'expo-router';
import { MotiView } from 'moti';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, shadow, spacing } from '@thali/ui-tokens';
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
          <LinearGradient
            colors={['rgba(110,168,255,0.18)', 'rgba(115,214,255,0.16)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </MotiView>
      )}
      <Icon
        name={icon}
        size={22}
        color={focused ? colors.brand : colors.textFaint}
        strokeWidth={focused ? 2.2 : 1.8}
      />
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
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFillObject}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        ),
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
    left: spacing.lg, right: spacing.lg, bottom: spacing.lg,
    height: 68,
    borderRadius: radii.pill,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadow.floating,
    elevation: 12,
  },
  pillBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    margin: 4,
    overflow: 'hidden',
  },
});
