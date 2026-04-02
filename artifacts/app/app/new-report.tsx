import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
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

import { CategoryIcon, CATEGORY_COLORS } from "@/components/CategoryIcon";
import { useColors } from "@/hooks/useColors";
import { useUser } from "@/context/UserContext";
import {
  useGetProviders,
  useCreateReport,
} from "@workspace/api-client-react";

type Step = "category" | "provider" | "description" | "done";

const CATEGORY_LABELS: Record<string, string> = {
  delivery: "Доставка",
  micromobility: "Самокаты / велосипеды",
  carsharing: "Каршеринг",
  taxi: "Такси",
  car: "Автомобили",
  other: "Другое",
};

export default function NewReportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userId } = useUser();

  const { data: providersData, isLoading: providersLoading } = useGetProviders();
  const { mutateAsync: createReport, isPending } = useCreateReport();

  const [step, setStep] = useState<Step>("category");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [description, setDescription] = useState("");
  const [locating, setLocating] = useState(false);
  const [geo, setGeo] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);
  const [address, setAddress] = useState<string>("");

  const categories = providersData?.categories ?? [];
  const currentCategory = categories.find((c) => c.id === selectedCategory);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handlePickCategory = (catId: string) => {
    Haptics.selectionAsync();
    setSelectedCategory(catId);
    setStep("provider");
  };

  const handlePickProvider = (id: string, label: string) => {
    Haptics.selectionAsync();
    setSelectedProvider({ id, label });
    setStep("description");
  };

  const handleLocate = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Геолокация", "Разрешите доступ к местоположению в настройках");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setGeo({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        accuracy: loc.coords.accuracy ?? undefined,
      });
      try {
        const [rev] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (rev) {
          const parts = [rev.street, rev.streetNumber, rev.city].filter(Boolean);
          setAddress(parts.join(", "));
        }
      } catch {
        setAddress(`${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`);
      }
    } catch {
      Alert.alert("Ошибка", "Не удалось получить местоположение");
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Ошибка", "Введите описание нарушения");
      return;
    }
    try {
      await createReport({
        data: {
          userId: userId || undefined,
          isAnonymous: !userId,
          category: selectedCategory as any,
          providerId: selectedProvider!.id,
          description: description.trim(),
          deviceGeo: geo ?? undefined,
          addressText: address || undefined,
          deviceContext: {
            platform: Platform.OS,
            appVersion: "1.0.0",
          },
        },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep("done");
    } catch {
      Alert.alert("Ошибка", "Не удалось отправить жалобу. Попробуйте ещё раз.");
    }
  };

  const goBack = () => {
    if (step === "provider") {
      setStep("category");
      setSelectedProvider(null);
    } else if (step === "description") {
      setStep("provider");
    } else {
      router.back();
    }
  };

  const STEPS: Step[] = ["category", "provider", "description"];
  const stepIndex = STEPS.indexOf(step);
  const progress = (stepIndex + 1) / STEPS.length;

  if (step === "done") {
    return (
      <View
        style={[
          styles.container,
          styles.doneContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={[styles.doneIcon, { backgroundColor: colors.primary }]}>
          <Feather name="check" size={40} color={colors.primaryForeground} />
        </View>
        <Text style={[styles.doneTitle, { color: colors.foreground }]}>
          Жалоба отправлена
        </Text>
        <Text style={[styles.doneText, { color: colors.mutedForeground }]}>
          Ваше обращение принято на рассмотрение. Спасибо, что помогаете сделать город лучше.
        </Text>
        <Pressable
          onPress={() => router.replace("/")}
          style={[styles.doneBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.doneBtnLabel, { color: colors.primaryForeground }]}>
            На главную
          </Text>
        </Pressable>
      </View>
    );
  }

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
        <Pressable onPress={goBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            {step === "category"
              ? "КАТЕГОРИЯ"
              : step === "provider"
              ? "СЕРВИС"
              : "ОПИСАНИЕ"}
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Шаг {stepIndex + 1} из {STEPS.length}
          </Text>
        </View>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      <View
        style={[styles.progressBar, { backgroundColor: colors.muted }]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>

      {providersLoading && step !== "description" ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : step === "category" ? (
        <ScrollView
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.stepHint, { color: colors.mutedForeground }]}>
            Выберите тип нарушителя
          </Text>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              testID={`category-${cat.id}`}
              onPress={() => handlePickCategory(cat.id)}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: colors.card,
                  borderColor:
                    selectedCategory === cat.id
                      ? colors.primary
                      : colors.border,
                  borderWidth: selectedCategory === cat.id ? 2 : 1,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor:
                      CATEGORY_COLORS[cat.id as any] + "20",
                  },
                ]}
              >
                <CategoryIcon category={cat.id as any} size={22} />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: colors.foreground }]}>
                  {CATEGORY_LABELS[cat.id] ?? cat.label}
                </Text>
                <Text style={[styles.optionSub, { color: colors.mutedForeground }]}>
                  {cat.providers.length} сервисов
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </ScrollView>
      ) : step === "provider" ? (
        <ScrollView
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.stepHint, { color: colors.mutedForeground }]}>
            {CATEGORY_LABELS[selectedCategory] ?? selectedCategory} — выберите сервис
          </Text>
          {currentCategory?.providers.map((p) => (
            <Pressable
              key={p.id}
              testID={`provider-${p.id}`}
              onPress={() => handlePickProvider(p.id, p.label)}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: colors.card,
                  borderColor:
                    selectedProvider?.id === p.id
                      ? colors.primary
                      : colors.border,
                  borderWidth: selectedProvider?.id === p.id ? 2 : 1,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.optionTitle, { color: colors.foreground, flex: 1 }]}>
                {p.label}
              </Text>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.summaryRow}>
            <CategoryIcon category={selectedCategory as any} size={16} />
            <Text style={[styles.summaryText, { color: colors.mutedForeground }]}>
              {CATEGORY_LABELS[selectedCategory]} · {selectedProvider?.label}
            </Text>
          </View>

          <Text style={[styles.stepHint, { color: colors.mutedForeground }]}>
            Опишите нарушение
          </Text>

          <TextInput
            testID="description-input"
            style={[
              styles.textArea,
              {
                color: colors.foreground,
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Курьер ехал по тротуару, не пропустил пешеходов..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={[styles.charCount, { color: colors.mutedForeground }]}>
            {description.length}/1000
          </Text>

          <Text style={[styles.stepHint, { color: colors.mutedForeground }]}>
            Место нарушения (необязательно)
          </Text>

          <Pressable
            onPress={handleLocate}
            disabled={locating}
            style={[
              styles.geoBtn,
              {
                borderColor: geo ? colors.primary : colors.border,
                backgroundColor: colors.card,
              },
            ]}
          >
            {locating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Feather
                name="map-pin"
                size={18}
                color={geo ? colors.primary : colors.mutedForeground}
              />
            )}
            <Text
              style={[
                styles.geoBtnLabel,
                { color: geo ? colors.primary : colors.mutedForeground },
              ]}
              numberOfLines={1}
            >
              {geo
                ? address || `${geo.lat.toFixed(5)}, ${geo.lng.toFixed(5)}`
                : "Определить местоположение"}
            </Text>
          </Pressable>

          <Pressable
            testID="submit-report-btn"
            onPress={handleSubmit}
            disabled={isPending || !description.trim()}
            style={[
              styles.submitBtn,
              {
                backgroundColor:
                  !description.trim() ? colors.muted : colors.primary,
              },
            ]}
          >
            {isPending ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text
                style={[
                  styles.submitLabel,
                  {
                    color: !description.trim()
                      ? colors.mutedForeground
                      : colors.primaryForeground,
                  },
                ]}
              >
                Отправить жалобу
              </Text>
            )}
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  doneContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  doneIcon: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  doneTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  doneText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  doneBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginTop: 8,
  },
  doneBtnLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  headerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 1,
  },
  progressBar: {
    height: 3,
    width: "100%",
  },
  progressFill: {
    height: 3,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  stepHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    marginBottom: 4,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
  },
  optionSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  summaryText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  textArea: {
    borderWidth: 1,
    padding: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    minHeight: 120,
    lineHeight: 22,
  },
  charCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    textAlign: "right",
    marginTop: -4,
  },
  geoBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  geoBtnLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    flex: 1,
  },
  submitBtn: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
});
