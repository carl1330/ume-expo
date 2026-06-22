import {
  volumeQueries,
  type Volume,
  type VolumeContent,
} from "@/entities/manga";
import { updateLastPage } from "../api/update-last-page";
import { progressQueries } from "../api/progress.queries";
import { SafeScreen, Text } from "@/shared/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VolumeProgress } from "@db/schema";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { useCallback, useRef, useState } from "react";
import PageRenderer from "./PageRenderer";

export function ReaderPage({
  mangaId,
  volumeUuid,
}: {
  mangaId: string;
  volumeUuid: string;
}) {
  const { data: volumes, isLoading } = useQuery(volumeQueries.byManga(mangaId));

  if (isLoading) {
    return (
      <SafeScreen>
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      </SafeScreen>
    );
  }

  const volume = volumes?.find((v) => v.uuid === volumeUuid);
  if (!volume) {
    return (
      <SafeScreen>
        <View style={styles.centered}>
          <Text>Volume not found.</Text>
        </View>
      </SafeScreen>
    );
  }

  return <VolumeReader volume={volume} mangaId={mangaId} />;
}

function VolumeReader({
  volume,
  mangaId,
}: {
  volume: Volume;
  mangaId: string;
}) {
  const content = useQuery(volumeQueries.content(volume.dir));
  const progress = useQuery(progressQueries.byVolume(volume.uuid));

  if (content.isLoading || progress.isLoading) {
    return (
      <SafeScreen>
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      </SafeScreen>
    );
  }

  if (content.error || !content.data) {
    return (
      <SafeScreen>
        <View style={styles.centered}>
          <Text>
            Failed to load volume: {content.error?.message ?? "unknown"}
          </Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <LoadedVolumeReader
      volume={volume}
      mangaId={mangaId}
      content={content.data}
      initialPage={progress.data?.lastPage ?? 0}
    />
  );
}

function LoadedVolumeReader({
  volume,
  mangaId,
  content,
  initialPage,
}: {
  volume: Volume;
  mangaId: string;
  content: VolumeContent;
  initialPage: number;
}) {
  const { width } = useWindowDimensions();
  const totalPages = content.pages.length;
  const safeInitial = Math.min(initialPage, Math.max(totalPages - 1, 0));

  const [chromeVisible, setChromeVisible] = useState(false);
  const toggleChrome = useCallback(() => setChromeVisible((v) => !v), []);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleTap = useCallback(() => {
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;
      return;
    }
    tapTimerRef.current = setTimeout(() => {
      tapTimerRef.current = null;
      toggleChrome();
    }, 280);
  }, [toggleChrome]);

  const [currentIndex, setCurrentIndex] = useState(safeInitial);
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      const i = viewableItems[0]?.index;
      if (i != null) setCurrentIndex(i);
    },
  ).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const queryClient = useQueryClient();
  const updateProgress = useMutation({
    mutationFn: updateLastPage,
    onSuccess: ({ volumeUuid, page, totalPages }) => {
      const isFinal = page >= totalPages - 1;
      queryClient.setQueryData<VolumeProgress | null>(
        progressQueries.byVolume(volumeUuid).queryKey,
        (prev) =>
          prev
            ? {
                ...prev,
                lastPage: page,
                updatedAt: new Date(),
                completedAt: prev.completedAt ?? (isFinal ? new Date() : null),
              }
            : prev,
      );
      queryClient.setQueryData<Volume[]>(
        volumeQueries.byManga(mangaId).queryKey,
        (old) =>
          old?.map((volume) =>
            volume.uuid === volumeUuid
              ? { ...volume, progress: page / totalPages }
              : volume,
          ),
      );
    },
  });
  const handleMomentumScrollEnd = useCallback(() => {
    updateProgress.mutate({
      volumeUuid: volume.uuid,
      page: currentIndex,
      totalPages,
    });
  }, [updateProgress, volume.uuid, currentIndex, totalPages]);

  const getItemLayout = useCallback(
    (_: ArrayLike<unknown> | null | undefined, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [width],
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: chromeVisible,
          headerTitle: `${currentIndex + 1} / ${totalPages}`,
          headerTransparent: true,
          headerShadowVisible: false,
        }}
      />
      <GestureDetector
        gesture={Gesture.Tap()
          .maxDuration(250)
          .maxDistance(10)
          .runOnJS(true)
          .onEnd(handleTap)}
      >
        <FlatList
          style={{ flex: 1 }}
          data={content.pages}
          renderItem={({ item: page }) => <PageRenderer pageContent={page} />}
          pagingEnabled
          inverted
          horizontal
          showsHorizontalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          initialScrollIndex={safeInitial}
          getItemLayout={getItemLayout}
        />
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
