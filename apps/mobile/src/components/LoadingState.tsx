import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <View style={styles.wrap} accessibilityRole="progressbar">
      <ActivityIndicator color={colors.accent} size="large" />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  text: {
    color: colors.muted,
    fontSize: 14,
  },
});
