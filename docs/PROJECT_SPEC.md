# OpsFlow --- Project Specification

> **Status:** Planning / Phase 0\
> **Purpose:** Proof of Concept (POC) for Intiqo Technologies Senior UI
> Engineer evaluation\
> **Development model:** Cursor Agent + human approval after every
> phase\
> **Rule:** Cursor must NOT proceed to the next phase until Ravi
> explicitly approves the current phase.

------------------------------------------------------------------------

## 1. Project Overview

### Product Name

**OpsFlow --- Service Operations Command Center**

### One-line description

OpsFlow is a web and mobile service-operations platform where an
operations team manages jobs, customers, agents, assignments, statuses
and analytics from a web dashboard, while field agents use a React
Native mobile application to view and update their assigned jobs.

### Simple product model

``` text
                 OpsFlow
                    |
          +---------+---------+
          |                   |
     Web Dashboard       Mobile App
       Next.js          React Native CLI
          |                   |
          +---------+---------+
                    |
                 REST API
                    |
               JSON Server
                    |
                 db.json
```

### Primary goal

This is **not intended to be a production SaaS product**.

The purpose is to demonstrate that Ravi can independently:

-   understand a product requirement
-   design a frontend architecture
-   build reusable UI
-   work with TypeScript
-   implement Redux Toolkit state management
-   implement asynchronous flows with thunks
-   integrate REST APIs
-   handle loading/error/empty states
-   work with large datasets
-   implement search/filter/sort/pagination
-   optimize rendering performance
-   build responsive interfaces
-   build a React Native application
-   write maintainable and testable code
-   document technical decisions
-   ship a polished deployed web application

The project should therefore prioritize **engineering quality and
explainability over feature quantity**.

------------------------------------------------------------------------

# 2. POC Context

The hiring team should be able to look at the repository and understand:

1.  What problem the application solves.
2.  How the application is architected.
3.  How state is managed.
4.  How API communication works.
5.  How large datasets are handled.
6.  How reusable components are structured.
7.  How performance was considered.
8.  How the mobile application shares the same API contract.
9.  How testing and quality checks are handled.
10. That the project was built independently and deliberately.

### Important

Do not describe the JSON Server as a production backend.

Use wording such as:

> "The POC uses a lightweight JSON Server REST API to keep the
> implementation focused on frontend and mobile engineering. The clients
> communicate through a REST API contract, allowing the data layer to be
> replaced with a production backend later."

------------------------------------------------------------------------

# 3. Technology Stack

## Web

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Tailwind skill from TasteSkill
-   Redux Toolkit
-   Redux Thunk
-   React Hook Form
-   Zod
-   Recharts
-   REST API integration

## Mobile

-   React Native CLI
-   TypeScript
-   Redux Toolkit
-   Redux Thunk
-   React Navigation
-   React Native `FlatList`
-   React Native `StyleSheet`
-   Same REST API as web

> Do not use Expo.

## API

-   JSON Server
-   REST endpoints
-   `db.json`
-   Seeded realistic data

## Quality

-   ESLint
-   Prettier
-   TypeScript strict mode
-   Unit/component testing
-   E2E testing for critical web flows
-   GitHub Actions CI

## Deployment

-   Web: Vercel
-   API: Any suitable JSON Server hosting solution that provides a
    public REST URL
-   Mobile: local React Native CLI development/testing; no App
    Store/Play Store publishing required for the POC

------------------------------------------------------------------------

# 4. Tailwind Skill

The project will use the Tailwind skill supplied by TasteSkill.

Installation command:

``` bash
npx skills add Leonxlnx/taste-skill
```

Reference:

https://www.tasteskill.dev/

Cursor should use the installed skill for the web UI implementation
where appropriate.

### Tailwind rules

-   Do not introduce arbitrary styling patterns unnecessarily.
-   Prefer reusable design tokens/classes.
-   Keep spacing and typography consistent.
-   Avoid excessive one-off values.
-   Do not mix multiple styling systems in the web application.
-   Keep the visual system consistent across all screens.
-   Responsive design is required.

