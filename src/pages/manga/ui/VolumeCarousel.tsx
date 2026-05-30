import { spacing } from "@/shared/config";
import { Text } from "@/shared/ui";
import { useFillVolumeCovers, volumeQueries } from "@/entities/manga";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, View } from "react-native";
import { VolumeCard } from "./VolumeCard";

export function VolumeCarousel({ mangaId }: { mangaId: string }) {
  const { data: volumes = [] } = useQuery(volumeQueries.byManga(mangaId));
  useFillVolumeCovers(mangaId, volumes);

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
          <VolumeCard key={volume.dir.uri} cover={volume.cover ?? ""} />
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
