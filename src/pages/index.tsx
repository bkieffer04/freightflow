// pages/index.tsx
import type { GetServerSideProps } from "next";
import { supabaseServer } from "@/lib/supabase/server"; // from earlier step

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const supabase = supabaseServer(req as any, res as any);
  const { data: { session } } = await supabase.auth.getSession();

  return {
    redirect: session
      ? { destination: "/settings", permanent: false }
      : { destination: "/login", permanent: false },
  };
};

export default function Index() { return null; }
