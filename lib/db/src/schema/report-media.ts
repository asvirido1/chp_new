import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { reportsTable } from "./reports";

export const mediaTypeEnum = pgEnum("media_type", ["photo", "video"]);

export const reportMediaTable = pgTable("report_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => reportsTable.id, { onDelete: "cascade" }),
  mediaType: mediaTypeEnum("media_type").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type"),
  sizeBytes: integer("size_bytes"),
  takenAt: timestamp("taken_at"),
  mediaGeo: jsonb("media_geo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReportMediaSchema = createInsertSchema(reportMediaTable).omit({
  id: true,
  createdAt: true,
});

export type InsertReportMedia = z.infer<typeof insertReportMediaSchema>;
export type ReportMedia = typeof reportMediaTable.$inferSelect;
