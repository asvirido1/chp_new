import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { reportsTable } from "./reports";

export const adminNotesTable = pgTable("admin_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => reportsTable.id, { onDelete: "cascade" }),
  adminId: text("admin_id"),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAdminNoteSchema = createInsertSchema(adminNotesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertAdminNote = z.infer<typeof insertAdminNoteSchema>;
export type AdminNote = typeof adminNotesTable.$inferSelect;
