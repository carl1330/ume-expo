import { Text as RNText, type TextProps } from "react-native";
import { useColors } from "@/shared/config/theme";
import { typography, type TypographyVariant } from "@/shared/config/typography";

type Props = TextProps & {
  color?: "primary" | "secondary";
  variant?: TypographyVariant;
};

export function Text({
  color = "primary",
  variant = "bodyMedium",
  style,
  ...props
}: Props) {
  const colors = useColors();
  const textColor =
    color === "secondary" ? colors.textSecondary : colors.textPrimary;
  const typeStyle = typography[variant];
  return <RNText style={[{ color: textColor }, typeStyle, style]} {...props} />;
}
