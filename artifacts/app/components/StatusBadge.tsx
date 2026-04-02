import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

type Status =
  | "new"
  | "in_review"
  | "confirmed"
  | "rejected"
  | "resolved"
  | "archived";

const STATUS_LABELS: Record<Status, string> = {
  new: "Новый",
  in_review: "На рассмотрении",
  confirmed: "Подтверждён",
  rejected: "Отклонён",
  resolved: "Решён",
  archived: "Архив",
};

const STATUS_COLORS: Record<Status, { bg: string; text: string }> = {
  new: { bg: "#AAFF00", text: "#17191C" },
  in_review: { bg: "#FCD34D", text: "#17191C" },
  confirmed: { bg: "#60A5FA", text: "#17191C" },
  rejected: { bg: "#EF4444", text: "#FFFFFF" },
  resolved: { bg: "#34D399", text: "#17191C" },
  archived: { bg: "#9CA3AF", text: "#FFFFFF" },
};

interface Props {
  status: Status;
  small?: boolean;
}

export function StatusBadge({ status, small }: Props) {
  const { bg, text } = STATUS_COLORS[status] ?? STATUS_COLORS.new;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text
        style={[
          styles.label,
          { color: text, fontSize: small ? 9 : 11 },
        ]}
      >
        {STATUS_LABELS[status] ?? status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
