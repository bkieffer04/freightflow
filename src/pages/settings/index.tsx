import type { ReactElement } from "react";
import AppLayout from "@/components/applayout";
import { withAuth } from "@/lib/withAuth";

function SettingsPage() {
  return <h2 className="text-xl font-semibold">Settings</h2>;
}

SettingsPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
export const getServerSideProps = withAuth(); // ← protect
export default SettingsPage;
