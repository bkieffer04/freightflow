import type { ReactElement } from "react";
import AppLayout from "@/components/applayout";

function HomePage() {
  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">Home</h2>
      <p className="text-sm text-black/70">
        Welcome to FreightFlow. This is your dashboard area.
      </p>
    </>
  );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default HomePage;
