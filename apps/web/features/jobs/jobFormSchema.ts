import { z } from "zod";

export const jobFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be under 120 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be under 2000 characters"),
  customerId: z.string().min(1, "Customer is required"),
  agentId: z.string().optional(),
  status: z.enum([
    "pending",
    "assigned",
    "in_progress",
    "completed",
    "cancelled",
  ]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  location: z
    .string()
    .trim()
    .min(2, "Location is required")
    .max(120, "Location must be under 120 characters"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date"),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
