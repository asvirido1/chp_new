import { Feather } from "@expo/vector-icons";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  InputAccessoryView,
  Keyboard,
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
import { useUser } from "@/context/UserContext";
import { useColors } from "@/hooks/useColors";
import Constants from "expo-constants";
import { getSupabaseClient } from "@/lib/supabase";
import {
  invokeVoiceNoteTranscription,
  type VoiceNoteAsset,
  uploadVoiceNoteToStorage,
} from "@/lib/voice-notes";
import { useCreateReport } from "@workspace/api-client-react";

type Step = "photo" | "details" | "category" | "provider" | "review" | "done";

const STEP_ORDER: Step[] = ["photo", "details", "category", "provider", "review"];

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
  details: "Что случилось",
  category: "Категория",
  provider: "Сервис",
  review: "Проверка",
  done: "",
};

function isLoopbackApiHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

function resolveExpoApiBaseUrlForFetch(): string | null {
  const rawBase = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const hostRaw =
    process.env.EXPO_PUBLIC_API_HOST?.trim() || process.env.EXPO_PUBLIC_DOMAIN?.trim();

  let base: string | null = null;
  if (rawBase) {
    base = rawBase.replace(/\/+$/, "");
  } else if (hostRaw) {
    const host = hostRaw.replace(/^https?:\/\//, "").split("/")[0]?.trim();
    if (host) {
      base = `https://${host}`;
    }
  }

  if (!base) {
    return null;
  }

  if (Platform.OS === "web") {
    return base;
  }

  const isDev =
    typeof __DEV__ !== "undefined"
      ? __DEV__
      : process.env.NODE_ENV !== "production";

  if (!isDev) {
    return base;
  }

  try {
    const parsed = new URL(
      base.startsWith("http://") || base.startsWith("https://") ? base : `https://${base}`,
    );

    if (!isLoopbackApiHost(parsed.hostname)) {
      return base;
    }

    const uri = Constants.expoConfig?.hostUri;
    const devHost = uri?.split(":")[0]?.trim();
    if (!devHost || isLoopbackApiHost(devHost)) {
      return base;
    }

    parsed.hostname = devHost;
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return base;
  }
}

function resolveApiBaseUrl(): string {
  const base = resolveExpoApiBaseUrlForFetch();
  if (!base) {
    throw new Error("API base URL is not configured");
  }
  return base;
}

async function getSupabaseAccessToken() {
  const {
    data: { session },
  } = await getSupabaseClient().auth.getSession();
  return session?.access_token ?? null;
}

function inferUploadMimeType(uri: string) {
  const normalized = uri.toLowerCase();
  if (normalized.endsWith(".png")) return "image/png";
  if (normalized.endsWith(".webp")) return "image/webp";
  if (normalized.endsWith(".heic")) return "image/heic";
  if (normalized.endsWith(".heif")) return "image/heif";
  return "image/jpeg";
}

type PickedPhoto = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  file?: File | null;
};

type TranscriptUiStatus = "idle" | "uploading" | "transcribing" | "done" | "error";

