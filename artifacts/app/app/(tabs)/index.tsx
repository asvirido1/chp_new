import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
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

import { CategoryIcon } from "@/components/CategoryIcon";
import { StatusBadge } from "@/components/StatusBadge";
import { useUser } from "@/context/UserContext";
import { useColors } from "@/hooks/useColors";
import { useGetReports } from "@workspace/api-client-react";

const CATEGORY_LABELS: Record<string, string> = {
  delivery: "Доставка",
  micromobility: "Самокаты / СИМ",
  carsharing: "Каршеринг",
  taxi: "Такси",
  car: "Автомобили",
  other: "Другое",
};

const HOME_VARIANTS = {
  civic: {
    id: "civic",
    tab: "A",
    name: "Городской CTA",
    pitch: "самый дружелюбный",
    eyebrow: "Быстрый и понятный",
    headline: "Фиксируй нарушения и отправляй жалобу за полминуты",
    description:
      "Чистый flat-подход: яркий CTA, понятные метрики, мягкие карточки и низкий порог входа.",
    surface: "#FFFFFF",
    canvas: "#F4F8FC",
    mutedSurface: "#E8F0FE",
    text: "#10243E",
    mutedText: "#5F6F84",
    border: "#D7E0EA",
    accent: "#2563EB",
    accentText: "#F8FAFC",
    accentSoft: "#DBEAFE",
    heroBackground: "#2563EB",
    heroText: "#F8FAFC",
    radius: 28,
    borderWidth: 1,
    headingSpacing: 0.4,
    dark: false,
  },
  editorial: {
    id: "editorial",
    tab: "B",
    name: "Постерный акцент",
    pitch: "самый смелый",
    eyebrow: "Редакционный стиль",
    headline: "Город слышит, когда нарушение зафиксировано точно",
    description:
      "Контрастный тёмный экран с крупной типографикой, подачей как у digital-постера и сильным ощущением срочности.",
    surface: "#111111",
    canvas: "#0A0A0A",
    mutedSurface: "#171717",
    text: "#FAFAFA",
    mutedText: "#A3A3A3",
    border: "#262626",
    accent: "#FF5A1F",
    accentText: "#0A0A0A",
    accentSoft: "#2A140F",
    heroBackground: "#0A0A0A",
    heroText: "#FAFAFA",
    radius: 0,
    borderWidth: 1,
    headingSpacing: -0.6,
    dark: true,
  },
  command: {
    id: "command",
    tab: "C",
    name: "Контрольный центр",
    pitch: "самый доверительный",
    eyebrow: "Статус и контроль",
    headline: "Стартовый экран как гражданская панель управления",
    description:
      "Больше доверия и структуры: премиальный контраст, сетка статусов и ощущение серьёзного сервиса.",
    surface: "#FFFFFF",
    canvas: "#F7F5F2",
    mutedSurface: "#EFEAE3",
    text: "#17120F",
    mutedText: "#6B625D",
    border: "#D6CEC6",
    accent: "#A16207",
    accentText: "#FFFFFF",
    accentSoft: "#F4E8D3",
    heroBackground: "#1C1917",
    heroText: "#FAFAF9",
    radius: 18,
    borderWidth: 1,
    headingSpacing: 0.2,
    dark: false,
  },
} as const;

type HomeVariantId = keyof typeof HOME_VARIANTS;

const HOME_STEPS = [
  {
    icon: "camera" as const,
    title: "Зафиксируйте нарушение",
    desc: "Самокат на тротуаре, такси без документов, машина на газоне или курьер в опасной зоне.",
  },
  {
    icon: "edit-3" as const,
    title: "Опишите ситуацию",
    desc: "Категория, сервис, адрес и короткое описание. Анонимная подача остаётся доступной.",
  },
  {
    icon: "send" as const,
    title: "Передайте в работу",
    desc: "Жалоба уходит в модерацию и дальше направляется в нужную инстанцию.",
  },
];

