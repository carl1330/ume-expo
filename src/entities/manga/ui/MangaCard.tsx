import { Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { Manga } from "../model/types";
import { Text } from "@/shared/ui";
import { useColors } from "@/shared/config";
import { router } from "expo-router";

interface MangaCardProps {
  manga: Manga;
}

export function MangaCard({ manga }: MangaCardProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={() => {
        if (manga.id) router.push(`/manga/${manga.id}`);
        else if (manga.malId != null) router.push(`/manga/mal_${manga.malId}`);
      }}
      style={styles.card}
    >
      <Animated.View entering={FadeInDown.duration(300).springify()}>
        <Image
          source={manga.coverUrl || null}
          contentFit="cover"
          style={[styles.image, { backgroundColor: colors.imagePlaceholder }]}
        />
        <Text style={styles.title} numberOfLines={2}>
          {manga.title || manga.id || String(manga.malId)}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 2 / 3,
  },
  title: {
    padding: 4,
    fontSize: 11,
    fontWeight: "600",
  },
});
