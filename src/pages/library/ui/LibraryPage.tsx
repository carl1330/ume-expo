import {
  deleteManga,
  localMangaQueries,
  MangaCard,
  useImportManga,
  type Manga,
} from "@/entities/manga";
import { Screen } from "@/shared/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { MenuView } from "@expo/ui/community/menu";

export function LibraryPage() {
  const queryClient = useQueryClient();
  const { data: manga = [] } = useQuery(localMangaQueries.list());
  const { importManga, status, error, importedId } = useImportManga();

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
          onPress={importManga}
        />
      </Stack.Toolbar>
      <FlatList
        data={manga}
        keyExtractor={(m) => m.id}
        numColumns={3}
        renderItem={({ item }) => <LibraryMangaCard manga={item} />}
        contentContainerStyle={styles.list}
        contentInsetAdjustmentBehavior="automatic"
      />
    </Screen>
  );
}

const LIST_PADDING = 4;
const COLUMNS = 3;

function LibraryMangaCard({ manga }: { manga: Manga }) {
  const queryClient = useQueryClient();
  const { width: windowWidth } = useWindowDimensions();
  const cellWidth = (windowWidth - LIST_PADDING * 2) / COLUMNS;

  const confirmDelete = () => {
    Alert.alert(
      "Delete manga",
      `Delete "${manga.title}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteManga(manga.id);
              queryClient.invalidateQueries({
                queryKey: localMangaQueries.list().queryKey,
              });
            } catch (e) {
              Alert.alert("Delete failed", (e as Error).message);
            }
          },
        },
      ],
    );
  };

  return (
    <MenuView
      shouldOpenOnLongPress
      title={manga.title}
      onPressAction={({ nativeEvent }) => {
        if (nativeEvent.event === "edit") {
          router.push(`/manga/edit/${manga.id}`);
        } else if (nativeEvent.event === "delete") {
          confirmDelete();
        }
      }}
      actions={[
        { id: "edit", title: "Edit metadata", image: "pencil" },
        {
          id: "delete",
          title: "Delete",
          image: "trash",
          attributes: { destructive: true },
        },
      ]}
    >
      <View style={{ width: cellWidth }}>
        <MangaCard manga={manga} />
      </View>
    </MenuView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 4,
  },
});
