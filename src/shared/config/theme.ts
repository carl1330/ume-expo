import { useColorScheme } from "react-native";

const light = {
  background: "#ffffff",
  surface: "#f2f2f7",
  textPrimary: "#000000",
  textSecondary: "#8e8e93",
  border: "#e5e5ea",
  placeholder: "#c7c7cc",
  imagePlaceholder: "#e5e5ea",
  star: "#ffd700",
};

const dark = {
  background: "#000000",
  surface: "#1c1c1e",
  textPrimary: "#ffffff",
  textSecondary: "#8e8e93",
  border: "#38383a",
  placeholder: "#636366",
  imagePlaceholder: "#2c2c2e",
  star: "#ffd700",
};

export type Colors = typeof light;

export function useColors(): Colors {
  const scheme = useColorScheme();
  return scheme === "dark" ? dark : light;
}
