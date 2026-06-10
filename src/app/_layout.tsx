import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from "expo-router";
import { QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Providers } from "@/shared/providers";
import { mangaLibraryDir } from "@/shared/config";
import { useColors } from "@/shared/config";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colors = useColors();
  const scheme = useColorScheme();

  useEffect(() => {
    if (!mangaLibraryDir.exists) {
      mangaLibraryDir.create({ intermediates: true });
    }
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers client={queryClient}>
        <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="manga/[id]"
              options={{
                headerTransparent: true,
                headerTitle: "",
                headerBackButtonDisplayMode: "minimal",
                headerBackButtonMenuEnabled: true,
              }}
            />
            <Stack.Screen
              name="manga/edit/[id]"
              options={{
                presentation: "formSheet",
                headerShown: true,
                gestureEnabled: true,
                sheetGrabberVisible: true,
                sheetAllowedDetents: [1.0],
              }}
            />
          </Stack>
        </ThemeProvider>
      </Providers>
    </GestureHandlerRootView>
  );
}
