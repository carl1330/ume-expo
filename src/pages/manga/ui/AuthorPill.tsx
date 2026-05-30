import { Pressable, StyleSheet } from "react-native";
import { Text } from "@/shared/ui";
import { spacing, useColors } from "@/shared/config";

type AuthorPillProps = {
  name: string;
  onPress?: () => void;
};

export function AuthorPill({ name, onPress }: AuthorPillProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: colors.surface },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Text variant="caption" color="secondary" numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 99,
  },
});
