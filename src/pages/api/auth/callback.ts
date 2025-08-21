// pages/api/auth/callback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = (req.query.code as string) || "";
  const next = (req.query.next as string) || "/home";

  if (code) {
    const supabase = supabaseServer(req, res);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return res.redirect(next.startsWith("/") ? next : "/home");
  }

  // On error, send to an info page
  return res.redirect("/auth/auth-code-error");
}
