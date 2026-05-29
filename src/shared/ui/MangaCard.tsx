import { StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Manga } from "../api/manga/models";

interface MangaCardProps {
  manga: Manga;
  index?: number;
}

export function MangaCard({ manga, index = 0 }: MangaCardProps) {
  return (
    <Animated.View
      style={styles.card}
      entering={index < 9 ? FadeInDown.delay(index * 40).duration(300).springify() : undefined}
    >
      <Image
        source={manga.images?.jpg?.image_url}
        contentFit="cover"
        style={styles.image}
      />
      <Text style={styles.title} numberOfLines={2}>
        {manga.title}
      </Text>
    </Animated.View>
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
    backgroundColor: "#0553",
  },
  title: {
    padding: 4,
    fontSize: 11,
    fontWeight: "600",
  },
});
