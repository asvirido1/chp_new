import { Feather } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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
import { useCreateReport } from "@workspace/api-client-react";

type Step = "photo" | "category" | "provider" | "details" | "review" | "done";

const STEP_ORDER: Step[] = ["photo", "category", "provider", "details", "review"];

const CATEGORY_LABELS: Record<string, string> = {
  delivery: "Доставка",
  micromobility: "Самокаты / СИМ",
  carsharing: "Каршеринг",
  taxi: "Такси",
  car: "Автомобили",
  other: "Другое",
};

const CATEGORY_DESC: Record<string, string> = {
  delivery: "Курьеры, самокаты-доставщики",
  micromobility: "Электросамокаты, велосипеды",
  carsharing: "Делимобиль, Яндекс Драйв и др.",
  taxi: "Яндекс Такси, Uber и др.",
  car: "Частные и служебные авто",
  other: "Другой тип нарушителя",
};

const PROVIDERS_BY_CATEGORY: Record<string, { id: string; label: string }[]> = {
  delivery: [
    { id: "samokat", label: "Самокат" },
    { id: "yandex_eda", label: "Яндекс Еда" },
    { id: "vkusvill", label: "ВкусВилл" },
    { id: "kuper", label: "Купер" },
    { id: "ozon_fresh", label: "Ozon Fresh" },
    { id: "magnit_dostavka", label: "Магнит Доставка" },
    { id: "pyaterochka", label: "Пятёрочка" },
    { id: "perekrestok", label: "Перекрёсток" },
    { id: "lenta", label: "Лента" },
    { id: "delivery_other", label: "Другое" },
    { id: "delivery_unknown", label: "Не знаю" },
  ],
  micromobility: [
    { id: "whoosh", label: "Whoosh" },
    { id: "mts_urent", label: "МТС Юрент" },
    { id: "yandex_go", label: "Яндекс GO (самокат)" },
    { id: "private_sim", label: "Частный самокат" },
    { id: "micromobility_other", label: "Другое" },
    { id: "micromobility_unknown", label: "Не знаю" },
  ],
  carsharing: [
    { id: "delimobil", label: "Делимобиль" },
    { id: "citydrive", label: "CityDrive" },
    { id: "yandex_drive", label: "Яндекс Драйв" },
    { id: "belkacar", label: "BelkaCar" },
    { id: "carsharing_other", label: "Другое" },
    { id: "carsharing_unknown", label: "Не знаю" },
  ],
  taxi: [
    { id: "yandex_taxi", label: "Яндекс Такси" },
    { id: "uber", label: "Uber" },
    { id: "maxim", label: "Максим" },
    { id: "drivee", label: "Drivee" },
    { id: "taxi_other", label: "Другое" },
    { id: "taxi_unknown", label: "Не знаю" },
  ],
  car: [
    { id: "private_car", label: "Частный автомобиль" },
    { id: "service_car", label: "Служебный автомобиль" },
    { id: "municipal_car", label: "Муниципальный автомобиль" },
    { id: "car_unknown", label: "Не знаю" },
  ],
  other: [
    { id: "other_other", label: "Другое" },
    { id: "other_unknown", label: "Не знаю" },
  ],
};

const STEP_LABELS: Record<Step, string> = {
  photo: "Фото",
  category: "Категория",
  provider: "Сервис",
  details: "Детали",
  review: "Проверка",
  done: "",
};

