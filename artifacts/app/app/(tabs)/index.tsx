import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 152 : 118 + insets.bottom;

  const handleChpok = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/new-report");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
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

          <View style={styles.heroActionZone}>
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
            Это анонимно. Чпок — независимая гражданская платформа.
          </Text>
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 20,
    minHeight: 430,
    justifyContent: "space-between",
  },
  heroInner: {
    gap: 10,
  },
  heroActionZone: {
    gap: 10,
    marginTop: 28,
  },
  heroActionHint: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    textAlign: "center",
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
    minHeight: 56,
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
    marginTop: -2,
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
