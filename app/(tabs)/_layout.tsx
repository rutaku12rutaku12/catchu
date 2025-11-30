import { Tabs, useRouter } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {

  const router = useRouter();

  const colorScheme = useColorScheme();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => <Ionicons name="home" size={24} color={focused ? "black":"gray"} />,
        }}
      />
      <Tabs.Screen
        name="posts"
        options={{
          title: '글 작성',
          tabBarIcon: ({ focused }) => <Ionicons name="add" size={24} color={focused ? "black":"gray"} />,
        }}
      />
      <Tabs.Screen
        name="postlist"
        options={{
          title: '게시글',
          tabBarIcon: ({ focused }) => <Ionicons name="list-circle-outline" size={24} color={focused ? "black":"gray"} />,
        }}
      />
    </Tabs>
  );
}
