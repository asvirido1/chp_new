import { Router } from "express";
import { eq, and, desc, asc, count, sql, ilike } from "drizzle-orm";
import multer from "multer";
import { db } from "@workspace/db";
import {
  reportsTable,
  reportMediaTable,
  reportStatusHistoryTable,
  adminNotesTable,
  profilesTable,
} from "@workspace/db";
import {
  GetReportsQueryParams,
  CreateReportBody,
  GetReportParams,
  UpdateReportParams,
  UpdateReportBody,
  AddReportMediaParams,
  AddReportMediaBody,
  AdminGetReportsQueryParams,
  AdminGetReportParams,
  AdminUpdateReportStatusParams,
  AdminUpdateReportStatusBody,
  AdminAddNoteParams,
  AdminAddNoteBody,
  GetUserProfileQueryParams,
  UpsertUserProfileBody,
} from "@workspace/api-zod";
import {
  buildStorageObjectPath,
  inferMediaType,
  resolveStorageUrl,
  uploadBufferToStorage,
} from "../lib/storage";
import { requireAuthUser } from "../lib/supabase-auth";
import { PROVIDER_MAP } from "./providers";

const router = Router();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
});

function toReport(r: typeof reportsTable.$inferSelect, mediaCount?: number) {
  return {
    id: r.id,
    userId: r.userId,
    isAnonymous: r.isAnonymous,
    category: r.category,
    providerId: r.providerId,
    providerLabel: r.providerLabel,
    description: r.description,
    voiceNotePath: r.voiceNotePath ?? null,
    transcriptRaw: r.transcriptRaw ?? null,
    transcriptClean: r.transcriptClean ?? null,
    transcriptStatus: r.transcriptStatus,
    transcriptLanguage: r.transcriptLanguage ?? null,
    transcriptProvider: r.transcriptProvider ?? null,
    transcriptError: r.transcriptError ?? null,
    status: r.status,
    deviceGeo: r.deviceGeo ?? null,
    addressText: r.addressText ?? null,
    mediaCount: mediaCount ?? r.mediaCount,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

async function getReportOrNull(reportId: string) {
  const [report] = await db.select().from(reportsTable).where(eq(reportsTable.id, reportId));
  return report ?? null;
}

async function createReportMediaRecord(input: {
  reportId: string;
  mediaType: "photo" | "video";
  url: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  takenAt?: Date | null;
  mediaGeo?: unknown;
}) {
  const [media] = await db
    .insert(reportMediaTable)
    .values({
      reportId: input.reportId,
      mediaType: input.mediaType,
      url: input.url,
      mimeType: input.mimeType ?? null,
      sizeBytes: input.sizeBytes ?? null,
      takenAt: input.takenAt ?? null,
      mediaGeo: input.mediaGeo ?? null,
    })
    .returning();

  await db
    .update(reportsTable)
    .set({ mediaCount: sql`${reportsTable.mediaCount} + 1`, updatedAt: new Date() })
    .where(eq(reportsTable.id, input.reportId));

  return media!;
}

async function serializeReportMedia(media: typeof reportMediaTable.$inferSelect) {
  return {
    id: media.id,
    reportId: media.reportId,
    mediaType: media.mediaType,
    url: await resolveStorageUrl(media.url),
    mimeType: media.mimeType ?? null,
    sizeBytes: media.sizeBytes ?? null,
    takenAt: media.takenAt?.toISOString() ?? null,
    mediaGeo: media.mediaGeo ?? null,
    createdAt: media.createdAt.toISOString(),
  };
}

async function serializeReportMediaList(media: Array<typeof reportMediaTable.$inferSelect>) {
  return Promise.all(media.map((item) => serializeReportMedia(item)));
}

// GET /reports
router.get("/reports", requireAuthUser, async (req, res) => {
  const parsed = GetReportsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  const { userId, status, category, providerId, page = 1, limit = 20 } = parsed.data;
  const authUserId = req.authUser!.id;

  const conditions = [];
  if (userId && userId !== authUserId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  conditions.push(eq(reportsTable.userId, authUserId));
  if (status) conditions.push(eq(reportsTable.status, status));
  if (category) conditions.push(eq(reportsTable.category, category));
  if (providerId) conditions.push(eq(reportsTable.providerId, providerId));

  const offset = (page - 1) * limit;
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(reportsTable).where(where).orderBy(desc(reportsTable.createdAt)).limit(limit).offset(offset),
    db.select({ total: count() }).from(reportsTable).where(where),
  ]);

  res.json({
    reports: rows.map((r) => toReport(r)),
    total: Number(total),
    page,
    limit,
    hasMore: offset + rows.length < Number(total),
  });
});

// POST /reports
router.post("/reports", requireAuthUser, async (req, res) => {
  const parsed = CreateReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", message: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const authUserId = req.authUser!.id;
  const provider = PROVIDER_MAP.get(data.providerId);

  const [report] = await db
    .insert(reportsTable)
    .values({
      userId: authUserId,
      isAnonymous: data.isAnonymous ?? false,
      category: data.category,
      providerId: data.providerId,
      providerLabel: provider?.label ?? data.providerId,
      description: data.description,
      voiceNotePath: data.voiceNotePath ?? null,
      transcriptRaw: data.transcriptRaw ?? null,
      transcriptClean: data.transcriptClean ?? null,
      transcriptStatus: data.transcriptStatus ?? "idle",
      transcriptLanguage: data.transcriptLanguage ?? null,
      transcriptProvider: data.transcriptProvider ?? null,
      transcriptError: data.transcriptError ?? null,
      status: "new",
      deviceGeo: data.deviceGeo ?? null,
      addressText: data.addressText ?? null,
      deviceContext: data.deviceContext ?? null,
      mediaCount: 0,
    })
    .returning();

  // Track in user profile
  if (!data.isAnonymous) {
    await db
      .insert(profilesTable)
      .values({ userId: authUserId, reportCount: 1, reportsResolved: 0, points: 10 })
      .onConflictDoUpdate({
        target: profilesTable.userId,
        set: {
          reportCount: sql`${profilesTable.reportCount} + 1`,
          points: sql`${profilesTable.points} + 10`,
          updatedAt: new Date(),
        },
      });
  }

  res.status(201).json(toReport(report!));
});

// GET /reports/:id
router.get("/reports/:id", requireAuthUser, async (req, res) => {
  const parsed = GetReportParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  const [report] = await db.select().from(reportsTable).where(eq(reportsTable.id, parsed.data.id));
  if (!report) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (report.userId !== req.authUser!.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const media = await db.select().from(reportMediaTable).where(eq(reportMediaTable.reportId, report.id));

  res.json({
    ...toReport(report),
    media: await serializeReportMediaList(media),
    deviceContext: null,
  });
});

// PATCH /reports/:id
router.patch("/reports/:id", requireAuthUser, async (req, res) => {
  const paramsParsed = UpdateReportParams.safeParse(req.params);
  const bodyParsed = UpdateReportBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Validation failed" });
    return;
  }

  const { id } = paramsParsed.data;
  if (!UUID_RE.test(id)) {
    res.status(400).json({ error: "Bad request" });
    return;
  }

  const existing = await getReportOrNull(id);
  if (!existing) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  const data = bodyParsed.data;
  const authUserId = req.authUser!.id;
  if (existing.userId !== authUserId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const provider = PROVIDER_MAP.get(data.providerId);
  const [updated] = await db
    .update(reportsTable)
    .set({
      userId: authUserId,
      isAnonymous: data.isAnonymous,
      category: data.category,
      providerId: data.providerId,
      providerLabel: provider?.label ?? data.providerId,
      description: data.description,
      voiceNotePath: data.voiceNotePath ?? null,
      transcriptRaw: data.transcriptRaw ?? null,
      transcriptClean: data.transcriptClean ?? null,
      transcriptStatus: data.transcriptStatus ?? "idle",
      transcriptLanguage: data.transcriptLanguage ?? null,
      transcriptProvider: data.transcriptProvider ?? null,
      transcriptError: data.transcriptError ?? null,
      deviceGeo: data.deviceGeo ?? null,
      addressText: data.addressText ?? null,
      deviceContext: data.deviceContext ?? null,
      updatedAt: new Date(),
    })
    .where(eq(reportsTable.id, id))
    .returning();

  res.json(toReport(updated!));
});

// POST /reports/:reportId/media
router.post("/reports/:reportId/media", requireAuthUser, async (req, res) => {
  const paramsParsed = AddReportMediaParams.safeParse(req.params);
  const bodyParsed = AddReportMediaBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  const { reportId } = paramsParsed.data;
  if (!UUID_RE.test(reportId)) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  const data = bodyParsed.data;

  const report = await getReportOrNull(reportId);
  if (!report) {
    res.status(404).json({ error: "Report not found" });
    return;
  }
  if (report.userId !== req.authUser!.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const media = await createReportMediaRecord({
    reportId,
    mediaType: data.mediaType,
    url: data.url,
    mimeType: data.mimeType ?? null,
    sizeBytes: data.sizeBytes ?? null,
    takenAt: data.takenAt ? new Date(data.takenAt) : null,
    mediaGeo: data.mediaGeo ?? null,
  });

  res.status(201).json(await serializeReportMedia(media));
});

// POST /reports/:reportId/media/upload
router.post("/reports/:reportId/media/upload", requireAuthUser, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      const message = err.code === "LIMIT_FILE_SIZE" ? "File too large" : "Bad request";
      res.status(400).json({ error: message });
      return;
    }

    if (err) {
      res.status(400).json({ error: "Bad request" });
      return;
    }

    const paramsParsed = AddReportMediaParams.safeParse(req.params);
    if (!paramsParsed.success) {
      res.status(400).json({ error: "Bad request" });
      return;
    }

    const { reportId } = paramsParsed.data;
    if (!UUID_RE.test(reportId)) {
      res.status(400).json({ error: "Bad request" });
      return;
    }

    const report = await getReportOrNull(reportId);
    if (!report) {
      res.status(404).json({ error: "Report not found" });
      return;
    }
    if (report.userId !== req.authUser!.id) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const file = req.file;
    if (!file || !file.buffer?.length) {
      res.status(400).json({ error: "File is required" });
      return;
    }

    const requestedMediaType =
      typeof req.body?.mediaType === "string" ? req.body.mediaType : undefined;
    const mediaType = inferMediaType(file.mimetype, requestedMediaType);

    if (!mediaType) {
      res.status(400).json({ error: "Unsupported media type" });
      return;
    }

    try {
      const objectPath = buildStorageObjectPath(reportId, file.originalname, file.mimetype);
      await uploadBufferToStorage({
        buffer: file.buffer,
        objectPath,
        mimeType: file.mimetype || "application/octet-stream",
      });

      const media = await createReportMediaRecord({
        reportId,
        mediaType,
        url: objectPath,
        mimeType: file.mimetype || null,
        sizeBytes: file.size ?? null,
      });

      res.status(201).json(await serializeReportMedia(media));
    } catch (uploadError) {
      res.status(502).json({
        error: "Storage upload failed",
        message:
          uploadError instanceof Error ? uploadError.message : "Unexpected storage upload error",
      });
    }
  });
});

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// GET /admin/session
router.get("/admin/session", (_req, res) => {
  res.json({ ok: true });
});

