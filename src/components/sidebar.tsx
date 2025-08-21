import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Settings } from "lucide-react";
import clsx from "clsx";

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useRouter();

  const item = (href: string, label: string, Icon: any) => (
    <Link
      href={href}
      onClick={onNavigate}
      className={clsx(
        "flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-black/5",
        pathname === href && "bg-black/5 font-medium"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );

  return (
    <nav className="space-y-1">
      {item("/home", "Home", Home)}
      {item("/settings", "Settings", Settings)}
    </nav>
  );
}
