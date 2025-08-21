// pages/accounts/[clientId]/index.tsx
import type { ReactElement } from "react";
import type { GetServerSidePropsContext } from "next";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/applayout";
import { withAuth } from "@/lib/withAuth";

type Role = "shipper" | "vendor";

type Account = {
  id: string;
  fullName: string;  // account rep
  company: string;
  role: Role;
};

type ChatMessage = {
  id: string;
  from: "rep" | "user";
  text: string;
  at: string; // ISO
};

// --- Mock data (match IDs from the list page) ---
const ACCOUNTS: Account[] = [
  { id: "tracy-schwartz", fullName: "Tracy Schwartz", company: "Walmart",    role: "shipper" },
  { id: "miguel-alvarez", fullName: "Miguel Alvarez", company: "Target",     role: "shipper" },
  { id: "priya-patel",    fullName: "Priya Patel",    company: "Costco",     role: "shipper" },
  { id: "hannah-kim",     fullName: "Hannah Kim",     company: "Best Buy",   role: "vendor"  },
  { id: "james-oconnor",  fullName: "James O'Connor", company: "Home Depot", role: "vendor"  },
];

// Role-aligned messages
const MESSAGES: Record<string, ChatMessage[]> = {
  // Shippers: RFQs, POs, pickup/delivery windows
  "tracy-schwartz": [
    { id: "m1", from: "rep",  text: "RFQ #7741 received—need pickup tomorrow AM.", at: "2025-08-20T14:05:00Z" },
    { id: "m2", from: "user", text: "Got it. Can we lock 8–10am pickup?",          at: "2025-08-20T14:07:00Z" },
    { id: "m3", from: "rep",  text: "Confirmed. Delivery window Fri 1–3pm.",       at: "2025-08-20T14:10:00Z" },
  ],
  "miguel-alvarez": [
    { id: "m1", from: "rep",  text: "PO #9920 is ready. Need 53' dry van.", at: "2025-08-20T18:30:00Z" },
    { id: "m2", from: "user", text: "Pricing sent. Awaiting approval.",     at: "2025-08-20T18:42:00Z" },
  ],
  "priya-patel": [
    { id: "m1", from: "rep",  text: "Can you advance delivery by one day?", at: "2025-08-18T11:10:00Z" },
    { id: "m2", from: "user", text: "Working on reschedule now.",           at: "2025-08-18T11:12:00Z" },
  ],

  // Vendors: driver status, BOL/PODs, lumper, invoices
  "hannah-kim": [
    { id: "m1", from: "rep",  text: "Driver checked in at shipper. Gate in 15.", at: "2025-08-20T09:00:00Z" },
    { id: "m2", from: "user", text: "Copy—send BOL photo when loaded.",          at: "2025-08-20T09:03:00Z" },
    { id: "m3", from: "rep",  text: "Loaded. BOL attached. Rolling now.",        at: "2025-08-20T09:30:00Z" },
  ],
  "james-oconnor": [
    { id: "m1", from: "rep",  text: "POD uploaded. Lumper was $65.", at: "2025-08-17T16:45:00Z" },
    { id: "m2", from: "user", text: "Thanks—add lumper to invoice.", at: "2025-08-17T16:50:00Z" },
  ],
};
// --- /mock ---

type Props = {
  user: User;            // injected by withAuth()
  account: Account;
  initialMessages: ChatMessage[];
};

function Bubble({ mine, text, at }: { mine: boolean; text: string; at: string }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${mine ? "bg-black text-white" : "bg-black/5 text-black"}`}>
        <div className="text-sm">{text}</div>
        <div className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-black/50"}`}>
          {new Date(at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function AccountDetailPage({ user, account, initialMessages }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    setMessages((cur) => [
      ...cur,
      { id: `tmp-${Date.now()}`, from: "user", text: draft.trim(), at: new Date().toISOString() },
    ]);
    setDraft("");
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/accounts" className="inline-flex items-center gap-1 text-sm hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Accounts
        </Link>
      </div>

      <div className="mb-4 rounded-xl border p-4">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold">{account.company}</div>
          <span className={`rounded px-2 py-0.5 text-xs ${
            account.role === "shipper" ? "bg-emerald-100 text-emerald-900" : "bg-blue-100 text-blue-900"
          }`}>
            {account.role === "shipper" ? "Shipper" : "Vendor"}
          </span>
        </div>
        <div className="text-sm text-black/70">Account Rep: {account.fullName}</div>
        <div className="text-sm text-black/60">You: {user.email}</div>
      </div>

      <div className="rounded-xl border">
        <div className="h-96 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="text-sm text-black/60">No messages yet.</div>
          ) : (
            messages.map((m) => (
              <Bubble key={m.id} mine={m.from === "user"} text={m.text} at={m.at} />
            ))
          )}
        </div>

        <div className="flex items-center gap-2 border-t p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={account.role === "shipper" ? "Type a note to the shipper…" : "Type a note to the vendor…"}
            className="flex-1 rounded border border-black p-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="button"
            onClick={send}
            className="inline-flex items-center gap-1 rounded border border-black px-3 py-2 text-sm hover:bg-black hover:text-white transition"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </>
  );
}

AccountDetailPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export const getServerSideProps = withAuth(async (ctx: GetServerSidePropsContext) => {
  const clientId = ctx.params?.clientId as string | undefined;
  const account = ACCOUNTS.find((a) => a.id === clientId);
  if (!clientId || !account) return { notFound: true };
  const initialMessages = MESSAGES[clientId] ?? [];
  return { props: { account, initialMessages } };
});

export default AccountDetailPage;
