import { BlurView } from "expo-blur";
import { Tabs, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const TAB_META = {
  index: { label: "Главная", icon: "home" as const },
  feed: { label: "Новости", icon: "bell" as const },
  profile: { label: "Профиль", icon: "user" as const },
};

type VisibleTabName = keyof typeof TAB_META;
type TabRoute = { key: string; name: string };

function MainTabButton({
  label,
  icon,
  active,
  color,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  active: boolean;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabButton,
        { opacity: pressed ? 0.72 : 1 },
      ]}
    >
      <Feather name={icon} size={20} color={color} />
      <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

function ChpokTabBar({ state, navigation }: any) {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const routes = state.routes.filter((route: TabRoute) => route.name in TAB_META);
  const leftRoutes = routes.filter(
    (route: TabRoute) => route.name === "index" || route.name === "feed",
  );
  const rightRoutes = routes.filter((route: TabRoute) => route.name === "profile");

  const renderTab = (routeName: VisibleTabName) => {
    const route = routes.find((item: TabRoute) => item.name === routeName);
    if (!route) return <View key={routeName} style={styles.tabButton} />;

    const routeIndex = state.routes.findIndex((item: TabRoute) => item.key === route.key);
    const isFocused = state.index === routeIndex;
    const meta = TAB_META[routeName];
    const tint = isFocused ? colors.primary : colors.mutedForeground;

    return (
      <MainTabButton
        key={route.key}
        label={meta.label}
        icon={meta.icon}
        active={isFocused}
        color={tint}
        onPress={() => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }}
      />
    );
  };

  return (
    <View style={[styles.tabBarWrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View
        style={[
          styles.tabBarBase,
          {
            borderTopColor: colors.border,
            backgroundColor: isIOS ? "transparent" : colors.background,
          },
        ]}
      >
        {isIOS ? (
          <BlurView
            intensity={100}
            tint={isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        ) : null}

        <View style={styles.tabGroups}>
          <View style={styles.sideGroup}>
            {leftRoutes.map((route: TabRoute) => renderTab(route.name as VisibleTabName))}
          </View>
          <View style={styles.centerGap} />
          <View style={[styles.sideGroup, styles.rightGroup]}>
            {rightRoutes.map((route: TabRoute) => renderTab(route.name as VisibleTabName))}
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Чпокнуть"
        onPress={() => router.push("/new-report")}
        style={({ pressed }) => [
          styles.chpokButton,
          {
            backgroundColor: colors.primary,
            shadowOpacity: pressed ? 0.14 : 0.24,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        <View style={[styles.chpokIconWrap, { backgroundColor: colors.primaryForeground }]}>
          <Feather name="plus" size={18} color={colors.primary} />
        </View>
        <Text style={[styles.chpokLabel, { color: colors.primaryForeground }]}>ЧПОК</Text>
      </Pressable>
    </View>
  );
}

function ClassicTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <ChpokTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Новости",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return <ClassicTabLayout />;
}

const styles = StyleSheet.create({
  tabBarWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  tabBarBase: {
    overflow: "hidden",
    borderTopWidth: 1,
    borderRadius: 28,
  },
  tabGroups: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 72,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  sideGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  rightGroup: {
    justifyContent: "center",
  },
  centerGap: {
    width: 92,
  },
  tabButton: {
    minHeight: 48,
    minWidth: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 6,
  },
  tabLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  chpokButton: {
    position: "absolute",
    left: "50%",
    top: 0,
    marginLeft: -42,
    width: 84,
    height: 84,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#000",
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  chpokIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  chpokLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    letterSpacing: 0.8,
  },
});
