import type { ReactElement } from "react";
import AppLayout from "@/components/applayout";
import { withAuth } from "@/lib/withAuth";

function HomePage() {
  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">Home</h2>
      <p className="text-sm text-black/70">Welcome to FreightFlow.</p>
    </>
  );
}

HomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
export const getServerSideProps = withAuth(); // ← protect
export default HomePage;
