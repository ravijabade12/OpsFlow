import { StyleSheet, Text, View } from "react-native";
import type { JobPriority, JobStatus } from "@opsflow/shared";

import { colors } from "../theme/colors";

const statusStyles: Record<
  JobStatus,
  { backgroundColor: string; color: string; label: string }
> = {
  pending: {
    backgroundColor: "#e2e8f0",
    color: colors.text,
    label: "Pending",
  },
  assigned: {
    backgroundColor: colors.infoSoft,
    color: colors.info,
    label: "Assigned",
  },
  in_progress: {
    backgroundColor: colors.accentSoft,
    color: colors.accent,
    label: "In progress",
  },
  completed: {
    backgroundColor: colors.successSoft,
    color: colors.success,
    label: "Completed",
  },
  cancelled: {
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
    label: "Cancelled",
  },
};

const priorityStyles: Record<
  JobPriority,
  { backgroundColor: string; color: string; label: string }
> = {
  low: { backgroundColor: "#e2e8f0", color: colors.text, label: "Low" },
  medium: {
    backgroundColor: colors.infoSoft,
    color: colors.info,
    label: "Medium",
  },
  high: {
    backgroundColor: colors.warningSoft,
    color: colors.warning,
    label: "High",
  },
  critical: {
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
    label: "Critical",
  },
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const tone = statusStyles[status];
  return (
    <View style={[styles.badge, { backgroundColor: tone.backgroundColor }]}>
      <Text style={[styles.text, { color: tone.color }]}>{tone.label}</Text>
    </View>
  );
}

export function PriorityBadge({ priority }: { priority: JobPriority }) {
  const tone = priorityStyles[priority];
  return (
    <View style={[styles.badge, { backgroundColor: tone.backgroundColor }]}>
      <Text style={[styles.text, { color: tone.color }]}>{tone.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
});
