import { Modal, Pressable, StyleSheet, Text } from "react-native";
import type { JobStatus } from "@opsflow/shared";

import { colors } from "../theme/colors";

const OPTIONS: Array<{ value: JobStatus; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function StatusBottomSheet({
  open,
  current,
  busy,
  onClose,
  onSelect,
}: {
  open: boolean;
  current: JobStatus;
  busy?: boolean;
  onClose: () => void;
  onSelect: (status: JobStatus) => void;
}) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>Update status</Text>
          <Text style={styles.subtitle}>Current: {current.replaceAll("_", " ")}</Text>
          {OPTIONS.map((option) => {
            const selected = option.value === current;
            return (
              <Pressable
                key={option.value}
                disabled={busy}
                accessibilityRole="button"
                onPress={() => onSelect(option.value)}
                style={({ pressed }) => [
                  styles.option,
                  selected && styles.optionSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  optionSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  optionText: {
    color: colors.text,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: colors.accent,
  },
  cancel: {
    marginTop: 4,
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelText: {
    color: colors.muted,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
});
