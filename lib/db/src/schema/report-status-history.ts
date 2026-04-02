import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { reportsTable } from "./reports";
import { reportStatusEnum } from "./reports";

export const reportStatusHistoryTable = pgTable("report_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => reportsTable.id, { onDelete: "cascade" }),
  fromStatus: reportStatusEnum("from_status"),
  toStatus: reportStatusEnum("to_status").notNull(),
  changedBy: text("changed_by"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStatusHistorySchema = createInsertSchema(
  reportStatusHistoryTable
).omit({ id: true, createdAt: true });

export type InsertStatusHistory = z.infer<typeof insertStatusHistorySchema>;
export type StatusHistory = typeof reportStatusHistoryTable.$inferSelect;