const HOME_STATS = [
  { value: "1 248", label: "жалоб подано" },
  { value: "6", label: "категорий" },
  { value: "~30 сек", label: "на обращение" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userId } = useUser();
  const [variant, setVariant] = useState<HomeVariantId>("civic");

  const { data, isLoading } = useGetReports({ userId, limit: 3 });
  const recentReports = data?.reports ?? [];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 84 + 34 : 100 + insets.bottom;
  const current = HOME_VARIANTS[variant];

  const handleChpok = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/new-report");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: current.canvas }]}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.page, { paddingTop: topPad + 16 }]}>
        <View
          style={[
            styles.variantPanel,
            {
              backgroundColor: current.surface,
              borderColor: current.border,
              borderRadius: current.radius,
              borderWidth: current.borderWidth,
            },
          ]}
        >
          <View style={styles.variantHeader}>
            <View style={styles.variantHeaderText}>
              <Text style={[styles.variantEyebrow, { color: current.mutedText }]}>
                3 варианта стартовой страницы
              </Text>
              <Text style={[styles.variantTitle, { color: current.text }]}>
                Выбери настроение экрана
              </Text>
            </View>
            <View
              style={[
                styles.brandChip,
                { backgroundColor: current.accentSoft, borderRadius: current.radius / 2 + 4 },
              ]}
            >
              <View style={[styles.brandDot, { backgroundColor: current.accent }]} />
              <Text style={[styles.brandLabel, { color: current.text }]}>ЧПОК</Text>
            </View>
          </View>

          <View style={styles.variantTabs}>
            {(Object.values(HOME_VARIANTS) as Array<(typeof HOME_VARIANTS)[HomeVariantId]>).map(
              (item) => {
                const selected = item.id === variant;
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    onPress={() => setVariant(item.id)}
                    style={({ pressed }) => [
                      styles.variantTab,
                      {
                        backgroundColor: selected ? current.text : current.canvas,
                        borderColor: current.border,
                        borderRadius: current.id === "editorial" ? 0 : current.radius / 2,
                        opacity: pressed ? 0.92 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.variantTabLetter,
                        { color: selected ? current.canvas : current.text },
                      ]}
                    >
                      {item.tab}
                    </Text>
                    <View style={styles.variantTabBody}>
                      <Text
                        style={[
                          styles.variantTabName,
                          { color: selected ? current.canvas : current.text },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.variantTabPitch,
                          { color: selected ? current.canvas : current.mutedText },
                        ]}
                      >
                        {item.pitch}
                      </Text>
                    </View>
                  </Pressable>
                );
              },
            )}
          </View>
        </View>

        <HeroSection
          current={current}
          onPressMain={handleChpok}
          onPressReports={() => router.push("/(tabs)/reports")}
        />

        <StatsSection current={current} />

        <SectionShell
          current={current}
          title="Мои последние жалобы"
          actionLabel={recentReports.length > 0 ? "Все" : undefined}
          onPressAction={recentReports.length > 0 ? () => router.push("/(tabs)/reports") : undefined}
        >
          {isLoading ? (
            <ActivityIndicator color={current.accent} style={{ marginVertical: 20 }} />
          ) : recentReports.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: current.surface,
                  borderColor: current.border,
                  borderRadius: current.id === "editorial" ? 0 : current.radius,
                  borderWidth: current.borderWidth,
                },
              ]}
            >
              <Feather name="inbox" size={28} color={current.mutedText} />
              <Text style={[styles.emptyTitle, { color: current.text }]}>Пока нет жалоб</Text>
              <Text style={[styles.emptyText, { color: current.mutedText }]}>
                Нажмите «Чпокнуть», чтобы открыть первый кейс и отправить обращение.
              </Text>
            </View>
          ) : (
            <View style={styles.recentList}>
              {recentReports.map((report: (typeof recentReports)[number]) => (
                <Pressable
                  key={report.id}
                  onPress={() => router.push(`/report/${report.id}`)}
                  style={({ pressed }) => [
                    styles.recentCard,
                    {
                      backgroundColor: current.surface,
                      borderColor: current.border,
                      borderRadius: current.id === "editorial" ? 0 : current.radius,
                      borderWidth: current.borderWidth,
                      opacity: pressed ? 0.88 : 1,
                    },
                  ]}
                >
                  <View style={styles.recentCardHeader}>
                    <View style={styles.recentCatRow}>
                      <View
                        style={[
                          styles.iconWrap,
                          {
                            backgroundColor: current.accentSoft,
                            borderRadius: current.id === "editorial" ? 0 : 12,
                          },
                        ]}
                      >
                        <CategoryIcon category={report.category as any} size={14} color={current.accent} />
                      </View>
                      <View style={styles.recentTitleWrap}>
                        <Text style={[styles.recentProvider, { color: current.text }]}>
                          {report.providerLabel}
                        </Text>
                        <Text style={[styles.recentMeta, { color: current.mutedText }]}>
                          {CATEGORY_LABELS[report.category] ?? "Обращение"}
                        </Text>
                      </View>
                    </View>
                    <StatusBadge status={report.status as any} small />
                  </View>

                  <Text style={[styles.recentDesc, { color: current.mutedText }]} numberOfLines={2}>
                    {report.description}
                  </Text>

                  <View style={styles.recentFooter}>
                    <Text style={[styles.recentDate, { color: current.mutedText }]}>
                      {new Date(report.createdAt).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </Text>
                    <Text style={[styles.recentOpen, { color: current.accent }]}>Открыть</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </SectionShell>

        <SectionShell current={current} title="Как это работает">
          <View style={styles.stepsList}>
            {HOME_STEPS.map((step, index) => (
              <View
                key={step.title}
                style={[
                  styles.stepCard,
                  {
                    backgroundColor: current.surface,
                    borderColor: current.border,
                    borderRadius: current.id === "editorial" ? 0 : current.radius,
                    borderWidth: current.borderWidth,
                  },
                ]}
              >
                <View style={styles.stepHeader}>
                  <View
                    style={[
                      styles.stepIndex,
                      {
                        backgroundColor: current.accent,
                        borderRadius: current.id === "editorial" ? 0 : 999,
                      },
                    ]}
                  >
                    <Text style={[styles.stepIndexLabel, { color: current.accentText }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.stepIcon,
                      {
                        backgroundColor: current.accentSoft,
                        borderRadius: current.id === "editorial" ? 0 : 14,
                      },
                    ]}
                  >
                    <Feather name={step.icon} size={16} color={current.accent} />
                  </View>
                </View>
                <Text style={[styles.stepTitle, { color: current.text }]}>{step.title}</Text>
                <Text style={[styles.stepDesc, { color: current.mutedText }]}>{step.desc}</Text>
              </View>
            ))}
          </View>
        </SectionShell>

        <View
          style={[
            styles.trustBlock,
            {
              backgroundColor: current.heroBackground,
              borderColor: current.border,
              borderRadius: current.id === "editorial" ? 0 : current.radius,
              borderWidth: current.borderWidth,
            },
          ]}
        >
          <View
            style={[
              styles.trustIcon,
              {
                backgroundColor: current.accent,
                borderRadius: current.id === "editorial" ? 0 : 999,
              },
            ]}
          >
            <Feather name="shield" size={18} color={current.accentText} />
          </View>
          <View style={styles.trustCopy}>
            <Text style={[styles.trustTitle, { color: current.heroText }]}>
              Независимая гражданская платформа
            </Text>
            <Text style={[styles.trustText, { color: current.dark ? "#CFCFCF" : "#D6D3D1" }]}>
              Данные защищены, анонимная подача доступна, история обращений остаётся под рукой.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.nativePaletteHint,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text style={[styles.nativePaletteText, { color: colors.foreground }]}>
            Выше три концепции на выбор. Текущая системная палитра приложения сохранена для остальных экранов.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function HeroSection({
  current,
  onPressMain,
  onPressReports,
}: {
  current: (typeof HOME_VARIANTS)[HomeVariantId];
  onPressMain: () => void;
  onPressReports: () => void;
}) {
  const buttonRadius = current.id === "editorial" ? 0 : current.radius - 6;

  if (current.id === "editorial") {
    return (
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: current.heroBackground,
            borderColor: current.border,
            borderRadius: 0,
            borderWidth: current.borderWidth,
          },
        ]}
      >
        <Text style={[styles.heroEyebrow, { color: current.accent }]}>{current.eyebrow}</Text>
        <Text style={[styles.heroTitleEditorial, { color: current.heroText }]}>{current.headline}</Text>
        <Text style={[styles.heroDescriptionEditorial, { color: current.mutedText }]}>
          {current.description}
        </Text>

        <View style={[styles.heroDivider, { backgroundColor: current.border }]} />

        <View style={styles.editorialFacts}>
          <FactCell current={current} value="24/7" label="доступность" />
          <FactCell current={current} value="1 экран" label="до отправки" />
          <FactCell current={current} value="0 шума" label="только важное" />
        </View>

        <Pressable
          testID="chpok-cta-btn"
          onPress={onPressMain}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: current.accent,
              borderRadius: buttonRadius,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <Text style={[styles.primaryButtonLabel, { color: current.accentText }]}>Чпокнуть</Text>
          <Feather name="arrow-right" size={18} color={current.accentText} />
        </Pressable>

        <Pressable onPress={onPressReports} style={styles.secondaryLink}>
          <Text style={[styles.secondaryLinkText, { color: current.heroText }]}>
            Смотреть последние обращения
          </Text>
          <View style={[styles.secondaryUnderline, { backgroundColor: current.accent }]} />
        </Pressable>
      </View>
    );
  }

  if (current.id === "command") {
    return (
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: current.heroBackground,
            borderColor: current.border,
            borderRadius: current.radius,
            borderWidth: current.borderWidth,
          },
        ]}
      >
        <View style={styles.commandHeader}>
          <Text style={[styles.heroEyebrow, { color: "#D6D3D1" }]}>{current.eyebrow}</Text>
          <View
            style={[
              styles.commandBadge,
              { backgroundColor: current.accentSoft, borderRadius: current.radius / 2 },
            ]}
          >
            <Text style={[styles.commandBadgeText, { color: current.accent }]}>LIVE</Text>
          </View>
        </View>

        <Text style={[styles.heroTitleCommand, { color: current.heroText }]}>{current.headline}</Text>
        <Text style={[styles.heroDescription, { color: "#D6D3D1" }]}>{current.description}</Text>

        <View style={styles.commandGrid}>
          <View
            style={[
              styles.commandCellWide,
              { backgroundColor: "#2A2521", borderColor: "#3A342F" },
            ]}
          >
            <Text style={[styles.commandCellLabel, { color: "#B9AEA5" }]}>Категории</Text>
            <Text style={[styles.commandCellValue, { color: current.heroText }]}>Самокаты / Такси / Каршеринг</Text>
          </View>
          <View
            style={[
              styles.commandCell,
              { backgroundColor: "#2A2521", borderColor: "#3A342F" },
            ]}
          >
            <Text style={[styles.commandCellLabel, { color: "#B9AEA5" }]}>Статус</Text>
            <Text style={[styles.commandCellValue, { color: current.heroText }]}>Под контролем</Text>
          </View>
          <View
            style={[
              styles.commandCell,
              { backgroundColor: "#2A2521", borderColor: "#3A342F" },
            ]}
          >
            <Text style={[styles.commandCellLabel, { color: "#B9AEA5" }]}>Анонимно</Text>
            <Text style={[styles.commandCellValue, { color: current.heroText }]}>Доступно</Text>
          </View>
        </View>

        <View style={styles.heroActions}>
          <Pressable
            testID="chpok-cta-btn"
            onPress={onPressMain}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: current.accent,
                borderRadius: buttonRadius,
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <Text style={[styles.primaryButtonLabel, { color: current.accentText }]}>Открыть обращение</Text>
          </Pressable>
          <Pressable
            onPress={onPressReports}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                borderColor: "#4C433D",
                borderRadius: buttonRadius,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text style={[styles.secondaryButtonLabel, { color: current.heroText }]}>История</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.heroCard,
        {
          backgroundColor: current.heroBackground,
          borderColor: current.border,
          borderRadius: current.radius,
          borderWidth: current.borderWidth,
        },
      ]}
    >
      <View style={styles.heroTopRow}>
        <View>
          <Text style={[styles.heroEyebrow, { color: "#BFDBFE" }]}>{current.eyebrow}</Text>
          <Text style={[styles.heroTitle, { color: current.heroText }]}>{current.headline}</Text>
        </View>
        <View style={[styles.heroStamp, { backgroundColor: "#0F3FA8" }]}>
          <Text style={[styles.heroStampText, { color: current.heroText }]}>01</Text>
        </View>
      </View>

      <Text style={[styles.heroDescription, { color: "#DCEAFE" }]}>{current.description}</Text>

      <View style={styles.civicStatChips}>
        {HOME_STATS.map((item) => (
          <View
            key={item.label}
            style={[
              styles.civicStatChip,
              { backgroundColor: current.accentSoft, borderRadius: current.radius / 2 },
            ]}
          >
            <Text style={[styles.civicStatValue, { color: current.accent }]}>{item.value}</Text>
            <Text style={[styles.civicStatLabel, { color: current.text }]}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.heroActions}>
        <Pressable
          testID="chpok-cta-btn"
          onPress={onPressMain}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: current.accent,
              borderRadius: buttonRadius,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <Text style={[styles.primaryButtonLabel, { color: current.accentText }]}>Чпокнуть</Text>
          <Feather name="arrow-right" size={18} color={current.accentText} />
        </Pressable>

        <Pressable
          onPress={onPressReports}
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              backgroundColor: "#3B82F6",
              borderRadius: buttonRadius,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <Text style={[styles.secondaryButtonLabel, { color: current.heroText }]}>Последние жалобы</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StatsSection({ current }: { current: (typeof HOME_VARIANTS)[HomeVariantId] }) {
  return (
    <View style={styles.statsGrid}>
      {HOME_STATS.map((item) => (
        <View
          key={item.label}
          style={[
            styles.statsCard,
            {
              backgroundColor: current.surface,
              borderColor: current.border,
              borderRadius: current.id === "editorial" ? 0 : current.radius,
              borderWidth: current.borderWidth,
            },
          ]}
        >
          <Text style={[styles.statsValue, { color: current.text }]}>{item.value}</Text>
          <Text style={[styles.statsLabel, { color: current.mutedText }]}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

function SectionShell({
  current,
  title,
  actionLabel,
  onPressAction,
  children,
}: {
  current: (typeof HOME_VARIANTS)[HomeVariantId];
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: current.text,
              letterSpacing: current.headingSpacing,
            },
          ]}
        >
          {title}
        </Text>
        {actionLabel ? (
          <Pressable onPress={onPressAction}>
            <Text style={[styles.sectionLink, { color: current.accent }]}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

function FactCell({
  current,
  value,
  label,
}: {
  current: (typeof HOME_VARIANTS)[HomeVariantId];
  value: string;
  label: string;
}) {
  return (
    <View style={[styles.factCell, { borderColor: current.border }]}>
      <Text style={[styles.factValue, { color: current.heroText }]}>{value}</Text>
      <Text style={[styles.factLabel, { color: current.mutedText }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  page: {
    paddingHorizontal: 16,
    gap: 16,
  },
  variantPanel: {
    padding: 16,
    gap: 14,
  },
  variantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  variantHeaderText: {
    flex: 1,
    gap: 4,
  },
  variantEyebrow: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  variantTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.6,
  },
  brandChip: {
    minHeight: 40,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  brandLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    letterSpacing: 1.5,
  },
  variantTabs: {
    gap: 10,
  },
  variantTab: {
    minHeight: 64,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  variantTabLetter: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    width: 18,
    textAlign: "center",
  },
  variantTabBody: {
    flex: 1,
    gap: 2,
  },
  variantTabName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  variantTabPitch: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  heroCard: {
    padding: 20,
    gap: 16,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  heroEyebrow: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -1.2,
  },
  heroTitleEditorial: {
    fontFamily: "Inter_700Bold",
    fontSize: 40,
    lineHeight: 42,
    letterSpacing: -1.8,
  },
  heroTitleCommand: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.9,
  },
  heroDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  heroDescriptionEditorial: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  heroStamp: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heroStampText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  civicStatChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  civicStatChip: {
    minWidth: "31%",
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 2,
  },
  civicStatValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  civicStatLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  secondaryButton: {
    minHeight: 52,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  secondaryButtonLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  heroDivider: {
    height: 2,
  },
  editorialFacts: {
    flexDirection: "row",
  },
  factCell: {
    flex: 1,
    borderRightWidth: 1,
    paddingRight: 10,
    marginRight: 10,
  },
  factValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    marginBottom: 4,
  },
  factLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    textTransform: "uppercase",
  },
  secondaryLink: {
    alignSelf: "flex-start",
    gap: 6,
  },
  secondaryLinkText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  secondaryUnderline: {
    height: 2,
    width: "100%",
  },
  commandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commandBadge: {
    minHeight: 28,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  commandBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 1,
  },
  commandGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  commandCellWide: {
    width: "100%",
    borderWidth: 1,
    padding: 14,
    gap: 6,
    borderRadius: 12,
  },
  commandCell: {
    flex: 1,
    minWidth: 120,
    borderWidth: 1,
    padding: 14,
    gap: 6,
    borderRadius: 12,
  },
  commandCellLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  commandCellValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statsCard: {
    flex: 1,
    minHeight: 84,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: "space-between",
  },
  statsValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    letterSpacing: -0.6,
  },
  statsLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    lineHeight: 24,
  },
  sectionLink: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  emptyCard: {
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  recentList: {
    gap: 10,
  },
  recentCard: {
    padding: 14,
    gap: 12,
  },
  recentCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  recentCatRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  recentTitleWrap: {
    flex: 1,
    gap: 2,
  },
  recentProvider: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  recentMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  recentDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  recentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentDate: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  recentOpen: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  stepsList: {
    gap: 10,
  },
  stepCard: {
    padding: 16,
    gap: 12,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepIndex: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIndexLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
  },
  stepIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  stepDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  trustBlock: {
    padding: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  trustIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  trustCopy: {
    flex: 1,
    gap: 4,
  },
  trustTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  trustText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  nativePaletteHint: {
    marginBottom: 8,
    borderWidth: 1,
    padding: 14,
  },
  nativePaletteText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },
});