Tailwind is primarily for the **Next.js web application**.

The React Native application should use React Native-compatible styling
unless a separate mobile styling decision is explicitly approved.

------------------------------------------------------------------------

# 5. Product Users

## Operations Manager

Uses the web dashboard to:

-   monitor jobs
-   search jobs
-   filter jobs
-   sort jobs
-   assign agents
-   update job status
-   inspect customers
-   inspect agents
-   monitor analytics

## Field Agent

Uses the React Native application to:

-   view assigned jobs
-   inspect job details
-   update job status
-   refresh assigned jobs
-   perform job actions

------------------------------------------------------------------------

# 6. Core Modules

## Web

### 6.1 Dashboard

Display:

-   Total Jobs
-   Active Jobs
-   Urgent Jobs
-   Completed Jobs
-   SLA Compliance
-   Job status distribution
-   Job trends
-   Agent performance
-   Recent jobs
-   Recent activity

### 6.2 Jobs

Features:

-   jobs table
-   search
-   filtering
-   sorting
-   pagination
-   status badges
-   priority badges
-   agent information
-   job details
-   create job
-   edit job
-   status update
-   delete job
-   bulk selection
-   bulk status update where practical

### 6.3 Agents

Features:

-   agent list
-   agent status
-   active jobs
-   completed jobs
-   SLA percentage
-   agent detail
-   assigned jobs

### 6.4 Customers

Features:

-   customer list
-   search
-   filtering where useful
-   customer details
-   customer's jobs

### 6.5 Analytics

Features:

-   date range
-   job trends
-   status distribution
-   priority distribution
-   agent performance
-   SLA metrics

------------------------------------------------------------------------

# 7. React Native Mobile Scope

The mobile application represents the **Field Agent App**.

Do not attempt to reproduce the entire web dashboard.

### Screens

``` text
Jobs
 |
 +-- Job Details
 |
 +-- Update Status
```

Optional:

``` text
Profile
Settings
```

### Required mobile features

-   jobs list
-   API integration
-   loading state
-   error state
-   empty state
-   pull-to-refresh
-   `FlatList`
-   job details
-   status update
-   reusable components
-   bottom-sheet-style interaction where appropriate
-   Redux Toolkit state
-   async API actions
-   responsive mobile layout

### Mobile performance

The jobs list should use `FlatList`.

Do not use:

``` js
jobs.map(...)
```

for the primary large mobile jobs list.

------------------------------------------------------------------------

# 8. Data Model

The initial data model should include:

## Job

``` ts
type JobStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

type JobPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

interface Job {
  id: string;
  title: string;
  description: string;
  customerId: string;
  agentId: string | null;
  status: JobStatus;
  priority: JobPriority;
  location: string;
  createdAt: string;
  dueDate: string;
  completedAt?: string;
}
```

## Agent

``` ts
type AgentStatus =
  | "available"
  | "busy"
  | "offline";

interface Agent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: AgentStatus;
  phone: string;
}
```

## Customer

``` ts
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  location: string;
}
```

## Activity

``` ts
interface Activity {
  id: string;
  jobId: string;
  type: string;
  description: string;
  createdAt: string;
  actorId?: string;
}
```

Additional fields may be introduced only when they solve a real product
requirement.

------------------------------------------------------------------------

# 9. Large Dataset Requirement

The POC must visibly demonstrate that the application can work with
meaningful amounts of data.

Seed approximately:

-   10,000+ jobs
-   500+ agents
-   2,000+ customers
-   20,000+ activities

The exact numbers may change if performance testing shows a better
threshold.

### Important

Do not render thousands of records simultaneously.

Use appropriate techniques:

-   pagination
-   server-side query parameters where possible
-   debounced search
-   memoized derived calculations when justified
-   virtualization where appropriate
-   efficient selectors
-   stable component props
-   lazy loading
-   RTK caching where applicable

The purpose is to demonstrate **performance thinking**, not simply
generate a huge JSON file.

------------------------------------------------------------------------

# 10. API Contract

The frontend and mobile applications must communicate through REST APIs.

