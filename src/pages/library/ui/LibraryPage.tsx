import { ImportButton, localMangaQueries, MangaCard } from "@/entities/manga";
import { Screen } from "@/shared/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FlatList, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export function LibraryPage() {
  const queryClient = useQueryClient();
  const { data: ids = [] } = useQuery(localMangaQueries.list());

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerShadowVisible: false,
          headerRight: () => (
            <ImportButton
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: localMangaQueries.list().queryKey });
              }}
            />
          ),
        }}
      />
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
