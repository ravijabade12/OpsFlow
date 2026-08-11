import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { JobStatus } from "@opsflow/shared";

import { PriorityBadge, StatusBadge } from "../../components/Badges";
import { ErrorState } from "../../components/ErrorState";
import { LoadingState } from "../../components/LoadingState";
import { StatusBottomSheet } from "../../components/StatusBottomSheet";
import type { RootStackParamList } from "../../navigation/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchJobById,
  selectJobsDetailError,
  selectJobsDetailStatus,
  selectJobsMutationError,
  selectJobsMutationStatus,
  selectSelectedJob,
  updateJobStatus,
} from "../../store/slices/jobsSlice";
import { colors } from "../../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "JobDetails">;

function formatDateTime(iso?: string): string {
  if (!iso) {
    return "—";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString();
}

export function JobDetailsScreen({ route }: Props) {
  const { jobId } = route.params;
  const dispatch = useAppDispatch();
  const job = useAppSelector(selectSelectedJob);
  const detailStatus = useAppSelector(selectJobsDetailStatus);
  const detailError = useAppSelector(selectJobsDetailError);
  const mutationStatus = useAppSelector(selectJobsMutationStatus);
  const mutationError = useAppSelector(selectJobsMutationError);
  const [sheetOpen, setSheetOpen] = useState(false);

  const load = useCallback(() => {
    dispatch(fetchJobById(jobId));
  }, [dispatch, jobId]);

  useEffect(() => {
    load();
  }, [load]);

  const onSelectStatus = useCallback(
    (status: JobStatus) => {
      dispatch(updateJobStatus({ id: jobId, status })).then((result) => {
        if (updateJobStatus.fulfilled.match(result)) {
          setSheetOpen(false);
        }
      });
    },
    [dispatch, jobId],
  );

  if (detailStatus === "loading" && (!job || job.id !== jobId)) {
    return <LoadingState label="Loading job details…" />;
  }

  if (detailStatus === "failed" && (!job || job.id !== jobId)) {
    return (
      <ErrorState
        title="Unable to load job"
        description={detailError ?? undefined}
        onRetry={load}
      />
    );
  }

  if (!job || job.id !== jobId) {
    return <LoadingState label="Loading job details…" />;
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>{job.title}</Text>
        <View style={styles.badges}>
          <StatusBadge status={job.status} />
          <PriorityBadge priority={job.priority} />
        </View>

        <Text style={styles.description}>{job.description}</Text>

        <View style={styles.card}>
          <InfoRow label="Job ID" value={job.id} />
          <InfoRow label="Location" value={job.location} />
          <InfoRow label="Customer" value={job.customerId} />
          <InfoRow label="Created" value={formatDateTime(job.createdAt)} />
          <InfoRow label="Due" value={formatDateTime(job.dueDate)} />
          <InfoRow
            label="Completed"
            value={formatDateTime(job.completedAt)}
          />
        </View>

        {mutationError ? (
          <Text style={styles.error}>{mutationError}</Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          onPress={() => setSheetOpen(true)}
          style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
        >
          <Text style={styles.ctaText}>
            {mutationStatus === "loading" ? "Updating…" : "Update status"}
          </Text>
        </Pressable>
      </ScrollView>

      <StatusBottomSheet
        open={sheetOpen}
        current={job.status}
        busy={mutationStatus === "loading"}
        onClose={() => setSheetOpen(false)}
        onSelect={onSelectStatus}
      />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
  },
  infoRow: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: "700",
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  pressed: {
    opacity: 0.9,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
});
