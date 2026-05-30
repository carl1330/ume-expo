import {
  localMangaQueries,
  MangaCard,
  useImportMangaDirectory,
} from "@/entities/manga";
import { Screen } from "@/shared/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, FlatList, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useEffect } from "react";

export function LibraryPage() {
  const queryClient = useQueryClient();
  const { data: ids = [] } = useQuery(localMangaQueries.list());
  const { importDirectory, status, error, importedId } =
    useImportMangaDirectory();

  useEffect(() => {
    if (status === "success" && importedId) {
      queryClient.invalidateQueries({
        queryKey: localMangaQueries.list().queryKey,
      });
    }
  }, [status, importedId, queryClient]);

  useEffect(() => {
    if (status === "error" && error) {
      Alert.alert("Import failed", error);
    }
  }, [status, error]);

  const importing = status === "validating" || status === "importing";

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={importing ? "hourglass" : "plus"}
          accessibilityLabel="Import manga"
          disabled={importing}
          onPress={importDirectory}
        />
      </Stack.Toolbar>
      <FlatList
        data={ids}
        keyExtractor={(id) => id}
        numColumns={3}
        renderItem={({ item }) => <LibraryMangaCard id={item} />}
        contentContainerStyle={styles.list}
        contentInsetAdjustmentBehavior="automatic"
      />
    </Screen>
  );
}

function LibraryMangaCard({ id }: { id: string }) {
  const { data: manga } = useQuery(localMangaQueries.metadata(id));

  return (
    <MangaCard
      manga={
        manga ?? {
          id,
          malId: null,
          title: id,
          coverUrl: null,
          score: null,
          status: null,
          authors: [],
        }
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 4,
  },
});