## Jobs

``` text
GET    /jobs
GET    /jobs/:id
POST   /jobs
PATCH  /jobs/:id
DELETE /jobs/:id
```

## Agents

``` text
GET /agents
GET /agents/:id
```

## Customers

``` text
GET /customers
GET /customers/:id
```

## Activities

``` text
GET /activities
GET /activities/:id
```

## Analytics

Analytics may be derived from available API data if JSON Server does not
provide a dedicated aggregation endpoint.

Example:

``` text
GET /jobs
```

followed by frontend selectors/derived calculations.

Do not introduce a complex backend solely to calculate analytics.

------------------------------------------------------------------------

# 11. API Query Requirements

The implementation should support realistic query behavior where JSON
Server allows it.

Examples:

``` text
/jobs?status=pending
/jobs?priority=high
/jobs?agentId=agent-001
/jobs?_page=1&_per_page=20
```

Search/filter behavior should be designed deliberately.

If a requirement cannot be implemented cleanly through JSON Server,
document the limitation rather than creating unnecessary backend
complexity.

------------------------------------------------------------------------

# 12. Redux Architecture

Redux Toolkit is a core part of the POC.

Do not put all application state into one giant slice.

Use domain-oriented slices.

Suggested structure:

``` text
store/
├── index.ts
├── hooks.ts
├── rootReducer.ts
└── slices/
    ├── jobs/
    │   ├── jobsSlice.ts
    │   ├── jobsThunks.ts
    │   ├── jobsSelectors.ts
    │   └── jobsTypes.ts
    │
    ├── agents/
    │   ├── agentsSlice.ts
    │   ├── agentsThunks.ts
    │   ├── agentsSelectors.ts
    │   └── agentsTypes.ts
    │
    ├── customers/
    │   ├── customersSlice.ts
    │   ├── customersThunks.ts
    │   ├── customersSelectors.ts
    │   └── customersTypes.ts
    │
    └── ui/
        └── uiSlice.ts
```

### Each domain should demonstrate

-   initial state
-   reducers
-   async thunks
-   pending state
-   fulfilled state
-   rejected state
-   `extraReducers`
-   selectors
-   typed hooks

Do not create unnecessary Redux state.

------------------------------------------------------------------------

# 13. Thunk Pattern

For example:

``` text
fetchJobs
   |
   +-- pending
   +-- fulfilled
   +-- rejected
```

The implementation should clearly demonstrate understanding of:

``` ts
createAsyncThunk
extraReducers
```

Example conceptual state:

``` ts
interface JobsState {
  data: Job[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
```

Do not duplicate API logic across components.

------------------------------------------------------------------------

# 14. Reusable Components

Create a reusable UI foundation.

Suggested components:

``` text
components/
├── ui/
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Badge
│   ├── Card
│   ├── Modal
│   ├── Drawer
│   ├── Tabs
│   ├── Dropdown
│   ├── Table
│   ├── Pagination
│   ├── Skeleton
│   ├── EmptyState
│   └── ErrorState
│
├── forms/
│   ├── SearchInput
│   ├── JobForm
│   └── FilterPanel
│
└── data-display/
    ├── JobStatusBadge
    ├── PriorityBadge
    ├── AgentAvatar
    └── MetricCard
```

Domain-specific components should remain separate from generic UI
components.

------------------------------------------------------------------------

# 15. Custom Hooks

Create custom hooks only when they represent reusable behavior.

Potential hooks:

``` text
hooks/
├── useDebounce.ts
├── useJobs.ts
├── useJobFilters.ts
├── usePagination.ts
├── useMediaQuery.ts
└── usePrevious.ts
```

Do not create custom hooks simply to wrap one line of code.

------------------------------------------------------------------------

# 16. Utilities

Keep pure reusable logic in:

``` text
utils/
├── date.ts
├── format.ts
├── validation.ts
├── job.ts
└── analytics.ts
```

Utilities should remain:

-   pure where possible
-   independently testable
-   free from React-specific behavior

------------------------------------------------------------------------

# 17. Forms and Validation

