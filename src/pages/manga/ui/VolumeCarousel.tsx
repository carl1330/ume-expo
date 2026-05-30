import { spacing } from "@/shared/config";
import { Text } from "@/shared/ui";
import { volumeQueries } from "@/entities/manga";
import { useQuery } from "@tanstack/react-query";
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
        {volumes.map((dir) => (
          <VolumeCard key={dir.uri} name={dir.name} />
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
