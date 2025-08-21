import { useState } from "react";
import { useRouter } from "next/router";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Mode = "login" | "signup";

export default function Login() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/settings"); // success
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // If email confirmations are enabled, there's no session yet:
        if (!data.session) {
          setMsg("Check your email to confirm your account.");
        } else {
          router.push("/settings");
        }
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
            className={`py-2 text-center font-medium transition ${
              mode === "login" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Log in
          </button>
          <button
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => setMode("signup")}
            className={`py-2 text-center font-medium transition ${
              mode === "signup" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="text-sm text-black">Email</label>
          <input
            type="email"
            className="rounded border border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="text-sm text-black">Password</label>
          <input
            type="password"
            className="rounded border border-black p-2 focus:outline-none focus:ring-2 focus:ring-black text-black"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mode === "signup" && (
            <>
              <label className="text-sm text-black">Confirm password</label>
              <input
                type="password"
                className="rounded border border-black p-2 focus:outline-none focus:ring-2 focus:ring-black text-black"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
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

        {/* OAuth */}
        <button
          className="w-full rounded border border-black px-4 py-2 text-black hover:bg-black hover:text-white transition"
          // pages/login.tsx (excerpt)
onClick={() =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/home`,
        // If you need Google API access later, request refresh token:
        // queryParams: { access_type: "offline", prompt: "consent" }
      },
    })
  }
  
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
