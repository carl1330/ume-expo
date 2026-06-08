import { volumeQueries, type Volume } from "@/entities/manga";
import { SafeScreen, Text } from "@/shared/ui";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
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

  return <VolumeReader volume={volume} />;
}

function VolumeReader({ volume }: { volume: Volume }) {
  const { data, isLoading, error } = useQuery(
    volumeQueries.content(volume.dir),
  );
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      const i = viewableItems[0]?.index;
      if (i != null) setCurrentIndex(i);
    },
  ).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  if (isLoading) {
    return (
      <SafeScreen>
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      </SafeScreen>
    );
  }

  if (error || !data) {
    return (
      <SafeScreen>
        <View style={styles.centered}>
          <Text>Failed to load volume: {error?.message ?? "unknown"}</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: chromeVisible,
          headerTitle: `${currentIndex + 1} / ${data.pages.length}`,
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
          data={data.pages}
          renderItem={({ item: page }) => <PageRenderer pageContent={page} />}
          pagingEnabled
          inverted
          horizontal
          showsHorizontalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
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
