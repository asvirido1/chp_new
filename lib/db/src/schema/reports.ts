import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const providerCategoryEnum = pgEnum("provider_category", [
  "delivery",
  "micromobility",
  "carsharing",
  "taxi",
  "car",
  "other",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "new",
  "in_review",
  "confirmed",
  "rejected",
  "resolved",
  "archived",
]);

export const reportsTable = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id"),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  category: providerCategoryEnum("category").notNull(),
  providerId: text("provider_id").notNull(),
  providerLabel: text("provider_label").notNull(),
  description: text("description").notNull(),
  status: reportStatusEnum("status").notNull().default("new"),
  deviceGeo: jsonb("device_geo"),
  addressText: text("address_text"),
  deviceContext: jsonb("device_context"),
  mediaCount: integer("media_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertReportSchema = createInsertSchema(reportsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reportsTable.$inferSelect;