Use:

-   React Hook Form
-   Zod

Job forms should validate:

-   title
-   description
-   customer
-   priority
-   due date
-   optional agent

Validation errors must be displayed clearly.

Do not rely only on browser validation.

------------------------------------------------------------------------

# 18. Search

Search must support a realistic UX.

Requirements:

-   controlled input
-   debounced search
-   clear search action
-   loading indication where appropriate
-   no-results state

Suggested debounce:

``` text
300–500ms
```

Do not make the debounce delay artificially large.

------------------------------------------------------------------------

# 19. Filtering

Jobs should support combinations such as:

``` text
Status
Priority
Agent
Date
```

Filters should be composable.

Example:

``` text
Status = In Progress
+
Priority = High
+
Agent = Arjun
```

The UI should clearly show active filters.

------------------------------------------------------------------------

# 20. Sorting

Support useful columns:

-   created date
-   due date
-   priority
-   status
-   customer
-   agent

Sorting behavior must be predictable.

------------------------------------------------------------------------

# 21. Pagination

The Jobs page must not render all 10,000+ jobs.

Use pagination.

Display:

-   current page
-   total/available records
-   next/previous
-   page size where appropriate

------------------------------------------------------------------------

# 22. Virtualization

Virtualization should be used only where it provides value.

Potential candidates:

-   very large desktop tables
-   very large lists
-   mobile lists through `FlatList`

Do not add virtualization just for the sake of saying "virtualization".

The README should explain:

> why it was used, where it was used, and what problem it solves.

------------------------------------------------------------------------

# 23. Performance Optimization

Performance optimization must be evidence-driven.

Potential techniques:

-   debouncing
-   pagination
-   virtualization
-   memoized selectors
-   `useMemo` for genuinely expensive derived calculations
-   `useCallback` where referential stability matters
-   `React.memo` where appropriate
-   lazy-loaded routes
-   image optimization
-   avoiding unnecessary global state
-   avoiding unnecessary re-renders

### Critical rule

Do not blindly use:

``` text
useMemo
useCallback
React.memo
```

everywhere.

Every optimization should have a reason.

------------------------------------------------------------------------

# 24. Charts / Analytics

Use **Recharts** for the web analytics dashboard unless a better
approved choice is identified during implementation.

Recommended charts:

### 1. Line chart

For:

``` text
Jobs created vs completed over time
```

Good for trends.

### 2. Bar chart

For:

``` text
Jobs completed by agent
```

Good for comparison.

### 3. Donut/Pie chart

For:

``` text
Jobs by status
```

Use sparingly because too many categories reduce readability.

### 4. Area chart

For:

``` text
Job volume over time
```

Use when showing a continuous trend.

Avoid filling the dashboard with charts.

Every chart must answer a useful business question.

------------------------------------------------------------------------

# 25. Dashboard KPI Cards

Required KPIs:

``` text
Total Jobs
Active Jobs
Urgent Jobs
Completed Jobs
SLA Compliance
```

Each card should provide:

-   label
-   value
-   trend/change where meaningful
-   accessible semantic structure

Do not invent meaningless percentages.

------------------------------------------------------------------------

# 26. Loading / Error / Empty States

Every API-driven feature must consider:

``` text
Loading
Success
Error
Empty
```

Example:

``` text
Loading:
Skeleton UI

Error:
Unable to load jobs
[Retry]

Empty:
No jobs found
Adjust your filters.
```

Avoid blank screens.

------------------------------------------------------------------------

# 27. Responsive Design

Web must support:

``` text
Desktop
Tablet
Mobile
```

The dashboard should transform rather than simply shrink.

For example:

-   sidebar collapses
-   tables become horizontally scrollable or card-based where
    appropriate
-   filters move into a panel/drawer
-   KPI cards adapt to available width

------------------------------------------------------------------------

# 28. Accessibility

Minimum requirements:

-   semantic HTML
-   keyboard navigation
-   visible focus states
-   accessible buttons
-   form labels
-   appropriate ARIA attributes where required
-   sufficient contrast
-   meaningful error messages

