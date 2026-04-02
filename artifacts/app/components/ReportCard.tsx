import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBadge } from "./StatusBadge";
import { CategoryIcon } from "./CategoryIcon";
import { useColors } from "@/hooks/useColors";

interface ReportCardProps {
  id: string;
  category: string;
  providerLabel: string;
  description: string;
  status: string;
  addressText?: string | null;
  createdAt: string;
  mediaCount: number;
}

export function ReportCard({
  id,
  category,
  providerLabel,
  description,
  status,
  addressText,
  createdAt,
  mediaCount,
}: ReportCardProps) {
  const colors = useColors();
  const router = useRouter();

  const date = new Date(createdAt);
  const dateStr = date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });

  return (
    <Pressable
      testID={`report-card-${id}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      onPress={() => router.push(`/report/${id}`)}
    >
      <View style={styles.header}>
        <View style={styles.categoryRow}>
          <CategoryIcon category={category as any} size={16} />
          <Text style={[styles.provider, { color: colors.foreground }]}>
            {providerLabel}
          </Text>
        </View>
        <Text style={[styles.date, { color: colors.mutedForeground }]}>
          {dateStr}
        </Text>
      </View>

      <Text
        style={[styles.description, { color: colors.foreground }]}
        numberOfLines={2}
      >
        {description}
      </Text>

      <View style={styles.footer}>
        <StatusBadge status={status as any} small />
        {addressText ? (
          <View style={styles.addressRow}>
            <Feather name="map-pin" size={10} color={colors.mutedForeground} />
            <Text
              style={[styles.address, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              {addressText}
            </Text>
          </View>
        ) : null}
        {mediaCount > 0 && (
          <View style={styles.mediaRow}>
            <Feather name="camera" size={10} color={colors.mutedForeground} />
            <Text style={[styles.address, { color: colors.mutedForeground }]}>
              {mediaCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  provider: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  date: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    flex: 1,
  },
  mediaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  address: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    flex: 1,
  },
});
