import { BottomSheet, Button, Host } from "@expo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { spacing } from "@/shared/config";
import { Text, TextInput } from "@/shared/ui";
import {
  localMangaQueries,
  mangaQueries,
  type Manga,
} from "@/entities/manga";
import {
  updateMangaMetadata,
  type JikanPreview,
} from "@/entities/manga/api/update-manga-metadata";

interface SheetProps {
  manga: Manga;
  isOpen: boolean;
  onClose: () => void;
}

export function EditMetadataSheet({ manga, isOpen, onClose }: SheetProps) {
  return (
    <BottomSheet isPresented={isOpen} onDismiss={onClose}>
      <EditMetadataForm manga={manga} onClose={onClose} />
    </BottomSheet>
  );
}

function parseMalId(s: string): number | null {
  const trimmed = s.trim();
  if (!trimmed) return null;
  const n = parseInt(trimmed, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function EditMetadataForm({
  manga,
  onClose,
}: {
  manga: Manga;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(manga.title);
  const [malIdInput, setMalIdInput] = useState(manga.malId?.toString() ?? "");
  const [searchTerm, setSearchTerm] = useState("");
  const [jikanPreview, setJikanPreview] = useState<JikanPreview | null>(null);

  const searchQuery = useQuery(mangaQueries.searchTop(searchTerm));

  const fetchMutation = useMutation({
    mutationFn: (malId: number) =>
      queryClient.fetchQuery(mangaQueries.detail(malId)),
    onSuccess: (data, malId) => {
      if (!data) {
        Alert.alert("Not found", `No manga with MAL ID ${malId}`);
        return;
      }
      applyJikanResult(data);
    },
    onError: () => Alert.alert("MAL fetch failed", "Could not load manga"),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      updateMangaMetadata({
        id: manga.id,
        title,
        malId: parseMalId(malIdInput),
        jikanPreview,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: localMangaQueries.metadata(manga.id).queryKey,
      });
      onClose();
    },
    onError: (e) =>
      Alert.alert(
        "Save failed",
        e instanceof Error ? e.message : "Unknown error",
      ),
  });

  function applyJikanResult(m: Manga) {
    setTitle(m.title);
    setMalIdInput(m.malId?.toString() ?? "");
    setJikanPreview({
      score: m.score,
      status: m.status,
      authors: m.authors,
      coverUrl: m.coverUrl,
    });
  }

  function onSearch() {
    setSearchTerm(title.trim());
  }

  function onFetchById() {
    const id = parseMalId(malIdInput);
    if (id === null) {
      Alert.alert("Invalid MAL ID", "Enter a positive number");
      return;
    }
    fetchMutation.mutate(id);
  }

  const searchResults = searchQuery.data?.manga ?? [];
  const showNoResults =
    searchTerm.length > 0 &&
    searchQuery.isSuccess &&
    searchResults.length === 0;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.currentRow}>
        {manga.coverUrl && (
          <Image
            source={manga.coverUrl}
            style={styles.currentCover}
            contentFit="cover"
          />
        )}
        <Text variant="bodyMedium" numberOfLines={2} style={styles.flex}>
          {manga.title}
        </Text>
      </View>

      <View style={styles.field}>
        <Text variant="caption" color="secondary">
          Title
        </Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />
      </View>

      <View style={styles.field}>
        <Text variant="caption" color="secondary">
          MAL ID
        </Text>
        <View style={styles.row}>
          <TextInput
            value={malIdInput}
            onChangeText={setMalIdInput}
            keyboardType="number-pad"
            style={[styles.input, styles.flex]}
          />
          <Host matchContents>
            <Button
              variant="outlined"
              onPress={onFetchById}
              disabled={fetchMutation.isPending}
            >
              <Text>{fetchMutation.isPending ? "Fetching..." : "Fetch"}</Text>
            </Button>
          </Host>
        </View>
      </View>

      <Host matchContents>
        <Button
          variant="outlined"
          onPress={onSearch}
          disabled={searchQuery.isFetching}
        >
          <Text>
            {searchQuery.isFetching ? "Searching..." : "Search MAL by title"}
          </Text>
        </Button>
      </Host>

      {showNoResults && (
        <Text variant="caption" color="secondary">
          No matches found
        </Text>
      )}

      {searchResults.length > 0 && (
        <View style={styles.results}>
          {searchResults.map((result) => (
            <Pressable
              key={result.malId ?? result.title}
              onPress={() => applyJikanResult(result)}
              style={styles.resultRow}
            >
              {result.coverUrl && (
                <Image
                  source={result.coverUrl}
                  style={styles.resultCover}
                  contentFit="cover"
                />
              )}
              <Text variant="bodyMedium" numberOfLines={2} style={styles.flex}>
                {result.title}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {jikanPreview && (
        <View style={styles.preview}>
          <Text variant="caption" color="secondary">
            Preview from MAL
          </Text>
          <View style={styles.previewBody}>
            {jikanPreview.coverUrl && (
              <Image
                source={jikanPreview.coverUrl}
                style={styles.previewCover}
                contentFit="cover"
              />
            )}
            <View style={styles.flex}>
              {jikanPreview.score !== null && (
                <Text variant="caption">Score: {jikanPreview.score}</Text>
              )}
              {jikanPreview.status && (
                <Text variant="caption">Status: {jikanPreview.status}</Text>
              )}
              {jikanPreview.authors.length > 0 && (
                <Text variant="caption">
                  Authors: {jikanPreview.authors.map((a) => a.name).join(", ")}
                </Text>
              )}
            </View>
          </View>
          <Host matchContents>
            <Button variant="text" onPress={() => setJikanPreview(null)}>
              <Text>Clear preview</Text>
            </Button>
          </Host>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.flex}>
          <Host matchContents>
            <Button variant="outlined" onPress={onClose}>
              <Text>Cancel</Text>
            </Button>
          </Host>
        </View>
        <View style={styles.flex}>
          <Host matchContents>
            <Button
              variant="filled"
              onPress={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              <Text>{saveMutation.isPending ? "Saving..." : "Save"}</Text>
            </Button>
          </Host>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  flex: { flex: 1 },
  currentRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  currentCover: {
    width: 40,
    aspectRatio: 2 / 3,
  },
  field: {
    gap: spacing.xs,
  },
  input: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  results: {
    gap: spacing.xs,
  },
  resultRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  resultCover: {
    width: 32,
    aspectRatio: 2 / 3,
  },
  preview: {
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: 8,
  },
  previewBody: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  previewCover: {
    width: 48,
    aspectRatio: 2 / 3,
  },
  footer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
