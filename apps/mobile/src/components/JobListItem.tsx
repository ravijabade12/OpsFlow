import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Job } from "@opsflow/shared";

import { PriorityBadge, StatusBadge } from "./Badges";
import { colors } from "../theme/colors";

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleDateString();
}

export function JobListItem({
  job,
  onPress,
}: {
  job: Job;
  onPress: (job: Job) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(job)}
      style={({ pressed }: { pressed: boolean }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.title} numberOfLines={2}>
        {job.title}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {job.location} · Due {formatDate(job.dueDate)}
      </Text>
      <View style={styles.row}>
        <StatusBadge status={job.status} />
        <PriorityBadge priority={job.priority} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    gap: 8,
  },
  pressed: {
    opacity: 0.92,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  meta: {
    fontSize: 12,
    color: colors.muted,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
});
