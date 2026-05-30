import { Stack } from "expo-router";
import { QueryClient } from "@tanstack/react-query";
import { useColorScheme } from "react-native";
import { useEffect } from "react";
import { Providers } from "@/shared/providers";
import { mangaLibraryDir } from "@/shared/config";

const queryClient = new QueryClient();

export default function RootLayout() {
  const scheme = useColorScheme();
  const background = scheme === "dark" ? "#000000" : "#ffffff";

  useEffect(() => {
    if (!mangaLibraryDir.exists) {
      mangaLibraryDir.create({ intermediates: true });
    }
  }, []);

  return (
    <Providers client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="manga/[id]"
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerBackButtonDisplayMode: "minimal",
            headerBackButtonMenuEnabled: true,
            contentStyle: { backgroundColor: background },
          }}
        />
      </Stack>
    </Providers>
  );
}
