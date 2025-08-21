import { useRouter } from "next/router";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Menu, Truck } from "lucide-react";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 h-14 w-full border-b bg-white">
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center rounded p-2 hover:bg-black/5"
            aria-label="Toggle menu"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            <span className="text-base font-semibold">FreightFlow</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="rounded border border-black px-3 py-1 text-sm font-medium hover:bg-black hover:text-white transition"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
