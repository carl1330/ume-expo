import { Stack } from "expo-router";
import { QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import * as SystemUI from "expo-system-ui";
import { Providers } from "@/shared/providers";
import { mangaLibraryDir } from "@/shared/config";
import { useColors } from "@/shared/config/theme";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colors = useColors();

  useEffect(() => {
    if (!mangaLibraryDir.exists) {
      mangaLibraryDir.create({ intermediates: true });
    }
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return (
    <Providers client={queryClient}>
      <Stack
        screenOptions={{ contentStyle: { backgroundColor: colors.background } }}
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
    </Providers>
  );
}
