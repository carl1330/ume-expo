import { useColors } from "@/shared/config";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";

export function VolumeCard({ cover }: { cover: string }) {
  const colors = useColors();

  return (
    <Pressable
      onPress={() => {}}
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      <Image
        source={cover || null}
        contentFit="cover"
        style={[styles.cover, { backgroundColor: colors.imagePlaceholder }]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: 90,
    aspectRatio: 2 / 3,
  },
  label: {
    fontSize: 10,
    paddingTop: 2,
    width: 90,
  },
});
