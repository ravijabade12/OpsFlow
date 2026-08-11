"use client";

import { useState } from "react";

import {
  JobStatusBadge,
  PriorityBadge,
} from "@/components/data-display/JobBadges";
import { MetricCard } from "@/components/data-display/MetricCard";
import { AppShell } from "@/components/layout/AppShell";
import { PageSection } from "@/components/layout/PageSection";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Drawer,
  Dropdown,
  EmptyState,
  ErrorState,
  Input,
  Modal,
  Pagination,
  Select,
  SkeletonRows,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";

export function DesignSystemClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <AppShell
      title="Design system"
      description="Phase 4 component gallery for OpsFlow web."
    >
      <div className="space-y-8">
        <PageSection
          title="Actions & inputs"
          description="Primary teal accent on cool zinc surfaces."
        >
          <Card>
            <CardBody className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Input label="Search jobs" placeholder="HVAC, outage…" />
                <Select
                  label="Status"
                  placeholder="All statuses"
                  options={[
                    { label: "Pending", value: "pending" },
                    { label: "In progress", value: "in_progress" },
                    { label: "Completed", value: "completed" },
                  ]}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => setModalOpen(true)}>
                  Open modal
                </Button>
                <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                  Open drawer
                </Button>
                <Dropdown
                  label="Actions"
                  items={[
                    {
                      id: "assign",
                      label: "Assign agent",
                      onSelect: () => undefined,
                    },
                    {
                      id: "cancel",
                      label: "Cancel job",
                      onSelect: () => undefined,
                      danger: true,
                    },
                  ]}
                />
              </div>
            </CardBody>
          </Card>
        </PageSection>

        <PageSection title="Badges & metrics">
          <div className="flex flex-wrap gap-2">
            <Badge>Neutral</Badge>
            <Badge tone="accent">Accent</Badge>
            <JobStatusBadge status="in_progress" />
            <PriorityBadge priority="critical" />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Sample KPI"
              value="1,284"
              hint="+4.2% vs last week"
            />
            <MetricCard label="Active" value="318" />
            <MetricCard label="Urgent" value="27" />
            <MetricCard label="SLA" value="96.4%" />
          </div>
        </PageSection>

        <PageSection title="Tabs & table">
          <Tabs defaultValue="table">
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="loading">Loading</TabsTrigger>
              <TabsTrigger value="empty">Empty</TabsTrigger>
              <TabsTrigger value="error">Error</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <Card>
                <CardHeader
                  title="Sample jobs"
                  description="Horizontal scroll on narrow viewports."
                />
                <CardBody className="p-0">
                  <Table>
                    <THead>
                      <TR>
                        <TH>Job</TH>
                        <TH>Status</TH>
                        <TH>Priority</TH>
                        <TH>Location</TH>
                      </TR>
                    </THead>
                    <TBody>
                      <TR>
                        <TD>HVAC inspection #120</TD>
                        <TD>
                          <JobStatusBadge status="assigned" />
                        </TD>
                        <TD>
                          <PriorityBadge priority="high" />
                        </TD>
                        <TD>Bengaluru</TD>
                      </TR>
                      <TR>
                        <TD>Network outage triage #88</TD>
                        <TD>
                          <JobStatusBadge status="in_progress" />
                        </TD>
                        <TD>
                          <PriorityBadge priority="critical" />
                        </TD>
                        <TD>Hyderabad</TD>
                      </TR>
                    </TBody>
                  </Table>
                </CardBody>
              </Card>
              <Pagination
                className="mt-3"
                page={page}
                totalPages={12}
                totalCount={240}
                pageSize={20}
                onPageChange={setPage}
              />
            </TabsContent>
            <TabsContent value="loading">
              <SkeletonRows rows={4} />
            </TabsContent>
            <TabsContent value="empty">
              <EmptyState
                title="No jobs found"
                description="Adjust your filters or create a new job."
                action={<Button size="sm">Create job</Button>}
              />
            </TabsContent>
            <TabsContent value="error">
              <ErrorState
                title="Unable to load jobs"
                description="The API request failed. Check JSON Server and retry."
                onRetry={() => undefined}
              />
            </TabsContent>
          </Tabs>
        </PageSection>
      </div>

      <Modal
        open={modalOpen}
        title="Confirm status update"
        description="Modal uses the native dialog element for accessibility."
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </>
        }
      >
        <p className="text-muted text-sm">
          This is a design-system preview only. Job mutations wire up in Phase
          5.
        </p>
      </Modal>

      <Drawer
        open={drawerOpen}
        title="Filters"
        description="Drawer pattern for mobile/tablet filter panels."
        onClose={() => setDrawerOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Reset
            </Button>
            <Button onClick={() => setDrawerOpen(false)}>Apply</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Select
            label="Priority"
            options={[
              { label: "High", value: "high" },
              { label: "Critical", value: "critical" },
            ]}
          />
          <Input label="Agent" placeholder="Search agents" />
        </div>
      </Drawer>
    </AppShell>
  );
}
