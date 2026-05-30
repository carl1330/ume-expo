import { StarIcon, Text } from "@/shared/ui";
import { spacing } from "@/shared/config";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { AuthorPill } from "./AuthorPill";

type Props = {
  manga: {
    title: string;
    coverUrl: string | null;
    score: number | null;
    status: string | null;
    authors: { id: number; name: string }[];
  };
};

export function MangaHeader({ manga }: Props) {
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
