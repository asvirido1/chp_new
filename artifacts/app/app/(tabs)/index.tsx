import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
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
import { useUser } from "@/context/UserContext";
import { useGetReports } from "@workspace/api-client-react";

const CATEGORY_LABELS: Record<string, string> = {
  delivery: "Доставка",
  micromobility: "Самокаты / СИМ",
  carsharing: "Каршеринг",
  taxi: "Такси",
  car: "Автомобили",
  other: "Другое",
};

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userId } = useUser();

  const { data, isLoading } = useGetReports({ userId, limit: 3 });
  const recentReports = data?.reports ?? [];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 84 + 34 : 100 + insets.bottom;

  const handleChpok = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/new-report");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.hero,
          {
            paddingTop: topPad + 20,
            backgroundColor: colors.secondary,
          },
        ]}
      >
        <View style={styles.heroInner}>
          <View style={styles.logoRow}>
            <View style={[styles.logoDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.logoText, { color: colors.secondaryForeground }]}>
              ЧПОК
            </Text>
          </View>
          <Text style={[styles.heroTagline, { color: colors.secondaryForeground }]}>
            Фиксируй нарушения{"\n"}городского транспорта
          </Text>
          <Text style={[styles.heroSub, { color: "#9CA3AF" }]}>
            Самокаты, такси, каршеринг, доставка — всё под контролем
          </Text>
        </View>

        <Pressable
          testID="chpok-cta-btn"
          onPress={handleChpok}
          style={({ pressed }) => [
            styles.ctaBtn,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <Text style={[styles.ctaLabel, { color: colors.primaryForeground }]}>
            ЧПОКНУТЬ
          </Text>
          <Feather name="arrow-right" size={22} color={colors.primaryForeground} />
        </Pressable>

        <Text style={[styles.ctaHint, { color: "#6B7280" }]}>
          Подать жалобу за 30 секунд
        </Text>
      </View>

      <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: colors.foreground }]}>1 248</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>жалоб подано</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: colors.foreground }]}>6</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>категорий</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: colors.foreground }]}>~30 сек</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>на обращение</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            МОИ ПОСЛЕДНИЕ ЖАЛОБЫ
          </Text>
          {recentReports.length > 0 && (
            <Pressable onPress={() => router.push("/(tabs)/reports")}>
              <Text style={[styles.sectionLink, { color: colors.primary }]}>Все →</Text>
            </Pressable>
          )}
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
        ) : recentReports.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="inbox" size={28} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Пока нет жалоб
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Нажмите «Чпокнуть», чтобы подать первое обращение
            </Text>
          </View>
        ) : (
          <View style={styles.recentList}>
            {recentReports.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/report/${r.id}`)}
                style={({ pressed }) => [
                  styles.recentCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View style={styles.recentCardHeader}>
                  <View style={styles.recentCatRow}>
                    <CategoryIcon category={r.category as any} size={14} />
                    <Text style={[styles.recentProvider, { color: colors.foreground }]}>
                      {r.providerLabel}
                    </Text>
                  </View>
                  <StatusBadge status={r.status as any} small />
                </View>
                <Text
                  style={[styles.recentDesc, { color: colors.mutedForeground }]}
                  numberOfLines={1}
                >
                  {r.description}
                </Text>
                <Text style={[styles.recentDate, { color: colors.mutedForeground }]}>
                  {new Date(r.createdAt).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "short",
                  })}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          КАК ЭТО РАБОТАЕТ
        </Text>
        <View style={styles.howList}>
          {[
            {
              icon: "camera" as const,
              title: "Зафиксируйте нарушение",
              desc: "Курьер на тротуаре, самокат в неположенном месте, такси без документов",
            },
            {
              icon: "send" as const,
              title: "Подайте жалобу",
              desc: "Выберите категорию, сервис, опишите ситуацию. Можно анонимно.",
            },
            {
              icon: "check-circle" as const,
              title: "Мы передаём данные",
              desc: "Модераторы проверяют жалобу и направляют её в нужные инстанции",
            },
          ].map((item, i) => (
            <View key={i} style={styles.howItem}>
              <View style={[styles.howIcon, { backgroundColor: colors.primary }]}>
                <Feather name={item.icon} size={16} color={colors.primaryForeground} />
              </View>
              <View style={styles.howText}>
                <Text style={[styles.howTitle, { color: colors.foreground }]}>
                  {item.title}
                </Text>
                <Text style={[styles.howDesc, { color: colors.mutedForeground }]}>
                  {item.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.trustBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="shield" size={18} color={colors.primary} />
        <Text style={[styles.trustText, { color: colors.mutedForeground }]}>
          Данные защищены. Анонимная подача возможна. Чпок — независимая гражданская платформа.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 20,
  },
  heroInner: {
    gap: 10,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  logoDot: {
    width: 10,
    height: 10,
  },
  logoText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    letterSpacing: 3,
  },
  heroTagline: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    letterSpacing: -1,
    lineHeight: 36,
  },
  heroSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 10,
  },
  ctaLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  ctaHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    textAlign: "center",
    marginTop: -8,
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statNum: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: "100%",
  },
  section: {
    padding: 20,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    letterSpacing: 1.5,
  },
  sectionLink: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  emptyCard: {
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  recentList: {
    gap: 8,
  },
  recentCard: {
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  recentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentCatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recentProvider: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  recentDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  recentDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  howList: {
    gap: 16,
  },
  howItem: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  howIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  howText: {
    flex: 1,
    gap: 3,
  },
  howTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  howDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  trustBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    margin: 20,
    marginTop: 0,
    padding: 14,
    borderWidth: 1,
  },
  trustText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});
