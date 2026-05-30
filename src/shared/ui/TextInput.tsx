import { forwardRef } from "react";
import { TextInput as RNTextInput, type TextInputProps } from "react-native";
import { useColors } from "@/shared/config/theme";

export const TextInput = forwardRef<RNTextInput, TextInputProps>(function TextInput(
  { style, ...props },
  ref,
) {
  const colors = useColors();
  return (
    <RNTextInput
      ref={ref}
      placeholderTextColor={colors.placeholder}
      style={[{ backgroundColor: colors.surface, color: colors.textPrimary }, style]}
      {...props}
    />
  );
});
