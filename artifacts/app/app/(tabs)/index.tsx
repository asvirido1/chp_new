import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ReportCard } from "@/components/ReportCard";
import { useColors } from "@/hooks/useColors";
import { useUser } from "@/context/UserContext";
import { useGetReports } from "@workspace/api-client-react";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userId } = useUser();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetReports({ userId, limit: 50 });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const reports = data?.reports ?? [];

  const topPad =
    Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: topPad + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            МОИ ЖАЛОБЫ
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {reports.length > 0 ? `${reports.length} обращений` : "История пуста"}
          </Text>
        </View>
        <Pressable
          testID="new-report-fab"
          onPress={() => router.push("/new-report")}
          style={[styles.fabHeader, { backgroundColor: colors.primary }]}
        >
          <Feather name="plus" size={20} color={colors.primaryForeground} />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Feather name="wifi-off" size={32} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Ошибка загрузки
          </Text>
          <Pressable onPress={() => refetch()} style={[styles.retryBtn, { borderColor: colors.border }]}>
            <Text style={[styles.retryLabel, { color: colors.foreground }]}>Повторить</Text>
          </Pressable>
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.center}>
          <Feather name="inbox" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Нет жалоб
          </Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Подайте первое обращение
          </Text>
          <Pressable
            onPress={() => router.push("/new-report")}
            style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.emptyBtnLabel, { color: colors.primaryForeground }]}>
              Подать жалобу
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReportCard
              id={item.id}
              category={item.category}
              providerLabel={item.providerLabel}
              description={item.description}
              status={item.status}
              addressText={item.addressText}
              createdAt={item.createdAt}
              mediaCount={item.mediaCount}
            />
          )}
          contentContainerStyle={[
            styles.list,
            {
              paddingBottom:
                Platform.OS === "web" ? 84 + 34 : 100 + insets.bottom,
            },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: 2,
  },
  fabHeader: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingTop: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  emptyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  emptyBtnLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
  },
  retryLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
});
