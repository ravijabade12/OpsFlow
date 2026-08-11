"use client";

import { useEffect, useState } from "react";
import { AGENT_STATUSES, SEARCH_DEBOUNCE_MS } from "@opsflow/shared";
import type { AgentStatus } from "@opsflow/shared";

import { AgentAvatar } from "@/components/data-display/AgentAvatar";
import { AgentStatusBadge } from "@/components/data-display/AgentStatusBadge";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { AgentDetailsDrawer } from "@/features/agents/AgentDetailsDrawer";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAgentById,
  fetchAgents,
  selectAgents,
  selectAgentsError,
  selectAgentsIsEmpty,
  selectAgentsState,
  selectAgentsStatus,
} from "@/store/slices/agents";

export function AgentsPageClient() {
  const dispatch = useAppDispatch();
  const agents = useAppSelector(selectAgents);
  const status = useAppSelector(selectAgentsStatus);
  const error = useAppSelector(selectAgentsError);
  const isEmpty = useAppSelector(selectAgentsIsEmpty);
  const { totalCount } = useAppSelector(selectAgentsState);

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Reset to first page when query changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync page with query
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    void dispatch(
      fetchAgents({
        page,
        pageSize,
        q: debouncedSearch || undefined,
        status: statusFilter,
      }),
    );
  }, [dispatch, page, pageSize, debouncedSearch, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <AppShell
      title="Agents"
      description="Field agents, availability, and assigned workload."
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <Input
              aria-label="Search agents"
              placeholder="Search name, email, phone…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Select
            aria-label="Filter by status"
            placeholder="All statuses"
            className="sm:w-48"
            value={statusFilter}
            options={AGENT_STATUSES.map((value) => ({
              value,
              label: value[0].toUpperCase() + value.slice(1),
            }))}
            onChange={(event) =>
              setStatusFilter(event.target.value as AgentStatus | "")
            }
          />
        </div>

        <Card>
          <CardBody className="p-0">
            {status === "loading" || status === "idle" ? (
              <div className="p-4">
                <SkeletonRows rows={8} />
              </div>
            ) : null}

            {status === "failed" ? (
              <div className="p-4">
                <ErrorState
                  title="Unable to load agents"
                  description={error ?? undefined}
                  onRetry={() => {
                    void dispatch(
                      fetchAgents({
                        page,
                        pageSize,
                        q: debouncedSearch || undefined,
                        status: statusFilter,
                      }),
                    );
                  }}
                />
              </div>
            ) : null}

            {status === "succeeded" && isEmpty ? (
              <div className="p-4">
                <EmptyState
                  title="No agents found"
                  description="Try another search or clear the status filter."
                />
              </div>
            ) : null}

            {status === "succeeded" && !isEmpty ? (
              <Table>
                <THead>
                  <TR>
                    <TH>Agent</TH>
                    <TH>Status</TH>
                    <TH>Email</TH>
                    <TH>Phone</TH>
                    <TH className="w-24">Actions</TH>
                  </TR>
                </THead>
                <TBody>
                  {agents.map((agent) => (
                    <TR key={agent.id}>
                      <TD>
                        <div className="flex items-center gap-3">
                          <AgentAvatar
                            name={agent.name}
                            avatar={agent.avatar}
                          />
                          <div>
                            <p className="text-foreground font-medium">
                              {agent.name}
                            </p>
                            <p className="text-muted text-xs">{agent.id}</p>
                          </div>
                        </div>
                      </TD>
                      <TD>
                        <AgentStatusBadge status={agent.status} />
                      </TD>
                      <TD className="whitespace-nowrap">{agent.email}</TD>
                      <TD className="whitespace-nowrap">{agent.phone}</TD>
                      <TD>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedId(agent.id);
                            void dispatch(fetchAgentById(agent.id));
                          }}
                        >
                          View
                        </Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            ) : null}
          </CardBody>
        </Card>

        {status === "succeeded" && !isEmpty ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        ) : null}
      </div>

      <AgentDetailsDrawer
        open={Boolean(selectedId)}
        agentId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </AppShell>
  );
}
