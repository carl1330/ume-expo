import { volumeQueries, type Volume } from "@/entities/manga";
import { SafeScreen, Text } from "@/shared/ui";
import { spacing } from "@/shared/config";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
    <GestureHandlerRootView>
      <FlatList
        data={data.pages}
        renderItem={({ item: page }) => <PageRenderer pageContent={page} />}
        pagingEnabled
        inverted
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