async function appendFileToFormData(
  formData: FormData,
  fieldName: string,
  file: PickedPhoto,
  fallbackFileName: string,
  fallbackMimeType: string,
) {
  const mimeType = file.file?.type || file.mimeType || fallbackMimeType;
  const fileName = file.fileName?.trim() || fallbackFileName;

  if (Platform.OS === "web") {
    const blob: Blob =
      file.file ??
      (await fetch(file.uri)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to read selected file: ${response.status}`);
          }
          return response.blob();
        })
        .then((value) => (value.type === mimeType ? value : value.slice(0, value.size, mimeType))));

    formData.append(fieldName, blob, fileName);
    return;
  }

  formData.append(fieldName, {
    uri: file.uri,
    name: fileName,
    type: mimeType,
  } as any);
}

function toPickedPhoto(
  asset: PickedPhoto | (ImagePicker.ImagePickerAsset & { file?: File | null }),
): PickedPhoto {
  return {
    uri: asset.uri,
    fileName: asset.fileName ?? null,
    mimeType: asset.mimeType ?? null,
    file: typeof File !== "undefined" && asset.file instanceof File ? asset.file : null,
  };
}

async function uploadReportPhoto(reportId: string, photo: PickedPhoto) {
  const formData = new FormData();
  const fallbackMimeType = inferUploadMimeType(photo.uri);
  const extension = (photo.file?.type || photo.mimeType || fallbackMimeType).split("/")[1] || "jpg";
  formData.append("mediaType", "photo");
  await appendFileToFormData(
    formData,
    "file",
    photo,
    `report-photo.${extension}`,
    fallbackMimeType,
  );

  const accessToken = await getSupabaseAccessToken();
  if (!accessToken) {
    throw new Error("Auth session is not ready");
  }

  const response = await fetch(`${resolveApiBaseUrl()}/api/reports/${reportId}/media/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Upload failed with status ${response.status}`);
  }
}

function formatRecordingDuration(durationMillis: number) {
  const totalSeconds = Math.max(0, Math.round(durationMillis / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function NewReportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userId, session, isLoading: isAuthLoading } = useUser();
  const { mutateAsync: createReport, isPending: isCreatingReport } = useCreateReport();

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
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [voiceNote, setVoiceNote] = useState<VoiceNoteAsset | null>(null);
  const [voiceNotePath, setVoiceNotePath] = useState<string | null>(null);
  const [transcriptRaw, setTranscriptRaw] = useState<string | null>(null);
  const [transcriptClean, setTranscriptClean] = useState<string | null>(null);
  const [transcriptStatus, setTranscriptStatus] = useState<TranscriptUiStatus>("idle");
  const [transcriptLanguage, setTranscriptLanguage] = useState<string | null>(null);
  const [transcriptProvider, setTranscriptProvider] = useState<string | null>(null);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [showTranscriptActions, setShowTranscriptActions] = useState(false);
  const autoLocateRequestedRef = useRef(false);

  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const stepIndex = STEP_ORDER.indexOf(step);
  const progress = (stepIndex + 1) / STEP_ORDER.length;
  const isVoiceBusy = transcriptStatus === "uploading" || transcriptStatus === "transcribing";
  const isSubmittingReport = isCreatingReport;
  const isAuthReady = Boolean(session?.access_token && userId);

  const finalDescription = description.trim() || transcriptClean?.trim() || "";
  const canSubmit =
    Boolean(finalDescription) &&
    Boolean(selectedCategory) &&
    Boolean(selectedProvider) &&
    !isSubmittingReport &&
    !isAuthLoading &&
    isAuthReady;

  const categories = Object.keys(PROVIDERS_BY_CATEGORY);
  const providers = selectedCategory ? (PROVIDERS_BY_CATEGORY[selectedCategory] ?? []) : [];

  const takePicture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) {
        setPhoto({ uri: photo.uri });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setStep("details");
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
      setPhoto(toPickedPhoto(result.assets[0] as ImagePicker.ImagePickerAsset & { file?: File | null }));
      setStep("details");
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(toPickedPhoto(result.assets[0] as ImagePicker.ImagePickerAsset & { file?: File | null }));
      setStep("details");
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
    setStep("review");
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

  React.useEffect(() => {
    if (step !== "details" || geo || locating || autoLocateRequestedRef.current) {
      return;
    }

    autoLocateRequestedRef.current = true;
    void handleLocate();
  }, [geo, locating, step]);

  const buildReportPayload = (descriptionValue: string) => ({
    isAnonymous: false,
    category: selectedCategory as any,
    providerId: selectedProvider!.id,
    description: descriptionValue,
    voiceNotePath: voiceNotePath || undefined,
    transcriptRaw: transcriptRaw || undefined,
    transcriptClean: transcriptClean || undefined,
    transcriptStatus,
    transcriptLanguage: transcriptLanguage || undefined,
    transcriptProvider: transcriptProvider || undefined,
    transcriptError: transcriptError || undefined,
    deviceGeo: geo ?? undefined,
    addressText: address || undefined,
    deviceContext: {
      platform: Platform.OS,
      appVersion: "1.0.0",
    },
  });

  const resetVoiceTranscriptState = () => {
    setVoiceNotePath(null);
    setTranscriptRaw(null);
    setTranscriptClean(null);
    setTranscriptStatus("idle");
    setTranscriptLanguage(null);
    setTranscriptProvider(null);
    setTranscriptError(null);
    setShowTranscriptActions(false);
  };

  const applyTranscriptToDescription = (mode: "replace" | "append") => {
    if (!transcriptClean) {
      return;
    }

    setDescription((current) => {
      if (mode === "replace") {
        return transcriptClean;
      }

      return current.trim() ? `${current.trim()}\n\n${transcriptClean}` : transcriptClean;
    });
    setShowTranscriptActions(false);
  };

  const processVoiceNote = async (asset: VoiceNoteAsset) => {
    setVoiceNote(asset);
    setVoiceNotePath(null);
    setTranscriptRaw(null);
    setTranscriptClean(null);
    setTranscriptLanguage(null);
    setTranscriptProvider(null);
    setTranscriptError(null);
    setShowTranscriptActions(false);
    setTranscriptStatus("uploading");

    let phase: "upload" | "transcribe" = "upload";

    try {
      if (!isAuthReady) {
        throw new Error("Пользовательская сессия ещё не готова. Попробуйте ещё раз.");
      }

      const upload = await uploadVoiceNoteToStorage({
        asset,
        userId,
      });

      setVoiceNotePath(upload.storagePath);
      setTranscriptStatus("transcribing");
      phase = "transcribe";

      const transcript = await invokeVoiceNoteTranscription({
        storagePath: upload.storagePath,
      });

      setTranscriptRaw(transcript.transcriptRaw);
      setTranscriptClean(transcript.transcriptClean);
      setTranscriptLanguage(transcript.transcriptLanguage);
      setTranscriptProvider(transcript.transcriptProvider);
      setTranscriptError(transcript.transcriptError);
      setTranscriptStatus(transcript.transcriptStatus === "error" ? "error" : "done");

      if (!transcript.transcriptClean) {
        setTranscriptStatus("error");
        setTranscriptError("Ничего не распознано. Попробуйте записать сообщение ещё раз.");
        Alert.alert("Ничего не распознано", "Попробуйте записать сообщение ещё раз");
        return;
      }

      const recognized = transcript.transcriptClean;
      setDescription((current) => {
        const t = current.trim();
        if (!t) return recognized;
        return `${t}\n\n${recognized}`;
      });
      setShowTranscriptActions(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось распознать голосовое сообщение";
      console.error(phase === "upload" ? "voice_upload_failed" : "voice_transcription_failed", error);
      setTranscriptStatus("error");
      setTranscriptError(message);
      Alert.alert("Ошибка", message);
    }
  };

  const handlePickVoiceFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      const asset = result.assets[0];
      const pickedAsset = asset as typeof asset & { file?: File | null };
      await processVoiceNote({
        uri: asset.uri,
        fileName: asset.name ?? null,
        mimeType: asset.mimeType ?? null,
        file:
          typeof File !== "undefined" && pickedAsset.file instanceof File ? pickedAsset.file : null,
      });
    } catch (error) {
      Alert.alert(
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось прикрепить голосовой файл",
      );
    }
  };

  const handleStartVoiceRecording = async () => {
    try {
      if (!isAuthReady) {
        Alert.alert("Подождите", "Сначала дождитесь инициализации пользовательской сессии.");
        return;
      }
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Микрофон", "Разрешите доступ к микрофону, чтобы надиктовать жалобу");
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      Alert.alert("Ошибка", "Не удалось начать запись");
    }
  };

  const handleStopVoiceRecording = async () => {
    try {
      await audioRecorder.stop();
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      const uri = audioRecorder.uri;
      if (!uri) {
        throw new Error("Recording URI is missing");
      }

      await processVoiceNote({
        uri,
        fileName: uri.split("/").pop()?.trim() || "voice-note.m4a",
        mimeType: "audio/mp4",
      });
    } catch (error) {
      Alert.alert(
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось распознать голосовое сообщение",
      );
    }
  };

  const handleSubmit = async () => {
    if (!finalDescription) {
      Alert.alert("Нужно описание", "Опишите, что случилось, текстом или голосом");
      return;
    }
    if (!selectedCategory || !selectedProvider) {
      Alert.alert("Не хватает данных", "Выберите категорию и сервис");
      return;
    }

    try {
      if (!isAuthReady) {
        Alert.alert("Подождите", "Сначала дождитесь инициализации пользовательской сессии.");
        return;
      }

      const report = await createReport({
        data: buildReportPayload(finalDescription),
      });

      let mediaUploadFailed = false;
      if (photo && report?.id) {
        try {
          await uploadReportPhoto(report.id, photo);
        } catch {
          mediaUploadFailed = true;
        }
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStep("done");
      if (mediaUploadFailed) {
        Alert.alert(
          "Фото не загрузилось",
          "Жалоба создана, но фото не удалось загрузить. Можно проверить обращение в админке и повторить позже.",
        );
      }
    } catch (error) {
      console.error("report_submit_failed", error);
      const message =
        error instanceof Error ? error.message : "Не удалось отправить жалобу";
      Alert.alert("Ошибка отправки", message);
    }
  };

  const goBack = () => {
    if (step === "photo") {
      router.back();
    } else if (step === "details") {
      autoLocateRequestedRef.current = false;
      setStep("photo");
    } else if (step === "category") {
      setStep("details");
      setSelectedCategory("");
      setSelectedProvider(null);
    } else if (step === "provider") {
      setStep("category");
      setSelectedProvider(null);
    } else if (step === "review") {
      setStep("provider");
    } else {
      router.back();
    }
  };

  React.useEffect(() => {
    if (step !== "done") return;
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 3000);
    return () => clearTimeout(timer);
  }, [step]);

  if (step === "done") {
    return (
      <View
        style={[styles.container, styles.doneContainer, { backgroundColor: colors.background }]}
      >
        <View style={[styles.doneIconWrap, { backgroundColor: colors.primary }]}>
          <Feather name="check" size={44} color={colors.primaryForeground} />
        </View>
        <Text style={[styles.doneTitle, { color: colors.foreground }]}>
          Чпок зафиксирован!
        </Text>
        <Text style={[styles.doneText, { color: colors.mutedForeground }]}>
          Спасибо тебе, о неравнодушный человек!
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
            Моя история
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
            setPhoto(null);
            autoLocateRequestedRef.current = false;
            setVoiceNote(null);
            resetVoiceTranscriptState();
          }}
          style={styles.doneSecondary}
        >
          <Text style={[styles.doneSecondaryLabel, { color: colors.mutedForeground }]}>
            Зафиксировать ещё
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
            <Pressable onPress={() => setStep("details")} style={styles.photoSkip}>
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
          {selectedCategory && selectedProvider ? (
            <View style={styles.breadcrumb}>
              <CategoryIcon category={selectedCategory as any} size={14} />
              <Text style={[styles.breadcrumbText, { color: colors.mutedForeground }]}>
                {CATEGORY_LABELS[selectedCategory]} · {selectedProvider.label}
              </Text>
            </View>
          ) : null}

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
            inputAccessoryViewID={Platform.OS === "ios" ? "descriptionDoneBar" : undefined}
          />
          {Platform.OS === "ios" ? (
            <InputAccessoryView nativeID="descriptionDoneBar">
              <View
                style={[
                  styles.keyboardBar,
                  { backgroundColor: colors.card, borderTopColor: colors.border },
                ]}
              >
                <Pressable onPress={() => Keyboard.dismiss()} style={styles.keyboardBarBtn}>
                  <Text style={[styles.keyboardBarLabel, { color: colors.primary }]}>
                    Готово
                  </Text>
                </Pressable>
              </View>
            </InputAccessoryView>
          ) : null}
          <Text style={[styles.charCount, { color: colors.mutedForeground }]}>
            {description.length}/1000
          </Text>

          <Text style={[styles.stepHint, { color: colors.mutedForeground }]}>
            Голосовое описание
          </Text>

          <View
            style={[
              styles.voiceCard,
              {
                backgroundColor: colors.card,
                borderColor:
                  transcriptStatus === "error"
                    ? "#DC2626"
                    : recorderState.isRecording
                      ? "#DC2626"
                      : transcriptStatus === "done"
                        ? colors.primary
                        : colors.border,
              },
            ]}
          >
            <Text style={[styles.voiceTitle, { color: colors.foreground }]}>
              Надиктуйте описание голосом
            </Text>
            <Text style={[styles.voiceBody, { color: colors.mutedForeground }]}>
              Можно записать сообщение или прикрепить готовый аудиофайл. Расшифровка появится здесь и станет черновиком описания.
            </Text>

            <View style={styles.voiceActions}>
              <Pressable
                onPress={recorderState.isRecording ? handleStopVoiceRecording : handleStartVoiceRecording}
                disabled={isVoiceBusy}
                style={({ pressed }) => [
                  styles.voiceButton,
                  styles.voicePrimaryButton,
                  {
                    backgroundColor: recorderState.isRecording ? "#DC2626" : colors.primary,
                    opacity: pressed || isVoiceBusy ? 0.86 : 1,
                  },
                ]}
              >
                {isVoiceBusy ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <>
                    <Feather
                      name={recorderState.isRecording ? "stop-circle" : "mic"}
                      size={18}
                      color={colors.primaryForeground}
                    />
                    <Text style={[styles.voiceButtonLabel, { color: colors.primaryForeground }]}>
                      {recorderState.isRecording ? "Остановить" : "Записать"}
                    </Text>
                  </>
                )}
              </Pressable>

              <Pressable
                onPress={handlePickVoiceFile}
                disabled={isVoiceBusy || recorderState.isRecording}
                style={({ pressed }) => [
                  styles.voiceButton,
                  styles.voiceSecondaryButton,
                  {
                    borderColor: colors.border,
                    opacity: pressed || isVoiceBusy || recorderState.isRecording ? 0.86 : 1,
                  },
                ]}
              >
                <Feather name="paperclip" size={16} color={colors.foreground} />
                <Text style={[styles.voiceButtonLabel, { color: colors.foreground }]}>
                  Прикрепить файл
                </Text>
              </Pressable>
            </View>

            {voiceNotePath ? (
              <View style={[styles.voiceMetaCard, { borderColor: colors.border }]}>
                <Feather
                  name={transcriptStatus === "done" ? "check-circle" : "music"}
                  size={16}
                  color={transcriptStatus === "done" ? colors.primary : colors.mutedForeground}
                />
                <Text style={[styles.voiceMetaText, { color: colors.foreground }]} numberOfLines={2}>
                  {voiceNote?.fileName?.trim() || "Голосовое описание прикреплено"}
                </Text>
                {!isVoiceBusy ? (
                  <Pressable
                    onPress={() => {
                      setVoiceNote(null);
                      resetVoiceTranscriptState();
                    }}
                    style={styles.voiceMetaRemove}
                  >
                    <Feather name="x" size={16} color={colors.mutedForeground} />
                  </Pressable>
                ) : null}
              </View>
            ) : null}

            <Text style={[styles.voiceHint, { color: colors.mutedForeground }]}>
              {transcriptStatus === "uploading"
                ? "Загружаем голосовое сообщение..."
                : transcriptStatus === "transcribing"
                  ? "Распознаём речь..."
                  : transcriptStatus === "done"
                    ? transcriptClean
                      ? "Транскрипт готов. Проверьте текст ниже."
                      : "Файл обработан, но текст не распознан."
                    : transcriptStatus === "error"
                      ? transcriptError || "Не удалось распознать голосовое сообщение."
                : recorderState.isRecording
                  ? `Идёт запись: ${formatRecordingDuration(recorderState.durationMillis)}`
                  : "Если описание пустое, транскрипт подставится автоматически"}
            </Text>

            {transcriptClean && showTranscriptActions ? (
              <View style={styles.transcriptActions}>
                <Pressable
                  onPress={() => applyTranscriptToDescription("replace")}
                  style={[
                    styles.transcriptActionButton,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.transcriptActionButtonLabel,
                      { color: colors.primaryForeground },
                    ]}
                  >
                    Подставить транскрипт
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => applyTranscriptToDescription("append")}
                  style={[
                    styles.transcriptActionButton,
                    styles.transcriptGhostButton,
                    { borderColor: colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.transcriptActionButtonLabel,
                      { color: colors.foreground },
                    ]}
                  >
                    Добавить к тексту
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>

          <Text style={[styles.stepHint, { color: colors.mutedForeground }]}>
            Место нарушения
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
              {locating
                ? "Определяем местоположение..."
                : geo
                ? address || `${geo.lat.toFixed(5)}, ${geo.lng.toFixed(5)}`
                : "Определить местоположение"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (isVoiceBusy) {
                Alert.alert(
                  "Подождите",
                  "Сначала дождитесь завершения загрузки и распознавания голосового описания.",
                );
                return;
              }
              const hasDetailsContent = Boolean(description.trim() || transcriptClean?.trim());
              if (!hasDetailsContent) {
                Alert.alert(
                  "Нужно описание",
                  "Опишите, что случилось, текстом или голосом",
                );
                return;
              }
              setStep("category");
            }}
            style={[
              styles.nextBtn,
              {
                backgroundColor:
                  description.trim() || transcriptClean?.trim() ? colors.primary : colors.muted,
              },
            ]}
          >
            <Text
              style={[
                styles.nextBtnLabel,
                {
                  color:
                    description.trim() || transcriptClean?.trim()
                      ? colors.primaryForeground
                      : colors.mutedForeground,
                },
              ]}
            >
              Далее →
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
                {description.trim() || transcriptClean || ""}
              </Text>
            </View>
            {voiceNotePath ? (
              <>
                <View style={[styles.reviewDivider, { backgroundColor: colors.border }]} />
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: colors.mutedForeground }]}>
                    ГОЛОС
                  </Text>
                  <Text style={[styles.reviewValueBody, { color: colors.foreground }]}>
                    {transcriptStatus === "done"
                      ? "Голосовое описание распознано и сохранится вместе с жалобой."
                      : transcriptStatus === "error"
                        ? "Голосовой файл сохранится, но транскрипт завершился ошибкой."
                        : "Голосовой файл прикреплён."}
                  </Text>
                </View>
              </>
            ) : null}
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
            {photo ? (
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
            disabled={!canSubmit}
            style={[
              styles.submitBtn,
              {
                backgroundColor: colors.primary,
                opacity: !canSubmit ? 0.65 : 1,
              },
            ]}
          >
            {isSubmittingReport || isAuthLoading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <>
                <Text style={[styles.submitLabel, { color: colors.primaryForeground }]}>
                  ОТПРАВИТЬ
                </Text>
                <Feather name="send" size={18} color={colors.primaryForeground} />
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => setStep("provider")}
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
  voiceCard: {
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  voiceTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  voiceBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  voiceActions: {
    flexDirection: "row",
    gap: 10,
  },
  voiceButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
  },
  voicePrimaryButton: {
    flex: 1,
  },
  voiceSecondaryButton: {
    flex: 1,
    borderWidth: 1,
  },
  voiceButtonLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  voiceMetaCard: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  voiceMetaText: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    lineHeight: 18,
  },
  voiceMetaRemove: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  voiceHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  transcriptActions: {
    flexDirection: "row",
    gap: 8,
  },
  transcriptActionButton: {
    minHeight: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  transcriptGhostButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  transcriptActionButtonLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
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
  keyboardBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  keyboardBarBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  keyboardBarLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
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