// GET /admin/reports
router.get("/admin/reports", async (req, res) => {
  const parsed = AdminGetReportsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  const {
    status,
    category,
    providerId,
    search,
    dateFrom,
    dateTo,
    page = 1,
    limit = 50,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = parsed.data;

  const conditions = [];
  if (status) conditions.push(eq(reportsTable.status, status));
  if (category) conditions.push(eq(reportsTable.category, category));
  if (providerId) conditions.push(eq(reportsTable.providerId, providerId));
  if (search) conditions.push(ilike(reportsTable.description, `%${search}%`));
  if (dateFrom) conditions.push(sql`${reportsTable.createdAt} >= ${new Date(dateFrom)}`);
  if (dateTo) conditions.push(sql`${reportsTable.createdAt} <= ${new Date(dateTo)}`);

  const offset = (page - 1) * limit;
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const orderCol = sortBy === "status" ? reportsTable.status : reportsTable.createdAt;
  const orderFn = sortOrder === "asc" ? asc(orderCol) : desc(orderCol);

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(reportsTable).where(where).orderBy(orderFn).limit(limit).offset(offset),
    db.select({ total: count() }).from(reportsTable).where(where),
  ]);

  res.json({
    reports: rows.map((r) => toReport(r)),
    total: Number(total),
    page,
    limit,
    hasMore: offset + rows.length < Number(total),
  });
});

