import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, Compass, Sparkles, MessageSquare, User } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          color: COLORS.text,
        },
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          ...TYPOGRAPHY.small,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerTitle: 'Explore Reports',
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          headerTitle: 'AI Potential Matches',
          tabBarBadge: 1,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.ai,
            fontSize: 10,
          },
          tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          headerTitle: 'Conversations',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'My Account',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
