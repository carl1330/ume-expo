import Ionicons from "@expo/vector-icons/Ionicons";
import { useColors } from "@/shared/config/theme";

type StarIconProps = {
  size?: number;
};

export function StarIcon({ size = 16 }: StarIconProps) {
  const colors = useColors();
  return <Ionicons name="star" size={size} color={colors.star} />;
}