Do not use ARIA as a substitute for semantic HTML.

------------------------------------------------------------------------

# 29. Web Folder Structure

Suggested structure:

``` text
apps/
└── web/
    ├── app/
    │   ├── dashboard/
    │   ├── jobs/
    │   ├── agents/
    │   ├── customers/
    │   └── analytics/
    │
    ├── components/
    │   ├── ui/
    │   ├── layout/
    │   └── data-display/
    │
    ├── features/
    │   ├── jobs/
    │   ├── agents/
    │   ├── customers/
    │   └── analytics/
    │
    ├── hooks/
    ├── lib/
    ├── services/
    ├── store/
    ├── types/
    ├── utils/
    └── tests/
```

Exact structure may evolve, but changes must be intentional.

------------------------------------------------------------------------

# 30. Mobile Folder Structure

``` text
apps/
└── mobile/
    ├── src/
    │   ├── screens/
    │   │   ├── Jobs/
    │   │   └── JobDetails/
    │   │
    │   ├── components/
    │   ├── navigation/
    │   ├── hooks/
    │   ├── services/
    │   ├── store/
    │   ├── types/
    │   └── utils/
    │
    └── android/
```

Use React Native CLI.

Do not introduce Expo.

------------------------------------------------------------------------

# 31. Shared Code

If practical, shared API/domain types may live in:

``` text
packages/
└── shared/
    ├── types/
    └── constants/
```

Do not create a complicated monorepo abstraction if it slows
development.

The goal is maintainability, not architectural complexity.

------------------------------------------------------------------------

# 32. Suggested Repository Structure

``` text
opsflow/
│
├── apps/
│   ├── web/
│   └── mobile/
│
├── packages/
│   └── shared/
│
├── api/
│   ├── db.json
│   ├── seed/
│   └── README.md
│
├── docs/
│   ├── PROJECT_SPEC.md
│   ├── ARCHITECTURE.md
│   └── DECISIONS.md
│
├── .github/
│   └── workflows/
│
├── README.md
├── package.json
└── .gitignore
```

------------------------------------------------------------------------

# 33. Documentation Requirements

Maintain:

``` text
docs/PROJECT_SPEC.md
docs/ARCHITECTURE.md
docs/DECISIONS.md
```

### ARCHITECTURE.md

Explain:

-   application architecture
-   state architecture
-   API flow
-   web/mobile relationship
-   component structure
-   performance strategy

### DECISIONS.md

Record important decisions.

Example:

``` text
Decision:
Use JSON Server instead of Node/Express.

Reason:
POC focuses on frontend/mobile engineering while maintaining a real REST API contract.

Trade-off:
No production-grade backend features.

Future:
Replace JSON Server with Node/Express or another backend without rewriting presentation-layer architecture.
```

------------------------------------------------------------------------

# 34. Git Strategy

Use meaningful commits.

Examples:

``` text
chore: initialize project structure
feat: add design system foundation
feat: add jobs API integration
feat: add jobs redux slice
feat: add jobs table
feat: add job filtering
feat: add job pagination
feat: add analytics dashboard
feat: add react native jobs screen
perf: optimize jobs rendering
test: add jobs component tests
ci: add github actions workflow
docs: add architecture documentation
```

Avoid:

``` text
update
fix
changes
final
final-final
```

------------------------------------------------------------------------

# 35. Cursor Agent Rules

Cursor must follow these rules throughout development:

### Rule 1 --- Work phase-wise

Never build the entire project in one operation.

### Rule 2 --- Wait for approval

After completing a phase:

1.  Stop.
2.  Summarize what changed.
3.  List files created/modified.
4.  Explain important decisions.
5.  Provide commands to run/test.
6.  Mention known issues.
7.  Wait for Ravi's explicit approval.

### Rule 3 --- No silent architecture changes

If a requested implementation requires changing architecture:

-   explain why
-   propose the change
-   wait for approval

### Rule 4 --- No unnecessary dependencies

Before adding a dependency:

-   explain the problem it solves
-   check whether existing dependencies solve it
-   request approval if it materially changes architecture