// GET /admin/reports/:id
router.get("/admin/reports/:id", async (req, res) => {
  const parsed = AdminGetReportParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  const [report] = await db.select().from(reportsTable).where(eq(reportsTable.id, parsed.data.id));
  if (!report) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const [media, history, notes] = await Promise.all([
    db.select().from(reportMediaTable).where(eq(reportMediaTable.reportId, report.id)),
    db.select().from(reportStatusHistoryTable).where(eq(reportStatusHistoryTable.reportId, report.id)).orderBy(asc(reportStatusHistoryTable.createdAt)),
    db.select().from(adminNotesTable).where(eq(adminNotesTable.reportId, report.id)).orderBy(asc(adminNotesTable.createdAt)),
  ]);

  res.json({
    ...toReport(report),
    media: await serializeReportMediaList(media),
    deviceContext: null,
    statusHistory: history.map((h) => ({
      id: h.id,
      reportId: h.reportId,
      fromStatus: h.fromStatus ?? null,
      toStatus: h.toStatus,
      changedBy: h.changedBy ?? null,
      note: h.note ?? null,
      createdAt: h.createdAt.toISOString(),
    })),
    adminNotes: notes.map((n) => ({
      id: n.id,
      reportId: n.reportId,
      adminId: n.adminId ?? null,
      text: n.text,
      createdAt: n.createdAt.toISOString(),
    })),
  });
});

