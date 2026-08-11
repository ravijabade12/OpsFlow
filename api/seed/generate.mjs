/**
 * OpsFlow Phase 2 — deterministic seed generator.
 *
 * Targets (spec §9):
 *   500+ agents, 2,000+ customers, 10,000+ jobs, 20,000+ activities
 *
 * Usage (from repo root or api/):
 *   npm run api:seed
 */

import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(__dirname, "..");
const OUT_FILE = path.join(API_ROOT, "db.json");

const COUNTS = {
  agents: 500,
  customers: 2000,
  jobs: 10000,
  activities: 20000,
};

const JOB_STATUSES = [
  "pending",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
];
const JOB_PRIORITIES = ["low", "medium", "high", "critical"];
const AGENT_STATUSES = ["available", "busy", "offline"];

const FIRST_NAMES = [
  "Arjun",
  "Priya",
  "Rohan",
  "Ananya",
  "Vikram",
  "Neha",
  "Kabir",
  "Isha",
  "Aditya",
  "Meera",
  "Sanjay",
  "Diya",
  "Rahul",
  "Kavya",
  "Aman",
  "Sneha",
  "Dev",
  "Pooja",
  "Nikhil",
  "Riya",
  "Omar",
  "Sofia",
  "James",
  "Elena",
  "Chen",
  "Maya",
  "Luis",
  "Aisha",
  "Noah",
  "Hana",
];

const LAST_NAMES = [
  "Sharma",
  "Patel",
  "Singh",
  "Reddy",
  "Nair",
  "Khan",
  "Iyer",
  "Gupta",
  "Das",
  "Mehta",
  "Chopra",
  "Verma",
  "Joseph",
  "Fernandez",
  "Martinez",
  "Nguyen",
  "Kim",
  "Williams",
  "Brown",
  "Garcia",
];

const COMPANIES = [
  "Northwind Logistics",
  "Cedar Health",
  "BluePeak Retail",
  "Summit Facilities",
  "Harbor Bank",
  "Atlas Manufacturing",
  "Brightline Telecom",
  "GreenLeaf Foods",
  "Vertex Clinics",
  "Cascade Hotels",
  "Ironclad Security",
  "Lumen Transit",
];

const CITIES = [
  "Bengaluru",
  "Hyderabad",
  "Mumbai",
  "Chennai",
  "Pune",
  "Delhi",
  "Ahmedabad",
  "Kolkata",
  "Jaipur",
  "Kochi",
  "Austin",
  "Seattle",
  "Toronto",
  "London",
  "Singapore",
];

const JOB_TITLES = [
  "HVAC inspection",
  "Network outage triage",
  "On-site equipment install",
  "Preventive maintenance",
  "Customer escalations follow-up",
  "Access control repair",
  "POS terminal swap",
  "Cold-chain sensor check",
  "Safety audit",
  "Fiber splice repair",
  "Generator load test",
  "Inventory discrepancy review",
];

const ACTIVITY_TYPES = [
  "job_created",
  "job_assigned",
  "status_changed",
  "priority_changed",
  "note_added",
  "job_completed",
  "job_cancelled",
];

/** Mulberry32 — small deterministic PRNG */
function createRng(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, list) {
  return list[Math.floor(rng() * list.length)];
}

function pad(n, width) {
  return String(n).padStart(width, "0");
}

function isoDaysAgo(rng, maxDays) {
  const days = Math.floor(rng() * maxDays);
  const hours = Math.floor(rng() * 24);
  const minutes = Math.floor(rng() * 60);
  const d = new Date(Date.UTC(2026, 0, 15, 12, 0, 0));
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(hours, minutes, 0, 0);
  return d.toISOString();
}

