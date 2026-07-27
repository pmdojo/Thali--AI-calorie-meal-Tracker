import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { colors } from '@thali/ui-tokens';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{label}</Text>
      <View style={{ height: 3, width: 20, marginTop: 4, borderRadius: 2, backgroundColor: focused ? colors.brand : 'transparent' }} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: 74,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen name="index"   options={{ tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} /> }} />
      <Tabs.Screen name="log"     options={{ tabBarIcon: ({ focused }) => <TabIcon label="🍽️" focused={focused} /> }} />
      <Tabs.Screen name="history" options={{ tabBarIcon: ({ focused }) => <TabIcon label="📅" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <TabIcon label="👤" focused={focused} /> }} />
    </Tabs>
  );
}