export default function NewReportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userId } = useUser();
  const { mutateAsync: createReport, isPending } = useCreateReport();

  const [step, setStep] = useState<Step>("photo");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [description, setDescription] = useState("");
  const [locating, setLocating] = useState(false);
  const [geo, setGeo] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const stepIndex = STEP_ORDER.indexOf(step);
  const progress = (stepIndex + 1) / STEP_ORDER.length;

  const categories = Object.keys(PROVIDERS_BY_CATEGORY);
  const providers = selectedCategory ? (PROVIDERS_BY_CATEGORY[selectedCategory] ?? []) : [];

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        setPhotoUri(photo.uri);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setStep("category");
      }
    } catch {
      Alert.alert("Ошибка", "Не удалось сделать фото");
    }
  };

  const openLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setStep("category");
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setStep("category");
    }
  };

  const handlePickCategory = (catId: string) => {
    Haptics.selectionAsync();
    setSelectedCategory(catId);
    setSelectedProvider(null);
    setStep("provider");
  };

  const handlePickProvider = (id: string, label: string) => {
    Haptics.selectionAsync();
    setSelectedProvider({ id, label });
    setStep("details");
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
    if (!description.trim()) return;
    try {
      await createReport({
        data: {
          userId: userId || undefined,
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
    if (step === "photo") {
      router.back();
    } else if (step === "category") {
      setStep("photo");
      setSelectedProvider(null);
    } else if (step === "provider") {
      setStep("category");
      setSelectedProvider(null);
    } else if (step === "details") {
      setStep("provider");
    } else if (step === "review") {
      setStep("details");
    } else {
      router.back();
    }
  };

  if (step === "done") {
    return (
      <View
        style={[styles.container, styles.doneContainer, { backgroundColor: colors.background }]}
      >
        <View style={[styles.doneIconWrap, { backgroundColor: colors.primary }]}>
          <Feather name="check" size={44} color={colors.primaryForeground} />
        </View>
        <Text style={[styles.doneTitle, { color: colors.foreground }]}>
          Жалоба отправлена!
        </Text>
        <Text style={[styles.doneText, { color: colors.mutedForeground }]}>
          Ваше обращение принято на рассмотрение. Спасибо, что делаете город лучше.
        </Text>
        <View style={[styles.doneSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.doneSummaryRow}>
            <CategoryIcon category={selectedCategory as any} size={14} />
            <Text style={[styles.doneSummaryText, { color: colors.foreground }]}>
              {CATEGORY_LABELS[selectedCategory]} · {selectedProvider?.label}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.replace("/(tabs)/reports")}
          style={[styles.doneBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.doneBtnLabel, { color: colors.primaryForeground }]}>
            Мои жалобы
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setStep("photo");
            setSelectedCategory("");
            setSelectedProvider(null);
            setDescription("");
            setGeo(null);
            setAddress("");
            setPhotoUri(null);
          }}
          style={styles.doneSecondary}
        >
          <Text style={[styles.doneSecondaryLabel, { color: colors.mutedForeground }]}>
            Подать ещё одну
          </Text>
        </Pressable>
      </View>
    );
  }

  if (step === "photo") {
    const isNative = Platform.OS !== "web";
    const hasPermission = cameraPermission?.granted;

    return (
      <View style={[styles.container, { backgroundColor: "#000" }]}>
        {isNative && hasPermission && (
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
        )}

        <View style={StyleSheet.absoluteFill}>
          {/* Top bar */}
          <View style={[styles.photoTopBar, { paddingTop: topPad + 8 }]}>
            <Text style={styles.photoTitle}>СФОТОГРАФИРУЙТЕ НАРУШЕНИЕ</Text>
            <Pressable onPress={() => router.back()} style={styles.photoClose}>
              <Feather name="x" size={22} color="#fff" />
            </Pressable>
          </View>

          {/* Middle: fallback when no native camera */}
          {(!isNative || !hasPermission) && (
            <View style={styles.photoFallbackCenter}>
              <Feather name="camera" size={64} color="rgba(255,255,255,0.22)" />
              <Text style={styles.photoFallbackTitle}>Добавить фото нарушения</Text>
              {isNative && !hasPermission && (
                <Pressable
                  onPress={requestCameraPermission}
                  style={[styles.photoFallbackBtn, { backgroundColor: colors.primary }]}
                >
                  <Feather name="camera" size={16} color={colors.primaryForeground} />
                  <Text style={[styles.photoFallbackBtnLabel, { color: colors.primaryForeground }]}>
                    Разрешить камеру
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={openCamera}
                style={[styles.photoFallbackBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}
              >
                <Feather name="camera" size={16} color="#fff" />
                <Text style={[styles.photoFallbackBtnLabel, { color: "#fff" }]}>
                  Сфотографировать
                </Text>
              </Pressable>
              <Pressable
                onPress={openLibrary}
                style={[styles.photoFallbackBtn, { backgroundColor: "rgba(255,255,255,0.10)" }]}
              >
                <Feather name="image" size={16} color="#fff" />
                <Text style={[styles.photoFallbackBtnLabel, { color: "#fff" }]}>
                  Из медиатеки
                </Text>
              </Pressable>
            </View>
          )}

          {/* Bottom bar */}
          <View style={styles.photoBottomBar}>
            <Pressable onPress={() => setStep("category")} style={styles.photoSkip}>
              <Text style={styles.photoSkipText}>Пропустить</Text>
            </Pressable>

            {isNative && hasPermission ? (
              <Pressable onPress={takePicture} style={styles.photoShutter}>
                <View style={styles.photoShutterInner} />
              </Pressable>
            ) : (
              <View style={{ width: 80 }} />
            )}

            <Pressable onPress={openLibrary} style={styles.photoLibBtn}>
              <Feather name="image" size={24} color="#fff" />
            </Pressable>
          </View>
        </View>
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
        <Pressable onPress={goBack} style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            {STEP_LABELS[step].toUpperCase()}
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Шаг {stepIndex + 1} из {STEP_ORDER.length}
          </Text>
        </View>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Feather name="x" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
        <View
          style={[styles.progressFill, { backgroundColor: colors.primary, width: `${progress * 100}%` }]}
        />
      </View>

      <View style={styles.stepDotsRow}>
        {STEP_ORDER.map((s, i) => (
          <View key={s} style={styles.stepDotWrap}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    i < stepIndex
                      ? colors.primary
                      : i === stepIndex
                      ? colors.primary
                      : colors.muted,
                  width: i === stepIndex ? 28 : 8,
                },
              ]}
            >
              {i < stepIndex ? (
                <Feather name="check" size={8} color={colors.primaryForeground} />
              ) : null}
            </View>
          </View>
        ))}
      </View>

      {step === "category" ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.stepHint, { color: colors.mutedForeground }]}>
            Кто нарушил?
          </Text>
          {categories.map((catId) => (
            <Pressable
              key={catId}
              testID={`category-${catId}`}
              onPress={() => handlePickCategory(catId)}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: colors.card,
                  borderColor:
                    selectedCategory === catId ? colors.primary : colors.border,
                  borderWidth: selectedCategory === catId ? 2 : 1,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.catIconBox,
                  {
                    backgroundColor:
                      ((CATEGORY_COLORS as Record<string, string>)[catId] ?? "#888") + "22",
                  },
                ]}
              >
                <CategoryIcon category={catId as any} size={22} />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: colors.foreground }]}>
                  {CATEGORY_LABELS[catId]}
                </Text>
                <Text style={[styles.optionDesc, { color: colors.mutedForeground }]}>
                  {CATEGORY_DESC[catId]}
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </ScrollView>
      ) : step === "provider" ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.breadcrumb}>
            <CategoryIcon category={selectedCategory as any} size={14} />
            <Text style={[styles.breadcrumbText, { color: colors.mutedForeground }]}>
              {CATEGORY_LABELS[selectedCategory]}
            </Text>
          </View>
          <Text style={[styles.stepHint, { color: colors.mutedForeground }]}>
            Выберите сервис или бренд
          </Text>
          {providers.map((p) => (
            <Pressable
              key={p.id}
              testID={`provider-${p.id}`}
              onPress={() => handlePickProvider(p.id, p.label)}
              style={({ pressed }) => [
                styles.providerCard,
                {
                  backgroundColor: colors.card,
                  borderColor:
                    selectedProvider?.id === p.id ? colors.primary : colors.border,
                  borderWidth: selectedProvider?.id === p.id ? 2 : 1,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.providerLabel, { color: colors.foreground }]}>
                {p.label}
              </Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </ScrollView>
      ) : step === "details" ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.breadcrumb}>
            <CategoryIcon category={selectedCategory as any} size={14} />
            <Text style={[styles.breadcrumbText, { color: colors.mutedForeground }]}>
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
            Место нарушения{" "}
            <Text style={styles.optionalTag}>(необязательно)</Text>
          </Text>

          <Pressable
            onPress={handleLocate}
            disabled={locating}
            style={[
              styles.locationBtn,
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
                styles.locationLabel,
                { color: geo ? colors.primary : colors.mutedForeground },
              ]}
              numberOfLines={1}
            >
              {geo
                ? address || `${geo.lat.toFixed(5)}, ${geo.lng.toFixed(5)}`
                : "Определить моё местоположение"}
            </Text>
            {geo ? (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setGeo(null);
                  setAddress("");
                }}
              >
                <Feather name="x" size={16} color={colors.mutedForeground} />
              </Pressable>
            ) : null}
          </Pressable>

          <Pressable
            onPress={() => {
              if (!description.trim()) {
                Alert.alert("Нужно описание", "Опишите нарушение, чтобы продолжить");
                return;
              }
              setStep("review");
            }}
            style={[
              styles.nextBtn,
              {
                backgroundColor: description.trim() ? colors.primary : colors.muted,
              },
            ]}
          >
            <Text
              style={[
                styles.nextBtnLabel,
                {
                  color: description.trim()
                    ? colors.primaryForeground
                    : colors.mutedForeground,
                },
              ]}
            >
              Проверить жалобу →
            </Text>
          </Pressable>
        </ScrollView>
      ) : step === "review" ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.stepHint, { color: colors.mutedForeground }]}>
            Проверьте перед отправкой
          </Text>

          <View style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.reviewRow}>
              <Text style={[styles.reviewLabel, { color: colors.mutedForeground }]}>
                КАТЕГОРИЯ
              </Text>
              <Text style={[styles.reviewValue, { color: colors.foreground }]}>
                {CATEGORY_LABELS[selectedCategory]}
              </Text>
            </View>
            <View style={[styles.reviewDivider, { backgroundColor: colors.border }]} />
            <View style={styles.reviewRow}>
              <Text style={[styles.reviewLabel, { color: colors.mutedForeground }]}>
                СЕРВИС
              </Text>
              <Text style={[styles.reviewValue, { color: colors.foreground }]}>
                {selectedProvider?.label}
              </Text>
            </View>
            <View style={[styles.reviewDivider, { backgroundColor: colors.border }]} />
            <View style={styles.reviewRow}>
              <Text style={[styles.reviewLabel, { color: colors.mutedForeground }]}>
                ОПИСАНИЕ
              </Text>
              <Text style={[styles.reviewValueBody, { color: colors.foreground }]}>
                {description}
              </Text>
            </View>
            {geo ? (
              <>
                <View style={[styles.reviewDivider, { backgroundColor: colors.border }]} />
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: colors.mutedForeground }]}>
                    МЕСТО
                  </Text>
                  <Text style={[styles.reviewValue, { color: colors.foreground }]}>
                    {address || `${geo.lat.toFixed(5)}, ${geo.lng.toFixed(5)}`}
                  </Text>
                </View>
              </>
            ) : null}
            {photoUri ? (
              <>
                <View style={[styles.reviewDivider, { backgroundColor: colors.border }]} />
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: colors.mutedForeground }]}>
                    ФОТО
                  </Text>
                  <View style={styles.reviewPhotoThumb}>
                    <Feather name="image" size={14} color={colors.primary} />
                    <Text style={[styles.reviewValue, { color: colors.primary }]}>
                      Прикреплено
                    </Text>
                  </View>
                </View>
              </>
            ) : null}
          </View>

          <Pressable
            testID="submit-report-btn"
            onPress={handleSubmit}
            disabled={isPending}
            style={[
              styles.submitBtn,
              { backgroundColor: colors.primary, opacity: isPending ? 0.8 : 1 },
            ]}
          >
            {isPending ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <>
                <Text style={[styles.submitLabel, { color: colors.primaryForeground }]}>
                  ОТПРАВИТЬ ЖАЛОБУ
                </Text>
                <Feather name="send" size={18} color={colors.primaryForeground} />
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => setStep("details")}
            style={[styles.editBtn, { borderColor: colors.border }]}
          >
            <Text style={[styles.editBtnLabel, { color: colors.foreground }]}>
              ← Изменить
            </Text>
          </Pressable>
        </ScrollView>
      ) : null}
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
    gap: 8,
  },
  headerBtn: {
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
    fontSize: 15,
    letterSpacing: 1,
  },
  headerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 1,
  },
  progressTrack: {
    height: 3,
    width: "100%",
  },
  progressFill: {
    height: 3,
  },
  stepDotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
  },
  stepDotWrap: {
    alignItems: "center",
  },
  stepDot: {
    height: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  breadcrumbText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  stepHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    marginBottom: 2,
  },
  optionalTag: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  catIconBox: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
    gap: 3,
  },
  optionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  optionDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 10,
  },
  providerLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    flex: 1,
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
    fontSize: 11,
    textAlign: "right",
    marginTop: -4,
  },
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  locationLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    flex: 1,
  },
  nextBtn: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  nextBtnLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  reviewCard: {
    borderWidth: 1,
    gap: 0,
  },
  reviewRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
  },
  reviewLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  reviewValue: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
  },
  reviewValueBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  reviewDivider: {
    height: 1,
    marginHorizontal: 0,
  },
  reviewPhotoThumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    marginTop: 4,
  },
  submitLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  editBtn: {
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  editBtnLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  doneContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    gap: 16,
  },
  doneIconWrap: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  doneTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  doneText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  doneSummary: {
    borderWidth: 1,
    padding: 14,
    alignSelf: "stretch",
    gap: 8,
  },
  doneSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  doneSummaryText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  doneBtn: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: 4,
  },
  doneBtnLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  doneSecondary: {
    paddingVertical: 10,
  },
  doneSecondaryLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },

  photoTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  photoTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    letterSpacing: 1,
    color: "#fff",
    flex: 1,
  },
  photoClose: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  photoFallbackCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  photoFallbackTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    opacity: 0.8,
  },
  photoFallbackBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 4,
  },
  photoFallbackBtnLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  photoBottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingVertical: 32,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  photoSkip: {
    width: 80,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  photoSkipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
  },
  photoShutter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },
  photoShutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.15)",
  },
  photoLibBtn: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});
