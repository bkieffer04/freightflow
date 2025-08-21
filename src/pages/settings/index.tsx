import type { ReactElement } from "react";
import AppLayout from "@/components/applayout";

function SettingsPage() {
  return <h2 className="text-xl font-semibold">Settings</h2>;
}

SettingsPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
export default SettingsPage;