### Rule 5 --- No fake functionality

Do not create buttons that appear functional but do nothing.

If functionality is intentionally deferred, document it.

### Rule 6 --- No hardcoded production-looking data inside components

Use the API/data layer.

### Rule 7 --- TypeScript first

Avoid:

``` ts
any
```

unless there is a documented reason.

### Rule 8 --- Keep components focused

Avoid giant components.

### Rule 9 --- Reuse before duplicating

Check existing components/hooks/utils before creating new ones.

### Rule 10 --- Do not over-engineer

The project is a POC.

Prefer simple, explainable architecture.

------------------------------------------------------------------------

# 36. Phase Plan

## Phase 0 --- Project Planning

Deliver:

-   repository structure
-   PROJECT_SPEC
-   architecture document
-   technology decisions
-   development rules

**Approval required.**

------------------------------------------------------------------------

## Phase 1 --- Foundation

Build:

-   Next.js web application
-   React Native CLI application
-   TypeScript configuration
-   Tailwind setup
-   linting
-   formatting
-   basic folder structure
-   Redux Toolkit setup
-   shared types
-   basic API configuration

Do not build dashboard features yet.

**Approval required.**

------------------------------------------------------------------------

## Phase 2 --- Mock REST API

Build:

-   `db.json`
-   realistic seed data
-   JSON Server
-   jobs endpoints
-   agents endpoints
-   customers endpoints
-   activities endpoints
-   API documentation

Verify APIs independently.

**Approval required.**

------------------------------------------------------------------------

## Phase 3 --- Redux Architecture

Build separately:

-   jobs slice
-   agents slice
-   customers slice
-   UI slice
-   thunks
-   `extraReducers`
-   selectors
-   typed hooks
-   loading/error states

Do not start building complex UI until the state architecture is
reviewed.

**Approval required.**

------------------------------------------------------------------------

## Phase 4 --- Design System

Build:

-   layout
-   sidebar
-   header
-   buttons
-   inputs
-   badges
-   cards
-   table
-   modal
-   drawer
-   skeleton
-   empty state
-   error state
-   responsive behavior

Use the Tailwind skill.

**Approval required.**

------------------------------------------------------------------------

## Phase 5 --- Jobs Module

Build:

-   jobs page
-   API integration
-   table
-   search
-   debounce
-   filters
-   sorting
-   pagination
-   job details
-   create/edit
-   status update
-   loading/error/empty states

This should become the strongest module in the project.

**Approval required.**

------------------------------------------------------------------------

## Phase 6 --- Dashboard + Analytics

Build:

-   KPI cards
-   line chart
-   bar chart
-   status distribution
-   agent performance
-   trends
-   recent activity
-   responsive dashboard

Use charts only where they communicate meaningful information.

**Approval required.**

------------------------------------------------------------------------

## Phase 7 --- Agents + Customers

Build:

-   agents
-   agent details
-   assigned jobs
-   customers
-   customer details
-   related jobs

**Approval required.**

------------------------------------------------------------------------

## Phase 8 --- Performance

Measure before optimizing.

Implement where justified:

-   debouncing
-   memoized selectors
-   `useMemo`
-   `useCallback`
-   `React.memo`
-   pagination
-   virtualization
-   lazy loading
-   optimized rendering

Document the reason for every significant optimization.

**Approval required.**

------------------------------------------------------------------------

## Phase 9 --- React Native

Build using React Native CLI:

-   navigation
-   jobs list
-   `FlatList`
-   pull-to-refresh
-   job details
-   status update
-   reusable components
-   Redux Toolkit
-   API integration
-   loading/error/empty states

Connect to the same REST API.

**Approval required.**

------------------------------------------------------------------------

## Phase 10 --- Testing

Add:

-   utility tests
-   Redux tests
-   component tests
-   critical user-flow E2E test
-   mobile testing where practical

**Approval required.**

------------------------------------------------------------------------

## Phase 11 --- Quality + CI/CD

Add:

-   lint
-   format checks
-   typecheck
-   tests
-   production build
-   GitHub Actions

