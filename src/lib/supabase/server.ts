import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export const supabaseServer = (req: NextApiRequest, res: NextApiResponse) =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies[name],
        set: (name: string, value: string, options: CookieOptions) => {
          res.setHeader(
            "Set-Cookie",
            serialize(name, value, { path: "/", httpOnly: true, sameSite: "lax", ...options })
          );
        },
        remove: (name: string, options: CookieOptions) => {
          res.setHeader(
            "Set-Cookie",
            serialize(name, "", { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0, ...options })
          );
        },
      },
    }
  );
