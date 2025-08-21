import type { ReactElement } from "react";
import type { User } from "@supabase/supabase-js";
import AppLayout from "@/components/applayout";
import { withAuth } from "@/lib/withAuth";

type Props = { user: User };

function HomePage({ user }: Props) {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-2">
        Welcome{user.email ? `, ${user.email}` : ""} 👋
      </h1>
      <h2 className="mb-4 text-xl font-semibold">Home</h2>
      <p className="text-sm text-black/70">Welcome to FreightFlow.</p>
    </>
  );
}

// Use the shared layout
HomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

// Protect the page. withAuth() will also inject { user } into props.
export const getServerSideProps = withAuth();

export default HomePage;
