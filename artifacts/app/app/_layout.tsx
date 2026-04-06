import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { setBaseUrl } from "@workspace/api-client-react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { UserProvider } from "@/context/UserContext";

/** API origin for customFetch. Prefer EXPO_PUBLIC_API_BASE_URL (any scheme); else host-only with HTTPS. */
function resolveExpoApiBaseUrl(): string | null {
  const rawBase = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (rawBase) {
    return rawBase.replace(/\/+$/, "");
  }
  const hostRaw =
    process.env.EXPO_PUBLIC_API_HOST?.trim() ||
    process.env.EXPO_PUBLIC_DOMAIN?.trim();
  if (!hostRaw) {
    return null;
  }
  const host = hostRaw.replace(/^https?:\/\//, "").split("/")[0]?.trim();
  if (!host) {
    return null;
  }
  return `https://${host}`;
}

setBaseUrl(resolveExpoApiBaseUrl());

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Never propagate query errors as render-level exceptions.
      // All network/API errors are captured in the `isError` flag of each
      // hook and rendered as in-screen error states, not via the ErrorBoundary.
      throwOnError: false,
    },
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="new-report"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="report/[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <GestureHandlerRootView>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </UserProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
