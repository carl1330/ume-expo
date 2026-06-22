import { useColors } from "@/shared/config";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";
import { GlassView } from "expo-glass-effect";
import { Host, ProgressView } from "@expo/ui/swift-ui";

export function VolumeCard({
  cover,
  progress,
  onPress,
}: {
  cover: string;
  progress: number;
  onPress: () => void;
}) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      <GlassView style={styles.container}>
        <Image
          source={{ uri: cover }}
          contentFit="cover"
          contentPosition="left"
          style={[styles.cover, { backgroundColor: colors.imagePlaceholder }]}
        />
        <Host style={{ flex: 1 }}>
          <ProgressView value={progress} />
        </Host>
      </GlassView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    flex: 1,
    gap: 8,
  },
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
