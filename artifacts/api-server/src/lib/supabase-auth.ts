import type { Request, Response, NextFunction } from "express";

export type AuthenticatedUser = {
  id: string;
  email?: string | null;
  isAnonymous?: boolean;
};

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedUser;
    }
  }
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function getBearerToken(req: Request) {
  const header = req.header("authorization")?.trim();
  if (!header) {
    return null;
  }

  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

async function fetchSupabaseUser(accessToken: string): Promise<AuthenticatedUser | null> {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL").replace(/\/+$/, "");
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!supabaseAnonKey) {
    throw new Error("Missing required env: SUPABASE_ANON_KEY");
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      apikey: supabaseAnonKey,
    },
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase auth lookup failed: ${response.status} ${detail}`.trim());
  }

  const payload = (await response.json()) as {
    id?: string;
    email?: string | null;
    is_anonymous?: boolean;
  };

  if (!payload?.id) {
    return null;
  }

  return {
    id: payload.id,
    email: payload.email ?? null,
    isAnonymous: payload.is_anonymous ?? false,
  };
}

export async function requireAuthUser(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = getBearerToken(req);
    if (!accessToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await fetchSupabaseUser(accessToken);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.authUser = user;
    next();
  } catch (error) {
    res.status(503).json({
      error: "Auth lookup failed",
      message: error instanceof Error ? error.message : "Unexpected auth error",
    });
  }
}
