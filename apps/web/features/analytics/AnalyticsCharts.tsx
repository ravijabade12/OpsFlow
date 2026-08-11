"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import type {
  AgentPerformanceRow,
  PrioritySlice,
  StatusSlice,
  TrendPoint,
} from "@/utils/analytics";

const STATUS_COLORS: Record<string, string> = {
  pending: "#94a3b8",
  assigned: "#3b82f6",
  in_progress: "#0f766e",
  completed: "#047857",
  cancelled: "#b91c1c",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "#94a3b8",
  medium: "#3b82f6",
  high: "#b45309",
  critical: "#b91c1c",
};

export function JobsTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <Card>
      <CardHeader
        title="Jobs created vs completed"
        description="Weekly trend from the analytics sample."
      />
      <CardBody className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="created"
              name="Created"
              stroke="#0f766e"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#1d4ed8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}

export function JobVolumeAreaChart({ data }: { data: TrendPoint[] }) {
  return (
    <Card>
      <CardHeader
        title="Job volume over time"
        description="Created volume by week."
      />
      <CardBody className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="created"
              name="Created"
              stroke="#0f766e"
              fill="#ccfbf1"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}

export function StatusDonutChart({ data }: { data: StatusSlice[] }) {
  return (
    <Card>
      <CardHeader
        title="Jobs by status"
        description="Full dataset counts via API totals."
      />
      <CardBody className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((slice) => (
                <Cell
                  key={slice.key}
                  fill={STATUS_COLORS[slice.key] ?? "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}

export function PriorityDonutChart({ data }: { data: PrioritySlice[] }) {
  return (
    <Card>
      <CardHeader
        title="Jobs by priority"
        description="Full dataset counts via API totals."
      />
      <CardBody className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((slice) => (
                <Cell
                  key={slice.key}
                  fill={PRIORITY_COLORS[slice.key] ?? "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}

export function AgentPerformanceChart({
  data,
}: {
  data: AgentPerformanceRow[];
}) {
  return (
    <Card>
      <CardHeader
        title="Jobs completed by agent"
        description="Top agents in the analytics sample."
      />
      <CardBody className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            <Bar
              dataKey="completed"
              name="Completed"
              fill="#0f766e"
              radius={4}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
