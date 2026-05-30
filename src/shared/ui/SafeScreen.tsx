import { type ViewProps } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useColors } from "@/shared/config/theme";

type Props = ViewProps & { edges?: Edge[] };

export function SafeScreen({ style, edges, ...props }: Props) {
  const colors = useColors();
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
      edges={edges}
      {...props}
    />
  );
}
