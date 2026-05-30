import { View, type ViewProps } from "react-native";
import { useColors } from "@/shared/config/theme";

export function Screen({ style, ...props }: ViewProps) {
  const colors = useColors();
  return <View style={[{ flex: 1, backgroundColor: colors.background }, style]} {...props} />;
}
