import { Stack } from "expo-router";
import { QueryClient } from "@tanstack/react-query";
import { Providers } from "./_providers";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <Providers client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}
