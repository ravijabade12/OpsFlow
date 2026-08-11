import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { Job } from "@opsflow/shared";

import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
import { JobListItem } from "../../components/JobListItem";
import { LoadingState } from "../../components/LoadingState";
import type { RootStackParamList } from "../../navigation/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchJobs,
  selectJobs,
  selectJobsAgentId,
  selectJobsError,
  selectJobsHasMore,
  selectJobsIsEmpty,
  selectJobsStatus,
  selectJobsTotalCount,
} from "../../store/slices/jobsSlice";
import { setRefreshing, selectRefreshing } from "../../store/slices/uiSlice";
import { colors } from "../../theme/colors";
import { apiConfig } from "../../services/apiConfig";

type Props = NativeStackScreenProps<RootStackParamList, "Jobs">;

export function JobsScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(selectJobs);
  const status = useAppSelector(selectJobsStatus);
  const error = useAppSelector(selectJobsError);
  const isEmpty = useAppSelector(selectJobsIsEmpty);
  const hasMore = useAppSelector(selectJobsHasMore);
  const totalCount = useAppSelector(selectJobsTotalCount);
  const agentId = useAppSelector(selectJobsAgentId);
  const refreshing = useAppSelector(selectRefreshing);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadInitial = useCallback(() => {
    dispatch(fetchJobs({ refresh: true }));
  }, [dispatch]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const onRefresh = useCallback(() => {
    dispatch(setRefreshing(true));
    dispatch(fetchJobs({ refresh: true })).finally(() => {
      dispatch(setRefreshing(false));
    });
  }, [dispatch]);

  const onEndReached = useCallback(() => {
    if (!hasMore || status === "loading" || loadingMore) {
      return;
    }
    setLoadingMore(true);
    dispatch(fetchJobs({ append: true })).finally(() => {
      setLoadingMore(false);
    });
  }, [dispatch, hasMore, loadingMore, status]);

  const onPressJob = useCallback(
    (job: Job) => {
      navigation.navigate("JobDetails", { jobId: job.id });
    },
    [navigation],
  );

  if (status === "loading" && jobs.length === 0) {
    return <LoadingState label="Loading assigned jobs…" />;
  }

  if (status === "failed" && jobs.length === 0) {
    return (
      <ErrorState
        title="Unable to load jobs"
        description={
          error ??
          `Check that the API is reachable at ${apiConfig.baseUrl}`
        }
        onRetry={loadInitial}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Field agent</Text>
        <Text style={styles.title}>My jobs</Text>
        <Text style={styles.subtitle}>
          Agent {agentId} · {totalCount} assigned
        </Text>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobListItem job={item} onPress={onPressJob} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          isEmpty ? (
            <EmptyState
              title="No assigned jobs"
              description="Pull to refresh, or check that this agent has jobs in the API."
            />
          ) : undefined
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.accent} />
            </View>
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.muted,
  },
  title: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 13,
    color: colors.muted,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 16,
  },
});
