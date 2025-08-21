// pages/accounts/index.tsx
import type { ReactElement } from "react";
import Link from "next/link";
import AppLayout from "@/components/applayout";
import { withAuth } from "@/lib/withAuth";

type Role = "shipper" | "vendor";

type Account = {
  id: string;
  fullName: string;
  company: string;
  role: Role;
  lastMessage: string; // e.g., "1 day ago"
};

const ACCOUNTS: Account[] = [
  // Shippers
  { id: "tracy-schwartz", fullName: "Tracy Schwartz", company: "Walmart",    role: "shipper", lastMessage: "RFQ received · 1 day ago" },
  { id: "miguel-alvarez", fullName: "Miguel Alvarez", company: "Target",     role: "shipper", lastMessage: "PO #7741 ready · 2 hours ago" },
  { id: "priya-patel",    fullName: "Priya Patel",    company: "Costco",     role: "shipper", lastMessage: "Pickup window confirmed · 3 days ago" },

  // Vendors
  { id: "hannah-kim",     fullName: "Hannah Kim",     company: "Best Buy",   role: "vendor",  lastMessage: "Driver arrived at shipper · 4 hours ago" },
  { id: "james-oconnor",  fullName: "James O'Connor", company: "Home Depot", role: "vendor",  lastMessage: "Invoice sent · yesterday" },
];





function Section({ title, items }: { title: string; items: Account[] }) {
  if (!items.length) return null;
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-black/60">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <div key={a.id} className="rounded-xl border p-4 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between gap-4">
              {/* Left: avatar + name/company */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate font-medium">{a.fullName}</div>
                  </div>
                            <div className="truncate text-sm text-black/60">{a.company}</div>
                            <span className="rounded bg-black/5 px-2 py-1 text-xs text-black/70">
                  {a.lastMessage}
                </span>
                </div>
              </div>
              {/* Right: last message + CTA */}
              <div className="flex items-center gap-3 shrink-0">
                
                <Link
                  href={`/accounts/${a.id}`}
                  className="rounded border border-black px-3 py-1 text-sm font-medium hover:bg-black hover:text-white transition"
                >
                  View Chat
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AccountsPage() {
  const shippers = ACCOUNTS.filter(a => a.role === "shipper");
  const vendors  = ACCOUNTS.filter(a => a.role === "vendor");

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Accounts</h1>
      <Section title="Shippers" items={shippers} />
      <Section title="Vendors"  items={vendors} />
    </>
  );
}

AccountsPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
export const getServerSideProps = withAuth();
export default AccountsPage;
