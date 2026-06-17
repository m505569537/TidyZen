import { Tabs } from 'expo-router';
import { View, type ColorValue } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

function TabIcon({
  name,
  color,
  size,
  focused,
}: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: ColorValue;
  size: number;
  focused: boolean;
}) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: focused ? '#E8F5E9' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MaterialIcons name={name} size={size} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2D6B5B',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
          borderTopWidth: 1,
          height: 49,
          paddingBottom: 4,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontFamily: 'BeVietnamPro_400Regular',
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: '扫描',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="center-focus-strong" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '记录',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="history" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '设置',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="settings" color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
