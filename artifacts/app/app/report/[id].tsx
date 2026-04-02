import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StatusBadge } from "@/components/StatusBadge";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useColors } from "@/hooks/useColors";
import { useGetReport } from "@workspace/api-client-react";

const CATEGORY_LABELS: Record<string, string> = {
  delivery: "Доставка",
  micromobility: "Самокаты / велосипеды",
  carsharing: "Каршеринг",
  taxi: "Такси",
  car: "Автомобили",
  other: "Другое",
};

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: report, isLoading, isError } = useGetReport(id ?? "");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          ОБРАЩЕНИЕ
        </Text>
        <View style={styles.backBtn} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isError || !report ? (
        <View style={styles.center}>
          <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
            Обращение не найдено
          </Text>
          <Pressable onPress={() => router.back()} style={[styles.retryBtn, { borderColor: colors.border }]}>
            <Text style={[styles.retryLabel, { color: colors.foreground }]}>Назад</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <StatusBadge status={report.status as any} />
            <Text style={[styles.date, { color: colors.mutedForeground }]}>
              {new Date(report.createdAt).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>

          <View style={styles.categoryRow}>
            <CategoryIcon category={report.category as any} size={20} />
            <Text style={[styles.category, { color: colors.foreground }]}>
              {CATEGORY_LABELS[report.category] ?? report.category}
            </Text>
            <Text style={[styles.dot, { color: colors.mutedForeground }]}>·</Text>
            <Text style={[styles.provider, { color: colors.foreground }]}>
              {report.providerLabel}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              ОПИСАНИЕ
            </Text>
            <Text style={[styles.description, { color: colors.foreground }]}>
              {report.description}
            </Text>
          </View>

          {report.addressText ? (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                МЕСТО
              </Text>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={14} color={colors.primary} />
                <Text style={[styles.address, { color: colors.foreground }]}>
                  {report.addressText}
                </Text>
              </View>
            </View>
          ) : null}

          {report.mediaCount > 0 ? (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
                МЕДИА
              </Text>
              <View style={styles.locationRow}>
                <Feather name="camera" size={14} color={colors.mutedForeground} />
                <Text style={[styles.address, { color: colors.mutedForeground }]}>
                  {report.mediaCount} файлов прикреплено
                </Text>
              </View>
            </View>
          ) : null}

          <View style={[styles.metaRow]}>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>ID</Text>
              <Text style={[styles.metaValue, { color: colors.foreground }]} numberOfLines={1}>
                {report.id.slice(0, 16)}…
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>
                Обновлён
              </Text>
              <Text style={[styles.metaValue, { color: colors.foreground }]}>
                {new Date(report.updatedAt).toLocaleDateString("ru-RU")}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 44,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
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
  content: {
    padding: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  category: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  dot: {
    fontSize: 15,
  },
  provider: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  card: {
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  address: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flex: 1,
    gap: 4,
  },
  metaLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  metaValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
});
