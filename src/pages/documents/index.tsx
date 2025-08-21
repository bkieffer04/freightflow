import type { ReactElement } from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { Download } from "lucide-react";
import AppLayout from "@/components/applayout";
import { withAuth } from "@/lib/withAuth";

type Props = { files: string[] };

function DocumentsPage({ files }: Props) {
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Documents</h1>

      <div className="divide-y rounded border">
        {files.length === 0 && (
          <div className="p-4 text-sm text-black/60">No documents found.</div>
        )}
        {files.map((name) => (
          <div key={name} className="flex items-center justify-between p-3">
            <span className="truncate">{name}</span>
            <Link
              href={`/api/download/${encodeURIComponent(name)}`}
              className="inline-flex items-center gap-2 rounded border border-black px-3 py-1 text-sm hover:bg-black hover:text-white transition"
            >
              <Download className="h-4 w-4" />
              Download
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

// Protect page
export const getServerSideProps = withAuth(async () => {
  const dir = path.join(process.cwd(), "src", "assets");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".pdf"));
  } catch {
    files = [];
  }
  return { props: { files } };
});

DocumentsPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
export default DocumentsPage;
