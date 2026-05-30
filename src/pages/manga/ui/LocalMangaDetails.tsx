import {
  localMangaQueries,
  useImportMangaDirectory,
  volumeQueries,
} from "@/entities/manga";
import { EditMetadataSheet } from "./EditMetadataSheet";
import { SafeScreen, Text } from "@/shared/ui";
import { spacing } from "@/shared/config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { MangaHeader } from "./MangaHeader";
import { VolumeCarousel } from "./VolumeCarousel";

export function LocalMangaDetails({ localId }: { localId: string }) {
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const { data: manga, isLoading } = useQuery(
    localMangaQueries.metadata(localId),
  );
  const { importDirectory, status, error, importedId } =
    useImportMangaDirectory(localId);

  useEffect(() => {
    if (status === "success" && importedId) {
      queryClient.invalidateQueries({
        queryKey: volumeQueries.byManga(localId).queryKey,
      });
    }
  }, [status, importedId, localId, queryClient]);

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

  if (!manga) return <Text>Manga not found</Text>;

  return (
    <SafeScreen>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="square.and.pencil"
          accessibilityLabel="Edit metadata"
          onPress={() => setEditOpen(true)}
          separateBackground
        />
        <Stack.Toolbar.Button
          icon={importing ? "hourglass" : "plus"}
          accessibilityLabel="Import volumes"
          disabled={importing}
          onPress={importDirectory}
        />
      </Stack.Toolbar>
      <ScrollView contentContainerStyle={styles.content}>
        <MangaHeader manga={manga} />
        <VolumeCarousel mangaId={localId} />
      </ScrollView>
      <EditMetadataSheet
        manga={manga}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
      />
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
