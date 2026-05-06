import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useUser } from "@/context/UserContext";
import {
  useGetUserProfile,
  useUpsertUserProfile,
} from "@workspace/api-client-react";

interface SettingsRowProps {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingsRow({ icon, label, value, onPress, isLast }: SettingsRowProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingsRow,
        {
          borderBottomColor: isLast ? "transparent" : colors.border,
          backgroundColor: pressed && onPress ? colors.muted : "transparent",
        },
      ]}
    >
      <Feather name={icon} size={16} color={colors.mutedForeground} />
      <Text style={[styles.settingsLabel, { color: colors.foreground }]}>
        {label}
      </Text>
      {value ? (
        <Text style={[styles.settingsValue, { color: colors.mutedForeground }]}>
          {value}
        </Text>
      ) : null}
      {onPress ? (
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      ) : null}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userId } = useUser();
  const router = useRouter();

  const { data: profile, isLoading } = useGetUserProfile({ userId });
  const { mutateAsync: upsert, isPending } = useUpsertUserProfile();

  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  React.useEffect(() => {
    if (profile?.displayName) {
      setName(profile.displayName);
    }
  }, [profile?.displayName]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const totalReports = profile?.reportCount ?? 0;

  const handleSave = async () => {
    try {
      await upsert({
        data: { userId, displayName: name.trim() || undefined },
      });
      setEditing(false);
    } catch {
      Alert.alert("Ошибка", "Не удалось сохранить профиль");
    }
  };

  const displayInitial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingBottom: Platform.OS === "web" ? 84 + 34 : 100 + insets.bottom,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: topPad + 12,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>ПРОФИЛЬ</Text>
      </View>

      <View style={[styles.avatarSection, { backgroundColor: colors.secondary }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
            {displayInitial}
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  borderColor: colors.primary,
                  backgroundColor: "#1E2124",
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Ваше имя"
              placeholderTextColor="#6B7280"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
            <Pressable
              onPress={handleSave}
              disabled={isPending}
              style={[styles.iconBtn, { backgroundColor: colors.primary }]}
            >
              {isPending ? (
                <ActivityIndicator size="small" color={colors.primaryForeground} />
              ) : (
                <Feather name="check" size={18} color={colors.primaryForeground} />
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                setEditing(false);
                setName(profile?.displayName ?? "");
              }}
              style={[styles.iconBtn, { backgroundColor: "#2D3138" }]}
            >
              <Feather name="x" size={18} color="#FFF" />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => setEditing(true)} style={styles.nameRow}>
            <Text style={[styles.displayName, { color: colors.secondaryForeground }]}>
              {name || "Добавить имя"}
            </Text>
            <Feather name="edit-2" size={14} color="#6B7280" />
          </Pressable>
        )}

        <Text style={[styles.anonId, { color: "#6B7280" }]} numberOfLines={1}>
          {userId ? `ID: ${userId.slice(0, 20)}…` : "—"}
        </Text>
      </View>

      <View style={[styles.statsRow, { borderBottomColor: colors.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: colors.foreground }]}>
            {totalReports}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            жалоб
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: colors.mutedForeground }]}>—</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            очков
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: colors.mutedForeground }]}>—</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            уровень
          </Text>
        </View>
      </View>

      <View style={[styles.rewardsBanner, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Feather name="award" size={18} color={colors.mutedForeground} />
        <View style={styles.rewardsText}>
          <Text style={[styles.rewardsTitle, { color: colors.foreground }]}>
            Награды и рейтинг
          </Text>
          <Text style={[styles.rewardsSub, { color: colors.mutedForeground }]}>
            Система вознаграждений появится в следующем обновлении
          </Text>
        </View>
      </View>

      <View style={styles.groupHeader}>
        <Text style={[styles.groupTitle, { color: colors.mutedForeground }]}>
          МОИ ЧПОКИ
        </Text>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SettingsRow
          icon="list"
          label="Мои чпоки"
          value={totalReports > 0 ? `${totalReports}` : undefined}
          onPress={() => router.push("/(tabs)/reports")}
          isLast
        />
      </View>

      <View style={styles.groupHeader}>
        <Text style={[styles.groupTitle, { color: colors.mutedForeground }]}>
          НАСТРОЙКИ
        </Text>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SettingsRow
          icon="bell"
          label="Новости"
          onPress={() => router.push("/(tabs)/feed")}
        />
        <SettingsRow
          icon="bell"
          label="Уведомления"
          value="Скоро"
        />
        <SettingsRow
          icon="lock"
          label="Конфиденциальность"
          value="Скоро"
        />
        <SettingsRow
          icon="globe"
          label="Язык"
          value="Русский"
          isLast
        />
      </View>

      <View style={styles.groupHeader}>
        <Text style={[styles.groupTitle, { color: colors.mutedForeground }]}>
          ПОДДЕРЖКА
        </Text>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SettingsRow icon="book-open" label="Как пользоваться" onPress={() => {}} />
        <SettingsRow icon="help-circle" label="Задать вопрос" onPress={() => {}} />
        <SettingsRow icon="refresh-cw" label="Повторить онбординг" onPress={() => {}} isLast />
      </View>

      <View style={styles.groupHeader}>
        <Text style={[styles.groupTitle, { color: colors.mutedForeground }]}>
          О ПРИЛОЖЕНИИ
        </Text>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SettingsRow icon="info" label="Версия" value="1.0.0" isLast />
      </View>

      <View style={styles.footerBlock}>
        <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
          Чпок — независимая гражданская платформа для фиксации нарушений городского транспорта. Данные не передаются третьим лицам без вашего согласия.
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
  avatarSection: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  displayName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
  },
  anonId: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#FFF",
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 22,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  statDivider: {
    width: 1,
  },
  rewardsBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    margin: 16,
    padding: 14,
    borderWidth: 1,
  },
  rewardsText: {
    flex: 1,
    gap: 2,
  },
  rewardsTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  rewardsSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  groupHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 6,
  },
  groupTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1,
  },
  settingsCard: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginHorizontal: 0,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingsLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    flex: 1,
  },
  settingsValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  footerBlock: {
    padding: 20,
    paddingTop: 24,
  },
  footerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
