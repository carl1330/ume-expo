import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from "expo-router";
import { QueryClient } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SQLiteProvider } from "expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { db, expoDb, DATABASE_NAME } from "@/shared/lib";
import migrations from "@db/migrations";
import { Providers } from "@/shared/providers";
import { mangaLibraryDir } from "@/shared/config";
import { useColors } from "@/shared/config";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colors = useColors();
  const scheme = useColorScheme();

  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expoDb);

  useEffect(() => {
    if (!mangaLibraryDir.exists) {
      mangaLibraryDir.create({ intermediates: true });
    }
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  const navTheme = scheme === "dark" ? DarkTheme : DefaultTheme;
  const theme = {
    ...navTheme,
    colors: { ...navTheme.colors, background: colors.background },
  };

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
          padding: 16,
        }}
      >
        <Text style={{ color: colors.textPrimary }}>
          Migration failed: {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.textPrimary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Suspense
        fallback={
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.background,
            }}
          >
            <ActivityIndicator size="large" color={colors.textPrimary} />
          </View>
        }
      >
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense
        >
          <Providers client={queryClient}>
            <ThemeProvider value={theme}>
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
                <Stack.Screen
                  name="reader/[mangaId]/[volumeUuid]"
                  options={{
                    headerShown: false,
                    headerTransparent: true,
                  }}
                />
              </Stack>
            </ThemeProvider>
          </Providers>
        </SQLiteProvider>
      </Suspense>
    </GestureHandlerRootView>
  );
}
