// /lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

function appendSetCookie(res: NextApiResponse, cookie: string) {
  const current = res.getHeader("Set-Cookie");
  if (!current) {
    res.setHeader("Set-Cookie", cookie);
  } else if (Array.isArray(current)) {
    res.setHeader("Set-Cookie", [...current, cookie]);
  } else {
    res.setHeader("Set-Cookie", [current as string, cookie]);
  }
}

export const supabaseServer = (req: NextApiRequest, res: NextApiResponse) =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies[name],
        set: (name: string, value: string, options: CookieOptions) => {
          const cookie = serialize(name, value, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            ...options,
          });
          appendSetCookie(res, cookie);
        },
        remove: (name: string, options: CookieOptions) => {
          const cookie = serialize(name, "", {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 0,
            ...options,
          });
          appendSetCookie(res, cookie);
        },
      },
    }
  );
