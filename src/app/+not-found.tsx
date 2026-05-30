import { StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";
import { Screen } from "@/shared/ui";
import { useColors } from "@/shared/config";

export default function NotFoundScreen() {
  const colors = useColors();
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <Screen style={styles.container}>
        <Link href="/" style={[styles.button, { color: colors.textPrimary }]}>
          Go back to Home screen!
        </Link>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
  },
});