function addDaysIso(iso, days) {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

function emailFromName(first, last, domain, n) {
  return `${first}.${last}.${n}@${domain}`.toLowerCase().replace(/\s+/g, "");
}

function phone(rng, n) {
  const base = 9000000000 + (n % 999999999);
  return `+91${String(base).slice(0, 10)}`;
}

function weightedStatus(rng) {
  const r = rng();
  if (r < 0.18) return "pending";
  if (r < 0.38) return "assigned";
  if (r < 0.58) return "in_progress";
  if (r < 0.88) return "completed";
  return "cancelled";
}

function weightedPriority(rng) {
  const r = rng();
  if (r < 0.35) return "low";
  if (r < 0.7) return "medium";
  if (r < 0.92) return "high";
  return "critical";
}

function weightedAgentStatus(rng) {
  const r = rng();
  if (r < 0.45) return "available";
  if (r < 0.85) return "busy";
  return "offline";
}

async function main() {
  const rng = createRng(20260811);
  await mkdir(API_ROOT, { recursive: true });

  console.log("Generating OpsFlow seed data…");
  console.log(COUNTS);

  const agents = [];
  for (let i = 1; i <= COUNTS.agents; i += 1) {
    const first = pick(rng, FIRST_NAMES);
    const last = pick(rng, LAST_NAMES);
    agents.push({
      id: `agent-${pad(i, 3)}`,
      name: `${first} ${last}`,
      email: emailFromName(first, last, "opsflow.agents.test", i),
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(`${first}${last}${i}`)}`,
      status: weightedAgentStatus(rng),
      phone: phone(rng, i),
    });
  }

  const customers = [];
  for (let i = 1; i <= COUNTS.customers; i += 1) {
    const first = pick(rng, FIRST_NAMES);
    const last = pick(rng, LAST_NAMES);
    const company = pick(rng, COMPANIES);
    customers.push({
      id: `customer-${pad(i, 4)}`,
      name: `${first} ${last}`,
      email: emailFromName(first, last, "opsflow.customers.test", i),
      phone: phone(rng, 10_000 + i),
      company,
      location: pick(rng, CITIES),
    });
  }

  const jobs = [];
  for (let i = 1; i <= COUNTS.jobs; i += 1) {
    const status = weightedStatus(rng);
    const priority = weightedPriority(rng);
    const customer = customers[Math.floor(rng() * customers.length)];
    const needsAgent = status !== "pending" && status !== "cancelled";
    /** Empty string = unassigned (json-server breaks on null foreign-key values during DELETE). */
    const agentId = needsAgent
      ? agents[Math.floor(rng() * agents.length)].id
      : rng() < 0.15
        ? agents[Math.floor(rng() * agents.length)].id
        : "";

    const createdAt = isoDaysAgo(rng, 180);
    const dueDate = addDaysIso(createdAt, 1 + Math.floor(rng() * 14));
    const title = pick(rng, JOB_TITLES);

    /** @type {Record<string, unknown>} */
    const job = {
      id: `job-${pad(i, 5)}`,
      title: `${title} #${i}`,
      description: `${title} for ${customer.company} at ${customer.location}. Priority ${priority}; follow SOP and update status on site.`,
      customerId: customer.id,
      agentId,
      status,
      priority,
      location: customer.location,
      createdAt,
      dueDate,
    };

    if (status === "completed") {
      const spanDays = Math.max(
        1,
        Math.floor(
          (new Date(dueDate).getTime() - new Date(createdAt).getTime()) /
            86400000,
        ),
      );
      job.completedAt = addDaysIso(
        createdAt,
        Math.max(1, Math.floor(spanDays * rng())),
      );
    }

    jobs.push(job);
  }

  const activities = [];
  for (let i = 1; i <= COUNTS.activities; i += 1) {
    const job = jobs[Math.floor(rng() * jobs.length)];
    const type = pick(rng, ACTIVITY_TYPES);
    const actor =
      rng() < 0.7
        ? agents[Math.floor(rng() * agents.length)].id
        : undefined;

    /** @type {Record<string, unknown>} */
    const activity = {
      id: `activity-${pad(i, 5)}`,
      jobId: job.id,
      type,
      description: `${type.replaceAll("_", " ")} on ${job.id} (${job.title})`,
      createdAt: isoDaysAgo(rng, 180),
    };

    if (actor) {
      activity.actorId = actor;
    }

    activities.push(activity);
  }

  // Validate enums present (sanity for shared contract)
  for (const status of JOB_STATUSES) {
    if (!jobs.some((j) => j.status === status)) {
      throw new Error(`Missing jobs with status=${status}`);
    }
  }
  for (const priority of JOB_PRIORITIES) {
    if (!jobs.some((j) => j.priority === priority)) {
      throw new Error(`Missing jobs with priority=${priority}`);
    }
  }
  for (const status of AGENT_STATUSES) {
    if (!agents.some((a) => a.status === status)) {
      throw new Error(`Missing agents with status=${status}`);
    }
  }

  console.log("Writing db.json…");
  await writeDbJson(OUT_FILE, { agents, customers, jobs, activities });

  console.log(`Wrote ${OUT_FILE}`);
  console.log(
    JSON.stringify(
      {
        agents: agents.length,
        customers: customers.length,
        jobs: jobs.length,
        activities: activities.length,
      },
      null,
      2,
    ),
  );
}

/**
 * Stream JSON to avoid a single giant stringify buffer spike.
 * @param {string} filePath
 * @param {{ agents: unknown[]; customers: unknown[]; jobs: unknown[]; activities: unknown[] }} db
 */
function writeDbJson(filePath, db) {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(filePath, { encoding: "utf8" });
    stream.on("error", reject);
    stream.on("finish", resolve);

    stream.write("{\n");
    writeArray(stream, "agents", db.agents, false);
    writeArray(stream, "customers", db.customers, false);
    writeArray(stream, "jobs", db.jobs, false);
    writeArray(stream, "activities", db.activities, true);
    stream.write("}\n");
    stream.end();
  });
}

/**
 * @param {import('node:fs').WriteStream} stream
 * @param {string} key
 * @param {unknown[]} items
 * @param {boolean} isLast
 */
function writeArray(stream, key, items, isLast) {
  stream.write(`  "${key}": [\n`);
  for (let i = 0; i < items.length; i += 1) {
    const comma = i < items.length - 1 ? "," : "";
    stream.write(`    ${JSON.stringify(items[i])}${comma}\n`);
  }
  stream.write(`  ]${isLast ? "\n" : ",\n"}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
