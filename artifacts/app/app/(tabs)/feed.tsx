import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

type UpdateTag = "product" | "tip" | "news" | "guide";

interface UpdateItem {
  id: string;
  date: string;
  tag: UpdateTag;
  title: string;
  body: string;
  link?: string;
}

const TAG_META: Record<UpdateTag, { label: string; color: string; textColor: string }> = {
  product: { label: "Обновление", color: "#AAFF00", textColor: "#17191C" },
  tip: { label: "Совет", color: "#60A5FA", textColor: "#17191C" },
  news: { label: "Новость", color: "#FCD34D", textColor: "#17191C" },
  guide: { label: "Инструкция", color: "#9CA3AF", textColor: "#17191C" },
};

const UPDATES: UpdateItem[] = [
  {
    id: "u1",
    date: "3 апреля 2026",
    tag: "product",
    title: "Запущена платформа Чпок",
    body:
      "Мы официально открыли доступ к платформе для всех жителей России. Теперь каждый может зафиксировать нарушение городского транспорта и направить обращение через приложение.",
  },
  {
    id: "u2",
    date: "2 апреля 2026",
    tag: "guide",
    title: "Как правильно описать нарушение",
    body:
      "Хорошее описание: время, место, что произошло, номер транспортного средства если виден. Чем точнее — тем быстрее модератор подтвердит обращение.",
  },
  {
    id: "u3",
    date: "1 апреля 2026",
    tag: "tip",
    title: "Анонимность работает",
    body:
      "При включённой анонимности ваш ID не передаётся сервису — только категория, описание и геолокация, если вы её разрешили. Личные данные не хранятся.",
  },
  {
    id: "u4",
    date: "28 марта 2026",
    tag: "news",
    title: "Добавлена категория «Автомобили»",
    body:
      "Теперь можно подавать жалобы на частные и служебные автомобили: парковка на тротуаре, проезд по велодорожке, опасное вождение.",
  },
  {
    id: "u5",
    date: "25 марта 2026",
    tag: "tip",
    title: "Геолокация ускоряет обработку",
    body:
      "Жалобы с указанием места рассматриваются быстрее. Разрешите доступ к геолокации на шаге описания — координаты передаются только с вашего согласия.",
  },
  {
    id: "u6",
    date: "20 марта 2026",
    tag: "guide",
    title: "Что происходит после подачи жалобы",
    body:
      "1. Обращение получает статус «Новый». 2. Модератор проверяет описание. 3. Подтверждённые жалобы направляются в профильные инстанции. 4. Статус обновляется — следите в разделе «Мои жалобы».",
  },
];

export default function FeedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 84 + 34 : 100 + insets.bottom;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
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
        <Text style={[styles.title, { color: colors.foreground }]}>
          НОВОСТИ
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Обновления платформы и советы
        </Text>
      </View>

      <View style={styles.list}>
        {UPDATES.map((item, index) => {
          const tag = TAG_META[item.tag];
          return (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderTopWidth: index === 0 ? 1 : 0,
                },
              ]}
            >
              <View style={styles.cardMeta}>
                <View
                  style={[styles.tagBadge, { backgroundColor: tag.color }]}
                >
                  <Text style={[styles.tagLabel, { color: tag.textColor }]}>
                    {tag.label}
                  </Text>
                </View>
                <Text style={[styles.dateText, { color: colors.mutedForeground }]}>
                  {item.date}
                </Text>
              </View>

              <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                {item.title}
              </Text>
              <Text style={[styles.cardBody, { color: colors.mutedForeground }]}>
                {item.body}
              </Text>

              {item.link ? (
                <Pressable
                  onPress={() => item.link && Linking.openURL(item.link)}
                  style={styles.linkRow}
                >
                  <Text style={[styles.linkText, { color: colors.primary }]}>
                    Подробнее
                  </Text>
                  <Feather name="external-link" size={12} color={colors.primary} />
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Feather name="bell-off" size={14} color={colors.mutedForeground} />
        <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
          Push-уведомления появятся в следующем обновлении
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
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
  list: {
    marginTop: 0,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    gap: 8,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  dateText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  cardBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  linkText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 20,
    borderTopWidth: 1,
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    flex: 1,
  },
});