// PATCH /admin/reports/:id
router.patch("/admin/reports/:id", async (req, res) => {
  const paramsParsed = AdminUpdateReportStatusParams.safeParse(req.params);
  const bodyParsed = AdminUpdateReportStatusBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  const { id } = paramsParsed.data;
  if (!UUID_RE.test(id)) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  const { status, note, adminId } = bodyParsed.data;

  const [existing] = await db.select().from(reportsTable).where(eq(reportsTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const [updated] = await db
    .update(reportsTable)
    .set({ status, updatedAt: new Date() })
    .where(eq(reportsTable.id, id))
    .returning();

  await db.insert(reportStatusHistoryTable).values({
    reportId: id,
    fromStatus: existing.status,
    toStatus: status,
    changedBy: adminId ?? null,
    note: note ?? null,
  });

  // If resolved, increment user's resolved count
  if (
    status === "resolved" &&
    existing.status !== "resolved" &&
    existing.userId &&
    !existing.isAnonymous
  ) {
    await db
      .update(profilesTable)
      .set({
        reportsResolved: sql`${profilesTable.reportsResolved} + 1`,
        points: sql`${profilesTable.points} + 50`,
        updatedAt: new Date(),
      })
      .where(eq(profilesTable.userId, existing.userId));
  }

  res.json(toReport(updated!));
});

// POST /admin/reports/:id/notes
router.post("/admin/reports/:id/notes", async (req, res) => {
  const paramsParsed = AdminAddNoteParams.safeParse(req.params);
  const bodyParsed = AdminAddNoteBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  const { id } = paramsParsed.data;
  if (!UUID_RE.test(id)) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  const { text, adminId } = bodyParsed.data;

  const [existing] = await db.select().from(reportsTable).where(eq(reportsTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const [note] = await db
    .insert(adminNotesTable)
    .values({ reportId: id, adminId: adminId ?? null, text })
    .returning();

  res.status(201).json({
    id: note!.id,
    reportId: note!.reportId,
    adminId: note!.adminId ?? null,
    text: note!.text,
    createdAt: note!.createdAt.toISOString(),
  });
});

// ─── STATS ────────────────────────────────────────────────────────────────────

// GET /admin/stats
router.get("/admin/stats", async (_req, res) => {
  const [totals, byStatus, byCategory, recent] = await Promise.all([
    db.select({ total: count() }).from(reportsTable),
    db.select({ status: reportsTable.status, count: count() }).from(reportsTable).groupBy(reportsTable.status),
    db.select({ category: reportsTable.category, count: count() }).from(reportsTable).groupBy(reportsTable.category),
    db.select().from(reportsTable).orderBy(desc(reportsTable.createdAt)).limit(10),
  ]);

  const statusMap = new Map(byStatus.map((s) => [s.status, Number(s.count)]));

  res.json({
    totalReports: Number(totals[0]?.total ?? 0),
    newReports: statusMap.get("new") ?? 0,
    inReviewReports: statusMap.get("in_review") ?? 0,
    resolvedReports: statusMap.get("resolved") ?? 0,
    byCategory: byCategory.map((c) => ({ category: c.category, count: Number(c.count) })),
    byStatus: byStatus.map((s) => ({ status: s.status, count: Number(s.count) })),
    recentActivity: recent.map((r) => toReport(r)),
  });
});

// GET /stats/public
router.get("/stats/public", async (_req, res) => {
  const [totals, byStatus, byCategory] = await Promise.all([
    db.select({ total: count() }).from(reportsTable),
    db.select({ status: reportsTable.status, count: count() }).from(reportsTable).groupBy(reportsTable.status),
    db.select({ category: reportsTable.category, count: count() }).from(reportsTable).groupBy(reportsTable.category).orderBy(desc(count())),
  ]);

  const resolvedCount = byStatus.find((s) => s.status === "resolved");

  res.json({
    totalReports: Number(totals[0]?.total ?? 0),
    resolvedReports: Number(resolvedCount?.count ?? 0),
    citiesCovered: 1,
    topCategories: byCategory.map((c) => ({ category: c.category, count: Number(c.count) })),
  });
});

// ─── USER PROFILE ─────────────────────────────────────────────────────────────

// GET /users/profile
router.get("/users/profile", requireAuthUser, async (req, res) => {
  const parsed = GetUserProfileQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  if (parsed.data.userId !== req.authUser!.id) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, parsed.data.userId));

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  res.json({
    id: profile.id,
    userId: profile.userId,
    displayName: profile.displayName ?? null,
    avatarUrl: profile.avatarUrl ?? null,
    reportCount: profile.reportCount,
    reportsResolved: profile.reportsResolved,
    points: profile.points,
    createdAt: profile.createdAt.toISOString(),
  });
});

// POST /users/profile
router.post("/users/profile", requireAuthUser, async (req, res) => {
  const parsed = UpsertUserProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", message: parsed.error.message });
    return;
  }
  const data = parsed.data;
  const authUserId = req.authUser!.id;

  const [profile] = await db
    .insert(profilesTable)
    .values({
      userId: authUserId,
      displayName: data.displayName ?? null,
      avatarUrl: data.avatarUrl ?? null,
      reportCount: 0,
      reportsResolved: 0,
      points: 0,
    })
    .onConflictDoUpdate({
      target: profilesTable.userId,
      set: {
        displayName: data.displayName ?? null,
        avatarUrl: data.avatarUrl ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();

  res.json({
    id: profile!.id,
    userId: profile!.userId,
    displayName: profile!.displayName ?? null,
    avatarUrl: profile!.avatarUrl ?? null,
    reportCount: profile!.reportCount,
    reportsResolved: profile!.reportsResolved,
    points: profile!.points,
    createdAt: profile!.createdAt.toISOString(),
  });
});

export default router;
