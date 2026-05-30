import { mangaQueries, useImportMangaDirectory } from "@/entities/manga";
import { findMangaByMalId } from "@/shared/api";
import { SafeScreen, Text } from "@/shared/ui";
import { spacing } from "@/shared/config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { MangaHeader } from "./MangaHeader";

export function RemoteMangaDetails({ malId }: { malId: number }) {
  const queryClient = useQueryClient();

  const { data: existingLocalId } = useQuery({
    queryKey: ["manga", "findByMalId", malId],
    queryFn: () => findMangaByMalId(malId),
  });

  useEffect(() => {
    if (existingLocalId) {
      router.replace(`/manga/${existingLocalId}`);
    }
  }, [existingLocalId]);

  const { data: manga, isLoading } = useQuery(mangaQueries.detail(malId));
  const { importDirectory, status, error, importedId } =
    useImportMangaDirectory();

  useEffect(() => {
    if (status === "success" && importedId) {
      queryClient.invalidateQueries({
        queryKey: ["manga", "findByMalId", malId],
      });
    }
  }, [status, importedId, malId, queryClient]);

  useEffect(() => {
    if (status === "error" && error) {
      Alert.alert("Import failed", error);
    }
  }, [status, error]);

  const importing = status === "validating" || status === "importing";

  if (isLoading) {
    return (
      <SafeScreen>
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      </SafeScreen>
    );
  }

  if (!manga) return <Text>An error occurred</Text>;

  return (
    <SafeScreen>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={importing ? "hourglass" : "plus"}
          accessibilityLabel="Import volumes"
          disabled={importing}
          onPress={importDirectory}
        />
      </Stack.Toolbar>
      <ScrollView contentContainerStyle={styles.content}>
        <MangaHeader manga={manga} />
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    gap: spacing.lg,
  },
});
