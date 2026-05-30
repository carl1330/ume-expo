import { ImportButton, localMangaQueries, mangaQueries, volumeQueries } from "@/entities/manga";
import { findMangaByMalId } from "@/shared/api";
import { SafeScreen, StarIcon, Text } from "@/shared/ui";
import { spacing } from "@/shared/config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { AuthorPill } from "./AuthorPill";
import { VolumeCarousel } from "./VolumeCarousel";

type Props =
  | { localId: string; malId: null }
  | { localId: null; malId: number };

export function MangaDetailsPage(props: Props) {
  if (props.localId !== null) {
    return <LocalMangaDetails localId={props.localId} />;
  }
  return <RemoteMangaDetails malId={props.malId} />;
}

function LocalMangaDetails({ localId }: { localId: string }) {
  const queryClient = useQueryClient();
  const { data: manga, isLoading } = useQuery(localMangaQueries.metadata(localId));

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
      <Stack.Screen
        options={{
          headerRight: () => (
            <ImportButton
              targetId={localId}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: volumeQueries.byManga(localId).queryKey });
              }}
            />
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <MangaHeader manga={manga} />
        <VolumeCarousel mangaId={localId} />
      </ScrollView>
    </SafeScreen>
  );
}

function RemoteMangaDetails({ malId }: { malId: number }) {
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
      <Stack.Screen
        options={{
          headerRight: () => (
            <ImportButton
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["manga", "findByMalId", malId] });
              }}
            />
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <MangaHeader manga={manga} />
      </ScrollView>
    </SafeScreen>
  );
}

function MangaHeader({ manga }: { manga: { title: string; coverUrl: string | null; score: number | null; status: string | null; authors: { id: number; name: string }[] } }) {
  return (
    <View style={styles.header}>
      <Image
        source={manga.coverUrl || null}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.info}>
        <Text variant="titleMedium" numberOfLines={2} style={styles.titleText}>
          {manga.title}
        </Text>
        <View style={styles.metadata}>
          <View style={styles.metadataGroup}>
            {manga.score && (
              <View style={styles.scoreRow}>
                <StarIcon size={16} />
                <Text variant="caption">{manga.score}</Text>
              </View>
            )}
            {manga.status && <Text variant="caption">{manga.status}</Text>}
            {manga.authors.length > 0 && (
              <View style={styles.authorRow}>
                {manga.authors.map((author) => (
                  <AuthorPill key={author.id} name={author.name} />
                ))}
              </View>
            )}
          </View>
          <Text variant="caption" color="secondary" style={styles.moreInfo}>
            More info →
          </Text>
        </View>
      </View>
    </View>
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
  header: {
    flexDirection: "row",
    padding: spacing.lg,
    paddingTop: 44 + spacing.lg,
    gap: spacing.md,
  },
  image: {
    width: 120,
    aspectRatio: 2 / 3,
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
  },
  metadata: {
    flex: 1,
    justifyContent: "space-between",
  },
  metadataGroup: {
    gap: spacing.xs,
  },
  titleText: {
    marginBottom: spacing.sm,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  authorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  moreInfo: {
    paddingTop: spacing.xs,
  },
});
