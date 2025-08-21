import { useState } from "react";
import { useRouter } from "next/router";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Eye, EyeOff } from "lucide-react";

type Mode = "login" | "signup";

export default function Login() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (mode === "signup" && password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // sync tokens to httpOnly cookies for SSR (if you added /api/auth/set)
        if (data.session) {
          await fetch("/api/auth/set", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            }),
          });
        }
        window.location.assign("/home");
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) setMsg("Check your email to confirm your account.");
        else window.location.assign("/home");
      }
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h1 className="text-black text-[32px] text-center mb-1">FreightFlow</h1>
        <p className="text-black text-center mb-6">
          Innovating the shipping logistics industry one step at a time
        </p>

        {/* Tabs */}
        <div role="tablist" aria-label="Auth mode" className="mb-4 grid grid-cols-2 rounded-lg overflow-hidden border border-black">
          <button
            role="tab"
            aria-selected={mode === "login"}
            onClick={() => setMode("login")}
            className={`py-2 text-center font-medium transition ${mode === "login" ? "bg-black text-white" : "bg-white text-black"}`}
          >
            Log in
          </button>
          <button
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => setMode("signup")}
            className={`py-2 text-center font-medium transition ${mode === "signup" ? "bg-black text-white" : "bg-white text-black"}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-black">Email</label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            className="rounded border border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="text-sm text-black">Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              name="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full rounded border border-black p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              aria-label={showPw ? "Hide password" : "Show password"}
              aria-pressed={showPw}
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-black/5"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {mode === "signup" && (
            <>
              <label className="text-sm text-black">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirm-password"
                  autoComplete="new-password"
                  className="w-full rounded border border-black p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  aria-pressed={showConfirm}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-black/5"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </>
          )}

          {err && <div className="text-red-600 text-sm">{err}</div>}
          {msg && <div className="text-emerald-700 text-sm">{msg}</div>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-4">
          <div className="h-px bg-black/20 flex-1" />
          <span className="text-xs text-black/60">or</span>
          <div className="h-px bg-black/20 flex-1" />
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          className="w-full rounded border border-black px-4 py-2 text-black hover:bg-black hover:text-white transition flex items-center justify-center gap-2"
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: "google",
              options: { redirectTo: `${window.location.origin}/api/auth/callback?next=/home` },
            })
          }
        >
          <img
            src="https://pngimg.com/uploads/google/google_PNG19635.png"
            alt="Google logo"
            className="h-5 w-5"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
