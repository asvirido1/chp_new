import { timingSafeEqual } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function adminGuardMiddleware(req: Request, res: Response, next: NextFunction) {
  const configuredSecret = process.env.ADMIN_SECRET?.trim();
  if (!configuredSecret) {
    next();
    return;
  }

  const providedSecret = req.header("x-admin-secret")?.trim();
  if (!providedSecret || !constantTimeEqual(providedSecret, configuredSecret)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