Verify the complete pipeline.

**Approval required.**

------------------------------------------------------------------------

## Phase 12 --- Deployment + POC Presentation

Deploy web application.

Verify public API.

Prepare:

-   GitHub repository
-   deployed URL
-   README
-   screenshots
-   architecture diagram
-   mobile demo screenshots/video
-   technical decisions
-   performance notes
-   testing notes

**Final approval required.**

------------------------------------------------------------------------

# 37. Definition of Done

The POC is complete only when:

### Product

-   [x] Dashboard works
-   [x] Jobs management works
-   [x] Search works
-   [x] Filtering works
-   [x] Sorting works
-   [x] Pagination works
-   [x] Job details work
-   [x] Agents work
-   [x] Customers work
-   [x] Analytics work
-   [x] Mobile jobs flow works

### Engineering

-   [x] TypeScript strict
-   [x] Redux Toolkit implemented
-   [x] Slices separated by domain
-   [x] Thunks implemented
-   [x] `extraReducers` used correctly
-   [x] Selectors implemented
-   [x] Reusable components
-   [x] Custom hooks
-   [x] API layer separated
-   [x] Loading/error/empty states
-   [x] Performance optimization
-   [x] Large dataset tested
-   [x] Responsive UI
-   [x] Accessibility basics
-   [x] Tests
-   [x] CI checks

### Documentation

-   [x] README
-   [x] PROJECT_SPEC
-   [x] ARCHITECTURE
-   [x] DECISIONS
-   [x] API documentation
-   [x] Setup instructions
-   [x] Mobile setup instructions
-   [x] Deployment instructions

------------------------------------------------------------------------

# 38. What We Are Explicitly NOT Building

To prevent scope creep:

-   No authentication
-   No authorization
-   No payment system
-   No real-time WebSockets
-   No production-grade backend
-   No microservices
-   No complex DevOps
-   No Kubernetes
-   No App Store publishing
-   No Play Store publishing
-   No unnecessary AI features
-   No unnecessary animations
-   No giant feature set

The POC should demonstrate engineering depth through the selected
features rather than feature quantity.

------------------------------------------------------------------------

# 39. Final POC Story

The final project should be explainable in under one minute:

> "I built OpsFlow as a service-operations platform to demonstrate
> production-oriented frontend and mobile engineering. The web
> application is built with Next.js, TypeScript and Tailwind, with Redux
> Toolkit managing application state and REST APIs providing the data
> layer. The dashboard supports large datasets, search, filtering,
> sorting, pagination and analytics. I also built a React Native CLI
> companion app for field agents using the same API contract. I
> intentionally kept the backend lightweight with JSON Server because
> the goal of the POC was to demonstrate frontend architecture,
> performance, reusable components and independent product development."

------------------------------------------------------------------------

# 40. Final Cursor Instruction

Before implementing any phase, Cursor must:

1.  Read `docs/PROJECT_SPEC.md`.
2.  Inspect the existing repository.
3.  Identify the current phase.
4.  Implement only the approved phase.
5.  Follow existing architecture.
6.  Avoid unnecessary dependencies.
7.  Run relevant checks.
8.  Summarize changes.
9.  Stop and wait for Ravi's approval.

**Never implement future phases without explicit approval.**

------------------------------------------------------------------------

## Current State

``` text
Phase: 12 — Deployment + POC Presentation

Status: COMPLETE — WAITING FOR FINAL APPROVAL

Delivered (through Phase 12):
- Vercel config for apps/web (vercel.json, transpilePackages, tracing root)
- Render Blueprint (render.yaml) + api/server.mjs for hosted JSON Server
- docs/DEPLOYMENT.md, docs/PRESENTATION.md, docs/screenshots/
- README live-demo + docs index updated; ADR-023

Remaining (requires host accounts / local capture):
- Push GitHub remote; deploy Render API; deploy Vercel web; fill live URLs
- Capture screenshots / mobile demo video into docs/screenshots/

Next action:
Ravi performs final approval of the POC (and optionally completes live deploy + screenshots).
```
