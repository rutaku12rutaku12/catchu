import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="login"
        options={{
          title: '로그인',
          tabBarIcon: ({ focused }) => <Ionicons name="log-in" size={24} color={focused ? "black":"gray"} />,
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: '회원가입',
          tabBarIcon: ({ focused }) => <Ionicons name="people-outline" size={24} color={focused ? "black":"gray"} />,
        }}
      />
      <Tabs.Screen
        name="postlist"
        options={{
          title: '글 목록',
          tabBarIcon: ({ focused }) => <Ionicons name="list-circle-outline" size={24} color={focused ? "black":"gray"} />,
        }}
      />
      <Tabs.Screen
        name="writing"
        options={{
          title: '글쓰기/이미지첨부',
          tabBarIcon: ({ focused }) => <Ionicons name="create" size={24} color={focused ? "black":"gray"} />,
        }}
      />
      <Tabs.Screen
        name="postdetail"
        options={{
          title: '글상세/댓글',
          tabBarIcon: ({ focused }) => <Ionicons name="newspaper" size={24} color={focused ? "black":"gray"} />,
        }}
      />
    </Tabs>
  );
}
