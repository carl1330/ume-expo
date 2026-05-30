import { useColors } from "@/shared/config";
import { Text } from "@/shared/ui";
import { Pressable, StyleSheet, View } from "react-native";

export function VolumeCard({ name }: { name: string }) {
  const colors = useColors();

  return (
    <Pressable
      onPress={() => {}}
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      <View style={[styles.cover, { backgroundColor: colors.imagePlaceholder }]} />
      <Text style={styles.label} numberOfLines={1}>{name}</Text>
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
