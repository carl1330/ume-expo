import {
  localMangaQueries,
  mangaQueries,
  updateMangaMetadata,
  type JikanPreview,
  type Manga,
} from "@/entities/manga";
import { useColors } from "@/shared/config";
import {
  Button,
  FieldGroup,
  Host,
  Icon,
  useNativeState,
} from "@expo/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { JikanPreviewSection } from "./JikanPreviewSection";
import { MalLookupSection } from "./MalLookupSection";
import { SearchResultsSection } from "./SearchResultsSection";
import { TitleSection } from "./TitleSection";

function parseMalId(s: string): number | null {
  const trimmed = s.trim();
  if (!trimmed) return null;
  const n = parseInt(trimmed, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function EditMangaMetadataPage({ id }: { id: string }) {
  const { data: manga, isLoading } = useQuery(localMangaQueries.metadata(id));

  if (isLoading || !manga) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <EditMangaMetadataForm id={id} manga={manga} />;
}

function EditMangaMetadataForm({ id, manga }: { id: string; manga: Manga }) {
  const colors = useColors();
  const queryClient = useQueryClient();
  const titleState = useNativeState(manga.title);
  const malIdState = useNativeState(manga.malId?.toString() ?? "");
  const titleQuery = useNativeState(manga.title);
  const [jikanPreview, setJikanPreview] = useState<JikanPreview | null>(null);
  const [selectedResultMalId, setSelectedResultMalId] = useState<number | null>(
    null,
  );

  function applyJikanResult(m: Manga) {
    titleState.value = m.title;
    malIdState.value = m.malId?.toString() ?? "";
    setJikanPreview({
      score: m.score,
      status: m.status,
      authors: m.authors,
      coverUrl: m.coverUrl,
    });
  }

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

  const fetchByTitleMutation = useMutation({
    mutationFn: (title: string) =>
      queryClient.fetchQuery(mangaQueries.searchTop(title)),
    onSuccess: (data) => {
      const first = data.manga[0];
      if (!first) return;
      setSelectedResultMalId(first.malId);
      applyJikanResult(first);
    },
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      updateMangaMetadata({
        id,
        title: titleState.value,
        malId: parseMalId(malIdState.value),
        jikanPreview,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: localMangaQueries.metadata(id).queryKey,
      });
      router.back();
    },
    onError: (e) =>
      Alert.alert(
        "Save failed",
        e instanceof Error ? e.message : "Unknown error",
      ),
  });

  function onFetchByTitle() {
    const query = titleQuery.value.trim();
    if (!query) {
      Alert.alert("Enter a title", "Type a manga name to search");
      return;
    }
    setSelectedResultMalId(null);
    fetchByTitleMutation.mutate(query);
  }

  function onFetchById() {
    const malId = parseMalId(malIdState.value);
    if (malId === null) {
      Alert.alert("Invalid MAL ID", "Enter a positive number");
      return;
    }
    fetchMutation.mutate(malId);
  }

  function onSelectResult(malId: number) {
    setSelectedResultMalId(malId);
    const result = fetchByTitleMutation.data?.manga.find(
      (m) => m.malId === malId,
    );
    if (result) applyJikanResult(result);
  }

  const results = fetchByTitleMutation.data?.manga ?? [];

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "Edit metadata",
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { color: colors.textPrimary },
          headerRight: () => (
            <Host matchContents>
              <Button
                variant="text"
                onPress={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
              >
                <Icon name="checkmark" />
              </Button>
            </Host>
          ),
        }}
      />
      <Host style={{ flex: 1 }}>
        <FieldGroup>
          <TitleSection value={titleState} />
          <MalLookupSection
            titleQuery={titleQuery}
            malId={malIdState}
            onSearch={onFetchByTitle}
            onFetchById={onFetchById}
            isSearching={fetchByTitleMutation.isPending}
            isFetchingById={fetchMutation.isPending}
          />
          {results.length ? (
            <SearchResultsSection
              results={results}
              selectedMalId={selectedResultMalId}
              onSelect={onSelectResult}
            />
          ) : null}
          {jikanPreview ? <JikanPreviewSection preview={jikanPreview} /> : null}
        </FieldGroup>
      </Host>
    </View>
  );
}
