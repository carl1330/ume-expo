import { spacing } from "@/shared/config";
import { Text } from "@/shared/ui";
import { volumeQueries } from "@/entities/manga";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { VolumeCard } from "./VolumeCard";

export function VolumeCarousel({ mangaId }: { mangaId: string }) {
  const { data: volumes = [] } = useQuery(volumeQueries.byManga(mangaId));

  return (
    <View style={styles.section}>
      <Text variant="titleSmall" style={styles.title}>
        Volumes
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {volumes.map((volume) => (
          <VolumeCard
            key={volume.uuid}
            cover={volume.cover}
            onPress={() =>
              router.push({
                pathname: "/reader/[mangaId]/[volumeUuid]",
                params: { mangaId, volumeUuid: volume.uuid },
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  title: {
    paddingHorizontal: spacing.lg,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
});
