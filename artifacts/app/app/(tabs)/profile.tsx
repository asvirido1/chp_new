import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useUser } from "@/context/UserContext";
import {
  useGetUserProfile,
  useUpsertUserProfile,
} from "@workspace/api-client-react";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userId } = useUser();

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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: Platform.OS === "web" ? 84 + 34 : 100 + insets.bottom,
        },
      ]}
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
        <Text style={[styles.title, { color: colors.foreground }]}>
          ПРОФИЛЬ
        </Text>
      </View>

      <View style={styles.body}>
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
            {name ? name.charAt(0).toUpperCase() : "?"}
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              ИМЯ
            </Text>
            {editing ? (
              <View style={styles.editRow}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.foreground,
                      borderColor: colors.primary,
                      backgroundColor: colors.card,
                    },
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ваше имя"
                  placeholderTextColor={colors.mutedForeground}
                  autoFocus
                />
                <Pressable
                  onPress={handleSave}
                  disabled={isPending}
                  style={[
                    styles.saveBtn,
                    { backgroundColor: colors.primary },
                  ]}
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
                  style={[styles.cancelBtn, { borderColor: colors.border }]}
                >
                  <Feather name="x" size={18} color={colors.foreground} />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => setEditing(true)}
                style={[styles.displayRow, { borderColor: colors.border }]}
              >
                <Text
                  style={[
                    styles.displayName,
                    {
                      color: name ? colors.foreground : colors.mutedForeground,
                    },
                  ]}
                >
                  {name || "Добавить имя"}
                </Text>
                <Feather name="edit-2" size={16} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
        )}

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <Feather name="user" size={16} color={colors.mutedForeground} />
            <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
              ID пользователя
            </Text>
          </View>
          <Text style={[styles.infoValue, { color: colors.foreground }]} numberOfLines={1}>
            {userId || "—"}
          </Text>
        </View>

        {profile && (
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <Feather name="bar-chart-2" size={16} color={colors.mutedForeground} />
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                Статистика
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: colors.foreground }]}>
              {profile.totalReports ?? 0} обращений
            </Text>
          </View>
        )}

        <View style={[styles.divider, { borderColor: colors.border }]} />

        <View style={styles.infoBlock}>
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <Text style={[styles.infoSmall, { color: colors.mutedForeground }]}>
            Чпок — платформа для фиксации нарушений в городском транспорте.
            Ваши жалобы помогают делать город безопаснее.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {},
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
  body: {
    padding: 20,
    gap: 16,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 4,
  },
  avatarText: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
  },
  section: {
    gap: 6,
  },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  editRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  saveBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  displayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  displayName: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    flex: 1,
  },
  infoCard: {
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: 4,
  },
  infoBlock: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  infoSmall: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});
